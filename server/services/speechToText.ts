import { GoogleSpeechConfig, SpeechToTextRequest, SpeechToTextResponse } from '../../shared/firebase';

export class SpeechToTextService {
  private config: GoogleSpeechConfig;
  private apiUrl = 'https://speech.googleapis.com/v1/speech:recognize';

  constructor(config: GoogleSpeechConfig) {
    this.config = config;
  }

  /**
   * Convert audio URL to base64 for Google Speech API
   */
  private async audioUrlToBase64(audioUrl: string): Promise<string> {
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer.toString('base64');
    } catch (error) {
      console.error('Error converting audio to base64:', error);
      throw error;
    }
  }

  /**
   * Detect language of the audio content
   */
  private async detectLanguage(audioContent: string, encoding: string, sampleRate: number): Promise<string> {
    try {
      const detectRequest = {
        config: {
          encoding: encoding,
          sampleRateHertz: sampleRate,
          languageCode: 'ar-SA', // Default to Arabic, will auto-detect
          alternativeLanguageCodes: ['en-US', 'ar-SA'],
          enableAutomaticPunctuation: true,
          model: 'latest_long'
        },
        audio: {
          content: audioContent
        }
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(detectRequest)
      });

      if (!response.ok) {
        throw new Error(`Language detection failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.results && result.results.length > 0) {
        return result.results[0].languageCode || 'ar-SA';
      }
      
      return 'ar-SA'; // Default fallback
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'ar-SA'; // Default fallback
    }
  }

  /**
   * Convert speech to text using Google Speech-to-Text API
   */
  async transcribeAudio(request: SpeechToTextRequest): Promise<SpeechToTextResponse> {
    try {
      // Convert audio URL to base64
      const audioContent = await this.audioUrlToBase64(request.audioUrl);
      
      // Detect language if not specified or set to auto
      let languageCode = request.languageCode;
      if (languageCode === 'auto') {
        languageCode = await this.detectLanguage(audioContent, request.encoding, request.sampleRateHertz);
      }

      // Prepare the speech recognition request
      const speechRequest = {
        config: {
          encoding: request.encoding,
          sampleRateHertz: request.sampleRateHertz,
          languageCode: languageCode,
          alternativeLanguageCodes: languageCode === 'ar-SA' ? ['en-US'] : ['ar-SA'],
          maxAlternatives: 1,
          enableAutomaticPunctuation: this.config.enableAutomaticPunctuation,
          enableSpeakerDiarization: this.config.enableSpeakerDiarization,
          diarizationSpeakerCount: this.config.maxSpeakers,
          model: this.config.model,
          useEnhanced: true
        },
        audio: {
          content: audioContent
        }
      };

      // Make the API request
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(speechRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Speech-to-Text API error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();

      // Process the results
      if (!result.results || result.results.length === 0) {
        return {
          transcription: '',
          confidence: 0,
          languageCode: languageCode,
          segments: [],
          processedAt: new Date().toISOString()
        };
      }

      // Combine all transcription results
      let fullTranscription = '';
      let totalConfidence = 0;
      const segments: SpeechToTextResponse['segments'] = [];

      result.results.forEach((resultItem: any, index: number) => {
        if (resultItem.alternatives && resultItem.alternatives.length > 0) {
          const alternative = resultItem.alternatives[0];
          fullTranscription += (index > 0 ? ' ' : '') + alternative.transcript;
          totalConfidence += alternative.confidence || 0;

          // Process word-level timing if available
          if (alternative.words) {
            alternative.words.forEach((word: any) => {
              segments.push({
                text: word.word,
                startTime: this.parseTimeToSeconds(word.startTime),
                endTime: this.parseTimeToSeconds(word.endTime),
                confidence: word.confidence || alternative.confidence || 0,
                speakerTag: word.speakerTag
              });
            });
          } else {
            // If no word-level timing, create a segment for the whole result
            segments.push({
              text: alternative.transcript,
              startTime: 0,
              endTime: 0,
              confidence: alternative.confidence || 0
            });
          }
        }
      });

      const averageConfidence = result.results.length > 0 ? totalConfidence / result.results.length : 0;

      return {
        transcription: fullTranscription.trim(),
        confidence: averageConfidence,
        languageCode: languageCode,
        segments: segments,
        processedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  /**
   * Convert Google's time format to seconds
   */
  private parseTimeToSeconds(timeString: string): number {
    if (!timeString) return 0;
    
    // Google returns time in format like "1.500s"
    const match = timeString.match(/^(\d+(?:\.\d+)?)s?$/);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0;
  }

  /**
   * Transcribe audio with retry logic
   */
  async transcribeWithRetry(request: SpeechToTextRequest, maxRetries: number = 3): Promise<SpeechToTextResponse> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.transcribeAudio(request);
      } catch (error) {
        lastError = error as Error;
        console.error(`Transcription attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Validate audio format and requirements
   */
  validateAudioRequest(request: SpeechToTextRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check supported encoding
    const supportedEncodings = ['MP3', 'WAV', 'FLAC', 'AMR', 'AMR_WB', 'OGG_OPUS', 'SPEEX_WITH_HEADER_BYTE'];
    if (!supportedEncodings.includes(request.encoding)) {
      errors.push(`Unsupported encoding: ${request.encoding}`);
    }

    // Check sample rate
    if (request.sampleRateHertz < 8000 || request.sampleRateHertz > 48000) {
      errors.push(`Sample rate must be between 8000 and 48000 Hz, got ${request.sampleRateHertz}`);
    }

    // Check language code
    const supportedLanguages = ['ar-SA', 'en-US', 'auto'];
    if (!supportedLanguages.includes(request.languageCode)) {
      errors.push(`Unsupported language code: ${request.languageCode}`);
    }

    // Check audio URL
    if (!request.audioUrl || !this.isValidUrl(request.audioUrl)) {
      errors.push('Invalid audio URL provided');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate URL format
   */
  private isValidUrl(urlString: string): boolean {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get estimated processing cost
   */
  getEstimatedCost(durationSeconds: number): number {
    // Google Speech-to-Text pricing (as of 2024)
    // Standard: $0.006 per 15 seconds (or fraction thereof)
    // Enhanced: $0.009 per 15 seconds (or fraction thereof)
    const fifteenSecondBlocks = Math.ceil(durationSeconds / 15);
    const standardCost = fifteenSecondBlocks * 0.006;
    const enhancedCost = fifteenSecondBlocks * 0.009;
    
    return this.config.model.includes('enhanced') ? enhancedCost : standardCost;
  }
}

export default SpeechToTextService;
