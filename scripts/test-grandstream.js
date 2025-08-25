#!/usr/bin/env node

// Grandstream Connection Test Script
import fetch from 'node-fetch';
import { Buffer } from 'buffer';

const config = {
  host: process.env.GRANDSTREAM_HOST || '192.168.1.100',
  port: process.env.GRANDSTREAM_PORT || '8088',
  username: process.env.GRANDSTREAM_USERNAME || 'admin',
  password: process.env.GRANDSTREAM_PASSWORD || 'admin'
};

async function testConnection() {
  console.log('🔧 Grandstream UCM6304A Connection Test');
  console.log('======================================');
  
  try {
    const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');
    const url = `http://${config.host}:${config.port}/api/v1.0/status`;
    
    console.log(`📡 Testing connection to: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connection successful!');
      console.log('📊 System Status:', data);
      
      // Test extensions endpoint
      const extResponse = await fetch(`http://${config.host}:${config.port}/api/v1.0/extensions`, {
        headers: { 'Authorization': `Basic ${auth}` }
      });
      
      if (extResponse.ok) {
        const extensions = await extResponse.json();
        console.log(`📞 Found ${extensions.length || 0} extensions`);
      }
      
    } else {
      console.error('❌ Connection failed!');
      console.error(`Status: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if UCM is powered on and network cable connected');
    console.log('2. Verify IP address and port');
    console.log('3. Ensure API is enabled in UCM settings');
    console.log('4. Check username and password');
  }
}

testConnection();