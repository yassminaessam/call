# Grandstream UCM6304A CDR Integration Test Script (PowerShell)
# This script tests CDR data ingestion to your application

# Configuration - Update these values
$APP_SERVER = "http://localhost:3000"
$CDR_USERNAME = "cdr_user"
$CDR_PASSWORD = "secure_cdr_password"

# Create Basic Auth header
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${CDR_USERNAME}:${CDR_PASSWORD}"))
$headers = @{
    "Authorization" = "Basic $credentials"
    "Content-Type" = "application/json"
}

Write-Host "🔧 Testing Grandstream UCM6304A CDR Integration" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Test 1: Send sample CDR record via HTTPS
Write-Host "📤 Test 1: Sending sample CDR record..." -ForegroundColor Yellow

$testRecord = @{
    uniqueid = "test-call-001"
    calldate = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss")
    src = "1001"
    dst = "555-0123"
    duration = 120
    billsec = 115
    disposition = "ANSWERED"
    actionType = "OUTBOUND"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$APP_SERVER/api/cdr/ingest/https" -Method POST -Headers $headers -Body $testRecord
    Write-Host "✅ Test 1 Response: $($response1.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Test 1 Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Send multiple CDR records
Write-Host "`n📤 Test 2: Sending multiple CDR records..." -ForegroundColor Yellow

$multipleRecords = @(
    @{
        uniqueid = "test-call-002"
        calldate = (Get-Date).AddHours(-1).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss")
        src = "1002"
        dst = "555-0124"
        duration = 45
        billsec = 42
        disposition = "ANSWERED"
        actionType = "INBOUND"
    },
    @{
        uniqueid = "test-call-003"
        calldate = (Get-Date).AddMinutes(-30).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss")
        src = "1003"
        dst = "555-0125"
        duration = 0
        billsec = 0
        disposition = "NO ANSWER"
        actionType = "OUTBOUND"
    }
) | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$APP_SERVER/api/cdr/ingest/https" -Method POST -Headers $headers -Body $multipleRecords
    Write-Host "✅ Test 2 Response: Processed $($response2.processed) records" -ForegroundColor Green
} catch {
    Write-Host "❌ Test 2 Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Verify records were stored
Write-Host "`n📋 Test 3: Checking stored CDR records..." -ForegroundColor Yellow

try {
    $records = Invoke-RestMethod -Uri "$APP_SERVER/api/cdr/records?limit=5" -Method GET
    Write-Host "✅ Found $($records.data.Count) CDR records in database" -ForegroundColor Green
    $records.data | ForEach-Object {
        Write-Host "  📞 $($_.src) → $($_.dst) | $($_.disposition) | $(Get-Date $_.calldate -Format 'HH:mm:ss')" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Test 3 Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test manual sync from UCM
Write-Host "`n🔄 Test 4: Testing manual UCM sync..." -ForegroundColor Yellow

$syncRequest = @{ limit = 10 } | ConvertTo-Json
try {
    $syncResponse = Invoke-RestMethod -Uri "$APP_SERVER/api/grandstream/cdr/sync" -Method POST -Headers @{"Content-Type"="application/json"} -Body $syncRequest
    Write-Host "✅ Sync Response: $($syncResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Sync Test: $($_.Exception.Message) (Expected if UCM not configured)" -ForegroundColor Yellow
}

# Test 5: Check UCM connection health
Write-Host "`n🏥 Test 5: Checking UCM connection health..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "$APP_SERVER/api/grandstream/health" -Method GET
    if ($health.connected) {
        Write-Host "✅ UCM Connected: $($health.config.host):$($health.config.port) ($($health.responseTime))" -ForegroundColor Green
    } else {
        Write-Host "⚠️ UCM Not Connected: $($health.error)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get CDR diagnostics
Write-Host "`n📊 Test 6: Getting CDR diagnostics..." -ForegroundColor Yellow

try {
    $diagnostics = Invoke-RestMethod -Uri "$APP_SERVER/api/grandstream/cdr/status" -Method GET
    Write-Host "✅ CDR Diagnostics:" -ForegroundColor Green
    Write-Host "  Total Records: $($diagnostics.data.totalRecords)" -ForegroundColor Gray
    Write-Host "  Today's Records: $($diagnostics.data.todayRecords)" -ForegroundColor Gray
    Write-Host "  Ingestion Health: $($diagnostics.data.ingestionHealth)" -ForegroundColor Gray
    if ($diagnostics.data.lastRecord) {
        Write-Host "  Last Record: $($diagnostics.data.lastRecord.from) → $($diagnostics.data.lastRecord.to)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Diagnostics Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ CDR Integration testing completed!" -ForegroundColor Green
Write-Host "`n💡 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check your application CDR tab to see test records" -ForegroundColor White
Write-Host "2. Configure your UCM6304A to send real CDR data" -ForegroundColor White
Write-Host "3. Set proper environment variables in .env file" -ForegroundColor White
Write-Host "4. Enable periodic sync for live data updates" -ForegroundColor White

Write-Host "`n🔧 To configure UCM6304A CDR Real-Time Output:" -ForegroundColor Cyan
Write-Host "• Login to UCM Web Interface" -ForegroundColor White
Write-Host "• Go to Call Features → CDR → CDR Real-Time Output" -ForegroundColor White
Write-Host "• Set Server URL: $APP_SERVER/api/cdr/ingest/https" -ForegroundColor White
Write-Host "• Set Username: $CDR_USERNAME" -ForegroundColor White
Write-Host "• Set Password: $CDR_PASSWORD" -ForegroundColor White
Write-Host "• Enable and Apply settings" -ForegroundColor White