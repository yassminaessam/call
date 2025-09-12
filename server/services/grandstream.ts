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
    mode: 'demo' | 'production';
    connectionTimeout: number;
  };

  constructor() {
    super();
    this.prisma = new PrismaClient();
    this.ucmConfig = {
      host: process.env.GRANDSTREAM_HOST || 'YOUR_UCM_IP_ADDRESS_HERE',
      port: parseInt(process.env.GRANDSTREAM_PORT || '8088'),
      username: process.env.GRANDSTREAM_USERNAME || 'YOUR_UCM_USERNAME',
      password: process.env.GRANDSTREAM_PASSWORD || 'YOUR_UCM_PASSWORD',
      mode: (process.env.UCM_MODE as 'demo' | 'production') || 'demo',
      connectionTimeout: parseInt(process.env.UCM_CONNECTION_TIMEOUT || '10000'),
      extensions: new Map()
    };
    this.initializeExtensions();
    this.logModeInfo();
  }

  private logModeInfo() {
    const isDemo = this.isDemo();
    console.log(`[Grandstream] Mode: ${this.ucmConfig.mode.toUpperCase()}`);
    
    if (isDemo) {
      console.log(`[Grandstream] ⚠️  DEMO MODE: Using placeholder configuration`);
      console.log(`[Grandstream] To switch to production mode:`);
      console.log(`[Grandstream] 1. Update .env with your real UCM6304A settings`);
      console.log(`[Grandstream] 2. Set UCM_MODE=production`);
    } else {
      console.log(`[Grandstream] ✅ PRODUCTION MODE: Connecting to ${this.ucmConfig.host}:${this.ucmConfig.port}`);
    }
  }

  // Check if we're in demo mode
  isDemo(): boolean {
    return this.ucmConfig.mode === 'demo' || 
           this.ucmConfig.host === 'YOUR_UCM_IP_ADDRESS_HERE' ||
           this.ucmConfig.username === 'YOUR_UCM_USERNAME' ||
           this.ucmConfig.password === 'YOUR_UCM_PASSWORD';
  }

  // Get current mode info
  getModeInfo() {
    return {
      mode: this.ucmConfig.mode,
      isDemo: this.isDemo(),
      host: this.isDemo() ? 'DEMO_HOST' : this.ucmConfig.host,
      port: this.ucmConfig.port,
      configured: !this.isDemo()
    };
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

  // Test connection to UCM with proper API authentication
  async testConnection() {
    try {
      // Check if we're in demo mode
      if (this.isDemo()) {
        return {
          connected: false,
          demo: true,
          error: 'Demo mode active. Configure real UCM6304A settings in .env file to connect.',
          instructions: [
            'Update GRANDSTREAM_HOST with your UCM IP address',
            'Update GRANDSTREAM_USERNAME with your UCM admin username', 
            'Update GRANDSTREAM_PASSWORD with your UCM admin password',
            'Set UCM_MODE=production in .env file',
            'Restart the application'
          ]
        };
      }

      // Production mode - test real connection
      const testUrl = `http://${this.ucmConfig.host}:${this.ucmConfig.port}`;
      
      // Test basic connectivity first with timeout
      const connectivityTest = await fetch(testUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(this.ucmConfig.connectionTimeout)
      }).catch(() => null);
      
      if (!connectivityTest) {
        return {
          connected: false,
          demo: false,
          error: `Cannot reach UCM at ${this.ucmConfig.host}:${this.ucmConfig.port}. Check network connectivity and IP address.`,
          troubleshooting: [
            'Verify UCM6304A is powered on and network accessible',
            'Check if IP address in .env is correct',
            'Ensure port 8088 is not blocked by firewall',
            'Try pinging the UCM IP address first'
          ]
        };
      }
      
      // Now test API authentication with actual API call
      const response = await this.makeAPICall('status');
      return {
        connected: true,
        demo: false,
        info: {
          firmware: response.firmware_version || 'Unknown',
          model: response.model || 'UCM6304A',
          uptime: response.uptime || 'Unknown',
          apiVersion: response.api_version || 'Unknown',
          host: this.ucmConfig.host,
          port: this.ucmConfig.port
        }
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      // Provide more specific error messages
      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        return {
          connected: false,
          demo: false,
          error: 'Authentication failed. Username or password incorrect.',
          troubleshooting: [
            'Check GRANDSTREAM_USERNAME in .env file',
            'Check GRANDSTREAM_PASSWORD in .env file',
            'Verify credentials work in UCM web interface',
            'Ensure API access is enabled for this user'
          ]
        };
      } else if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
        return {
          connected: false,
          demo: false,
          error: 'API access forbidden. API may be disabled in UCM.',
          troubleshooting: [
            'Enable API access in UCM: System Settings > Remote Management',
            'Check if IP address is allowed for API access',
            'Verify user has admin privileges'
          ]
        };
      } else if (errorMsg.includes('timeout') || errorMsg.includes('ECONNRESET')) {
        return {
          connected: false,
          demo: false,
          error: 'Connection timeout. UCM may be unreachable or overloaded.',
          troubleshooting: [
            'Check network connectivity to UCM',
            'Verify UCM is not overloaded',
            'Try increasing UCM_CONNECTION_TIMEOUT in .env',
            'Check firewall settings'
          ]
        };
      } else {
        return {
          connected: false,
          demo: false,
          error: `Connection failed: ${errorMsg}`,
          troubleshooting: [
            'Check all UCM settings in .env file',
            'Verify UCM is accessible via web browser',
            'Check server logs for more details'
          ]
        };
      }
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
          status: 'PENDING',
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

  // Sync CDR data from UCM to local database
  async syncCDRFromUCM(limit: number = 100) {
    try {
      console.log(`[CDR Sync] Fetching up to ${limit} records from UCM`);
      const cdrData = await this.getCallHistory(limit);
      
      let synced = 0;
      let errors = 0;
      
      for (const record of cdrData) {
        try {
          // Convert UCM format to our CDR format
          const cdrRecord = {
            uniqueid: record.callId,
            calldate: record.startTime,
            src: record.from,
            dst: record.to,
            duration: record.duration || 0,
            billsec: record.duration || 0,
            disposition: record.status || 'UNKNOWN',
            actionType: record.direction || 'UNKNOWN'
          };
          
          // Upsert CDR record (create or update)
          await this.prisma.cDR.upsert({
            where: { uniqueid: cdrRecord.uniqueid },
            update: cdrRecord,
            create: cdrRecord
          });
          
          synced++;
        } catch (recordError) {
          console.error('[CDR Sync] Failed to sync record:', recordError);
          errors++;
        }
      }
      
      console.log(`[CDR Sync] Completed: ${synced} synced, ${errors} errors`);
      return { synced, errors };
    } catch (error) {
      console.error('[CDR Sync] Failed:', error);
      throw error;
    }
  }

  // Get CDR diagnostics and health info
  async getCDRDiagnostics() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [totalRecords, todayRecords, lastRecord] = await Promise.all([
        this.prisma.cDR.count(),
        this.prisma.cDR.count({
          where: {
            calldate: {
              gte: today
            }
          }
        }),
        this.prisma.cDR.findFirst({
          orderBy: { calldate: 'desc' },
          select: { calldate: true, src: true, dst: true, disposition: true }
        })
      ]);
      
      return {
        totalRecords,
        todayRecords,
        lastRecord: lastRecord ? {
          time: lastRecord.calldate,
          from: lastRecord.src,
          to: lastRecord.dst,
          status: lastRecord.disposition
        } : null,
        lastSyncTime: new Date().toISOString(),
        ingestionHealth: totalRecords > 0 ? 'healthy' : 'no-data'
      };
    } catch (error) {
      console.error('[CDR Diagnostics] Failed:', error);
      return {
        totalRecords: 0,
        todayRecords: 0,
        lastRecord: null,
        lastSyncTime: null,
        ingestionHealth: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Schedule periodic CDR sync with configurable interval
  startPeriodicSync(intervalMinutes: number = 5) {
    console.log(`[CDR Sync] Starting periodic sync every ${intervalMinutes} minutes`);
    
    // Do an initial sync immediately
    this.syncCDRFromUCM(50).catch(error => {
      console.error('[CDR Sync] Initial sync failed:', error);
    });
    
    const syncInterval = setInterval(async () => {
      try {
        console.log('[CDR Sync] Running scheduled sync...');
        const result = await this.syncCDRFromUCM(50); // Sync last 50 records
        console.log(`[CDR Sync] Scheduled sync completed: ${result.synced} records synced`);
      } catch (error) {
        console.error('[CDR Sync] Scheduled sync failed:', error);
      }
    }, intervalMinutes * 60 * 1000);
    
    return () => {
      clearInterval(syncInterval);
      console.log('[CDR Sync] Periodic sync stopped');
    };
  }

  // Start real-time CDR monitoring (if UCM supports webhooks)
  startRealTimeSync(webhookUrl?: string) {
    console.log('[CDR Sync] Starting real-time CDR monitoring...');
    
    if (webhookUrl) {
      console.log(`[CDR Sync] Webhook URL configured: ${webhookUrl}`);
      // In a real implementation, you would configure UCM to send CDR data to this webhook
      return {
        status: 'webhook-configured',
        url: webhookUrl
      };
    } else {
      // Fallback to frequent polling
      console.log('[CDR Sync] Using polling fallback (every 1 minute)');
      return this.startPeriodicSync(1); // More frequent sync for real-time feel
    }
  }
}

export default GrandstreamService;