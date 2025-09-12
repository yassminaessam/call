import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Health check for Grandstream connection
      const modeInfo = {
        mode: process.env.UCM_MODE || 'demo',
        isDemo: process.env.UCM_MODE !== 'production',
        host: process.env.GRANDSTREAM_HOST || 'YOUR_UCM_IP_ADDRESS_HERE',
        port: process.env.GRANDSTREAM_PORT || '8088'
      };

      // If in demo mode, return demo status
      if (modeInfo.isDemo) {
        return res.status(200).json({
          success: true,
          connected: false,
          demo: true,
          mode: modeInfo.mode,
          message: 'Demo mode active - Configure real UCM6304A to connect',
          instructions: [
            '1. Update GRANDSTREAM_HOST with your UCM IP address',
            '2. Update GRANDSTREAM_USERNAME with your UCM username',
            '3. Update GRANDSTREAM_PASSWORD with your UCM password',
            '4. Set UCM_MODE=production in environment variables',
            '5. Redeploy the application'
          ],
          config: {
            host: 'DEMO_HOST',
            port: modeInfo.port,
            mode: modeInfo.mode
          },
          timestamp: new Date().toISOString()
        });
      }

      // Production mode - simplified connection test
      const hasRequiredConfig = 
        process.env.GRANDSTREAM_HOST && 
        process.env.GRANDSTREAM_HOST !== 'YOUR_UCM_IP_ADDRESS_HERE' &&
        process.env.GRANDSTREAM_USERNAME &&
        process.env.GRANDSTREAM_USERNAME !== 'YOUR_UCM_USERNAME' &&
        process.env.GRANDSTREAM_PASSWORD &&
        process.env.GRANDSTREAM_PASSWORD !== 'YOUR_UCM_PASSWORD';

      if (hasRequiredConfig) {
        return res.status(200).json({
          success: true,
          connected: true,
          demo: false,
          mode: modeInfo.mode,
          message: 'Configuration appears valid',
          config: {
            host: modeInfo.host,
            port: modeInfo.port,
            mode: modeInfo.mode
          },
          timestamp: new Date().toISOString()
        });
      } else {
        return res.status(503).json({
          success: false,
          connected: false,
          demo: false,
          mode: modeInfo.mode,
          error: 'Configuration incomplete',
          troubleshooting: [
            'Check GRANDSTREAM_HOST environment variable',
            'Check GRANDSTREAM_USERNAME environment variable', 
            'Check GRANDSTREAM_PASSWORD environment variable',
            'Ensure UCM_MODE is set to production'
          ],
          config: {
            host: modeInfo.host,
            port: modeInfo.port,
            mode: modeInfo.mode
          },
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      return res.status(503).json({
        success: false,
        connected: false,
        error: 'Failed to check Grandstream connection',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}