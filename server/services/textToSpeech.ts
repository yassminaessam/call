import { VoiceGenerationConfig, VoiceGenerationRequest, VoiceGenerationResponse } from '../../shared/firebase';

export class TextToSpeechService {
  private config: VoiceGenerationConfig;

  constructor(config: VoiceGenerationConfig) {
    this.config = config;
  }

  /**
   * Generate voice from text using specified provider
   */
  async generateVoice(request: VoiceGenerationRequest): Promise<VoiceGenerationResponse> {
    switch (request.config.provider) {
      case 'elevenlabs':
        return this.generateWithElevenLabs(request);
      case 'google':
        return this.generateWithGoogle(request);
      case 'aws':
        return this.generateWithAWS(request);
      case 'azure':
        return this.generateWithAzure(request);
      default:
        throw new Error(`Unsupported TTS provider: ${request.config.provider}`);
    }
  }

  /**
   * Generate voice using ElevenLabs API
   */
  private async generateWithElevenLabs(request: VoiceGenerationRequest): Promise<VoiceGenerationResponse> {
    try {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const voiceSettings = {
        stability: request.config.stability || 0.5,
        similarity_boost: request.config.similarityBoost || 0.5,
        style: 0.0,
        use_speaker_boost: true
      };

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${request.config.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: request.text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: voiceSettings
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`ElevenLabs API error: ${errorData}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioUrl = await this.saveAudioFile(audioBuffer, 'mp3', request.callId, 'elevenlabs');

      // Get audio duration (approximation)
      const duration = this.estimateAudioDuration(request.text, request.config.speed);

      return {
        audioUrl,
        duration,
        format: 'mp3',
        size: audioBuffer.byteLength,
        generatedAt: new Date().toISOString(),
        provider: 'elevenlabs'
      };

    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      throw error;
    }
  }

  /**
   * Generate voice using Google Cloud Text-to-Speech
   */
  private async generateWithGoogle(request: VoiceGenerationRequest): Promise<VoiceGenerationResponse> {
    try {
      const apiKey = process.env.GOOGLE_TTS_API_KEY;
      if (!apiKey) {
        throw new Error('Google TTS API key not configured');
      }

      const requestBody = {
        input: { text: request.text },
        voice: {
          languageCode: request.config.language,
          name: request.config.voiceId,
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: request.config.speed,
          pitch: request.config.pitch,
          volumeGainDb: 0,
          sampleRateHertz: 24000
        }
      };

      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google TTS API error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const audioBuffer = Buffer.from(result.audioContent, 'base64');
      const audioUrl = await this.saveAudioFile(audioBuffer, 'mp3', request.callId, 'google');

      const duration = this.estimateAudioDuration(request.text, request.config.speed);

      return {
        audioUrl,
        duration,
        format: 'mp3',
        size: audioBuffer.byteLength,
        generatedAt: new Date().toISOString(),
        provider: 'google'
      };

    } catch (error) {
      console.error('Google TTS error:', error);
      throw error;
    }
  }

  /**
   * Generate voice using AWS Polly
   */
  private async generateWithAWS(request: VoiceGenerationRequest): Promise<VoiceGenerationResponse> {
    try {
      // AWS SDK would be required for this implementation
      // For now, we'll throw an error indicating it needs AWS SDK setup
      throw new Error('AWS Polly integration requires AWS SDK configuration');
      
      // Implementation would look like:
      /*
      const polly = new AWS.Polly();
      
      const params = {
        Text: request.text,
        OutputFormat: 'mp3',
        VoiceId: request.config.voiceId,
        LanguageCode: request.config.language,
        Engine: 'neural'
      };

      const result = await polly.synthesizeSpeech(params).promise();
      const audioBuffer = result.AudioStream as Buffer;
      const audioUrl = await this.saveAudioFile(audioBuffer, 'mp3', request.callId, 'aws');

      return {
        audioUrl,
        duration: this.estimateAudioDuration(request.text, request.config.speed),
        format: 'mp3',
        size: audioBuffer.byteLength,
        generatedAt: new Date().toISOString(),
        provider: 'aws'
      };
      */

    } catch (error) {
      console.error('AWS Polly error:', error);
      throw error;
    }
  }

  /**
   * Generate voice using Azure Cognitive Services
   */
  private async generateWithAzure(request: VoiceGenerationRequest): Promise<VoiceGenerationResponse> {
    try {
      const subscriptionKey = process.env.AZURE_SPEECH_KEY;
      const region = process.env.AZURE_SPEECH_REGION || 'eastus';
      
      if (!subscriptionKey) {
        throw new Error('Azure Speech API key not configured');
      }

      // Get access token
      const tokenResponse = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey
        }
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get Azure access token');
      }

      const accessToken = await tokenResponse.text();

      // Create SSML
      const ssml = `
        <speak version='1.0' xml:lang='${request.config.language}'>
          <voice xml:lang='${request.config.language}' name='${request.config.voiceId}'>
            <prosody rate='${this.mapSpeedToAzure(request.config.speed)}' pitch='${request.config.pitch}Hz'>
              ${request.text}
            </prosody>
          </voice>
        </speak>
      `;

      const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
        },
        body: ssml
      });

      if (!response.ok) {
        throw new Error(`Azure TTS API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioUrl = await this.saveAudioFile(audioBuffer, 'mp3', request.callId, 'azure');

      return {
        audioUrl,
        duration: this.estimateAudioDuration(request.text, request.config.speed),
        format: 'mp3',
        size: audioBuffer.byteLength,
        generatedAt: new Date().toISOString(),
        provider: 'azure'
      };

    } catch (error) {
      console.error('Azure TTS error:', error);
      throw error;
    }
  }

  /**
   * Save audio file to storage (Firebase Storage or local)
   */
  private async saveAudioFile(audioBuffer: ArrayBuffer | Buffer, format: string, callId: string, provider: string): Promise<string> {
    // In a real implementation, this would save to Firebase Storage or AWS S3
    // For now, we'll simulate this by returning a mock URL
    const timestamp = Date.now();
    const fileName = `voice-${callId}-${provider}-${timestamp}.${format}`;
    
    // Mock implementation - in production, save to cloud storage
    const mockUrl = `https://storage.example.com/voices/${fileName}`;
    
    console.log(`Audio file saved: ${fileName}, Size: ${audioBuffer.byteLength} bytes`);
    
    return mockUrl;
  }

  /**
   * Estimate audio duration based on text length and speech rate
   */
  private estimateAudioDuration(text: string, speed: number): number {
    // Average speaking rate is about 150-160 words per minute for English
    // For Arabic, it's typically 120-140 words per minute
    const wordsPerMinute = text.match(/[\u0600-\u06FF]/) ? 130 : 155; // Check for Arabic characters
    const adjustedWPM = wordsPerMinute * speed;
    
    const wordCount = text.split(/\s+/).length;
    const durationMinutes = wordCount / adjustedWPM;
    
    return Math.round(durationMinutes * 60); // Return seconds
  }

  /**
   * Map speed value to Azure format
   */
  private mapSpeedToAzure(speed: number): string {
    if (speed <= 0.7) return 'slow';
    if (speed >= 1.3) return 'fast';
    return 'medium';
  }

  /**
   * Get available voices for a provider
   */
  async getAvailableVoices(provider: string, language: string = 'ar-SA'): Promise<any[]> {
    switch (provider) {
      case 'elevenlabs':
        return this.getElevenLabsVoices();
      case 'google':
        return this.getGoogleVoices(language);
      case 'azure':
        return this.getAzureVoices(language);
      default:
        return [];
    }
  }

  /**
   * Get ElevenLabs voices
   */
  private async getElevenLabsVoices(): Promise<any[]> {
    try {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) return [];

      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': apiKey
        }
      });

      if (!response.ok) return [];

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      return [];
    }
  }

  /**
   * Get Google TTS voices
   */
  private async getGoogleVoices(languageCode: string): Promise<any[]> {
    try {
      const apiKey = process.env.GOOGLE_TTS_API_KEY;
      if (!apiKey) return [];

      const response = await fetch(`https://texttospeech.googleapis.com/v1/voices?key=${apiKey}&languageCode=${languageCode}`);

      if (!response.ok) return [];

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching Google voices:', error);
      return [];
    }
  }

  /**
   * Get Azure voices
   */
  private async getAzureVoices(languageCode: string): Promise<any[]> {
    // Azure voices are typically pre-defined
    // Return common Arabic and English voices
    const commonVoices = [
      { name: 'ar-SA-ZariyahNeural', language: 'ar-SA', gender: 'Female' },
      { name: 'ar-SA-HamedNeural', language: 'ar-SA', gender: 'Male' },
      { name: 'en-US-JennyNeural', language: 'en-US', gender: 'Female' },
      { name: 'en-US-GuyNeural', language: 'en-US', gender: 'Male' }
    ];

    return commonVoices.filter(voice => voice.language === languageCode);
  }

  /**
   * Validate TTS configuration
   */
  validateConfig(config: VoiceGenerationConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const supportedProviders = ['elevenlabs', 'google', 'aws', 'azure'];
    if (!supportedProviders.includes(config.provider)) {
      errors.push(`Unsupported TTS provider: ${config.provider}`);
    }

    if (!config.voiceId || config.voiceId.trim().length === 0) {
      errors.push('Voice ID is required');
    }

    if (!config.language || config.language.trim().length === 0) {
      errors.push('Language is required');
    }

    if (config.speed < 0.25 || config.speed > 4.0) {
      errors.push('Speed must be between 0.25 and 4.0');
    }

    if (config.pitch < -20 || config.pitch > 20) {
      errors.push('Pitch must be between -20 and 20');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get estimated cost for voice generation
   */
  getEstimatedCost(text: string, provider: string): number {
    const characterCount = text.length;
    
    // Pricing per provider (as of 2024)
    const pricing = {
      elevenlabs: 0.0001, // per character
      google: 0.000004 * 100, // per character (billed per 100 characters)
      aws: 0.00001 * 100, // per character (billed per 100 characters)
      azure: 0.00001 * 100 // per character (billed per 100 characters)
    };

    const rate = pricing[provider as keyof typeof pricing] || 0;
    return characterCount * rate;
  }
}

export default TextToSpeechService;
