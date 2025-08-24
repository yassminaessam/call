import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

// Create Express app inline for serverless
function createServerlessApp() {
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

  // Call Center API
  app.post("/api/calls", async (req, res) => {
    try {
      const { phoneNumber, type, department, duration, recording, transcript } = req.body;
      
      const call = await prisma.call.create({
        data: {
          phoneNumber,
          type: type || 'INBOUND',
          department: department || 'SUPPORT',
          duration: duration || null,
          recording: recording || null,
          transcript: transcript || null,
          status: 'PENDING'
        }
      });
      
      res.json({ success: true, call });
    } catch (error) {
      console.error('Error creating call:', error);
      res.status(500).json({ error: 'Failed to create call' });
    }
  });

  app.put("/api/calls/:callId", async (req, res) => {
    try {
      const { callId } = req.params;
      const updates = req.body;
      
      const call = await prisma.call.update({
        where: { id: callId },
        data: updates
      });
      
      res.json({ success: true, call });
    } catch (error) {
      console.error('Error updating call:', error);
      res.status(500).json({ error: 'Failed to update call' });
    }
  });

  app.get("/api/calls/logs", async (req, res) => {
    try {
      const calls = await prisma.call.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      });
      
      res.json({ logs: calls });
    } catch (error) {
      console.error('Error fetching call logs:', error);
      res.status(500).json({ error: 'Failed to fetch call logs' });
    }
  });

  // Sales CRM API
  app.post("/api/leads", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, company, source } = req.body;
      
      const lead = await prisma.lead.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          company,
          source: source || 'OTHER',
          status: 'NEW'
        }
      });
      
      res.json({ success: true, lead });
    } catch (error) {
      console.error('Error creating lead:', error);
      res.status(500).json({ error: 'Failed to create lead' });
    }
  });

  // Client Management API
  app.post("/api/clients", async (req, res) => {
    try {
      const { name, email, phone, company, industry } = req.body;
      
      const client = await prisma.client.create({
        data: {
          name,
          email,
          phone,
          company,
          industry,
          status: 'ACTIVE'
        }
      });
      
      res.json({ success: true, client });
    } catch (error) {
      console.error('Error creating client:', error);
      res.status(500).json({ error: 'Failed to create client' });
    }
  });

  // HR API
  app.post("/api/employees", async (req, res) => {
    try {
      const { employeeId, firstName, lastName, email, position, department, salary, hireDate } = req.body;
      
      const employee = await prisma.employee.create({
        data: {
          employeeId,
          firstName,
          lastName,
          email,
          position,
          department,
          salary: salary ? parseFloat(salary) : null,
          hireDate: new Date(hireDate),
          status: 'ACTIVE'
        }
      });
      
      res.json({ success: true, employee });
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ error: 'Failed to create employee' });
    }
  });

  // Marketing API
  app.post("/api/campaigns", async (req, res) => {
    try {
      const { name, description, type, budget, startDate, endDate } = req.body;
      
      const campaign = await prisma.campaign.create({
        data: {
          name,
          description,
          type: type || 'OTHER',
          budget: budget ? parseFloat(budget) : null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          status: 'DRAFT'
        }
      });
      
      res.json({ success: true, campaign });
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  });

  // Manufacturing API
  app.post("/api/inventory", async (req, res) => {
    try {
      const { name, sku, quantity, minQuantity, price, cost, supplier } = req.body;
      
      const item = await prisma.inventoryItem.create({
        data: {
          name,
          sku,
          quantity: parseInt(quantity) || 0,
          minQuantity: parseInt(minQuantity) || 0,
          price: price ? parseFloat(price) : null,
          cost: cost ? parseFloat(cost) : null,
          supplier,
          status: 'IN_STOCK'
        }
      });
      
      res.json({ success: true, item });
    } catch (error) {
      console.error('Error creating inventory item:', error);
      res.status(500).json({ error: 'Failed to create inventory item' });
    }
  });

  // Support API
  app.post("/api/tickets", async (req, res) => {
    try {
      const { title, description, category, priority } = req.body;
      
      const ticket = await prisma.ticket.create({
        data: {
          title,
          description,
          category: category || 'GENERAL',
          priority: priority || 'MEDIUM',
          status: 'OPEN'
        }
      });
      
      res.json({ success: true, ticket });
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  });

  // AI Answering API
  app.put("/api/answering/:department", async (req, res) => {
    try {
      const { department } = req.params;
      const { prompt, response, model, tokens, cost } = req.body;
      
      const aiResponse = await prisma.aIResponse.create({
        data: {
          department: department.toUpperCase(),
          prompt,
          response,
          model: model || 'gpt-4',
          tokens: tokens ? parseInt(tokens) : null,
          cost: cost ? parseFloat(cost) : null
        }
      });
      
      res.json({ success: true, response: aiResponse });
    } catch (error) {
      console.error('Error saving AI response:', error);
      res.status(500).json({ error: 'Failed to save AI response' });
    }
  });

  // Web Vitals metrics intake
  app.post('/api/metrics/web-vitals', (req, res) => {
    try {
      const metric = req.body;
      if (metric && metric.name && typeof metric.value === 'number') {
        console.log('[web-vitals]', metric.name, metric.value.toFixed ? metric.value.toFixed(2) : metric.value);
      }
    } catch (error) {
      console.error('Web vitals error:', error);
    }
    res.status(204).end();
  });

  // Health check
  app.get('/api/health', async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: errorMessage });
    }
  });

  return app;
}

const app = createServerlessApp();

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Let Express handle the request
  return app(req, res);
}
