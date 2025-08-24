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

  return app;
}
