#!/bin/bash

# Grandstream UCM6304A CDR Integration Test Script
# This script tests CDR data ingestion to your application

# Configuration - Update these values
APP_SERVER="http://localhost:3000"
CDR_USERNAME="cdr_user"
CDR_PASSWORD="secure_cdr_password"

echo "🔧 Testing Grandstream UCM6304A CDR Integration"
echo "================================================"

# Test 1: Send sample CDR record via HTTPS
echo "📤 Test 1: Sending sample CDR record..."

curl -X POST "${APP_SERVER}/api/cdr/ingest/https" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n "${CDR_USERNAME}:${CDR_PASSWORD}" | base64)" \
  -d '{
    "uniqueid": "test-call-001",
    "calldate": "'$(date -u +"%Y-%m-%d %H:%M:%S")'",
    "src": "1001",
    "dst": "555-0123",
    "duration": 120,
    "billsec": 115,
    "disposition": "ANSWERED",
    "actionType": "OUTBOUND"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""

# Test 2: Send multiple CDR records
echo "📤 Test 2: Sending multiple CDR records..."

curl -X POST "${APP_SERVER}/api/cdr/ingest/https" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n "${CDR_USERNAME}:${CDR_PASSWORD}" | base64)" \
  -d '[
    {
      "uniqueid": "test-call-002",
      "calldate": "'$(date -u -d "1 hour ago" +"%Y-%m-%d %H:%M:%S")'",
      "src": "1002",
      "dst": "555-0124",
      "duration": 45,
      "billsec": 42,
      "disposition": "ANSWERED",
      "actionType": "INBOUND"
    },
    {
      "uniqueid": "test-call-003",
      "calldate": "'$(date -u -d "30 minutes ago" +"%Y-%m-%d %H:%M:%S")'",
      "src": "1003",
      "dst": "555-0125",
      "duration": 0,
      "billsec": 0,
      "disposition": "NO ANSWER",
      "actionType": "OUTBOUND"
    }
  ]' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""

# Test 3: Verify records were stored
echo "📋 Test 3: Checking stored CDR records..."

curl -X GET "${APP_SERVER}/api/cdr/records?limit=5" \
  -H "Content-Type: application/json" \
  -s | jq '.data[] | {id: .uniqueid, from: .src, to: .dst, status: .disposition, time: .calldate}' 2>/dev/null || echo "Records retrieved (install 'jq' for formatted output)"

echo ""

# Test 4: Test manual sync from UCM
echo "🔄 Test 4: Testing manual UCM sync..."

curl -X POST "${APP_SERVER}/api/grandstream/cdr/sync" \
  -H "Content-Type: application/json" \
  -d '{"limit": 10}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""

# Test 5: Check UCM connection health
echo "🏥 Test 5: Checking UCM connection health..."

curl -X GET "${APP_SERVER}/api/grandstream/health" \
  -H "Content-Type: application/json" \
  -s | jq '.connected, .config.host, .responseTime' 2>/dev/null || echo "Health check completed"

echo ""

# Test 6: Get CDR diagnostics
echo "📊 Test 6: Getting CDR diagnostics..."

curl -X GET "${APP_SERVER}/api/grandstream/cdr/status" \
  -H "Content-Type: application/json" \
  -s | jq '.data | {totalRecords, todayRecords, lastRecord, ingestionHealth}' 2>/dev/null || echo "Diagnostics retrieved"

echo ""
echo "✅ CDR Integration testing completed!"
echo ""
echo "💡 Next Steps:"
echo "1. Check your application CDR tab to see test records"
echo "2. Configure your UCM6304A to send real CDR data"
echo "3. Set proper environment variables in .env file"
echo "4. Enable periodic sync for live data updates"