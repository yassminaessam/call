# UCM6304A CDR Integration Setup Guide

## Overview

This guide shows how to configure your Grandstream UCM6304A to send CDR data to our application using the methods recommended by Grandstream support.

## Method 1: REST API Integration (Recommended)

### UCM6304A Configuration

1. **Access UCM Web Interface**
   - Navigate to `https://your-ucm-ip`
   - Login with admin credentials
   - Go to **Maintenance** → **CDR**

2. **Configure CDR Output**

   ```ini
   CDR Method: HTTP POST
   CDR Server URL: http://your-app-server:8080/api/cdr/https
   Content-Type: application/json
   HTTP Method: POST
   Authentication: Bearer your-secure-token
   ```

3. **Test Configuration**
   - Make a test call on your UCM
   - Check CDR logs in your application dashboard
   - Verify data appears in real-time

### Application Configuration

1. **Set HTTPS Mode**
   ```bash
   curl -X PUT http://localhost:3000/api/cdr/config \
     -H "Content-Type: application/json" \
     -d '{
       "mode": "HTTPS",
       "httpsConfig": {
         "port": 8080,
         "endpoint": "/api/cdr/https",
         "enableAuth": true,
         "authToken": "your-secure-token-123"
       },
       "allowedIPs": ["192.168.1.100"],
       "isActive": true
     }'
   ```

2. **Verify Connection**
   ```bash
   curl -X POST http://localhost:3000/api/cdr/test
   ```

## Method 2: Real-Time CDR Output

### UCM6304A Real-Time Configuration

1. **Enable Real-Time CDR**
   - Go to **Maintenance** → **CDR** → **Real-Time Output**
   - Enable: **Yes**
   - Server IP: `your-app-server-ip`
   - Server Port: `9999`
   - Protocol: `TCP`

2. **CDR Format Settings**

   ```ini
   Format: Custom/Standard
   Field Separator: Comma (,)
   Record Separator: Line Feed (\n)
   Include Headers: No
   ```

### Application Configuration

1. **Set TCP Mode**
   ```bash
   curl -X PUT http://localhost:3000/api/cdr/config \
     -H "Content-Type: application/json" \
     -d '{
       "mode": "TCP",
       "tcpConfig": {
         "port": 9999,
         "enableAuth": false
       },
       "allowedIPs": ["192.168.1.100"],
       "isActive": true
     }'
   ```

2. **Monitor Real-Time Stream**
   - CDR data will stream live to your application
   - Check logs: `GET /api/cdr/records`
   - Monitor health: `GET /api/cdr/health`

## CDR Field Mapping

Our application expects these fields from UCM6304A:

| UCM Field | Application Field | Description |
|-----------|------------------|-------------|
| Call-ID | callId | Unique call identifier |
| Start Time | startTime | Call start (ISO 8601) |
| End Time | endTime | Call end (ISO 8601) |
| Duration | duration | Call duration (seconds) |
| Caller | callerNumber | Calling party number |
| Callee | calleeNumber | Called party number |
| Disposition | disposition | Call result |
| Recording | recordingUrl | Recording file URL |

## Troubleshooting

### Common Issues

1. **UCM Cannot Connect**
   - Check firewall: Allow port 8080 (HTTPS) or 9999 (TCP)
   - Verify IP allowlist includes UCM IP
   - Test network connectivity: `telnet your-app-server 8080`

2. **Authentication Errors**
   - Verify Bearer token in UCM configuration
   - Check token format: `Bearer your-token`
   - Review application logs for auth failures

3. **No CDR Data**
   - Confirm UCM CDR output is enabled
   - Make test calls to generate CDR records
   - Check application endpoint: `GET /api/cdr/records`

### Verification Steps

1. **Test UCM Connection**
   ```bash
   # From UCM or same network
   curl -X POST http://your-app-server:8080/api/cdr/https \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-token" \
     -d '{
       "callId": "test-001",
       "startTime": "2024-01-01T10:00:00Z",
       "endTime": "2024-01-01T10:02:00Z",
       "duration": 120,
       "callerNumber": "1001",
       "calleeNumber": "1002",
       "disposition": "ANSWERED"
     }'
   ```

2. **Monitor Application**
   ```bash
   # Check health
   curl http://your-app-server:3000/api/cdr/health
   
   # View recent CDRs
   curl http://your-app-server:3000/api/cdr/records
   ```

## Security Best Practices

1. **Network Security**
   - Use VPN or private network for UCM-App communication
   - Configure firewall rules to restrict access
   - Use strong authentication tokens

2. **UCM Security**
   - Keep UCM firmware updated
   - Use strong admin passwords
   - Enable HTTPS on UCM web interface

3. **Application Security**
   - Regularly rotate auth tokens
   - Monitor failed authentication attempts
   - Review security logs periodically

## Performance Optimization

1. **High Call Volume**
   - Use TCP mode for better performance
   - Configure appropriate database connection pools
   - Monitor system resources

2. **Network Optimization**
   - Place application server close to UCM
   - Use dedicated network connection if possible
   - Monitor network latency and bandwidth

## References

- [UCM API Documentation](https://documentation.grandstream.com/knowledge-base/https-api/)
- [CDR Real-Time Output Feature](https://documentation.grandstream.com/knowledge-base/cdr-real-time-output-feature/)
- [Application Deployment Guide](./CDR_DEPLOYMENT_GUIDE.md)