# CDR ## 🏧 Architecture

```text
PBX/UCM (السنترال) → [HTTPS/TCP] → Your App → Database
                                  ↓
                              Analytics Dashboard
```ion System - Setup & Deployment Guide

## 🎯 Overview

This guide provides comprehensive instructions for deploying and configuring the CDR (Call Detail Records) connection system that enables your PBX/UCM (السنترال) to send call data to your application via HTTPS or TCP connections.

## 🏗️ Architecture

```text
PBX/UCM (السنترال) → [HTTPS/TCP] → Your App → Database
                                  ↓
                              Analytics Dashboard
```

## Connection Modes

1. **HTTPS Mode**: RESTful API endpoint for receiving CDR data
2. **TCP Mode**: Raw TCP socket server for direct PBX connections

```text
Connection Flow:
PBX → HTTPS POST → /api/cdr/https
PBX → TCP Socket → port 9999
```

## 📋 Prerequisites

### System Requirements

- Node.js 18+
- PostgreSQL database (or Neon serverless)
- SSL certificate (for production HTTPS)
- Network access between PBX and application server

### PBX Requirements

- Grandstream UCM series or compatible PBX
- CDR export capability (HTTPS POST or TCP)
- Network connectivity to application server

## Installation & Setup

### 1. Environment Configuration

Create or update your `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/callcenter"

# CDR Security
CDR_AUTH_SECRET="your-secure-jwt-secret-key"
CDR_DEFAULT_AUTH_TOKEN="your-api-token-for-pbx"

# Server Configuration
PORT=3000
NODE_ENV=production

# Optional: Specific CDR server ports
CDR_HTTPS_PORT=8080
CDR_TCP_PORT=9999
```

## Database Setup

Run the Prisma migrations:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 3. Install Dependencies

Ensure all security and validation packages are installed:

```bash
npm install express-rate-limit joi helmet cors express-validator bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

### 4. Build and Start

```bash
# Build the application
npm run build

# Start in production
npm start

# Or use PM2 for production
pm2 start dist/server/node-build.mjs --name "call-center-api"
```

## ⚙️ Configuration

### 1. Initial CDR Configuration

Use the web interface or API to configure CDR settings:

**Via Web Interface:**

1. Navigate to Settings → CDR Settings
2. Choose connection mode (HTTPS/TCP)
3. Configure ports and security settings
4. Test the connection
5. Activate the configuration

**Via API:**

```bash
curl -X PUT http://localhost:3000/api/cdr/config \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "HTTPS",
    "httpsConfig": {
      "port": 8080,
      "endpoint": "/api/cdr/https",
      "enableAuth": true,
      "authToken": "your-secure-token"
    },
    "allowedIPs": ["192.168.1.0/24"],
    "isActive": true
  }'
```

### 2. PBX Configuration

#### For Grandstream UCM

1. **Access UCM Web Interface**
   - Login to your UCM admin panel
   - Navigate to Maintenance → CDR

2. **HTTPS Configuration:**

   ```ini
   CDR Server: http://your-server.com:8080/api/cdr/https
   Method: POST
   Content-Type: application/json
   Authorization Header: Bearer your-secure-token
   ```

3. **TCP Configuration:**

   ```ini
   CDR Server IP: your-server.com
   CDR Server Port: 9999
   Protocol: TCP
   ```

#### For Other PBX Systems

Refer to your PBX documentation for CDR export settings. The system accepts standard CDR fields:

- `callId`: Unique call identifier
- `startTime`: Call start timestamp (ISO 8601)
- `endTime`: Call end timestamp (ISO 8601)
- `duration`: Call duration in seconds
- `callerNumber`: Caller phone number
- `calleeNumber`: Called phone number
- `disposition`: Call result (ANSWERED, BUSY, NO_ANSWER, etc.)
- `recordingUrl`: Optional recording file URL

## 🔒 Security Configuration

### 1. Network Security

**Firewall Rules:**

```bash
# Allow CDR ports
ufw allow 8080/tcp comment "CDR HTTPS"
ufw allow 9999/tcp comment "CDR TCP"

# Restrict to PBX IP if possible
ufw allow from 192.168.1.100 to any port 8080
ufw allow from 192.168.1.100 to any port 9999
```

**IP Allowlisting:**

Configure allowed IP ranges in the CDR settings:

```json
{
  "allowedIPs": [
    "192.168.1.0/24",
    "10.0.0.0/8",
    "172.16.0.0/12"
  ]
}
```

### 2. Authentication

**API Token Authentication:**

1. Generate a secure token
2. Configure in CDR settings
3. Add to PBX authorization header: `Bearer your-token`

**JWT Authentication (Advanced):**
For user-based access, enable JWT authentication in middleware.

### 3. Rate Limiting

Default limits:

- CDR Ingestion: 1000 requests/hour per IP
- Configuration: 100 requests/hour per IP
- General: 1000 requests/hour per IP

Adjust in `server/middleware/cdrSecurity.ts` if needed.

## 🧪 Testing

### 1. Automated Testing

Run the integration test suite:

```bash
# Install axios for testing
npm install axios

# Run tests
node test-cdr-integration.js
```

### 2. Manual Testing

**Health Check:**

```bash
curl http://localhost:3000/api/cdr/health
```

**Configuration Test:**

```bash
curl -X POST http://localhost:3000/api/cdr/test
```

**CDR Ingestion Test:**

```bash
curl -X POST http://localhost:3000/api/cdr/https \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "callId": "test-001",
    "startTime": "2024-01-01T10:00:00Z",
    "endTime": "2024-01-01T10:02:00Z",
    "duration": 120,
    "callerNumber": "+1234567890",
    "calleeNumber": "+0987654321",
    "disposition": "ANSWERED"
  }'
```

## 📊 Monitoring

### 1. Health Monitoring

Monitor these endpoints:

- `GET /api/cdr/health` - System health
- `GET /api/cdr/records` - Recent CDR data

### 2. Log Monitoring

Key log files to monitor:

- Application logs: CDR ingestion and errors
- Security logs: Failed authentication attempts
- Database logs: Connection and query issues

### 3. Metrics to Track

- CDR ingestion rate
- Failed authentication attempts
- Database connection status
- TCP connection stability
- API response times

## 🚨 Troubleshooting

### Common Issues

#### 1. PBX Cannot Connect

- Check firewall rules
- Verify IP allowlist
- Test network connectivity: `telnet your-server.com 8080`

#### 2. Authentication Failures

- Verify auth token in PBX configuration
- Check token format: `Bearer token`
- Review security logs

#### 3. CDR Data Not Appearing

- Check CDR ingestion logs
- Verify PBX CDR format matches expected schema
- Test with manual curl request

#### 4. TCP Connection Issues

- Ensure TCP server is running
- Check port availability: `netstat -tlnp | grep 9999`
- Verify PBX TCP configuration

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
DEBUG=cdr:*
```

## 🔄 Maintenance

### Regular Tasks

1. **Database Cleanup**

   ```sql
   -- Delete CDR records older than 6 months
   DELETE FROM "CDR" WHERE "startTime" < NOW() - INTERVAL '6 months';
   ```

2. **Log Rotation**
   Configure logrotate for application logs

3. **Security Updates**
   - Regularly update dependencies
   - Rotate auth tokens
   - Review security logs

### Backup Strategy

1. **Database Backups**

   ```bash
   pg_dump your_database > cdr_backup_$(date +%Y%m%d).sql
   ```

2. **Configuration Backups**
   Export CDR configuration settings periodically

## 🆘 Support

### Log Files Locations

- Application: `/var/log/callcenter/`
- CDR specific: Check console output or configured log path

### Key Configuration Files

- Database schema: `prisma/schema.prisma`
- CDR routes: `server/routes/cdr.ts`
- Security middleware: `server/middleware/cdrSecurity.ts`
- Frontend config: `client/pages/CDRSettings.tsx`

### Emergency Procedures

**Disable CDR Ingestion:**

```bash
curl -X PUT http://localhost:3000/api/cdr/config \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

**Reset Configuration:**

```bash
# Will restore default configuration
curl -X DELETE http://localhost:3000/api/cdr/config
```

---

## 📞 Contact

For technical support or questions about the CDR integration system, please refer to the project documentation or contact your system administrator.

**System Status:** ✅ Production Ready  
**Last Updated:** $(date)  
**Version:** 1.0.0
