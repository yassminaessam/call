import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import basicAuth from 'basic-auth';
import * as net from 'net';
import { envManager } from '../services/envManager.js';
import {
  cdrRateLimit,
  cdrIngestRateLimit,
  ipAllowlistMiddleware,
  cdrAuthMiddleware,
  validateCDRRecord,
  validateCDRConfig,
  handleValidationErrors,
  securityHeaders,
  sanitizeInput,
  securityLogger
} from '../middleware/cdrSecurity.js';

const router = Router();
const prisma = new PrismaClient();

// Global TCP server instance
let tcpServer: net.Server | null = null;

// Helper function to get current CDR configuration
async function getConfig() {
  let config = await prisma.cDRConnectorConfig.findFirst({
    where: { id: 1 }
  });
  
  // If no config in database, load from .env and create initial database entry
  if (!config) {
    const envConfig = envManager.loadCDRConfigFromEnv();
    
    // Create initial database config from .env
    config = await prisma.cDRConnectorConfig.create({
      data: {
        id: 1,
        mode: envConfig.mode,
        jsonConfig: envConfig.jsonConfig,
        isActive: envConfig.isActive
      }
    });
    
    console.log('[CDR Config] Initialized database configuration from .env file');
  }
  
  return config || { mode: 'HTTPS' as any, jsonConfig: {}, isActive: true };
}

// Helper function to validate IP against allowlist
function isIpAllowed(clientIp: string, allowList: string[] = []): boolean {
  if (!allowList || allowList.length === 0) return true;
  
  // Normalize IPv6-mapped IPv4 addresses
  const normalizedIp = clientIp.replace('::ffff:', '');
  return allowList.includes(normalizedIp);
}

// Helper function to insert CDR rows
async function insertCdrRows(rows: any[]) {
  const processedRows = rows.map(row => ({
    calldate: row.start ? new Date(row.start) : new Date(),
    src: row.src || null,
    dst: row.dst || null,
    disposition: row.disposition || null,
    duration: Number(row.duration || 0),
    billsec: Number(row.billsec || 0),
    actionType: row.action_type || null,
    accountcode: row.accountcode || null,
    uniqueid: row.uniqueid || `${row.src}-${row.dst}-${Date.now()}`,
    channel: row.channel || null,
    dcontext: row.dcontext || null,
    dstchannel: row.dstchannel || null,
    lastapp: row.lastapp || null,
    lastdata: row.lastdata || null,
    amaflags: Number(row.amaflags || 0),
    userfield: row.userfield || null
  }));

  for (const cdr of processedRows) {
    await prisma.cDR.upsert({
      where: { uniqueid: cdr.uniqueid },
      update: cdr,
      create: cdr
    });
  }
}

// Helper function to ensure TCP server is running when needed
async function ensureTcpServer() {
  const config = await getConfig();
  
  if (config.mode !== 'TCP') {
    if (tcpServer) {
      tcpServer.close();
      tcpServer = null;
    }
    return;
  }

  if (tcpServer) return; // Already running

  const { tcpPort = 10001, allowIps = [] } = config.jsonConfig as any;

  tcpServer = net.createServer((socket) => {
    const clientIp = socket.remoteAddress || 'unknown';
    
    if (!isIpAllowed(clientIp, allowIps)) {
      console.warn(`CDR TCP: Blocked connection from ${clientIp}`);
      socket.destroy();
      return;
    }

    console.log(`CDR TCP: Connection from ${clientIp}`);
    
    let buffer = '';
    
    socket.on('data', async (chunk) => {
      buffer += chunk.toString('utf8');
      
      let lineEndIndex;
      while ((lineEndIndex = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, lineEndIndex).trim();
        buffer = buffer.slice(lineEndIndex + 1);
        
        if (!line) continue;
        
        try {
          const cdrData = JSON.parse(line);
          await insertCdrRows([cdrData]);
          console.log(`CDR TCP: Processed record for ${cdrData.src} -> ${cdrData.dst}`);
        } catch (error) {
          console.error('CDR TCP: Parse/insert error:', error);
        }
      }
    });

    socket.on('error', (error) => {
      console.error('CDR TCP: Socket error:', error);
    });

    socket.on('close', () => {
      console.log(`CDR TCP: Connection closed from ${clientIp}`);
    });
  });

  tcpServer.listen(tcpPort, () => {
    console.log(`CDR TCP server listening on port ${tcpPort}`);
  });

  tcpServer.on('error', (error) => {
    console.error('CDR TCP server error:', error);
    tcpServer = null;
  });
}

// Initialize TCP server on startup
ensureTcpServer();

// GET /api/cdr/config - Get current configuration
router.get('/config', 
  cdrRateLimit,
  securityHeaders,
  securityLogger,
  async (req, res) => {
  try {
    const config = await getConfig();
    res.json({
      success: true,
      config: {
        mode: config.mode,
        jsonConfig: config.jsonConfig,
        isActive: config.isActive
      }
    });
  } catch (error) {
    console.error('CDR config get error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve configuration'
    });
  }
});

// PUT /api/cdr/config - Save/update configuration
router.put('/config',
  cdrRateLimit,
  securityHeaders,
  sanitizeInput,
  validateCDRConfig,
  handleValidationErrors,
  securityLogger,
  async (req, res) => {
  try {
    const { mode, config, isActive = true } = req.body;

    if (!['HTTPS', 'TCP'].includes(mode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mode. Must be HTTPS or TCP'
      });
    }

    await prisma.cDRConnectorConfig.upsert({
      where: { id: 1 },
      update: {
        mode,
        jsonConfig: config,
        isActive,
        updatedAt: new Date()
      },
      create: {
        id: 1,
        mode,
        jsonConfig: config,
        isActive
      }
    });

    // Also save to .env file for persistence and easy configuration
    try {
      envManager.updateCDRConfig({
        mode: mode as 'HTTPS' | 'TCP',
        isActive,
        jsonConfig: config
      });
      console.log('[CDR Config] Configuration automatically saved to .env file');
    } catch (envError) {
      console.error('[CDR Config] Failed to save to .env file:', envError);
      // Don't fail the request if .env update fails, just log it
    }

    // Restart TCP server if mode changed
    await ensureTcpServer();

    res.json({
      success: true,
      message: 'Configuration saved successfully (database and .env file updated)'
    });
  } catch (error) {
    console.error('CDR config save error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save configuration'
    });
  }
});

// POST /api/cdr/test - Test current configuration
router.post('/test',
  cdrRateLimit,
  securityHeaders,
  sanitizeInput,
  securityLogger,
  async (req, res) => {
  try {
    const config = await getConfig();
    
    if (!config.isActive) {
      return res.status(400).json({
        success: false,
        error: 'CDR connector is disabled'
      });
    }

    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;

    if (config.mode === 'HTTPS') {
      const { endpointPath = '/cdr', basicUser, basicPass } = config.jsonConfig as any;
      
      return res.json({
        success: true,
        mode: 'HTTPS',
        message: 'HTTPS receiver is ready',
        testCurl: `curl -u '${basicUser}:${basicPass}' -H 'Content-Type: application/json' -d '{"src":"1001","dst":"6300","start":"${new Date().toISOString()}","duration":5,"billsec":4,"disposition":"ANSWERED","uniqueid":"test-${Date.now()}"}' https://YOUR-DOMAIN${endpointPath}`
      });
    }

    if (config.mode === 'TCP') {
      await ensureTcpServer();
      const { tcpPort = 10001 } = config.jsonConfig as any;
      
      return res.json({
        success: true,
        mode: 'TCP',
        message: `TCP server is running on port ${tcpPort}`,
        note: 'Send newline-delimited JSON to test from your UCM'
      });
    }

    res.status(400).json({
      success: false,
      error: 'Unknown mode configuration'
    });
  } catch (error) {
    console.error('CDR test error:', error);
    res.status(500).json({
      success: false,
      error: 'Configuration test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/cdr/health - Health check
router.get('/health',
  cdrRateLimit,
  securityHeaders,
  securityLogger,
  async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const config = await getConfig();
    
    res.json({
      success: true,
      database: 'connected',
      mode: config.mode,
      active: config.isActive,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/cdr/https - HTTPS CDR receiver
router.post('/https',
  cdrIngestRateLimit,
  securityHeaders,
  ipAllowlistMiddleware,
  cdrAuthMiddleware,
  sanitizeInput,
  validateCDRRecord,
  handleValidationErrors,
  securityLogger,
  async (req, res) => {
  try {
    const config = await getConfig();
    
    if (config.mode !== 'HTTPS' || !config.isActive) {
      return res.status(404).json({
        success: false,
        error: 'HTTPS receiver is not enabled'
      });
    }

    const {
      basicUser,
      basicPass,
      allowIps = []
    } = config.jsonConfig as any;

    // Check IP allowlist
    const clientIp = req.ip || req.socket.remoteAddress || '';
    if (!isIpAllowed(clientIp, allowIps)) {
      console.warn(`CDR HTTPS: Blocked request from ${clientIp}`);
      return res.status(403).json({
        success: false,
        error: 'IP not allowed'
      });
    }

    // Check basic authentication
    const credentials = basicAuth(req);
    if (!credentials || credentials.name !== basicUser || credentials.pass !== basicPass) {
      res.set('WWW-Authenticate', 'Basic realm="CDR"');
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Process CDR data
    const cdrData = Array.isArray(req.body) ? req.body : [req.body];
    await insertCdrRows(cdrData);

    console.log(`CDR HTTPS: Processed ${cdrData.length} record(s) from ${clientIp}`);
    
    res.json({
      success: true,
      processed: cdrData.length,
      message: 'CDR data received successfully'
    });
  } catch (error) {
    console.error('CDR HTTPS receiver error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process CDR data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/cdr/records - Get CDR records with pagination
router.get('/records',
  cdrRateLimit,
  securityHeaders,
  sanitizeInput,
  securityLogger,
  async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limitRaw = parseInt(req.query.limit as string) || 50;
    const limit = Math.min(200, Math.max(1, limitRaw));
    const skip = (page - 1) * limit;

    const {
      src,
      dst,
      disposition,
      actionType,
      dateFrom,
      dateTo
    } = req.query as Record<string, string | undefined>;

    const where: any = {};
    if (src) where.src = { contains: src, mode: 'insensitive' };
    if (dst) where.dst = { contains: dst, mode: 'insensitive' };
    if (disposition) where.disposition = { equals: disposition };
    if (actionType) where.actionType = { contains: actionType, mode: 'insensitive' };
    if (dateFrom || dateTo) {
      where.calldate = {};
      if (dateFrom) where.calldate.gte = new Date(dateFrom);
      if (dateTo) where.calldate.lte = new Date(dateTo);
    }

    const [records, total, statsAgg] = await Promise.all([
      prisma.cDR.findMany({
        where,
        skip,
        take: limit,
        orderBy: { calldate: 'desc' }
      }),
      prisma.cDR.count({ where }),
      prisma.cDR.groupBy({
        by: ['disposition'],
        _count: { _all: true },
        where
      }).catch(() => [])
    ]);

    const stats = statsAgg.reduce((acc: any, row: any) => {
      const key = (row.disposition || 'UNKNOWN').toLowerCase();
      acc[key] = row._count._all;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats,
      filters: { src, dst, disposition, actionType, dateFrom, dateTo }
    });
  } catch (error) {
    console.error('CDR records fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch CDR records'
    });
  }
});

export default router;