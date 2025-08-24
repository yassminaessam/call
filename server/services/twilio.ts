import twilio from 'twilio';
import { TwilioConfig, TwilioCallWebhook, Call } from '../../shared/firebase';

export class TwilioService {
  private client: twilio.Twilio;
  private config: TwilioConfig;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.client = twilio(config.accountSid, config.authToken);
  }

  /**
   * Initialize a new phone number for the CRM system
   */
  async purchasePhoneNumber(areaCode?: string | number, countryCode: string = 'US') {
    try {
      const parsedArea = typeof areaCode === 'string' ? parseInt(areaCode) : areaCode;
      const listOptions: any = { limit: 10 };
      if (typeof parsedArea === 'number' && !Number.isNaN(parsedArea)) {
        listOptions.areaCode = parsedArea;
      }
      const availableNumbers = await this.client.availablePhoneNumbers(countryCode)
        .local
        .list(listOptions);

      if (availableNumbers.length === 0) {
        throw new Error('No phone numbers available in the specified area');
      }

      const purchasedNumber = await this.client.incomingPhoneNumbers
        .create({
          phoneNumber: availableNumbers[0].phoneNumber,
          voiceUrl: `${this.config.webhookUrl}/twilio/voice`,
          voiceMethod: 'POST',
          statusCallback: `${this.config.webhookUrl}/twilio/status`,
          statusCallbackMethod: 'POST'
        });

      return {
        phoneNumber: purchasedNumber.phoneNumber,
        sid: purchasedNumber.sid,
        friendlyName: purchasedNumber.friendlyName
      };
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      throw error;
    }
  }

  /**
   * Configure existing phone number with webhooks
   */
  async configurePhoneNumber(phoneNumberSid: string) {
    try {
      await this.client.incomingPhoneNumbers(phoneNumberSid)
        .update({
          voiceUrl: `${this.config.webhookUrl}/twilio/voice`,
          voiceMethod: 'POST',
          statusCallback: `${this.config.webhookUrl}/twilio/status`,
          statusCallbackMethod: 'POST'
        });

      return { success: true };
    } catch (error) {
      console.error('Error configuring phone number:', error);
      throw error;
    }
  }

  /**
   * Initiate an outbound call
   */
  async makeCall(to: string, from?: string, department: string = 'sales') {
    try {
      const call = await this.client.calls.create({
        to: to,
        from: from || this.config.phoneNumber,
        url: `${this.config.webhookUrl}/twilio/voice?department=${department}`,
        method: 'POST',
        record: this.config.recordingEnabled,
        recordingStatusCallback: `${this.config.webhookUrl}/twilio/recording`,
        recordingStatusCallbackMethod: 'POST',
        statusCallback: `${this.config.webhookUrl}/twilio/status`,
        statusCallbackMethod: 'POST'
      });

      // Normalize direction to our schema ('inbound' | 'outbound')
      const normalizedDirection: 'inbound' | 'outbound' = call.direction === 'inbound' ? 'inbound' : 'outbound';
      return {
        callSid: call.sid,
        status: call.status,
        direction: normalizedDirection,
        to: call.to,
        from: call.from
      };
    } catch (error) {
      console.error('Error making call:', error);
      throw error;
    }
  }

  /**
   * Generate TwiML for incoming calls
   */
  generateIncomingCallTwiML(department: string = 'general'): string {
    const departmentMessages = {
      sales: 'مرحباً بك في قسم المبيعات. سيتم توصيلك بأحد ممثلينا.',
      hr: 'مرحباً بك في قسم الموارد البشرية. انتظر من فضلك.',
      support: 'مرحباً بك في قسم الدعم الفني. سيتم الرد عليك في أقرب وقت.',
      manufacturing: 'مرحباً بك في قسم الإنتاج. انتظر من فضلك.',
      marketing: 'مرحباً بك في قسم التسويق. سيتم توصيلك بأحد ممثلينا.'
    };

    const message = departmentMessages[department as keyof typeof departmentMessages] || 
                   'مرحباً بك في شركتنا. انتظر من فضلك.';

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="ar">${message}</Say>
  <Record 
    action="${this.config.webhookUrl}/twilio/recording"
    method="POST"
    maxLength="300"
    timeout="5"
    transcribe="false"
    recordingStatusCallback="${this.config.webhookUrl}/twilio/recording-status"
    recordingStatusCallbackMethod="POST"
  />
  <Say voice="alice" language="ar">شكراً لك على اتصالك. سيتم معاودة الاتصال بك قريباً.</Say>
</Response>`;
  }

  /**
   * Generate TwiML for outbound calls
   */
  generateOutboundCallTwiML(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Record 
    action="${this.config.webhookUrl}/twilio/recording"
    method="POST"
    maxLength="1800"
    timeout="5"
    transcribe="false"
    recordingStatusCallback="${this.config.webhookUrl}/twilio/recording-status"
    recordingStatusCallbackMethod="POST"
  />
</Response>`;
  }

  /**
   * Get call details from Twilio
   */
  async getCallDetails(callSid: string) {
    try {
      const call = await this.client.calls(callSid).fetch();
      return {
        sid: call.sid,
        accountSid: call.accountSid,
        from: call.from,
        to: call.to,
        status: call.status,
        direction: call.direction,
        duration: call.duration,
        price: call.price,
        priceUnit: call.priceUnit,
        dateCreated: call.dateCreated,
        dateUpdated: call.dateUpdated,
        endTime: call.endTime,
        startTime: call.startTime
      };
    } catch (error) {
      console.error('Error fetching call details:', error);
      throw error;
    }
  }

  /**
   * Get recording details
   */
  async getRecordingDetails(recordingSid: string) {
    try {
      const recording = await this.client.recordings(recordingSid).fetch();
      return {
        sid: recording.sid,
        accountSid: recording.accountSid,
        callSid: recording.callSid,
        status: recording.status,
        duration: recording.duration,
        channels: recording.channels,
        source: recording.source,
        price: recording.price,
        priceUnit: recording.priceUnit,
        uri: recording.uri,
        dateCreated: recording.dateCreated,
        dateUpdated: recording.dateUpdated
      };
    } catch (error) {
      console.error('Error fetching recording details:', error);
      throw error;
    }
  }

  /**
   * Get recording URL for download
   */
  getRecordingUrl(recordingSid: string, format: 'mp3' | 'wav' = 'mp3'): string {
    return `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Recordings/${recordingSid}.${format}`;
  }

  /**
   * Process webhook data and convert to Call object
   */
  processWebhookToCall(webhook: TwilioCallWebhook, department: string): Partial<Call> {
    const callData: Partial<Call> = {
      id: webhook.CallSid,
      twilioSid: webhook.CallSid,
      accountSid: webhook.AccountSid,
      from: webhook.From,
      to: webhook.To,
  direction: (webhook.Direction === 'inbound' ? 'inbound' : 'outbound') as 'inbound' | 'outbound',
      twilioStatus: webhook.CallStatus,
      receiverDepartment: department,
      type: webhook.Direction === 'inbound' ? 'incoming' : 'outgoing',
      webhookProcessed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Map Twilio status to our status
    switch (webhook.CallStatus) {
      case 'completed':
        callData.status = 'completed';
        callData.endTime = new Date().toISOString();
        if (webhook.Duration) {
          callData.duration = parseInt(webhook.Duration);
        }
        break;
      case 'busy':
      case 'no-answer':
        callData.status = 'missed';
        callData.type = 'missed';
        break;
      case 'failed':
        callData.status = 'failed';
        break;
      case 'in-progress':
        callData.status = 'ongoing';
        callData.startTime = new Date().toISOString();
        break;
      default:
        callData.status = 'ongoing';
    }

    // Add recording data if available
    if (webhook.RecordingUrl && webhook.RecordingSid) {
      callData.recording = {
        url: webhook.RecordingUrl,
        sid: webhook.RecordingSid,
        duration: webhook.RecordingDuration ? parseInt(webhook.RecordingDuration) : 0,
        format: this.config.recordingFormat,
        size: 0 // Will be updated when we process the recording
      };
    }

    return callData;
  }

  /**
   * Download recording file
   */
  async downloadRecording(recordingSid: string): Promise<Buffer> {
    try {
      const recording = await this.client.recordings(recordingSid).fetch();
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Recordings/${recordingSid}.mp3`, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString('base64')
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to download recording: ${response.statusText}`);
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      console.error('Error downloading recording:', error);
      throw error;
    }
  }
}

export default TwilioService;
