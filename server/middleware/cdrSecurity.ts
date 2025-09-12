import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Rate limiting for CDR endpoints
export const cdrRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for CDR endpoints
  message: {
    error: 'Too many CDR requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for CDR ingestion
export const cdrIngestRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Allow up to 1000 CDR records per minute per IP
  message: {
    error: 'CDR ingestion rate limit exceeded, please slow down.',
    code: 'CDR_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// IP allowlist middleware
export const ipAllowlistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await prisma.cDRConnectorConfig.findFirst();
    if (!config || !config.isActive) {
      return res.status(503).json({ 
        error: 'CDR service not active',
        code: 'SERVICE_INACTIVE'
      });
    }

    const jsonConfig = config.jsonConfig as any;
    const allowedIPs = jsonConfig.allowedIPs || [];
    
    // If no IPs specified, allow all
    if (allowedIPs.length === 0) {
      return next();
    }

    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const forwardedFor = req.headers['x-forwarded-for'] as string;
    const realIP = forwardedFor ? forwardedFor.split(',')[0].trim() : clientIP;

    // Check if client IP is in the allowlist
    const isAllowed = allowedIPs.some((allowedIP: string) => {
      // Support CIDR notation and exact IP matching
      if (allowedIP.includes('/')) {
        return isIPInCIDR(realIP, allowedIP);
      }
      return realIP === allowedIP;
    });

    if (!isAllowed) {
      console.warn(`CDR access denied for IP: ${realIP}, allowed IPs: ${allowedIPs.join(', ')}`);
      return res.status(403).json({ 
        error: 'IP address not allowed',
        code: 'IP_NOT_ALLOWED'
      });
    }

    next();
  } catch (error) {
    console.error('IP allowlist middleware error:', error);
    res.status(500).json({ 
      error: 'Security check failed',
      code: 'SECURITY_ERROR'
    });
  }
};

// Basic authentication middleware for CDR endpoints
export const cdrAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await prisma.cDRConnectorConfig.findFirst();
    if (!config) {
      return res.status(503).json({ 
        error: 'CDR service not configured',
        code: 'SERVICE_NOT_CONFIGURED'
      });
    }

    const jsonConfig = config.jsonConfig as any;
    
    // If no auth configured, skip authentication
    if (!jsonConfig.authUsername || !jsonConfig.authPassword) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const credentials = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== jsonConfig.authUsername || password !== jsonConfig.authPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    next();
  } catch (error) {
    console.error('CDR auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication check failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Validation schemas for CDR data
export const validateCDRRecord: ValidationChain[] = [
  body('calldate').optional().isISO8601().withMessage('Invalid call date format'),
  body('src').optional().isString().isLength({ max: 64 }).withMessage('Source number too long'),
  body('dst').optional().isString().isLength({ max: 64 }).withMessage('Destination number too long'),
  body('disposition').optional().isString().isLength({ max: 20 }).withMessage('Disposition too long'),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
  body('billsec').optional().isInt({ min: 0 }).withMessage('Bill seconds must be a positive integer'),
  body('uniqueid').isString().notEmpty().isLength({ max: 128 }).withMessage('Unique ID is required and must be valid'),
  body('channel').optional().isString().isLength({ max: 128 }).withMessage('Channel too long'),
  body('dcontext').optional().isString().isLength({ max: 80 }).withMessage('Destination context too long'),
  body('dstchannel').optional().isString().isLength({ max: 128 }).withMessage('Destination channel too long'),
  body('lastapp').optional().isString().isLength({ max: 80 }).withMessage('Last application too long'),
  body('lastdata').optional().isString().isLength({ max: 200 }).withMessage('Last data too long'),
  body('amaflags').optional().isInt({ min: 0 }).withMessage('AMA flags must be a positive integer'),
  body('userfield').optional().isString().isLength({ max: 255 }).withMessage('User field too long'),
];

// Validation for CDR configuration
export const validateCDRConfig: ValidationChain[] = [
  body('mode').isIn(['HTTPS', 'TCP']).withMessage('Mode must be HTTPS or TCP'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  body('jsonConfig').isObject().withMessage('jsonConfig must be an object'),
  body('jsonConfig.webhookUrl').optional().isURL().withMessage('Invalid webhook URL'),
  body('jsonConfig.tcpPort').optional().isInt({ min: 1, max: 65535 }).withMessage('TCP port must be between 1 and 65535'),
  body('jsonConfig.bufferSize').optional().isInt({ min: 1024, max: 65536 }).withMessage('Buffer size must be between 1024 and 65536'),
  body('jsonConfig.retryAttempts').optional().isInt({ min: 0, max: 10 }).withMessage('Retry attempts must be between 0 and 10'),
  body('jsonConfig.timeout').optional().isInt({ min: 1000, max: 60000 }).withMessage('Timeout must be between 1000 and 60000 ms'),
  body('jsonConfig.allowedIPs').optional().isArray().withMessage('Allowed IPs must be an array'),
  body('jsonConfig.allowedIPs.*').optional().custom((value) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/;
    if (!ipRegex.test(value)) {
      throw new Error('Invalid IP address or CIDR notation');
    }
    return true;
  }),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }
  next();
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim().slice(0, 1000); // Limit string length
    }
    if (Array.isArray(obj)) {
      return obj.slice(0, 100).map(sanitize); // Limit array size
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      Object.keys(obj).slice(0, 50).forEach(key => { // Limit object keys
        sanitized[key] = sanitize(obj[key]);
      });
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  next();
};

// Utility function to check if IP is in CIDR range
function isIPInCIDR(ip: string, cidr: string): boolean {
  try {
    const [subnet, bits] = cidr.split('/');
    const mask = ~(2 ** (32 - parseInt(bits)) - 1);
    
    const ipNum = ipToNumber(ip);
    const subnetNum = ipToNumber(subnet);
    
    return (ipNum & mask) === (subnetNum & mask);
  } catch (error) {
    console.error('CIDR check error:', error);
    return false;
  }
}

function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

// Logging middleware for security events
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400) {
      console.log(`CDR Security Event: ${req.method} ${req.path} - ${res.statusCode} - IP: ${req.ip} - UA: ${req.get('User-Agent')}`);
    }
    return originalSend.call(this, data);
  };
  next();
};

export default {
  cdrRateLimit,
  cdrIngestRateLimit,
  ipAllowlistMiddleware,
  cdrAuthMiddleware,
  validateCDRRecord,
  validateCDRConfig,
  handleValidationErrors,
  securityHeaders,
  sanitizeInput,
  securityLogger
};