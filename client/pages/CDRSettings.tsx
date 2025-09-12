import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Settings, 
  Network, 
  Database, 
  Play,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface CDRConfig {
  mode: 'HTTPS' | 'TCP';
  isActive: boolean;
  jsonConfig: {
    // HTTPS specific
    webhookUrl?: string;
    authUsername?: string;
    authPassword?: string;
    customHeaders?: Record<string, string>;
    
    // TCP specific
    tcpPort?: number;
    bufferSize?: number;
    
    // Common settings
    allowedIPs?: string[];
    retryAttempts?: number;
    timeout?: number;
  };
}

interface CDRRecord {
  id: string;
  calldate: string;
  src: string;
  dst: string;
  disposition: string;
  duration: number;
  billsec: number;
  uniqueid: string;
}

export default function CDRSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [config, setConfig] = useState<CDRConfig>({
    mode: 'HTTPS',
    isActive: false,
    jsonConfig: {
      retryAttempts: 3,
      timeout: 5000,
    }
  });
  
  const [records, setRecords] = useState<CDRRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadConfiguration();
    loadRecentRecords();
  }, []);

  const loadConfiguration = async () => {
    try {
      const response = await fetch('/api/cdr/config');
      if (response.ok) {
        const data = await response.json();
        if (data && data.config) {
          setConfig(data.config);
        } else if (data) {
          setConfig(data);
        }
      } else {
        toast({
          title: t('common.error') || 'Error',
          description: t('cdr.loadConfigError') || 'Failed to load configuration',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast({
        title: t('common.error') || 'Error',
        description: t('loadConfigError') || 'Failed to load configuration',
        variant: 'destructive',
      });
    }
  };

  const loadRecentRecords = async () => {
    try {
      const response = await fetch('/api/cdr/records?limit=10');
      if (response.ok) {
        const result = await response.json();
        const recordsData = result.data || result;
        setRecords(Array.isArray(recordsData) ? recordsData : []);
      }
    } catch (error) {
      console.error('Error loading records:', error);
      setRecords([]);
    }
  };

  const saveConfiguration = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cdr/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast({
          title: t('common.success') || 'Success',
          description: t('cdr.configSaved') || 'Configuration saved successfully',
        });
        setConnectionStatus('success');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save configuration');
      }
    } catch (error: any) {
      console.error('Error saving configuration:', error);
      toast({
        title: t('common.error') || 'Error',
        description: error?.message || t('cdr.saveConfigError') || 'Failed to save configuration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setTesting(true);
      setConnectionStatus('idle');
      const response = await fetch('/api/cdr/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        setConnectionStatus('success');
        setStatusMessage(result.message);
        toast({
          title: t('common.success') || 'Success',
          description: t('cdr.testSuccess') || 'Test successful',
        });
      } else {
        setConnectionStatus('error');
        setStatusMessage(result.error);
        toast({
          title: t('common.error') || 'Error',
          description: t('cdr.testError') || 'Test failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus('error');
      setStatusMessage('Connection test failed');
      toast({
        title: t('common.error') || 'Error',
        description: t('testError') || 'Test failed',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const updateConfig = (updates: Partial<CDRConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateJsonConfig = (updates: Partial<CDRConfig['jsonConfig']>) => {
    setConfig(prev => ({
      ...prev,
      jsonConfig: {
        ...prev.jsonConfig,
        ...updates
      }
    }));
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">{t('cdr.status.success')}</Badge>;
      case 'error':
        return <Badge variant="destructive">{t('cdr.status.error')}</Badge>;
      default:
        return <Badge variant="secondary">{t('cdr.status.idle')}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('cdr.title')}
          </CardTitle>
          <CardDescription>
            {t('cdr.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium">Status</span>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testConnection}
                disabled={testing}
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    {t('cdr.testConnection')}
                  </>
                )}
              </Button>
              <Switch
                checked={config?.isActive ?? false}
                onCheckedChange={(checked) => updateConfig({ isActive: checked })}
              />
              <Label>{t('cdr.active')}</Label>
            </div>
          </div>

          {statusMessage && (
            <Alert variant={connectionStatus === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs value={config?.mode ?? 'HTTPS'} onValueChange={(value) => updateConfig({ mode: value as 'HTTPS' | 'TCP' })}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="HTTPS">HTTPS</TabsTrigger>
          <TabsTrigger value="TCP">TCP</TabsTrigger>
        </TabsList>

        <TabsContent value="HTTPS" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                {t('cdr.httpsConfiguration')}
              </CardTitle>
              <CardDescription>
                {t('cdr.httpsConfigDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhookUrl">{t('cdr.webhookUrl')}</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  value={config?.jsonConfig?.webhookUrl || ''}
                  onChange={(e) => updateJsonConfig({ webhookUrl: e.target.value })}
                  placeholder="https://your-server.com/api/cdr/webhook"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="authUsername">{t('cdr.username')}</Label>
                  <Input
                    id="authUsername"
                    value={config?.jsonConfig?.authUsername || ''}
                    onChange={(e) => updateJsonConfig({ authUsername: e.target.value })}
                    placeholder={t('cdr.username')}
                  />
                </div>
                <div>
                  <Label htmlFor="authPassword">{t('cdr.password')}</Label>
                  <Input
                    id="authPassword"
                    type="password"
                    value={config?.jsonConfig?.authPassword || ''}
                    onChange={(e) => updateJsonConfig({ authPassword: e.target.value })}
                    placeholder={t('cdr.password')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customHeaders">{t('cdr.customHeaders')}</Label>
                <Textarea
                  id="customHeaders"
                  value={JSON.stringify(config?.jsonConfig?.customHeaders || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const headers = JSON.parse(e.target.value);
                      updateJsonConfig({ customHeaders: headers });
                    } catch {
                      // Invalid JSON, ignore for now
                    }
                  }}
                  placeholder='{\n  "X-API-Key": "your-api-key",\n  "Authorization": "Bearer token"\n}'
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="TCP" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                {t('cdr.tcpConfiguration')}
              </CardTitle>
              <CardDescription>
                {t('cdr.tcpConfigDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tcpPort">{t('cdr.tcpPort')}</Label>
                  <Input
                    id="tcpPort"
                    type="number"
                    min="1"
                    max="65535"
                    value={config?.jsonConfig?.tcpPort || 3001}
                    onChange={(e) => updateJsonConfig({ tcpPort: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="bufferSize">{t('cdr.bufferSize')}</Label>
                  <Input
                    id="bufferSize"
                    type="number"
                    min="1024"
                    value={config?.jsonConfig?.bufferSize || 4096}
                    onChange={(e) => updateJsonConfig({ bufferSize: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Common Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('cdr.commonSettings')}</CardTitle>
          <CardDescription>
            {t('cdr.commonSettingsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="allowedIPs">{t('cdr.allowedIPs')}</Label>
            <Textarea
              id="allowedIPs"
              value={config?.jsonConfig?.allowedIPs?.join('\n') || ''}
              onChange={(e) => {
                const ips = e.target.value.split('\n').filter(ip => ip.trim());
                updateJsonConfig({ allowedIPs: ips });
              }}
              placeholder="192.168.1.100\n10.0.0.1"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">{t('cdr.allowedIPsHint')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="retryAttempts">{t('cdr.retryAttempts')}</Label>
              <Input
                id="retryAttempts"
                type="number"
                min="0"
                max="10"
                value={config?.jsonConfig?.retryAttempts || 3}
                onChange={(e) => updateJsonConfig({ retryAttempts: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="timeout">{t('cdr.timeout')}</Label>
              <Input
                id="timeout"
                type="number"
                min="1000"
                max="60000"
                value={config?.jsonConfig?.timeout || 5000}
                onChange={(e) => updateJsonConfig({ timeout: parseInt(e.target.value) })}
              />
              <p className="text-sm text-gray-500 mt-1">{t('cdr.timeoutHint')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('cdr.recentRecords')}
          </CardTitle>
          <CardDescription>
            {t('cdr.recentRecordsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(records?.length || 0) === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t('cdr.noRecords')}
            </div>
          ) : (
            <div className="space-y-2">
              {Array.isArray(records) && records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="font-medium">{record.src} → {record.dst}</div>
                      <div className="text-gray-500">
                        {t('cdr.callDate')}: {new Date(record.calldate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{t('cdr.disposition')}: {record.disposition}</span>
                    <span>{t('cdr.duration')}: {record.duration}s</span>
                    <span>{t('cdr.billSec')}: {record.billsec}s</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <div className="flex justify-end">
        <Button onClick={saveConfiguration} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Configuration'
          )}
        </Button>
      </div>
    </div>
  );
}