import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  createCall,
  updateCall,
  getCallLogs,
  updateAIAnswering,
  triggerAIResponse,
  createLead,
  createClient,
  createEmployee,
  createCampaign,
  createInventoryItem,
  createTicket,
  handleCallEndedWebhook,
  handleNewLeadWebhook,
  handleStockLowWebhook
} from "./routes/crm";
import webhookRoutes from "./routes/webhooks";
import grandstreamRoutes from "./routes/grandstream";
import callCenterRoutes from "./routes/callCenter";
import cdrRoutes from "./routes/cdr";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Call Center API
  app.post("/api/calls", createCall);
  app.put("/api/calls/:callId", updateCall);
  app.get("/api/calls/logs", getCallLogs);

  // AI Answering API
  app.put("/api/answering/:department", updateAIAnswering);
  app.post("/api/answering/trigger", triggerAIResponse);

  // Sales CRM API
  app.post("/api/leads", createLead);
  
  // Client Management API
  app.post("/api/clients", createClient);

  // HR API
  app.post("/api/employees", createEmployee);

  // Marketing API
  app.post("/api/campaigns", createCampaign);

  // Manufacturing API
  app.post("/api/inventory", createInventoryItem);

  // Support API
  app.post("/api/tickets", createTicket);

  // Webhook endpoints
  app.post("/api/webhooks/call-ended", handleCallEndedWebhook);
  app.post("/api/webhooks/new-lead", handleNewLeadWebhook);
  app.post("/api/webhooks/stock-low", handleStockLowWebhook);

  // Advanced webhook system for Twilio, Speech-to-Text, and AI
  app.use("/api/webhooks", webhookRoutes);

  // Grandstream UCM6304A PBX Integration
  app.use("/api/grandstream", grandstreamRoutes);

  // Advanced Call Center with AI Integration
  app.use("/api/call-center", callCenterRoutes);

  // CDR Connector for PBX Integration
  app.use("/api/cdr", cdrRoutes);

  // Web Vitals metrics intake (fire-and-forget)
  app.post('/api/metrics/web-vitals', (req, res) => {
    try {
      const metric = req.body; // {name,value,id,ts}
      if (metric && metric.name && typeof metric.value === 'number') {
        // For now just log; could be queued to a DB or analytics pipeline.
        // eslint-disable-next-line no-console
        console.log('[web-vitals]', metric.name, metric.value.toFixed ? metric.value.toFixed(2) : metric.value);
      }
    } catch {}
    res.status(204).end();
  });

  // Initialize Grandstream service with periodic CDR sync
  initializeGrandstreamService(app);

  return app;
}

// Initialize Grandstream service and start periodic sync
async function initializeGrandstreamService(app: express.Application) {
  try {
    // Check if required environment variables are set
    const requiredVars = ['GRANDSTREAM_HOST', 'GRANDSTREAM_USERNAME', 'GRANDSTREAM_PASSWORD'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      console.warn(`[Grandstream] Skipping initialization - missing environment variables: ${missing.join(', ')}`);
      console.warn('[Grandstream] Set these variables in .env file to enable UCM integration');
      return;
    }

    console.log('[Grandstream] Initializing UCM6304A integration...');
    
    // Dynamic import to avoid issues during build
    const { GrandstreamService } = await import('./services/grandstream.js');
    const grandstreamService = new GrandstreamService();
    
    // Test initial connection
    const connectionTest = await grandstreamService.testConnection();
    if (connectionTest.connected) {
      console.log('[Grandstream] ✅ Connected to UCM6304A successfully');
      console.log(`[Grandstream] UCM Info:`, connectionTest.info);
      
      // Start automatic CDR sync
      const syncIntervalMinutes = parseInt(process.env.CDR_SYNC_INTERVAL || '5');
      const stopSync = grandstreamService.startPeriodicSync(syncIntervalMinutes);
      
      // Store service instance and cleanup function for API access
      app.locals.grandstreamService = grandstreamService;
      app.locals.stopGrandstreamSync = stopSync;
      
      console.log(`[Grandstream] 🔄 Started automatic CDR sync (every ${syncIntervalMinutes} minutes)`);
      console.log('[Grandstream] 📊 CDR data will be automatically synced to database');
      
      // Log initial CDR stats
      const diagnostics = await grandstreamService.getCDRDiagnostics();
      console.log(`[Grandstream] Current CDR stats: ${diagnostics.totalRecords} total records, ${diagnostics.todayRecords} today`);
    } else {
      console.warn('[Grandstream] ⚠️ Initial connection test failed:', connectionTest.error);
      console.warn('[Grandstream] Service will still be available but may not function properly');
    }
  } catch (error) {
    console.error('[Grandstream] Failed to initialize service:', error);
    console.warn('[Grandstream] UCM integration will be limited - check your configuration');
  }
}
