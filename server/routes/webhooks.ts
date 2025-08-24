import express from 'express';
import { TwilioCallWebhook, Call, WEBHOOK_EVENTS } from '../../shared/firebase';
import TwilioService from '../services/twilio';
import SpeechToTextService from '../services/speechToText';
import OpenAIService from '../services/openai';
import TextToSpeechService from '../services/textToSpeech';

const router = express.Router();

// Mock Firebase admin - In production, use actual Firebase Admin SDK
const mockFirebase = {
  ref: (path: string) => ({
    set: (data: any) => Promise.resolve(),
    push: (data: any) => Promise.resolve({ key: 'generated-id' }),
    once: (event: string) => Promise.resolve({ val: () => null }),
    update: (data: any) => Promise.resolve()
  })
};

// Initialize services (in production, these would be configured from Firebase config)
const twilioService = new TwilioService({
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  webhookUrl: process.env.WEBHOOK_BASE_URL || 'https://your-app.com/api',
  recordingEnabled: true,
  recordingFormat: 'mp3'
});

const speechToTextService = new SpeechToTextService({
  apiKey: process.env.GOOGLE_SPEECH_API_KEY || '',
  languageCodes: ['ar-SA', 'en-US'],
  model: 'latest_long',
  enableAutomaticPunctuation: true,
  enableSpeakerDiarization: true,
  maxSpeakers: 2
});

const openaiService = new OpenAIService({
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-4',
  maxTokens: 1000,
  temperature: 0.7
});

/**
 * Twilio Voice Webhook - Handles incoming calls
 */
router.post('/twilio/voice', async (req, res) => {
  try {
    const department = req.query.department as string || 'general';
    
    // Generate TwiML response for incoming call
    const twiml = twilioService.generateIncomingCallTwiML(department);
    
    // Log the incoming call
    const callData = {
      callSid: req.body.CallSid,
      from: req.body.From,
      to: req.body.To,
      direction: 'inbound',
      department: department,
      status: 'incoming',
      timestamp: new Date().toISOString()
    };
    
    await logWebhookEvent(WEBHOOK_EVENTS.TWILIO_CALL_INITIATED, callData);
    
    res.type('text/xml');
    res.send(twiml);
  } catch (error) {
    console.error('Error handling voice webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Twilio Call Status Webhook - Handles call status updates
 */
router.post('/twilio/status', async (req, res) => {
  try {
    const webhookData: TwilioCallWebhook = req.body;
    const department = req.query.department as string || 'general';
    
    console.log('Twilio Status Webhook:', webhookData);
    
    // Process webhook and convert to Call object
    const callData = twilioService.processWebhookToCall(webhookData, department);
    
    // Save or update call in Firebase
    await saveOrUpdateCall(callData);
    
    // If call is completed and has recording, trigger processing
    if (webhookData.CallStatus === 'completed' && webhookData.RecordingUrl) {
      await processCallRecording(webhookData.CallSid, webhookData.RecordingUrl, department);
    }
    
    // Log the event
    await logWebhookEvent(WEBHOOK_EVENTS.TWILIO_CALL_ENDED, {
      callSid: webhookData.CallSid,
      status: webhookData.CallStatus,
      duration: webhookData.Duration
    });
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling status webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Twilio Recording Webhook - Handles recording availability
 */
router.post('/twilio/recording', async (req, res) => {
  try {
    const recordingData = req.body;
    console.log('Recording Webhook:', recordingData);
    
    // Update call with recording information
    if (recordingData.CallSid && recordingData.RecordingUrl) {
      await updateCallRecording(recordingData.CallSid, {
        url: recordingData.RecordingUrl,
        sid: recordingData.RecordingSid,
        duration: parseInt(recordingData.RecordingDuration) || 0,
        format: 'mp3',
        size: 0
      });
      
      // Trigger speech-to-text processing
      const department = req.query.department as string || 'general';
      await processCallRecording(recordingData.CallSid, recordingData.RecordingUrl, department);
    }
    
    await logWebhookEvent(WEBHOOK_EVENTS.TWILIO_RECORDING_READY, recordingData);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling recording webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Manual Call Processing - Trigger processing for existing calls
 */
router.post('/process-call/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    const { force = false } = req.body;
    
    // Get call data from Firebase
    const callRef = mockFirebase.ref(`calls/${callId}`);
    const callSnapshot = await callRef.once('value');
    const callData = callSnapshot.val() as Call;
    
    if (!callData) {
      return res.status(404).json({ error: 'Call not found' });
    }
    
    if (!callData.recording?.url) {
      return res.status(400).json({ error: 'No recording available for this call' });
    }
    
    if (callData.transcription && !force) {
      return res.status(400).json({ error: 'Call already processed. Use force=true to reprocess.' });
    }
    
    // Process the call
    await processCallRecording(callId, callData.recording.url, callData.receiverDepartment);
    
    res.json({ message: 'Call processing started', callId });
  } catch (error) {
    console.error('Error processing call:', error);
    res.status(500).json({ error: 'Failed to process call' });
  }
});

/**
 * Get Call Details with Processing Status
 */
router.get('/call/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    
    const callRef = mockFirebase.ref(`calls/${callId}`);
    const callSnapshot = await callRef.once('value');
    const callData = callSnapshot.val() as Call;
    
    if (!callData) {
      return res.status(404).json({ error: 'Call not found' });
    }
    
    // Check processing status
    const processingRef = mockFirebase.ref(`processingQueue/${callId}`);
    const processingSnapshot = await processingRef.once('value');
    const processingStatus = processingSnapshot.val();
    
    res.json({
      call: callData,
      processing: processingStatus
    });
  } catch (error) {
    console.error('Error fetching call:', error);
    res.status(500).json({ error: 'Failed to fetch call' });
  }
});

/**
 * Regenerate AI Response
 */
router.post('/call/:callId/regenerate-response', async (req, res) => {
  try {
    const { callId } = req.params;
    const { customInstructions } = req.body;
    
    const callRef = mockFirebase.ref(`calls/${callId}`);
    const callSnapshot = await callRef.once('value');
    const callData = callSnapshot.val() as Call;
    
    if (!callData || !callData.transcription) {
      return res.status(400).json({ error: 'Call not found or not transcribed' });
    }
    
    // Generate new AI response
    await generateAIResponse(callId, callData, customInstructions);
    
    res.json({ message: 'AI response regeneration started', callId });
  } catch (error) {
    console.error('Error regenerating response:', error);
    res.status(500).json({ error: 'Failed to regenerate response' });
  }
});

/**
 * Get Processing Queue Status
 */
router.get('/processing-queue', async (req, res) => {
  try {
    const queueRef = mockFirebase.ref('processingQueue');
    const queueSnapshot = await queueRef.once('value');
    const queue = queueSnapshot.val() || {};
    
    res.json({ queue });
  } catch (error) {
    console.error('Error fetching processing queue:', error);
    res.status(500).json({ error: 'Failed to fetch processing queue' });
  }
});

/**
 * Helper function to process call recording
 */
async function processCallRecording(callId: string, recordingUrl: string, department: string) {
  try {
    // Add to processing queue
    await addToProcessingQueue(callId, 'transcription');
    
    // Start speech-to-text processing
    const transcriptionRequest = {
      audioUrl: recordingUrl,
      languageCode: 'auto',
      callId: callId,
      encoding: 'MP3' as const,
      sampleRateHertz: 8000
    };
    
    const transcriptionResult = await speechToTextService.transcribeWithRetry(transcriptionRequest);
    
    // Save transcription to Firebase
    await updateCallTranscription(callId, transcriptionResult);
    
    // Mark transcription as completed
    await updateProcessingQueue(callId, 'transcription', 'completed');
    
    // Start AI analysis
    await processAIAnalysis(callId, transcriptionResult.transcription, department);
    
    await logWebhookEvent(WEBHOOK_EVENTS.SPEECH_TO_TEXT_COMPLETED, {
      callId,
      transcription: transcriptionResult.transcription,
      confidence: transcriptionResult.confidence
    });
    
  } catch (error) {
    console.error('Error processing call recording:', error);
    await updateProcessingQueue(callId, 'transcription', 'failed', getErrorMessage(error));
    
    await logWebhookEvent(WEBHOOK_EVENTS.SPEECH_TO_TEXT_FAILED, {
      callId,
      error: getErrorMessage(error)
    });
  }
}

/**
 * Helper function to process AI analysis
 */
async function processAIAnalysis(callId: string, transcription: string, department: string) {
  try {
    await addToProcessingQueue(callId, 'ai_analysis');
    
    // Get call metadata
    const callRef = mockFirebase.ref(`calls/${callId}`);
    const callSnapshot = await callRef.once('value');
    const callData = callSnapshot.val() as Call;
    
    const analysisRequest = {
      transcription: transcription,
      callMetadata: {
        duration: callData.duration || 0,
        department: department,
        callerPhone: callData.from,
        direction: callData.direction
      },
      departmentContext: {
        type: department as any
      }
    };
    
    const analysis = await openaiService.analyzeCall(analysisRequest);
    
    // Save analysis to Firebase
    await updateCallAnalysis(callId, analysis);
    await updateProcessingQueue(callId, 'ai_analysis', 'completed');
    
    // Generate AI response
    await generateAIResponse(callId, { ...callData, aiAnalysis: analysis });
    
    await logWebhookEvent(WEBHOOK_EVENTS.AI_ANALYSIS_COMPLETED, {
      callId,
      analysis
    });
    
  } catch (error) {
    console.error('Error processing AI analysis:', error);
  await updateProcessingQueue(callId, 'ai_analysis', 'failed', getErrorMessage(error));
  }
}

/**
 * Helper function to generate AI response
 */
async function generateAIResponse(callId: string, callData: Call, customInstructions?: string) {
  try {
    if (!callData.transcription || !callData.aiAnalysis) {
      throw new Error('Call must be transcribed and analyzed first');
    }
    
    await addToProcessingQueue(callId, 'voice_generation');
    
    const replyRequest = {
      transcription: callData.transcription.text,
      analysis: {
        summary: callData.aiAnalysis.summary,
        sentiment: callData.aiAnalysis.sentiment,
        intent: callData.aiAnalysis.intent,
        category: callData.aiAnalysis.category
      },
      department: callData.receiverDepartment,
      companyInfo: {
        name: 'شركة CRM المتقدمة',
        businessHours: 'الأحد - الخميس، 9 صباحاً - 6 مساءً',
        contactInfo: 'للتواصل: 920000000'
      },
      customInstructions
    };
    
    const aiReply = await openaiService.generateReply(replyRequest);
    
    // Save AI reply to Firebase
    await updateCallAIReply(callId, aiReply);
    
    // Generate voice for the reply
    const voiceConfig = {
      provider: 'elevenlabs' as const,
      voiceId: 'default-arabic-voice',
      language: 'ar-SA',
      speed: 1.0,
      pitch: 0,
      stability: 0.5,
      similarityBoost: 0.5
    };
    
    const voiceRequest = {
      text: aiReply.text,
      config: voiceConfig,
      callId: callId,
      department: callData.receiverDepartment
    };
    
    try {
      const voiceResult = await new TextToSpeechService(voiceConfig).generateVoice(voiceRequest);
      
      // Update AI reply with voice URL
      await updateCallAIReplyVoice(callId, voiceResult);
      
      await logWebhookEvent(WEBHOOK_EVENTS.AI_VOICE_GENERATED, {
        callId,
        voiceUrl: voiceResult.audioUrl,
        duration: voiceResult.duration
      });
    } catch (voiceError) {
      console.error('Voice generation failed:', voiceError);
      // Continue without voice - text reply is still available
    }
    
    await updateProcessingQueue(callId, 'voice_generation', 'completed');
    
    await logWebhookEvent(WEBHOOK_EVENTS.AI_REPLY_GENERATED, {
      callId,
      reply: aiReply
    });
    
  } catch (error) {
    console.error('Error generating AI response:', error);
  await updateProcessingQueue(callId, 'voice_generation', 'failed', getErrorMessage(error));
  }
}

// Helper functions for Firebase operations
async function saveOrUpdateCall(callData: Partial<Call>) {
  const callRef = mockFirebase.ref(`calls/${callData.id}`);
  await callRef.set(callData);
}

async function updateCallRecording(callId: string, recording: any) {
  const callRef = mockFirebase.ref(`calls/${callId}/recording`);
  await callRef.set(recording);
}

async function updateCallTranscription(callId: string, transcription: any) {
  const callRef = mockFirebase.ref(`calls/${callId}/transcription`);
  await callRef.set(transcription);
}

async function updateCallAnalysis(callId: string, analysis: any) {
  const callRef = mockFirebase.ref(`calls/${callId}/aiAnalysis`);
  await callRef.set(analysis);
}

async function updateCallAIReply(callId: string, reply: any) {
  const callRef = mockFirebase.ref(`calls/${callId}/aiReply`);
  await callRef.set(reply);
}

async function updateCallAIReplyVoice(callId: string, voice: any) {
  const callRef = mockFirebase.ref(`calls/${callId}/aiReply/voiceGenerated`);
  await callRef.set(voice);
}

async function addToProcessingQueue(callId: string, type: string) {
  const queueRef = mockFirebase.ref(`processingQueue/${callId}-${type}`);
  await queueRef.set({
    id: `${callId}-${type}`,
    type,
    callId,
    status: 'pending',
    priority: 'medium',
    createdAt: new Date().toISOString()
  });
}

async function updateProcessingQueue(callId: string, type: string, status: string, error?: string) {
  const queueRef = mockFirebase.ref(`processingQueue/${callId}-${type}`);
  await queueRef.update({
    status,
    processedAt: new Date().toISOString(),
    error
  });
}

async function logWebhookEvent(event: string, data: any) {
  const logRef = mockFirebase.ref('webhookLogs');
  await logRef.push({
    event,
    data,
    timestamp: new Date().toISOString(),
    source: 'webhook-api'
  });
}

export default router;

// Helper to safely extract error messages in strict mode
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
