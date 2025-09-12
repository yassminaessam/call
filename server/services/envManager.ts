import fs from 'fs';
import path from 'path';

export class EnvManager {
  private envPath: string;

  constructor() {
    this.envPath = path.join(process.cwd(), '.env');
  }

  /**
   * Read the current .env file content
   */
  private readEnvFile(): string {
    try {
      return fs.readFileSync(this.envPath, 'utf8');
    } catch (error) {
      console.error('Failed to read .env file:', error);
      return '';
    }
  }

  /**
   * Write content to .env file
   */
  private writeEnvFile(content: string): void {
    try {
      fs.writeFileSync(this.envPath, content, 'utf8');
      console.log('[EnvManager] .env file updated successfully');
    } catch (error) {
      console.error('[EnvManager] Failed to write .env file:', error);
      throw error;
    }
  }

  /**
   * Update a specific environment variable in .env file
   */
  updateEnvVariable(key: string, value: string): void {
    const content = this.readEnvFile();
    const lines = content.split('\n');
    
    let found = false;
    const updatedLines = lines.map(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '') {
        return line;
      }
      
      // Check if this line contains our key
      const [lineKey] = line.split('=', 1);
      if (lineKey === key) {
        found = true;
        return `${key}=${value}`;
      }
      
      return line;
    });

    // If key wasn't found, add it to the end
    if (!found) {
      updatedLines.push(`${key}=${value}`);
    }

    this.writeEnvFile(updatedLines.join('\n'));
  }

  /**
   * Update multiple environment variables at once
   */
  updateEnvVariables(variables: Record<string, string>): void {
    const content = this.readEnvFile();
    const lines = content.split('\n');
    const keysToUpdate = Object.keys(variables);
    const foundKeys = new Set<string>();
    
    const updatedLines = lines.map(line => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '') {
        return line;
      }
      
      // Check if this line contains any of our keys
      const [lineKey] = line.split('=', 1);
      if (keysToUpdate.includes(lineKey)) {
        foundKeys.add(lineKey);
        return `${lineKey}=${variables[lineKey]}`;
      }
      
      return line;
    });

    // Add any keys that weren't found
    keysToUpdate.forEach(key => {
      if (!foundKeys.has(key)) {
        updatedLines.push(`${key}=${variables[key]}`);
      }
    });

    this.writeEnvFile(updatedLines.join('\n'));
  }

  /**
   * Update CDR configuration in .env file based on form data
   */
  updateCDRConfig(config: {
    mode: 'HTTPS' | 'TCP';
    isActive: boolean;
    jsonConfig: {
      webhookUrl?: string;
      authUsername?: string;
      authPassword?: string;
      endpointPath?: string;
      tcpPort?: number;
      bufferSize?: number;
      allowedIPs?: string[];
      retryAttempts?: number;
      timeout?: number;
    };
  }): void {
    const envUpdates: Record<string, string> = {
      CDR_MODE: config.mode,
      CDR_ACTIVE: config.isActive.toString(),
    };

    // HTTPS specific settings
    if (config.mode === 'HTTPS') {
      envUpdates.CDR_HTTPS_WEBHOOK_URL = config.jsonConfig.webhookUrl || '';
      envUpdates.CDR_HTTPS_AUTH_USERNAME = config.jsonConfig.authUsername || '';
      envUpdates.CDR_HTTPS_AUTH_PASSWORD = config.jsonConfig.authPassword || '';
      envUpdates.CDR_HTTPS_ENDPOINT_PATH = config.jsonConfig.endpointPath || '/api/cdr/receive';
    }

    // TCP specific settings
    if (config.mode === 'TCP') {
      envUpdates.CDR_TCP_PORT = (config.jsonConfig.tcpPort || 10001).toString();
      envUpdates.CDR_TCP_BUFFER_SIZE = (config.jsonConfig.bufferSize || 8192).toString();
    }

    // Common settings
    envUpdates.CDR_ALLOWED_IPS = config.jsonConfig.allowedIPs?.join(',') || '';
    envUpdates.CDR_RETRY_ATTEMPTS = (config.jsonConfig.retryAttempts || 3).toString();
    envUpdates.CDR_TIMEOUT = (config.jsonConfig.timeout || 5000).toString();

    this.updateEnvVariables(envUpdates);
  }

  /**
   * Update Grandstream configuration in .env file
   */
  updateGrandstreamConfig(config: {
    host?: string;
    port?: string;
    username?: string;
    password?: string;
    apiVersion?: string;
    mode?: 'production' | 'demo';
  }): void {
    const envUpdates: Record<string, string> = {};

    if (config.host) envUpdates.GRANDSTREAM_HOST = config.host;
    if (config.port) envUpdates.GRANDSTREAM_PORT = config.port;
    if (config.username) envUpdates.GRANDSTREAM_USERNAME = config.username;
    if (config.password) envUpdates.GRANDSTREAM_PASSWORD = config.password;
    if (config.apiVersion) envUpdates.GRANDSTREAM_API_VERSION = config.apiVersion;
    if (config.mode) envUpdates.UCM_MODE = config.mode;

    this.updateEnvVariables(envUpdates);
  }

  /**
   * Get current environment variable value
   */
  getEnvVariable(key: string): string | undefined {
    return process.env[key];
  }

  /**
   * Load .env file and populate environment variables for the current CDR config
   */
  loadCDRConfigFromEnv(): any {
    const mode = process.env.CDR_MODE || 'HTTPS';
    const isActive = process.env.CDR_ACTIVE === 'true';
    
    const jsonConfig: any = {
      allowedIPs: process.env.CDR_ALLOWED_IPS ? process.env.CDR_ALLOWED_IPS.split(',').filter(ip => ip.trim()) : [],
      retryAttempts: parseInt(process.env.CDR_RETRY_ATTEMPTS || '3'),
      timeout: parseInt(process.env.CDR_TIMEOUT || '5000'),
    };

    if (mode === 'HTTPS') {
      jsonConfig.webhookUrl = process.env.CDR_HTTPS_WEBHOOK_URL || '';
      jsonConfig.authUsername = process.env.CDR_HTTPS_AUTH_USERNAME || '';
      jsonConfig.authPassword = process.env.CDR_HTTPS_AUTH_PASSWORD || '';
      jsonConfig.endpointPath = process.env.CDR_HTTPS_ENDPOINT_PATH || '/api/cdr/receive';
    }

    if (mode === 'TCP') {
      jsonConfig.tcpPort = parseInt(process.env.CDR_TCP_PORT || '10001');
      jsonConfig.bufferSize = parseInt(process.env.CDR_TCP_BUFFER_SIZE || '8192');
    }

    return {
      mode,
      isActive,
      jsonConfig
    };
  }
}

export const envManager = new EnvManager();