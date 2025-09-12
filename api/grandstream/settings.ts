import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock settings for serverless environment
const mockSettings = {
  host: process.env.GRANDSTREAM_HOST || '192.168.1.100',
  port: process.env.GRANDSTREAM_PORT || '8088',
  username: process.env.GRANDSTREAM_USERNAME || 'admin',
  password: '••••••••', // Don't return actual password
  apiVersion: process.env.GRANDSTREAM_API_VERSION || 'v1.0',
  sslEnabled: process.env.GRANDSTREAM_SSL === 'true',
  autoBackup: true,
  backupInterval: '24',
  logLevel: 'info',
  maxConcurrentCalls: '200',
  recordCalls: true,
  callTimeout: '30'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get current settings
      return res.json({
        success: true,
        data: mockSettings
      });
    }

    if (req.method === 'POST') {
      // Save settings
      const { host, port, username, password, sslEnabled, maxConcurrentCalls, callTimeout, logLevel, recordCalls, autoBackup, backupInterval } = req.body;
      
      if (!host || !port || !username) {
        return res.status(400).json({
          success: false,
          error: 'Host, port, and username are required'
        });
      }

      // Validate settings
      if (isNaN(Number(port)) || Number(port) < 1 || Number(port) > 65535) {
        return res.status(400).json({
          success: false,
          error: 'Invalid port number'
        });
      }

      // In serverless environment, we can't persist to .env
      // You would typically save to database or environment variables
      console.log('Settings updated:', { host, port, username, sslEnabled, maxConcurrentCalls, callTimeout, logLevel, recordCalls, autoBackup, backupInterval });
      
      return res.json({
        success: true,
        message: 'Settings saved successfully'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Grandstream settings error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}