# Complete Grandstream UCM6304A Integration Setup Guide

This guide provides everything needed to connect your application to a real Grandstream UCM6304A for live call data.

## 🎯 Overview

Your application now supports:
- ✅ Real-time CDR data ingestion from UCM6304A
- ✅ Manual CDR sync with "Fetch from UCM" button
- ✅ Automatic periodic sync every 5 minutes
- ✅ Live PBX extension monitoring
- ✅ Call control (make, end, transfer calls)
- ✅ Connection health diagnostics
- ✅ Full Arabic/English translation

## 📋 Prerequisites

1. **Grandstream UCM6304A** with admin access
2. **Network connectivity** between your app server and UCM
3. **Environment variables** configured properly
4. **Database** (PostgreSQL) with CDR table

## 🔧 Step 1: Environment Configuration

Create or update your `.env` file:

```bash
# Copy from .env.example
cp .env.example .env

# Edit with your UCM details
GRANDSTREAM_HOST=192.168.1.100
GRANDSTREAM_PORT=8088
GRANDSTREAM_USERNAME=admin
GRANDSTREAM_PASSWORD=your_ucm_admin_password
GRANDSTREAM_API_VERSION=v1.0

# CDR Security
CDR_BASIC_USER=cdr_user
CDR_BASIC_PASS=secure_cdr_password
CDR_ALLOWED_IPS=192.168.1.0/24,10.0.0.0/8

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/call_db"
```

## 🔧 Step 2: UCM6304A Configuration

### 2.1 Enable API Access
1. Login to UCM Web Interface (http://YOUR_UCM_IP:8088)
2. Go to **System Settings → Security → API Access**
3. Enable **"Allow API Access"**
4. Note the API port (usually 8088)

### 2.2 Configure CDR Real-Time Output
1. Navigate to **Call Features → CDR → CDR Real-Time Output**
2. Configure the following:
   - **Enable**: ✅ Yes
   - **Server Type**: HTTPS
   - **Server URL**: `http://YOUR_APP_SERVER:3000/api/cdr/ingest/https`
   - **Username**: `cdr_user` (matches CDR_BASIC_USER)
   - **Password**: `secure_cdr_password` (matches CDR_BASIC_PASS)
   - **Format**: JSON
   - **Retry**: Enable with 3 attempts
3. **Apply** and **Save** configuration

### 2.3 Network Configuration
Ensure your UCM can reach your application server:
```bash
# From UCM, test connectivity (if SSH access available)
curl -I http://YOUR_APP_SERVER:3000/api/cdr/ingest/https

# From your app server, test UCM API
curl -u admin:password http://YOUR_UCM_IP:8088/api/v1.0/status
```

## 🔧 Step 3: Application Setup

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Database Migration
```bash
# Ensure CDR table exists
npx prisma db push
npx prisma generate
```

### 3.3 Start Application
```bash
npm run dev
```

The server will automatically:
- ✅ Test UCM connectivity on startup
- ✅ Start periodic CDR sync (every 5 minutes)
- ✅ Display connection status in logs

## 🧪 Step 4: Testing Integration

### 4.1 Run Test Scripts

**Windows (PowerShell):**
```powershell
.\scripts\test-cdr-integration.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x scripts/test-cdr-integration.sh
./scripts/test-cdr-integration.sh
```

### 4.2 Manual Testing

1. **Test Health**: Visit `/pbx` dashboard, check connection badge
2. **Manual Sync**: Click "Fetch from UCM" button in CDR tab
3. **View Data**: Check CDR records table
4. **Make Test Call**: Use UCM to make a call, verify it appears

## 📊 Step 5: Dashboard Features

### Available Endpoints
- `GET /api/grandstream/health` - Connection health
- `POST /api/grandstream/cdr/sync` - Manual CDR sync
- `GET /api/grandstream/cdr/status` - CDR diagnostics
- `GET /api/cdr/records` - View CDR data
- `POST /api/cdr/ingest/https` - CDR ingestion (for UCM)

### Dashboard Features
1. **Connection Status** - Real-time UCM connectivity
2. **Extension Monitoring** - Live extension status
3. **CDR Statistics** - Call volume and status breakdown
4. **Manual Sync** - "Fetch from UCM" button
5. **Health Diagnostics** - Record counts and last sync time
6. **Advanced Filtering** - Filter calls by date, extension, status

## 🔍 Step 6: Troubleshooting

### Common Issues

**Connection Failed**
```bash
# Check network connectivity
ping YOUR_UCM_IP
telnet YOUR_UCM_IP 8088

# Verify API credentials
curl -u admin:password http://YOUR_UCM_IP:8088/api/v1.0/status
```

**No CDR Data**
1. Check UCM CDR Real-Time Output is enabled
2. Verify server URL is correct and reachable
3. Check authentication credentials match
4. Look for UCM logs showing HTTP POST attempts
5. Test ingestion endpoint manually

**Environment Variables**
```bash
# Check if variables are loaded
node -e "console.log(process.env.GRANDSTREAM_HOST)"

# Restart application after .env changes
npm run dev
```

### Log Monitoring
```bash
# Watch application logs for UCM activity
tail -f logs/app.log | grep -i grandstream

# Look for these patterns:
# ✅ [Grandstream] Connected to UCM6304A successfully  
# 🔄 [Grandstream] Started periodic CDR sync
# 📤 CDR HTTPS: Processed X record(s)
```

### Network Diagnostics
```bash
# Test UCM API from your server
curl -v -u admin:password \
  http://YOUR_UCM_IP:8088/api/v1.0/extension/1001/status

# Test CDR ingestion from UCM network
curl -v -X POST \
  -H "Authorization: Basic $(echo -n 'cdr_user:secure_cdr_password' | base64)" \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}' \
  http://YOUR_APP_SERVER:3000/api/cdr/ingest/https
```

## ⚡ Step 7: Production Deployment

### Security Considerations
1. **Change default passwords** in production
2. **Use HTTPS** for CDR ingestion if possible
3. **Restrict IP access** with CDR_ALLOWED_IPS
4. **Monitor logs** for unauthorized access attempts

### Performance Optimization
1. **Database indexing** on calldate and uniqueid fields
2. **Log rotation** to prevent disk space issues
3. **Periodic cleanup** of old CDR records
4. **Resource monitoring** for high call volumes

### Backup Strategy
1. **Database backups** including CDR data
2. **Configuration backups** (.env files)
3. **UCM configuration exports**

## 📚 Additional Resources

- [UCM6304A API Documentation](https://documentation.grandstream.com/knowledge-base/https-api/)
- [CDR Real-Time Output Guide](https://documentation.grandstream.com/knowledge-base/cdr-real-time-output-feature/)
- [Application Architecture](./AGENTS.md)
- [CDR Deployment Guide](./CDR_DEPLOYMENT_GUIDE.md)

## 🆘 Getting Help

If you encounter issues:

1. **Check logs** in application console
2. **Run test scripts** to isolate problems
3. **Verify UCM configuration** step by step
4. **Test network connectivity** between systems
5. **Review environment variables** for typos

The application provides comprehensive error messages and diagnostic information to help identify and resolve issues quickly.

---

✅ **Your application is now ready for production UCM6304A integration!**