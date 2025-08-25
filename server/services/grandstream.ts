import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';

// Grandstream UCM6304A Integration Service
export class GrandstreamService extends EventEmitter {
  private prisma: PrismaClient;
  private ucmConfig: {
    host: string;
    port: number;
    username: string;
    password: string;
    extensions: Map<string, string>; // extension -> user mapping
  };

  constructor() {
    super();
    this.prisma = new PrismaClient();
    this.ucmConfig = {
      host: process.env.GRANDSTREAM_HOST || '192.168.1.100',
      port: parseInt(process.env.GRANDSTREAM_PORT || '8088'),
      username: process.env.GRANDSTREAM_USERNAME || 'admin',
      password: process.env.GRANDSTREAM_PASSWORD || '',
      extensions: new Map()
    };
    this.initializeExtensions();
  }

  private async initializeExtensions() {
    try {
      // Load user-extension mappings from database
      const users = await this.prisma.user.findMany({
        select: { id: true, email: true }
      });
      
      // Map users to extensions (you can customize this logic)
      users.forEach((user, index) => {
        const extension = `100${index + 1}`; // Extensions start from 1001
        this.ucmConfig.extensions.set(extension, user.id);
      });
      
      console.log(`[Grandstream] Initialized ${this.ucmConfig.extensions.size} extensions`);
    } catch (error) {
      console.error('[Grandstream] Failed to initialize extensions:', error);
    }
  }

  // API call to Grandstream UCM6304A
  private async makeAPICall(endpoint: string, method: string = 'GET', data?: any) {
    try {
      const url = `http://${this.ucmConfig.host}:${this.ucmConfig.port}/api/v1.0/${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.ucmConfig.username}:${this.ucmConfig.password}`).toString('base64')}`
        }
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Grandstream API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[Grandstream] API call failed:', error);
      throw error;
    }
  }

  // Get extension status
  async getExtensionStatus(extension: string) {
    try {
      const response = await this.makeAPICall(`extension/${extension}/status`);
      return {
        extension,
        status: response.status || 'unknown',
        registered: response.registered || false,
        inCall: response.in_call || false,
        lastActivity: response.last_activity || null
      };
    } catch (error) {
      console.error(`[Grandstream] Failed to get extension ${extension} status:`, error);
      return { extension, status: 'error', registered: false, inCall: false };
    }
  }

  // Get all extensions status
  async getAllExtensionsStatus() {
    const statusPromises = Array.from(this.ucmConfig.extensions.keys()).map(ext => 
      this.getExtensionStatus(ext)
    );
    return await Promise.all(statusPromises);
  }

  // Make outbound call
  async makeCall(fromExtension: string, toNumber: string, userId?: string) {
    try {
      console.log(`[Grandstream] Making call from ${fromExtension} to ${toNumber}`);
      
      const callData = {
        from: fromExtension,
        to: toNumber,
        timeout: 30
      };

      const response = await this.makeAPICall('call/originate', 'POST', callData);
      
      // Log call initiation in database
      const callRecord = await this.prisma.call.create({
        data: {
          phoneNumber: toNumber,
          status: 'INITIATED',
          type: 'OUTBOUND',
          department: 'SALES',
          userId: userId || this.ucmConfig.extensions.get(fromExtension),
          createdAt: new Date()
        }
      });

      this.emit('callInitiated', {
        callId: response.call_id || callRecord.id,
        from: fromExtension,
        to: toNumber,
        timestamp: new Date()
      });

      return {
        success: true,
        callId: response.call_id || callRecord.id,
        message: 'Call initiated successfully'
      };
    } catch (error) {
      console.error('[Grandstream] Failed to make call:', error);
      throw error;
    }
  }

  // End call
  async endCall(callId: string) {
    try {
      const response = await this.makeAPICall(`call/${callId}/hangup`, 'POST');
      
      // Update call record in database
      await this.prisma.call.updateMany({
        where: { id: callId },
        data: { 
          status: 'COMPLETED',
          updatedAt: new Date()
        }
      });

      this.emit('callEnded', { callId, timestamp: new Date() });
      
      return { success: true, message: 'Call ended successfully' };
    } catch (error) {
      console.error('[Grandstream] Failed to end call:', error);
      throw error;
    }
  }

  // Get call details
  async getCallDetails(callId: string) {
    try {
      const response = await this.makeAPICall(`call/${callId}`);
      return {
        callId,
        from: response.caller_id,
        to: response.called_number,
        status: response.status,
        duration: response.duration,
        startTime: response.start_time,
        endTime: response.end_time
      };
    } catch (error) {
      console.error(`[Grandstream] Failed to get call details for ${callId}:`, error);
      return null;
    }
  }

  // Get call recordings
  async getCallRecording(callId: string) {
    try {
      const response = await this.makeAPICall(`recording/${callId}`);
      return {
        callId,
        recordingUrl: response.recording_url,
        duration: response.duration,
        size: response.file_size
      };
    } catch (error) {
      console.error(`[Grandstream] Failed to get recording for ${callId}:`, error);
      return null;
    }
  }

  // Transfer call
  async transferCall(callId: string, targetExtension: string) {
    try {
      const transferData = {
        call_id: callId,
        target: targetExtension,
        type: 'attended' // or 'blind'
      };

      const response = await this.makeAPICall('call/transfer', 'POST', transferData);
      
      this.emit('callTransferred', {
        callId,
        targetExtension,
        timestamp: new Date()
      });

      return { success: true, message: 'Call transferred successfully' };
    } catch (error) {
      console.error('[Grandstream] Failed to transfer call:', error);
      throw error;
    }
  }

  // Get call history
  async getCallHistory(limit: number = 50) {
    try {
      const response = await this.makeAPICall(`cdr?limit=${limit}`);
      
      const calls = response.records?.map((record: any) => ({
        callId: record.uniqueid,
        from: record.src,
        to: record.dst,
        duration: record.billsec,
        status: record.disposition,
        startTime: new Date(record.calldate),
        direction: record.direction || 'inbound'
      })) || [];

      return calls;
    } catch (error) {
      console.error('[Grandstream] Failed to get call history:', error);
      return [];
    }
  }

  // Real-time call monitoring via WebSocket or polling
  async startCallMonitoring() {
    console.log('[Grandstream] Starting call monitoring...');
    
    // Poll for active calls every 5 seconds
    const pollInterval = setInterval(async () => {
      try {
        const activeCalls = await this.makeAPICall('calls/active');
        
        if (activeCalls?.calls?.length > 0) {
          this.emit('activeCallsUpdate', activeCalls.calls);
        }
      } catch (error) {
        console.error('[Grandstream] Call monitoring error:', error);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }

  // Queue management
  async getQueueStatus(queueNumber: string) {
    try {
      const response = await this.makeAPICall(`queue/${queueNumber}/status`);
      return {
        queueNumber,
        waitingCalls: response.waiting_calls || 0,
        availableAgents: response.available_agents || 0,
        longestWait: response.longest_wait || 0
      };
    } catch (error) {
      console.error(`[Grandstream] Failed to get queue ${queueNumber} status:`, error);
      return { queueNumber, waitingCalls: 0, availableAgents: 0, longestWait: 0 };
    }
  }

  // Send DTMF tones
  async sendDTMF(callId: string, dtmfString: string) {
    try {
      const dtmfData = {
        call_id: callId,
        dtmf: dtmfString
      };

      await this.makeAPICall('call/dtmf', 'POST', dtmfData);
      return { success: true, message: 'DTMF sent successfully' };
    } catch (error) {
      console.error('[Grandstream] Failed to send DTMF:', error);
      throw error;
    }
  }

  // Conference management
  async createConference(extensions: string[]) {
    try {
      const conferenceData = {
        participants: extensions,
        moderator: extensions[0]
      };

      const response = await this.makeAPICall('conference/create', 'POST', conferenceData);
      
      return {
        success: true,
        conferenceId: response.conference_id,
        participants: extensions
      };
    } catch (error) {
      console.error('[Grandstream] Failed to create conference:', error);
      throw error;
    }
  }

  // Sync call data with CRM
  async syncCallToCRM(callData: any) {
    try {
      const existingCall = await this.prisma.call.findFirst({
        where: { 
          phoneNumber: callData.to,
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Within last 5 minutes
          }
        }
      });

      if (existingCall) {
        // Update existing call
        await this.prisma.call.update({
          where: { id: existingCall.id },
          data: {
            duration: callData.duration,
            status: callData.status,
            recording: callData.recordingUrl,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new call record
        await this.prisma.call.create({
          data: {
            phoneNumber: callData.to,
            duration: callData.duration,
            status: callData.status,
            type: callData.direction === 'inbound' ? 'INBOUND' : 'OUTBOUND',
            department: 'SALES',
            recording: callData.recordingUrl,
            userId: this.ucmConfig.extensions.get(callData.from),
            createdAt: new Date(callData.startTime)
          }
        });
      }

      console.log(`[Grandstream] Call data synced to CRM: ${callData.callId}`);
    } catch (error) {
      console.error('[Grandstream] Failed to sync call to CRM:', error);
    }
  }

  // Cleanup and disconnect
  async disconnect() {
    try {
      await this.prisma.$disconnect();
      console.log('[Grandstream] Service disconnected');
    } catch (error) {
      console.error('[Grandstream] Error during disconnect:', error);
    }
  }
}

export default GrandstreamService;