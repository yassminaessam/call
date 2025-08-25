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

export default router;