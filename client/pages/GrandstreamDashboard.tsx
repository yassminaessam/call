import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Router, 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Users, 
  Clock, 
  Activity, 
  Settings, 
  PlayCircle, 
  StopCircle,
  RefreshCw,
  PhoneForwarded,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  UserCheck,
  UserX,
  Timer,
  PhoneMissed,
  Headphones,
  AlertCircle,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Extension {
  extension: string;
  status: 'available' | 'busy' | 'ringing' | 'offline';
  registered: boolean;
  inCall: boolean;
  lastActivity?: string;
  user?: string;
}

interface QueueStatus {
  queueNumber: string;
  waitingCalls: number;
  availableAgents: number;
  longestWait: number;
}

interface CallRecord {
  callId: string;
  from: string;
  to: string;
  duration: number;
  status: string;
  startTime: Date;
  direction: 'inbound' | 'outbound';
}

interface ActiveCall {
  callId: string;
  from: string;
  to: string;
  status: 'ringing' | 'connected' | 'holding';
  duration: number;
  startTime: Date;
}

export default function GrandstreamDashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // State
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [queues, setQueues] = useState<QueueStatus[]>([]);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitoring, setMonitoring] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  // Call controls state
  const [makeCallForm, setMakeCallForm] = useState({
    fromExtension: '',
    toNumber: '',
    show: false
  });

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    show: false,
    host: '',
    port: '',
    username: '',
    password: '',
    apiVersion: 'v1.0',
    sslEnabled: false,
    autoBackup: true,
    backupInterval: '24',
    logLevel: 'info',
    maxConcurrentCalls: '200',
    recordCalls: true,
    callTimeout: '30'
  });

  // Auto-refresh interval
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Settings Functions
  
  // Load current settings
  const loadSettings = async () => {
    try {
      const response = await fetch('/api/grandstream/settings');
      const result = await response.json();
      if (result.success) {
        setSettingsForm(prev => ({ ...prev, ...result.data }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      const response = await fetch('/api/grandstream/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: t('grandstream.settings.saved'),
          description: t('grandstream.settings.savedSuccessfully')
        });
        setSettingsForm(prev => ({ ...prev, show: false }));
        checkConnection();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: t('grandstream.settings.saveFailed'),
        description: error instanceof Error ? error.message : t('grandstream.error'),
        variant: 'destructive'
      });
    }
  };

  // Test settings connection
  const testSettings = async () => {
    try {
      const response = await fetch('/api/grandstream/settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      
      const result = await response.json();
      
      toast({
        title: result.success ? t('grandstream.settings.testSuccess') : t('grandstream.settings.testFailed'),
        description: result.message,
        variant: result.success ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: t('grandstream.settings.testFailed'),
        description: error instanceof Error ? error.message : t('grandstream.error'),
        variant: 'destructive'
      });
    }
  };

  // Backup configuration
  const backupConfig = async () => {
    try {
      const response = await fetch('/api/grandstream/backup', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `grandstream-backup-${new Date().toISOString().split('T')[0]}.tar.gz`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: t('grandstream.backup.success'),
          description: t('grandstream.backup.downloaded')
        });
      }
    } catch (error) {
      toast({
        title: t('grandstream.backup.failed'),
        description: error instanceof Error ? error.message : t('grandstream.error'),
        variant: 'destructive'
      });
    }
  };

  // Reboot system
  const rebootSystem = async () => {
    if (!confirm(t('grandstream.reboot.confirm'))) return;
    
    try {
      const response = await fetch('/api/grandstream/reboot', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: t('grandstream.reboot.initiated'),
          description: t('grandstream.reboot.pleaseWait')
        });
        
        setTimeout(() => {
          setConnectionStatus('checking');
        }, 5000);
      }
    } catch (error) {
      toast({
        title: t('grandstream.reboot.failed'),
        description: error instanceof Error ? error.message : t('grandstream.error'),
        variant: 'destructive'
      });
    }
  };

  // API calls
  const fetchExtensionsStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/grandstream/extensions/status');
      const result = await response.json();
      if (result.success) {
        setExtensions(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch extensions status:', error);
    }
  }, []);

  const fetchQueuesStatus = useCallback(async () => {
    try {
      // Fetch multiple queue statuses (100, 200, 300 as examples)
      const queueNumbers = ['100', '200', '300'];
      const queuePromises = queueNumbers.map(async (queueNumber) => {
        const response = await fetch(`/api/grandstream/queue/${queueNumber}/status`);
        const result = await response.json();
        return result.success ? result.data : { queueNumber, waitingCalls: 0, availableAgents: 0, longestWait: 0 };
      });
      
      const queueStatuses = await Promise.all(queuePromises);
      setQueues(queueStatuses);
    } catch (error) {
      console.error('Failed to fetch queues status:', error);
    }
  }, []);

  const fetchCallHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/grandstream/calls/history?limit=20');
      const result = await response.json();
      if (result.success) {
        setCallHistory(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch call history:', error);
    }
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      setConnectionStatus('checking');
      const response = await fetch('/api/grandstream/health');
      const result = await response.json();
      setConnectionStatus(result.success ? 'connected' : 'disconnected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  }, []);

  // Make outbound call
  const makeCall = async () => {
    if (!makeCallForm.fromExtension || !makeCallForm.toNumber) {
      toast({
        title: t('grandstream.error'),
        description: t('grandstream.makeCall.missingFields'),
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('/api/grandstream/call/make', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromExtension: makeCallForm.fromExtension,
          toNumber: makeCallForm.toNumber
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: t('grandstream.makeCall.success'),
          description: `${t('grandstream.makeCall.calling')} ${makeCallForm.toNumber}`
        });
        setMakeCallForm({ fromExtension: '', toNumber: '', show: false });
        // Refresh data
        fetchExtensionsStatus();
        fetchCallHistory();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: t('grandstream.makeCall.failed'),
        description: error instanceof Error ? error.message : t('grandstream.error'),
        variant: 'destructive'
      });
    }
  };

  // End call
  const endCall = async (callId: string) => {
    try {
      const response = await fetch(`/api/grandstream/call/${callId}/end`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: t('grandstream.endCall.success'),
          description: t('grandstream.endCall.ended')
        });
        // Refresh data
        fetchExtensionsStatus();
        fetchCallHistory();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: t('grandstream.endCall.failed'),
        description: error instanceof Error ? error.message : t('grandstream.error'),
        variant: 'destructive'
      });
    }
  };

  // Transfer call
  const transferCall = async (callId: string, targetExtension: string) => {
    try {
      const response = await fetch(`/api/grandstream/call/${callId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetExtension })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: t('grandstream.transferCall.success'),
          description: `${t('grandstream.transferCall.transferred')} ${targetExtension}`
        });
        fetchExtensionsStatus();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: t('grandstream.transferCall.failed'),
        description: error instanceof Error ? error.message : t('grandstream.error'),
        variant: 'destructive'
      });
    }
  };

  // Start/stop monitoring
  const toggleMonitoring = async () => {
    try {
      if (!monitoring) {
        const response = await fetch('/api/grandstream/monitoring/start', {
          method: 'POST'
        });
        const result = await response.json();
        
        if (result.success) {
          setMonitoring(true);
          toast({
            title: t('grandstream.monitoring.started'),
            description: t('grandstream.monitoring.realTimeActive')
          });
        }
      } else {
        setMonitoring(false);
        toast({
          title: t('grandstream.monitoring.stopped'),
          description: t('grandstream.monitoring.realTimeInactive')
        });
      }
    } catch (error) {
      toast({
        title: t('grandstream.monitoring.error'),
        description: error instanceof Error ? error.message : t('grandstream.error'),
        variant: 'destructive'
      });
    }
  };

  // Refresh all data
  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchExtensionsStatus(),
      fetchQueuesStatus(),
      fetchCallHistory(),
      checkConnection()
    ]);
    setLoading(false);
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchExtensionsStatus();
        fetchQueuesStatus();
        checkConnection();
      }, 10000); // Every 10 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchExtensionsStatus, fetchQueuesStatus, checkConnection]);

  // Initial load
  useEffect(() => {
    refreshAll();
    loadSettings();
  }, []);

  // Helper functions
  const getExtensionStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'ringing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getExtensionStatusIcon = (status: string, inCall: boolean) => {
    if (inCall) return <PhoneCall className="h-4 w-4" />;
    switch (status) {
      case 'available': return <UserCheck className="h-4 w-4" />;
      case 'busy': return <UserX className="h-4 w-4" />;
      case 'ringing': return <Phone className="h-4 w-4 animate-pulse" />;
      default: return <UserX className="h-4 w-4" />;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Elite Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-gray-200/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-4 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-700 transform rotate-12 translate-y-1"></div>
              <Router className="h-8 w-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-cyan-600 mb-2 flex items-center gap-3">
                {t('grandstream.dashboard.title') || 'PBX Management'}
                <Badge 
                  variant={connectionStatus === 'connected' ? 'default' : 'destructive'} 
                  className="gap-1 ml-3"
                >
                  <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
                  {connectionStatus === 'connected' ? t('grandstream.connected') : t('grandstream.disconnected')}
                </Badge>
              </h1>
              <p className="text-gray-600 text-lg">
                {t('grandstream.dashboard.subtitle') || 'Grandstream UCM6304A Management System'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`bg-white/80 border-gray-200 hover:bg-white transition-all duration-200 ${autoRefresh ? 'border-cyan-300 bg-cyan-50' : ''}`}
            >
              <Activity className="h-4 w-4 mr-2" />
              {autoRefresh ? t('grandstream.autoRefresh.on') : t('grandstream.autoRefresh.off')}
            </Button>
            <Button
              onClick={refreshAll}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('common.refresh') || 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Connection Alert */}
      {connectionStatus === 'disconnected' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('grandstream.connectionError')}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-slate-100 to-gray-100 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">{t('grandstream.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="extensions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">{t('grandstream.tabs.extensions')}</TabsTrigger>
          <TabsTrigger value="calls" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">{t('grandstream.tabs.calls')}</TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">{t('grandstream.tabs.monitoring')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Extensions Summary */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  {t('grandstream.overview.totalExtensions')}
                </CardTitle>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-2">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{extensions.length}</div>
                <p className="text-xs text-blue-500 mt-1">
                  {extensions.filter(e => e.status === 'available').length} {t('grandstream.overview.available')}
                </p>
              </CardContent>
            </Card>

            {/* Active Calls */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  {t('grandstream.overview.activeCalls')}
                </CardTitle>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-2">
                  <PhoneCall className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{extensions.filter(e => e.inCall).length}</div>
                <p className="text-xs text-green-500 mt-1">
                  {t('grandstream.overview.inProgress')}
                </p>
              </CardContent>
            </Card>

            {/* Queue Waiting */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-600"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
                  {t('grandstream.overview.waitingCalls')}
                </CardTitle>
                <div className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg p-2">
                  <Timer className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{queues.reduce((sum, q) => sum + q.waitingCalls, 0)}</div>
                <p className="text-xs text-orange-500 mt-1">
                  {t('grandstream.overview.inQueues')}
                </p>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">
                  {t('grandstream.overview.systemStatus')}
                </CardTitle>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-2">
                  <Activity className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {connectionStatus === 'connected' ? '✓' : '✗'}
                </div>
                <p className="text-xs text-purple-500 mt-1">
                  {connectionStatus === 'connected' ? t('grandstream.overview.healthy') : t('grandstream.overview.issues')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Queues Status */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-2">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                {t('grandstream.overview.queues')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {queues.map((queue) => (
                  <div key={queue.queueNumber} className="bg-white/60 border border-indigo-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-indigo-700">Queue {queue.queueNumber}</h3>
                      <Badge variant={queue.waitingCalls > 0 ? 'destructive' : 'default'} className="shadow-sm">
                        {queue.waitingCalls} {t('grandstream.overview.waiting')}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-indigo-600">
                      <div>{t('grandstream.overview.availableAgents')}: {queue.availableAgents}</div>
                      <div>{t('grandstream.overview.longestWait')}: {queue.longestWait}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-2">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                {t('grandstream.overview.quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setMakeCallForm(prev => ({ ...prev, show: !prev.show }))}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
                >
                  <PhoneOutgoing className="h-4 w-4" />
                  {t('grandstream.actions.makeCall')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={toggleMonitoring}
                  className="bg-white/80 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 gap-2"
                >
                  {monitoring ? <StopCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  {monitoring ? t('grandstream.monitoring.stop') : t('grandstream.monitoring.start')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSettingsForm(prev => ({ ...prev, show: !prev.show }))}
                  className="bg-white/80 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {t('grandstream.actions.settings')}
                </Button>
              </div>
              
              {/* Make Call Form */}
              {makeCallForm.show && (
                <div className="mt-4 p-4 border rounded-lg space-y-4">
                  <h4 className="font-medium">{t('grandstream.makeCall.title')}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromExtension">{t('grandstream.makeCall.fromExtension')}</Label>
                      <Input
                        id="fromExtension"
                        placeholder="1001"
                        value={makeCallForm.fromExtension}
                        onChange={(e) => setMakeCallForm(prev => ({ ...prev, fromExtension: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="toNumber">{t('grandstream.makeCall.toNumber')}</Label>
                      <Input
                        id="toNumber"
                        placeholder="+1234567890"
                        value={makeCallForm.toNumber}
                        onChange={(e) => setMakeCallForm(prev => ({ ...prev, toNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={makeCall} className="gap-2">
                      <PhoneCall className="h-4 w-4" />
                      {t('grandstream.makeCall.call')}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setMakeCallForm(prev => ({ ...prev, show: false }))}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Settings Form */}
              {settingsForm.show && (
                <div className="mt-4 p-6 border rounded-lg space-y-6 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      {t('grandstream.settings.title')}
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSettingsForm(prev => ({ ...prev, show: false }))}
                    >
                      ✕
                    </Button>
                  </div>

                  <Tabs defaultValue="connection" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="connection">{t('grandstream.settings.connection')}</TabsTrigger>
                      <TabsTrigger value="system">{t('grandstream.settings.system')}</TabsTrigger>
                      <TabsTrigger value="security">{t('grandstream.settings.security')}</TabsTrigger>
                      <TabsTrigger value="maintenance">{t('grandstream.settings.maintenance')}</TabsTrigger>
                    </TabsList>

                    {/* Connection Settings */}
                    <TabsContent value="connection" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="host">{t('grandstream.settings.host')}</Label>
                          <Input
                            id="host"
                            placeholder="192.168.1.100"
                            value={settingsForm.host}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, host: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="port">{t('grandstream.settings.port')}</Label>
                          <Input
                            id="port"
                            placeholder="8088"
                            value={settingsForm.port}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, port: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="username">{t('grandstream.settings.username')}</Label>
                          <Input
                            id="username"
                            placeholder="admin"
                            value={settingsForm.username}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, username: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">{t('grandstream.settings.password')}</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={settingsForm.password}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, password: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={settingsForm.sslEnabled}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, sslEnabled: e.target.checked }))}
                          />
                          {t('grandstream.settings.enableSSL')}
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={testSettings} variant="outline" className="gap-2">
                          <Activity className="h-4 w-4" />
                          {t('grandstream.settings.testConnection')}
                        </Button>
                      </div>
                    </TabsContent>

                    {/* System Settings */}
                    <TabsContent value="system" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="maxConcurrentCalls">{t('grandstream.settings.maxConcurrentCalls')}</Label>
                          <Input
                            id="maxConcurrentCalls"
                            placeholder="200"
                            value={settingsForm.maxConcurrentCalls}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, maxConcurrentCalls: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="callTimeout">{t('grandstream.settings.callTimeout')}</Label>
                          <Input
                            id="callTimeout"
                            placeholder="30"
                            value={settingsForm.callTimeout}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, callTimeout: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="logLevel">{t('grandstream.settings.logLevel')}</Label>
                          <select
                            id="logLevel"
                            className="w-full p-2 border rounded"
                            value={settingsForm.logLevel}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, logLevel: e.target.value }))}
                          >
                            <option value="error">Error</option>
                            <option value="warn">Warning</option>
                            <option value="info">Info</option>
                            <option value="debug">Debug</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={settingsForm.recordCalls}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, recordCalls: e.target.checked }))}
                          />
                          {t('grandstream.settings.recordCalls')}
                        </label>
                      </div>
                    </TabsContent>

                    {/* Security Settings */}
                    <TabsContent value="security" className="space-y-4">
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          {t('grandstream.settings.securityWarning')}
                        </AlertDescription>
                      </Alert>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label>{t('grandstream.settings.currentSecurityStatus')}</Label>
                          <div className="p-3 border rounded bg-green-50">
                            <div className="flex items-center gap-2 text-green-700">
                              <Shield className="h-4 w-4" />
                              {t('grandstream.settings.securityEnabled')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                          <Shield className="h-4 w-4" />
                          {t('grandstream.settings.updateSecurity')}
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Maintenance Settings */}
                    <TabsContent value="maintenance" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="backupInterval">{t('grandstream.settings.backupInterval')}</Label>
                          <select
                            id="backupInterval"
                            className="w-full p-2 border rounded"
                            value={settingsForm.backupInterval}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, backupInterval: e.target.value }))}
                          >
                            <option value="6">{t('grandstream.settings.every6Hours')}</option>
                            <option value="12">{t('grandstream.settings.every12Hours')}</option>
                            <option value="24">{t('grandstream.settings.daily')}</option>
                            <option value="168">{t('grandstream.settings.weekly')}</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={settingsForm.autoBackup}
                            onChange={(e) => setSettingsForm(prev => ({ ...prev, autoBackup: e.target.checked }))}
                          />
                          {t('grandstream.settings.autoBackup')}
                        </label>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h5 className="font-medium">{t('grandstream.settings.systemMaintenance')}</h5>
                        <div className="flex gap-2 flex-wrap">
                          <Button onClick={backupConfig} variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" />
                            {t('grandstream.settings.backupNow')}
                          </Button>
                          <Button onClick={rebootSystem} variant="destructive" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            {t('grandstream.settings.rebootSystem')}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Separator />

                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setSettingsForm(prev => ({ ...prev, show: false }))}
                    >
                      {t('common.cancel')}
                    </Button>
                    <div className="flex gap-2">
                      <Button onClick={testSettings} variant="outline" className="gap-2">
                        <Activity className="h-4 w-4" />
                        {t('grandstream.settings.test')}
                      </Button>
                      <Button onClick={saveSettings} className="gap-2">
                        <Settings className="h-4 w-4" />
                        {t('grandstream.settings.save')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extensions Tab */}
        <TabsContent value="extensions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('grandstream.extensions.title')}
              </CardTitle>
              <CardDescription>
                {t('grandstream.extensions.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {extensions.map((ext) => (
                  <div key={ext.extension} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getExtensionStatusIcon(ext.status, ext.inCall)}
                        <span className="font-medium">Ext. {ext.extension}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getExtensionStatusColor(ext.status)}`} />
                        <Badge variant={ext.registered ? 'default' : 'secondary'}>
                          {ext.registered ? t('grandstream.extensions.registered') : t('grandstream.extensions.unregistered')}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('grandstream.extensions.status')}:</span>
                        <span className="capitalize">{ext.status}</span>
                      </div>
                      {ext.inCall && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('grandstream.extensions.inCall')}:</span>
                          <Badge variant="destructive">{t('grandstream.extensions.busy')}</Badge>
                        </div>
                      )}
                      {ext.lastActivity && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('grandstream.extensions.lastActivity')}:</span>
                          <span>{new Date(ext.lastActivity).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calls Tab */}
        <TabsContent value="calls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {t('grandstream.calls.recentHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {callHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('grandstream.calls.noHistory')}
                  </div>
                ) : (
                  callHistory.map((call, index) => (
                    <div key={`${call.callId}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {call.direction === 'inbound' ? 
                          <PhoneIncoming className="h-4 w-4 text-green-600" /> : 
                          <PhoneOutgoing className="h-4 w-4 text-blue-600" />
                        }
                        <div>
                          <div className="font-medium">{call.from} → {call.to}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(call.startTime).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={call.status === 'ANSWERED' ? 'default' : 'secondary'}>
                          {call.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t('grandstream.monitoring.title')}
              </CardTitle>
              <CardDescription>
                {t('grandstream.monitoring.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t('grandstream.monitoring.realTimeMonitoring')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('grandstream.monitoring.realTimeDescription')}
                  </p>
                </div>
                <Button 
                  onClick={toggleMonitoring}
                  variant={monitoring ? 'destructive' : 'default'}
                  className="gap-2"
                >
                  {monitoring ? <StopCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  {monitoring ? t('grandstream.monitoring.stop') : t('grandstream.monitoring.start')}
                </Button>
              </div>
              
              {monitoring && (
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    {t('grandstream.monitoring.activeMonitoring')}
                  </AlertDescription>
                </Alert>
              )}
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">{t('grandstream.monitoring.systemMetrics')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{extensions.filter(e => e.registered).length}</div>
                    <div className="text-sm text-muted-foreground">{t('grandstream.monitoring.registered')}</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{extensions.filter(e => e.inCall).length}</div>
                    <div className="text-sm text-muted-foreground">{t('grandstream.monitoring.activeCalls')}</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{queues.reduce((sum, q) => sum + q.waitingCalls, 0)}</div>
                    <div className="text-sm text-muted-foreground">{t('grandstream.monitoring.waitingCalls')}</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{queues.reduce((sum, q) => sum + q.availableAgents, 0)}</div>
                    <div className="text-sm text-muted-foreground">{t('grandstream.monitoring.availableAgents')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}