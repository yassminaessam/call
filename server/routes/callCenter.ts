import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAIService from '../services/openai';
import SpeechToTextService from '../services/speechToText';
import TextToSpeechService from '../services/textToSpeech';

const router = Router();

// Lazy initialization to avoid serverless deployment issues
let prisma: PrismaClient | null = null;
let openaiService: OpenAIService | null = null;
let speechToTextService: SpeechToTextService | null = null;
let textToSpeechService: TextToSpeechService | null = null;

const getPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

const getOpenAIService = () => {
  if (!openaiService) {
    openaiService = new OpenAIService({
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4',
      maxTokens: 1000,
      temperature: 0.3
    });
  }
  return openaiService;
};

const getSpeechToTextService = () => {
  if (!speechToTextService) {
    speechToTextService = new SpeechToTextService({
      apiKey: process.env.GOOGLE_SPEECH_API_KEY || '',
      languageCodes: ['ar-SA', 'en-US'],
      enableAutomaticPunctuation: true,
      enableSpeakerDiarization: true,
      maxSpeakers: 2,
      model: 'latest_long'
    });
  }
  return speechToTextService;
};

const getTextToSpeechService = () => {
  if (!textToSpeechService) {
    textToSpeechService = new TextToSpeechService({
      provider: 'elevenlabs',
      voiceId: 'voice-1',
      language: 'ar-SA',
      speed: 1.0,
      pitch: 0,
      stability: 0.5,
      similarityBoost: 0.5
    });
  }
  return textToSpeechService;
};

// Get call history
router.get('/history', async (req, res) => {
  try {
    const db = getPrisma();
    
    // In a real implementation, you'd fetch from your calls table
    // For now, we'll return mock data
    const mockCalls = [
      {
        id: 'call-1',
        phoneNumber: '+966501234567',
        direction: 'inbound',
        duration: 120,
        department: 'sales',
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date(Date.now() - 3480000).toISOString(),
        recordingUrl: 'https://example.com/recording1.mp3',
        status: 'completed',
        transcription: 'مرحباً، أريد الاستفسار عن منتجاتكم الجديدة في مجال التكنولوجيا.',
        aiAnalysis: {
          summary: 'استفسار عن المنتجات التقنية الجديدة',
          sentiment: 'positive',
          intent: 'product_inquiry',
          category: 'sales',
          priority: 'medium',
          suggestedActions: ['إرسال كتالوج المنتجات', 'ترتيب اجتماع مع فريق المبيعات'],
          keywords: ['منتجات', 'تكنولوجيا', 'جديدة']
        },
        aiReply: {
          text: 'شكراً لك على اهتمامك بمنتجاتنا. سيقوم فريق المبيعات بالتواصل معك خلال 24 ساعة لتقديم معلومات مفصلة عن أحدث منتجاتنا التقنية.',
          tone: 'professional',
          audioUrl: 'https://example.com/reply1.mp3'
        }
      },
      {
        id: 'call-2',
        phoneNumber: '+966507654321',
        direction: 'inbound',
        duration: 95,
        department: 'support',
        startTime: new Date(Date.now() - 7200000).toISOString(),
        endTime: new Date(Date.now() - 7105000).toISOString(),
        recordingUrl: 'https://example.com/recording2.mp3',
        status: 'processing'
      },
      {
        id: 'call-3',
        phoneNumber: '+966509876543',
        direction: 'outbound',
        duration: 180,
        department: 'hr',
        startTime: new Date(Date.now() - 10800000).toISOString(),
        endTime: new Date(Date.now() - 10620000).toISOString(),
        status: 'failed'
      }
    ];

    res.json({
      success: true,
      calls: mockCalls
    });
  } catch (error) {
    console.error('Failed to fetch call history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch call history'
    });
  }
});

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    // In a real implementation, calculate from database
    const stats = {
      totalCalls: 156,
      processedCalls: 142,
      avgProcessingTime: 12,
      satisfactionScore: 8.7,
      activeProcessing: 3
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// Process call with AI
router.post('/process/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    const { speechToTextConfig, analysisConfig, textToSpeechConfig } = req.body;

    // Simulate processing steps
    console.log(`[AI] Processing call ${callId}...`);

    // Step 1: Speech-to-Text (mock)
    const transcription = 'مرحباً، أحتاج مساعدة في مشكلة تقنية في النظام الجديد. النظام لا يستجيب بشكل صحيح.';

    // Step 2: AI Analysis
    const openai = getOpenAIService();
    const analysis = await openai.analyzeCall({
      transcription,
      callMetadata: {
        department: 'support',
        duration: 120,
        direction: 'inbound',
        callerPhone: '+966501234567'
      },
      departmentContext: {
        type: 'support',
        specialInstructions: 'Focus on technical issues and resolution steps'
      }
    });

    // Step 3: Generate Reply
    const reply = await openai.generateReply({
      transcription,
      analysis,
      department: 'support',
      companyInfo: {
        name: 'شركة التقنية المتقدمة',
        businessHours: '9 صباحاً - 6 مساءً',
        contactInfo: 'support@company.com'
      }
    });

    // Step 4: Generate Voice (mock)
    const voiceResponse = {
      audioUrl: 'https://example.com/generated-reply.mp3',
      duration: 15,
      format: 'mp3'
    };

    // Update call record
    const updatedCall = {
      id: callId,
      transcription,
      aiAnalysis: analysis,
      aiReply: {
        ...reply,
        audioUrl: voiceResponse.audioUrl
      },
      status: 'completed'
    };

    console.log(`[AI] Call ${callId} processed successfully`);

    res.json({
      success: true,
      call: updatedCall,
      processing: {
        transcriptionTime: 5,
        analysisTime: 3,
        replyGenerationTime: 2,
        voiceGenerationTime: 4,
        totalTime: 14
      }
    });
  } catch (error) {
    console.error('AI processing failed:', error);
    res.status(500).json({
      success: false,
      error: 'AI processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Regenerate AI response
router.post('/regenerate/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    const { analysisConfig, textToSpeechConfig } = req.body;

    console.log(`[AI] Regenerating response for call ${callId}...`);

    // Mock existing transcription and analysis
    const transcription = 'مرحباً، أحتاج مساعدة في مشكلة تقنية في النظام الجديد.';
    const analysis = {
      summary: 'مشكلة تقنية في النظام',
      sentiment: 'neutral',
      intent: 'technical_support',
      category: 'support',
      priority: 'high',
      suggestedActions: ['تشخيص المشكلة', 'تقديم حل تقني'],
      keywords: ['مشكلة', 'تقنية', 'نظام']
    };

    // Generate new reply
    const openai = getOpenAIService();
    const reply = await openai.generateReply({
      transcription,
      analysis,
      department: 'support',
      companyInfo: {
        name: 'شركة التقنية المتقدمة',
        businessHours: '9 صباحاً - 6 مساءً',
        contactInfo: 'support@company.com'
      },
      customInstructions: 'Generate a more detailed technical response with step-by-step solution'
    });

    // Generate new voice
    const voiceResponse = {
      audioUrl: 'https://example.com/regenerated-reply.mp3',
      duration: 18,
      format: 'mp3'
    };

    const aiReply = {
      ...reply,
      audioUrl: voiceResponse.audioUrl,
      regeneratedAt: new Date().toISOString()
    };

    console.log(`[AI] Response regenerated for call ${callId}`);

    res.json({
      success: true,
      aiReply
    });
  } catch (error) {
    console.error('Response regeneration failed:', error);
    res.status(500).json({
      success: false,
      error: 'Response regeneration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Batch process multiple calls
router.post('/batch-process', async (req, res) => {
  try {
    const { callIds, config } = req.body;

    if (!Array.isArray(callIds) || callIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid call IDs provided'
      });
    }

    console.log(`[AI] Starting batch processing for ${callIds.length} calls...`);

    const results = [];
    const errors = [];

    for (const callId of callIds) {
      try {
        // Process each call (simplified version)
        const result = {
          callId,
          status: 'completed',
          processedAt: new Date().toISOString()
        };
        results.push(result);
      } catch (error) {
        errors.push({
          callId,
          error: error instanceof Error ? error.message : 'Processing failed'
        });
      }
    }

    console.log(`[AI] Batch processing completed: ${results.length} successful, ${errors.length} failed`);

    res.json({
      success: true,
      processed: results.length,
      failed: errors.length,
      results,
      errors
    });
  } catch (error) {
    console.error('Batch processing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Batch processing failed'
    });
  }
});

// Get processing queue status
router.get('/queue', async (req, res) => {
  try {
    // Mock queue data
    const queue = [
      {
        callId: 'call-4',
        position: 1,
        estimatedTime: 45,
        status: 'transcribing'
      },
      {
        callId: 'call-5',
        position: 2,
        estimatedTime: 60,
        status: 'queued'
      },
      {
        callId: 'call-6',
        position: 3,
        estimatedTime: 75,
        status: 'queued'
      }
    ];

    res.json({
      success: true,
      queue,
      totalInQueue: queue.length,
      averageWaitTime: 60
    });
  } catch (error) {
    console.error('Failed to fetch queue status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch queue status'
    });
  }
});

// Get AI service health
router.get('/health', async (req, res) => {
  try {
    const health = {
      openai: {
        status: process.env.OPENAI_API_KEY ? 'healthy' : 'missing_key',
        model: 'gpt-4',
        lastCheck: new Date().toISOString()
      },
      speechToText: {
        status: process.env.GOOGLE_SPEECH_API_KEY ? 'healthy' : 'missing_key',
        provider: 'google',
        lastCheck: new Date().toISOString()
      },
      textToSpeech: {
        status: process.env.ELEVENLABS_API_KEY ? 'healthy' : 'missing_key',
        provider: 'elevenlabs',
        lastCheck: new Date().toISOString()
      }
    };

    const overallHealth = Object.values(health).every(service => service.status === 'healthy') 
      ? 'healthy' 
      : 'degraded';

    res.json({
      success: true,
      status: overallHealth,
      services: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
});

// Get usage analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    // Mock analytics data
    const analytics = {
      period,
      totalCalls: 456,
      processedCalls: 423,
      averageProcessingTime: 12.5,
      successRate: 92.8,
      sentimentDistribution: {
        positive: 65,
        neutral: 25,
        negative: 10
      },
      departmentStats: {
        sales: { calls: 156, satisfaction: 8.9 },
        support: { calls: 134, satisfaction: 8.2 },
        hr: { calls: 89, satisfaction: 9.1 },
        marketing: { calls: 77, satisfaction: 8.7 }
      },
      costAnalysis: {
        totalCost: 45.67,
        costPerCall: 0.108,
        breakdown: {
          speechToText: 12.34,
          aiAnalysis: 23.45,
          textToSpeech: 9.88
        }
      },
      trends: {
        callVolume: [45, 52, 48, 61, 55, 68, 72],
        satisfaction: [8.2, 8.4, 8.1, 8.6, 8.5, 8.8, 8.7],
        processingTime: [14, 13, 12, 11, 12, 11, 10]
      }
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// Export transcription
router.get('/export/:callId/transcription', async (req, res) => {
  try {
    const { callId } = req.params;
    const { format = 'txt' } = req.query;

    // Mock transcription
    const transcription = 'مرحباً، أريد الاستفسار عن منتجاتكم الجديدة في مجال التكنولوجيا.';

    if (format === 'json') {
      res.json({
        callId,
        transcription,
        timestamp: new Date().toISOString(),
        metadata: {
          language: 'ar-SA',
          confidence: 0.95,
          duration: 120
        }
      });
    } else {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="call-${callId}-transcription.txt"`);
      res.send(transcription);
    }
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({
      success: false,
      error: 'Export failed'
    });
  }
});

export default router;