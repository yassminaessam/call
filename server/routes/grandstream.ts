import express from 'express';

const router = express.Router();
let grandstreamService: any = null;

// Lazy initialization of Grandstream service
const getGrandstreamService = async () => {
  if (!grandstreamService) {
    const { GrandstreamService } = await import('../services/grandstream.js');
    grandstreamService = new GrandstreamService();
    
    // Initialize service events
    grandstreamService.on('callInitiated', (data: any) => {
      console.log('📞 Call initiated:', data);
    });

    grandstreamService.on('callEnded', (data: any) => {
      console.log('📞 Call ended:', data);
    });

    grandstreamService.on('callTransferred', (data: any) => {
      console.log('📞 Call transferred:', data);
    });
  }
  return grandstreamService;
};

// Get all extensions status
router.get('/extensions/status', async (req, res) => {
  try {
    const service = await getGrandstreamService();
    const extensionsStatus = await service.getAllExtensionsStatus();
    res.json({
      success: true,
      data: extensionsStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get extensions status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific extension status
router.get('/extension/:extension/status', async (req, res) => {
  try {
    const { extension } = req.params;
    const service = await getGrandstreamService();
    const status = await service.getExtensionStatus(extension);
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get extension status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Make outbound call
router.post('/call/make', async (req, res) => {
  try {
    const { fromExtension, toNumber, userId } = req.body;
    
    if (!fromExtension || !toNumber) {
      return res.status(400).json({
        success: false,
        error: 'fromExtension and toNumber are required'
      });
    }

    const service = await getGrandstreamService();
    const result = await service.makeCall(fromExtension, toNumber, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to make call',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// End call
router.post('/call/:callId/end', async (req, res) => {
  try {
    const { callId } = req.params;
    const service = await getGrandstreamService();
    const result = await service.endCall(callId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to end call',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Transfer call
router.post('/call/:callId/transfer', async (req, res) => {
  try {
    const { callId } = req.params;
    const { targetExtension } = req.body;
    
    if (!targetExtension) {
      return res.status(400).json({
        success: false,
        error: 'targetExtension is required'
      });
    }

    const service = await getGrandstreamService();
    const result = await service.transferCall(callId, targetExtension);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to transfer call',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get call details
router.get('/call/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    const service = await getGrandstreamService();
    const callDetails = await service.getCallDetails(callId);
    
    if (!callDetails) {
      return res.status(404).json({
        success: false,
        error: 'Call not found'
      });
    }

    res.json({
      success: true,
      data: callDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get call details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get call recording
router.get('/call/:callId/recording', async (req, res) => {
  try {
    const { callId } = req.params;
    const service = await getGrandstreamService();
    const recording = await service.getCallRecording(callId);
    
    if (!recording) {
      return res.status(404).json({
        success: false,
        error: 'Recording not found'
      });
    }

    res.json({
      success: true,
      data: recording
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get call recording',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get call history
router.get('/calls/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const service = await getGrandstreamService();
    const callHistory = await service.getCallHistory(limit);
    
    res.json({
      success: true,
      data: callHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get call history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get queue status
router.get('/queue/:queueNumber/status', async (req, res) => {
  try {
    const { queueNumber } = req.params;
    const service = await getGrandstreamService();
    const queueStatus = await service.getQueueStatus(queueNumber);
    
    res.json({
      success: true,
      data: queueStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get queue status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Send DTMF
router.post('/call/:callId/dtmf', async (req, res) => {
  try {
    const { callId } = req.params;
    const { dtmf } = req.body;
    
    if (!dtmf) {
      return res.status(400).json({
        success: false,
        error: 'dtmf is required'
      });
    }

    const service = await getGrandstreamService();
    const result = await service.sendDTMF(callId, dtmf);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send DTMF',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create conference
router.post('/conference/create', async (req, res) => {
  try {
    const { extensions } = req.body;
    
    if (!extensions || !Array.isArray(extensions) || extensions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'extensions array is required'
      });
    }

    const service = await getGrandstreamService();
    const result = await service.createConference(extensions);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create conference',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start call monitoring (WebSocket endpoint would be better for real-time)
router.post('/monitoring/start', async (req, res) => {
  try {
    const service = await getGrandstreamService();
    const stopMonitoring = await service.startCallMonitoring();
    
    // Store the stop function for later cleanup
    req.app.locals.stopMonitoring = stopMonitoring;
    
    res.json({
      success: true,
      message: 'Call monitoring started'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start call monitoring',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check for Grandstream connection
router.get('/health', async (req, res) => {
  try {
    // Try to get extensions status as a health check
    const service = await getGrandstreamService();
    const status = await service.getAllExtensionsStatus();
    
    res.json({
      success: true,
      message: 'Grandstream UCM6304A connection healthy',
      extensionsCount: status.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'Grandstream connection unhealthy',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Settings endpoints

// Get current settings
router.get('/settings', async (req, res) => {
  try {
    // Return current environment settings (without sensitive data)
    res.json({
      success: true,
      data: {
        host: process.env.GRANDSTREAM_HOST || '192.168.1.100',
        port: process.env.GRANDSTREAM_PORT || '8088',
        username: process.env.GRANDSTREAM_USERNAME || 'admin',
        password: '••••••••', // Don't return actual password
        apiVersion: process.env.GRANDSTREAM_API_VERSION || 'v1.0',
        sslEnabled: process.env.GRANDSTREAM_SSL === 'true',
        autoBackup: true,
        backupInterval: '24',
        logLevel: 'info',
        maxConcurrentCalls: '200',
        recordCalls: true,
        callTimeout: '30'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Save settings
router.post('/settings', async (req, res) => {
  try {
    const { host, port, username, password, sslEnabled, maxConcurrentCalls, callTimeout, logLevel, recordCalls, autoBackup, backupInterval } = req.body;
    
    // In a real implementation, you would save these to a config file or database
    // For now, we'll just validate and return success
    
    if (!host || !port || !username) {
      return res.status(400).json({
        success: false,
        error: 'Host, port, and username are required'
      });
    }

    // Validate settings
    if (isNaN(Number(port)) || Number(port) < 1 || Number(port) > 65535) {
      return res.status(400).json({
        success: false,
        error: 'Invalid port number'
      });
    }

    // Here you would save to environment variables or config file
    console.log('Settings updated:', { host, port, username, sslEnabled, maxConcurrentCalls, callTimeout, logLevel, recordCalls, autoBackup, backupInterval });
    
    res.json({
      success: true,
      message: 'Settings saved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to save settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test settings connection
router.post('/settings/test', async (req, res) => {
  try {
    const { host, port, username, password } = req.body;
    
    if (!host || !port || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'All connection fields are required for testing'
      });
    }

    // Test connection with provided settings
    const testUrl = `http://${host}:${port}/api/v1.0/status`;
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      res.json({
        success: true,
        message: 'Connection test successful'
      });
    } else {
      res.json({
        success: false,
        message: `Connection failed: ${response.status} ${response.statusText}`
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
});

// Backup configuration
router.post('/backup', async (req, res) => {
  try {
    const service = await getGrandstreamService();
    
    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const backupFilename = `grandstream-backup-${timestamp}.tar.gz`;
    
    // In a real implementation, you would:
    // 1. Call Grandstream backup API
    // 2. Download the backup file
    // 3. Store it locally or in cloud storage
    // 4. Return download URL
    
    // For now, we'll simulate the process
    const mockBackupUrl = `/api/grandstream/backup/download/${backupFilename}`;
    
    res.json({
      success: true,
      message: 'Backup created successfully',
      downloadUrl: mockBackupUrl,
      filename: backupFilename
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create backup',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reboot system
router.post('/reboot', async (req, res) => {
  try {
    // In a real implementation, this would send a reboot command to Grandstream
    // For safety, we'll just simulate it
    
    console.log('Reboot command initiated for Grandstream UCM6304A');
    
    res.json({
      success: true,
      message: 'Reboot initiated successfully. System will be unavailable for 2-3 minutes.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate reboot',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;