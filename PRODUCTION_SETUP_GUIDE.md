# Production Setup Guide - Grandstream UCM6304A Integration

This guide will help you configure the application to connect to a real Grandstream UCM6304A device instead of demo mode.

## Overview

The application starts in **DEMO MODE** by default. To connect to a real UCM6304A:

1. ✅ Configure UCM6304A network settings
2. ✅ Set up API access on UCM  
3. ✅ Update application environment variables
4. ✅ Switch to production mode
5. ✅ Test the connection

---

## Step 1: Configure UCM6304A Network Settings

### Find UCM IP Address

1. **Access UCM Web Interface**
   - Connect to your UCM6304A via web browser
   - Default URL: `http://192.168.1.1` (may vary)
   - Login with admin credentials

2. **Get Network Configuration**
   - Navigate to: **Network Settings > Network Settings > LAN Settings**
   - Note the **IP Address** (e.g., `192.168.1.20`)
   - Note the **Subnet Mask** and **Gateway**

### Configure Static IP (Recommended)

```text
IP Address: 192.168.1.20  (choose available IP)
Subnet Mask: 255.255.255.0
Gateway: 192.168.1.1
DNS: 8.8.8.8, 8.8.4.4
```

---

## Step 2: Enable API Access on UCM

### Enable Remote Management

1. **Navigate to API Settings**
   - Go to: **System Settings > Remote Management**

2. **Enable API Access**
   - ✅ Check **Enable Action URL**
   - ✅ Check **Enable API**
   - **API Port**: `8088` (default)
   - **IP Authentication**: Add your server IP or use `0.0.0.0/0` for any IP

3. **Save Configuration**
   - Click **Save** and **Apply Changes**

### Verify Admin Account

1. **Check Administrator Account**
   - Go to: **System Settings > Administrator > Accounts**
   - Ensure you have admin username/password
   - Note credentials for configuration

---

## Step 3: Update Application Configuration

### Edit .env File

Open your `.env` file and update these values:

```env
# Grandstream UCM6304A PBX Configuration - PRODUCTION
GRANDSTREAM_HOST=192.168.1.20           # Your UCM IP address
GRANDSTREAM_PORT=8088                    # UCM API port
GRANDSTREAM_USERNAME=admin               # Your UCM admin username  
GRANDSTREAM_PASSWORD=your_admin_password # Your UCM admin password
GRANDSTREAM_API_VERSION=v1.0

# Production Mode
UCM_MODE=production                      # Switch to production mode
UCM_CONNECTION_TIMEOUT=10000             # Connection timeout (ms)

# CDR Sync Configuration
CDR_SYNC_INTERVAL=300000                 # Sync every 5 minutes
CDR_REALTIME_ENABLED=false               # Enable after webhook setup
CDR_MAX_RECORDS_PER_SYNC=1000           # Max records per sync
```

### Important Notes

- Replace `192.168.1.20` with your actual UCM IP
- Replace `your_admin_password` with your actual password
- Set `UCM_MODE=production` to enable real connection
- Keep `GRANDSTREAM_PORT=8088` unless you changed it

---

## Step 4: Test Configuration

### 1. Validate Configuration

```bash
# Check configuration endpoint
curl http://localhost:3000/api/grandstream/config/validate
```

Expected response for valid config:

```json
{
  "success": true,
  "validation": {
    "valid": true,
    "mode": "production",
    "isDemo": false,
    "issues": [],
    "recommendations": []
  }
}
```

### 2. Test Connection

```bash
# Test UCM connection
curl http://localhost:3000/api/grandstream/health
```

Expected response for successful connection:

```json
{
  "success": true,
  "connected": true,
  "demo": false,
  "mode": "production",
  "message": "Successfully connected to UCM6304A",
  "ucmInfo": {
    "firmware": "1.0.20.20",
    "model": "UCM6304A", 
    "uptime": "5 days",
    "apiVersion": "v1.0"
  }
}
```

### 3. Restart Application

```bash
npm run build  # Rebuild with new configuration
npm start      # Start production server
```

---

## Step 5: Verify Production Mode

### Check Application Logs

Look for these log messages on startup:

```text
[Grandstream] Mode: PRODUCTION
[Grandstream] ✅ PRODUCTION MODE: Connecting to 192.168.1.20:8088
```

### Test Frontend

1. **Open Application**: `http://localhost:3000`
2. **Navigate to UCM Settings**
3. **Click "اختبار الاتصال" (Test Connection)**
4. **Verify Status**: Should show "متصل" only if real connection works

---

## Troubleshooting

### Connection Issues

#### Error: "Cannot reach UCM"

- ✅ Verify UCM is powered on and connected to network
- ✅ Check IP address is correct in .env
- ✅ Try pinging UCM: `ping 192.168.1.20`
- ✅ Check firewall settings

#### Error: "Authentication failed"

- ✅ Verify username/password in .env
- ✅ Test credentials in UCM web interface
- ✅ Check if admin account has API access
- ✅ Ensure API is enabled in Remote Management

#### Error: "API access forbidden"

- ✅ Enable API in System Settings > Remote Management
- ✅ Check IP authentication settings
- ✅ Verify admin user has sufficient privileges

#### Error: "Connection timeout"

- ✅ Increase UCM_CONNECTION_TIMEOUT in .env
- ✅ Check network latency to UCM
- ✅ Verify UCM is not overloaded

### Configuration Validation

#### Still showing Demo Mode?

- ✅ Check `UCM_MODE=production` in .env
- ✅ Restart application after changes
- ✅ Verify no placeholder values remain in .env

#### Environment Variables

Use this endpoint to validate your configuration:

```bash
curl http://localhost:3000/api/grandstream/config/validate
```

---

## API Endpoints for Production

### Health Check Endpoint

```bash
GET /api/grandstream/health
```

Returns connection status and UCM information.

### Configuration Validation Endpoint

```bash
GET /api/grandstream/config/validate
```

Validates all configuration settings.

### CDR Sync (Manual)

```bash
POST /api/grandstream/cdr/sync
```

Manually sync recent CDR records.

### CDR Full Sync

```bash
POST /api/grandstream/cdr/sync/full
```

Sync complete CDR history.

---

## Production Checklist

- [ ] UCM6304A has static IP address
- [ ] API access enabled in UCM Remote Management
- [ ] Admin credentials verified
- [ ] .env file updated with real values
- [ ] UCM_MODE set to production
- [ ] Application restarted
- [ ] Connection test successful
- [ ] "متصل" status shows only with real connection
- [ ] CDR sync working (manual and automatic)

---

## Support

If you encounter issues:

1. **Check Configuration**: Use `/api/grandstream/config/validate`
2. **Test Connection**: Use `/api/grandstream/health`  
3. **Review Logs**: Check application console for detailed error messages
4. **Verify Network**: Ensure UCM is accessible from application server

The application will provide detailed troubleshooting information for connection failures in production mode.
