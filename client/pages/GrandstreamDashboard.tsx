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
  AlertCircle
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

  // Auto-refresh interval
  const [autoRefresh, setAutoRefresh] = useState(true);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Router className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('grandstream.dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('grandstream.dashboard.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={connectionStatus === 'connected' ? 'default' : 'destructive'} 
            className="gap-1"
          >
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
            {connectionStatus === 'connected' ? t('grandstream.connected') : t('grandstream.disconnected')}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <Activity className="h-4 w-4 mr-2" />
            {autoRefresh ? t('grandstream.autoRefresh.on') : t('grandstream.autoRefresh.off')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('grandstream.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="extensions">{t('grandstream.tabs.extensions')}</TabsTrigger>
          <TabsTrigger value="calls">{t('grandstream.tabs.calls')}</TabsTrigger>
          <TabsTrigger value="monitoring">{t('grandstream.tabs.monitoring')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Extensions Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('grandstream.overview.totalExtensions')}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{extensions.length}</div>
                <p className="text-xs text-muted-foreground">
                  {extensions.filter(e => e.status === 'available').length} {t('grandstream.overview.available')}
                </p>
              </CardContent>
            </Card>

            {/* Active Calls */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('grandstream.overview.activeCalls')}
                </CardTitle>
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{extensions.filter(e => e.inCall).length}</div>
                <p className="text-xs text-muted-foreground">
                  {t('grandstream.overview.inProgress')}
                </p>
              </CardContent>
            </Card>

            {/* Queue Waiting */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('grandstream.overview.waitingCalls')}
                </CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{queues.reduce((sum, q) => sum + q.waitingCalls, 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {t('grandstream.overview.inQueues')}
                </p>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('grandstream.overview.systemStatus')}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {connectionStatus === 'connected' ? '✓' : '✗'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {connectionStatus === 'connected' ? t('grandstream.overview.healthy') : t('grandstream.overview.issues')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Queues Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                {t('grandstream.overview.queues')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {queues.map((queue) => (
                  <div key={queue.queueNumber} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Queue {queue.queueNumber}</h3>
                      <Badge variant={queue.waitingCalls > 0 ? 'destructive' : 'default'}>
                        {queue.waitingCalls} {t('grandstream.overview.waiting')}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>{t('grandstream.overview.availableAgents')}: {queue.availableAgents}</div>
                      <div>{t('grandstream.overview.longestWait')}: {queue.longestWait}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {t('grandstream.overview.quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setMakeCallForm(prev => ({ ...prev, show: !prev.show }))}
                  className="gap-2"
                >
                  <PhoneOutgoing className="h-4 w-4" />
                  {t('grandstream.actions.makeCall')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={toggleMonitoring}
                  className="gap-2"
                >
                  {monitoring ? <StopCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  {monitoring ? t('grandstream.monitoring.stop') : t('grandstream.monitoring.start')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('/settings', '_blank')}
                  className="gap-2"
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