import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const prisma = new PrismaClient();

  try {
    if (req.method === 'GET') {
      // GET /api/cdr/config - Get current configuration
      let config = await prisma.cDRConnectorConfig.findFirst({
        where: { id: 1 }
      });
      
      const configData = config || {
        mode: 'HTTPS' as any,
        jsonConfig: {},
        isActive: true
      };
      
      return res.json({
        success: true,
        config: {
          mode: configData.mode,
          jsonConfig: configData.jsonConfig,
          isActive: configData.isActive
        }
      });
    }

    if (req.method === 'PUT') {
      // PUT /api/cdr/config - Save/update configuration
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

      return res.json({
        success: true,
        message: 'Configuration saved successfully'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('CDR config error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  } finally {
    await prisma.$disconnect();
  }
}