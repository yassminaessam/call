import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Router, Settings, Shield, Network, Phone, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface GrandstreamConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  apiVersion: string;
  enabled: boolean;
  autoSync: boolean;
  recordingEnabled: boolean;
  webhookUrl: string;
}

export default function GrandstreamSettings() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<GrandstreamConfig>({
    host: '192.168.1.100',
    port: 8088,
    username: 'admin',
    password: '',
    apiVersion: 'v1.0',
    enabled: false,
    autoSync: true,
    recordingEnabled: true,
    webhookUrl: ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      // In a real app, this would load from your settings API
      const savedConfig = localStorage.getItem('grandstream_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
      
      // Check current connection status
      await testConnection(false);
    } catch (error) {
      console.error('Failed to load configuration:', error);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to your settings API
      localStorage.setItem('grandstream_config', JSON.stringify(config));
      
      toast({
        title: t('grandstream.settings.saved'),
        description: t('grandstream.settings.configurationSaved')
      });
    } catch (error) {
      toast({
        title: t('grandstream.error'),
        description: t('grandstream.settings.saveFailed'),
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (showToast = true) => {
    setTesting(true);
    try {
      const response = await fetch('/api/grandstream/health');
      const result = await response.json();
      setIsConnected(result.success);
      
      if (showToast) {
        toast({
          title: result.success ? t('grandstream.settings.testSuccess') : t('grandstream.settings.testFailed'),
          description: result.success 
            ? t('grandstream.settings.connectionSuccessful')
            : result.details || t('grandstream.settings.connectionFailed'),
          variant: result.success ? 'default' : 'destructive'
        });
      }
    } catch (error) {
      setIsConnected(false);
      if (showToast) {
        toast({
          title: t('grandstream.settings.testFailed'),
          description: t('grandstream.settings.connectionFailed'),
          variant: 'destructive'
        });
      }
    } finally {
      setTesting(false);
    }
  };

  const handleConfigChange = (field: keyof GrandstreamConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Router className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">{t('grandstream.settings.title')}</h2>
          <p className="text-muted-foreground">{t('grandstream.settings.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              {t('grandstream.settings.connectionConfig')}
            </CardTitle>
            <CardDescription>
              {t('grandstream.settings.connectionDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('grandstream.settings.enableIntegration')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('grandstream.settings.enableDescription')}
                </p>
              </div>
              <Switch 
                checked={config.enabled}
                onCheckedChange={(checked) => handleConfigChange('enabled', checked)}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">{t('grandstream.settings.ipAddress')}</Label>
                <Input
                  id="host"
                  placeholder="192.168.1.100"
                  value={config.host}
                  onChange={(e) => handleConfigChange('host', e.target.value)}
                  disabled={!config.enabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">{t('grandstream.settings.port')}</Label>
                <Input
                  id="port"
                  type="number"
                  placeholder="8088"
                  value={config.port}
                  onChange={(e) => handleConfigChange('port', parseInt(e.target.value) || 8088)}
                  disabled={!config.enabled}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('grandstream.settings.username')}</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={config.username}
                  onChange={(e) => handleConfigChange('username', e.target.value)}
                  disabled={!config.enabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('grandstream.settings.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={config.password}
                  onChange={(e) => handleConfigChange('password', e.target.value)}
                  disabled={!config.enabled}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiVersion">{t('grandstream.settings.apiVersion')}</Label>
              <Input
                id="apiVersion"
                placeholder="v1.0"
                value={config.apiVersion}
                onChange={(e) => handleConfigChange('apiVersion', e.target.value)}
                disabled={!config.enabled}
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button 
                onClick={() => testConnection(true)}
                disabled={testing || !config.enabled}
                variant="outline"
                className="flex-1"
              >
                {testing ? t('grandstream.settings.testing') : t('grandstream.settings.testConnection')}
              </Button>
              <Badge variant={isConnected ? 'default' : 'destructive'} className="gap-1">
                {isConnected ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {isConnected ? t('grandstream.connected') : t('grandstream.disconnected')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Call Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {t('grandstream.settings.callManagement')}
            </CardTitle>
            <CardDescription>
              {t('grandstream.settings.callDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('grandstream.settings.autoSync')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('grandstream.settings.autoSyncDescription')}
                </p>
              </div>
              <Switch 
                checked={config.autoSync}
                onCheckedChange={(checked) => handleConfigChange('autoSync', checked)}
                disabled={!config.enabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('grandstream.settings.recordingEnabled')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('grandstream.settings.recordingDescription')}
                </p>
              </div>
              <Switch 
                checked={config.recordingEnabled}
                onCheckedChange={(checked) => handleConfigChange('recordingEnabled', checked)}
                disabled={!config.enabled}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">{t('grandstream.settings.webhookUrl')}</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-crm.com/api/webhooks/grandstream"
                value={config.webhookUrl}
                onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                disabled={!config.enabled}
              />
              <p className="text-sm text-muted-foreground">
                {t('grandstream.settings.webhookDescription')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('grandstream.settings.security')}
            </CardTitle>
            <CardDescription>
              {t('grandstream.settings.securityDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">
                  {t('grandstream.settings.securityWarning')}
                </span>
              </div>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• {t('grandstream.settings.securityTip1')}</li>
                <li>• {t('grandstream.settings.securityTip2')}</li>
                <li>• {t('grandstream.settings.securityTip3')}</li>
                <li>• {t('grandstream.settings.securityTip4')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('grandstream.settings.systemInfo')}
            </CardTitle>
            <CardDescription>
              {t('grandstream.settings.systemDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t('grandstream.settings.model')}:</span>
                <div className="text-muted-foreground">Grandstream UCM6304A</div>
              </div>
              <div>
                <span className="font-medium">{t('grandstream.settings.apiVersion')}:</span>
                <div className="text-muted-foreground">{config.apiVersion}</div>
              </div>
              <div>
                <span className="font-medium">{t('grandstream.settings.status')}:</span>
                <div className="text-muted-foreground">
                  {config.enabled ? t('grandstream.settings.enabled') : t('grandstream.settings.disabled')}
                </div>
              </div>
              <div>
                <span className="font-medium">{t('grandstream.settings.lastSync')}:</span>
                <div className="text-muted-foreground">{new Date().toLocaleString()}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">{t('grandstream.settings.supportedFeatures')}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t('grandstream.settings.feature1')}</li>
                <li>• {t('grandstream.settings.feature2')}</li>
                <li>• {t('grandstream.settings.feature3')}</li>
                <li>• {t('grandstream.settings.feature4')}</li>
                <li>• {t('grandstream.settings.feature5')}</li>
                <li>• {t('grandstream.settings.feature6')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button 
          onClick={saveConfiguration}
          disabled={saving}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          {saving ? t('grandstream.settings.saving') : t('grandstream.settings.saveConfiguration')}
        </Button>
      </div>
    </div>
  );
}