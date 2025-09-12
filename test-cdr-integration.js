// CDR Integration Test Script
// This script tests the CDR connection system functionality

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

class CDRIntegrationTester {
  constructor() {
    this.results = [];
  }

  async log(test, status, message, data = null) {
    const result = {
      test,
      status,
      message,
      timestamp: new Date().toISOString(),
      data
    };
    this.results.push(result);
    console.log(`[${status.toUpperCase()}] ${test}: ${message}`);
    if (data) console.log('  Data:', JSON.stringify(data, null, 2));
  }

  async testConfigManagement() {
    try {
      // Test getting default config
      const getResponse = await axios.get(`${BASE_URL}/cdr/config`);
      await this.log('Config Get', 'PASS', 'Retrieved CDR configuration', getResponse.data);

      // Test updating config
      const updateData = {
        mode: 'HTTPS',
        httpsConfig: {
          port: 8080,
          endpoint: '/api/cdr/https',
          enableAuth: true,
          authToken: 'test-token-123'
        },
        tcpConfig: {
          port: 9999,
          enableAuth: false
        },
        allowedIPs: ['127.0.0.1', '192.168.1.0/24'],
        isActive: true
      };

      const putResponse = await axios.put(`${BASE_URL}/cdr/config`, updateData);
      await this.log('Config Update', 'PASS', 'Updated CDR configuration', putResponse.data);

    } catch (error) {
      await this.log('Config Management', 'FAIL', error.message, error.response?.data);
    }
  }

  async testHealthCheck() {
    try {
      const response = await axios.get(`${BASE_URL}/cdr/health`);
      await this.log('Health Check', 'PASS', 'CDR system is healthy', response.data);
    } catch (error) {
      await this.log('Health Check', 'FAIL', error.message, error.response?.data);
    }
  }

  async testHTTPSIngestion() {
    try {
      // First set configuration to HTTPS mode
      await axios.put(`${BASE_URL}/cdr/config`, {
        mode: 'HTTPS',
        httpsConfig: {
          port: 8080,
          endpoint: '/api/cdr/https',
          enableAuth: false
        },
        isActive: true
      });

      // Test CDR record ingestion
      const cdrRecord = {
        callId: 'test-call-001',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60000).toISOString(),
        duration: 60,
        callerNumber: '+1234567890',
        calleeNumber: '+0987654321',
        disposition: 'ANSWERED',
        recordingUrl: 'https://example.com/recording.wav'
      };

      const response = await axios.post(`${BASE_URL}/cdr/https`, cdrRecord);
      await this.log('HTTPS Ingestion', 'PASS', 'CDR record ingested via HTTPS', response.data);

    } catch (error) {
      await this.log('HTTPS Ingestion', 'FAIL', error.message, error.response?.data);
    }
  }

  async testRecordsRetrieval() {
    try {
      const response = await axios.get(`${BASE_URL}/cdr/records?page=1&limit=10`);
      await this.log('Records Retrieval', 'PASS', 'Retrieved CDR records', {
        count: response.data.records?.length || 0,
        pagination: response.data.pagination
      });
    } catch (error) {
      await this.log('Records Retrieval', 'FAIL', error.message, error.response?.data);
    }
  }

  async testConnectionTest() {
    try {
      const response = await axios.post(`${BASE_URL}/cdr/test`);
      await this.log('Connection Test', 'PASS', 'CDR connection test completed', response.data);
    } catch (error) {
      await this.log('Connection Test', 'FAIL', error.message, error.response?.data);
    }
  }

  async testSecurityFeatures() {
    try {
      // Test rate limiting by making multiple rapid requests
      const promises = Array(10).fill().map(() => 
        axios.get(`${BASE_URL}/cdr/health`).catch(err => err.response)
      );
      
      const responses = await Promise.all(promises);
      const rateLimited = responses.some(r => r?.status === 429);
      
      if (rateLimited) {
        await this.log('Rate Limiting', 'PASS', 'Rate limiting is working');
      } else {
        await this.log('Rate Limiting', 'WARN', 'Rate limiting may not be active');
      }

      // Test input validation
      try {
        await axios.post(`${BASE_URL}/cdr/https`, { invalid: 'data' });
        await this.log('Input Validation', 'FAIL', 'Invalid data was accepted');
      } catch (error) {
        if (error.response?.status === 400) {
          await this.log('Input Validation', 'PASS', 'Invalid data was rejected');
        } else {
          await this.log('Input Validation', 'WARN', 'Unexpected validation response');
        }
      }

    } catch (error) {
      await this.log('Security Features', 'FAIL', error.message);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting CDR Integration Tests...\n');

    await this.testHealthCheck();
    await this.testConfigManagement();
    await this.testConnectionTest();
    await this.testHTTPSIngestion();
    await this.testRecordsRetrieval();
    await this.testSecurityFeatures();

    console.log('\n📊 Test Results Summary:');
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`📝 Total: ${this.results.length}`);

    return {
      passed,
      failed,
      warnings,
      total: this.results.length,
      results: this.results
    };
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new CDRIntegrationTester();
  tester.runAllTests().then(summary => {
    process.exit(summary.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = CDRIntegrationTester;