import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Activity, PhoneCall, Router, MessageSquare, Settings, RefreshCw, Headphones, Users, Timer, Phone, AlertCircle } from 'lucide-react';

// The unified PBX Dashboard merges: GrandstreamDashboard (PBX control), CDRConnector (CDR stats), AIAnswering (AI configs)
// We embed simplified versions of each to reduce initial complexity; original pages remain for now until user confirms deprecation.

// Types (subset reused)
interface Extension { extension: string; status: 'available' | 'busy' | 'ringing' | 'offline'; registered: boolean; inCall: boolean; lastActivity?: string; }
interface QueueStatus { queueNumber: string; waitingCalls: number; availableAgents: number; longestWait: number; }
interface CDRRecord { id: string | number; calldate?: string; src?: string; dst?: string; duration?: number; billsec?: number; disposition?: string; actionType?: string; }

export default function PBXDashboard() {
  const { t } = useTranslation();

  // PBX state (subset)
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [queues, setQueues] = useState<QueueStatus[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // CDR state
  const [cdrRecords, setCdrRecords] = useState<CDRRecord[]>([]);
  const [cdrStats, setCdrStats] = useState({ totalCalls: 0, activeCalls: 0, completedCalls: 0, missedCalls: 0 });
  const [cdrPage, setCdrPage] = useState(1);
  const [cdrPages, setCdrPages] = useState(1);
  const [cdrLimit, setCdrLimit] = useState(10);
  const [cdrLoading, setCdrLoading] = useState(false);
  const [cdrError, setCdrError] = useState<string | null>(null);
  const [cdrFilters, setCdrFilters] = useState({ src: '', dst: '', disposition: '', actionType: '', dateFrom: '', dateTo: '' });
  const [cdrDiagnostics, setCdrDiagnostics] = useState<any>(null);
  const [syncLoading, setSyncLoading] = useState(false);

  // AI placeholder (lightweight until deep merge required)
  const [selectedDept, setSelectedDept] = useState('sales');

  // Fetchers (simplified)
  const fetchExtensionsStatus = useCallback(async () => {
    try { const r = await fetch('/api/grandstream/extensions/status'); const j = await r.json(); if (j.success) setExtensions(j.data || []); } catch {}
  }, []);
  const fetchQueuesStatus = useCallback(async () => {
    try { const qNums = ['100','200','300']; const data = await Promise.all(qNums.map(async q => { const r = await fetch(`/api/grandstream/queue/${q}/status`); const j = await r.json(); return j.success ? j.data : { queueNumber: q, waitingCalls: 0, availableAgents: 0, longestWait: 0 }; })); setQueues(data); } catch {}
  }, []);
  const checkConnection = useCallback(async () => {
    try { setConnectionStatus('checking'); const r = await fetch('/api/grandstream/health'); const j = await r.json(); setConnectionStatus(j.success ? 'connected' : 'disconnected'); } catch { setConnectionStatus('disconnected'); }
  }, []);
  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set('page', String(cdrPage));
    params.set('limit', String(cdrLimit));
    Object.entries(cdrFilters).forEach(([k,v]) => { if (v) params.set(k, v); });
    return params.toString();
  };

  const fetchCDR = useCallback(async () => {
    setCdrLoading(true); setCdrError(null);
    try {
      const q = buildQuery();
      const r = await fetch(`/api/cdr/records?${q}`);
      const j = await r.json();
      if (!j.success) throw new Error(j.error || 'CDR fetch failed');
      setCdrRecords(j.data || []);
      // Derive stats if not provided
      const stats = j.stats || {};
      setCdrStats({
        totalCalls: j.pagination?.total || 0,
        activeCalls: (stats.answered || 0) + (stats.completed || 0),
        completedCalls: stats.answered || stats.completed || 0,
        missedCalls: (stats['no answer'] || stats.noanswer || stats.missed || 0)
      });
      setCdrPages(j.pagination?.pages || 1);
    } catch (e:any) {
      setCdrError(e.message);
    } finally { setCdrLoading(false); }
  }, [cdrPage, cdrLimit, cdrFilters]);

  const fetchCDRDiagnostics = useCallback(async () => {
    try {
      const r = await fetch('/api/grandstream/cdr/status');
      const j = await r.json();
      if (j.success) setCdrDiagnostics(j.data);
    } catch (e) {
      console.warn('CDR diagnostics fetch failed:', e);
    }
  }, []);

  const manualSyncCDR = async () => {
    setSyncLoading(true);
    try {
      const r = await fetch('/api/grandstream/cdr/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 100 })
      });
      const j = await r.json();
      if (j.success) {
        // Refresh CDR data and diagnostics
        await Promise.all([fetchCDR(), fetchCDRDiagnostics()]);
        alert(`✅ Synced ${j.synced} records from UCM`);
      } else {
        alert(`❌ Sync failed: ${j.error}`);
      }
    } catch (e: any) {
      alert(`❌ Sync error: ${e.message}`);
    } finally {
      setSyncLoading(false);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchExtensionsStatus(), fetchQueuesStatus(), checkConnection(), fetchCDR(), fetchCDRDiagnostics()]);
    setLoading(false);
  };

  useEffect(() => { refreshAll(); }, []);
  useEffect(() => { if (autoRefresh) { const id = setInterval(() => { fetchExtensionsStatus(); fetchQueuesStatus(); fetchCDR(); fetchCDRDiagnostics(); }, 15000); return () => clearInterval(id); } }, [autoRefresh, fetchExtensionsStatus, fetchQueuesStatus, fetchCDR, fetchCDRDiagnostics]);
  useEffect(() => { fetchCDR(); }, [fetchCDR]);

  const getStatusBadge = () => (
    <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'} className="gap-1">
      <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
      {connectionStatus === 'connected' ? t('grandstream.connected') : t('grandstream.disconnected')}
    </Badge>
  );

  const formatDuration = (s: number) => { const m = Math.floor(s/60); const sec = s%60; return `${m}:${sec.toString().padStart(2,'0')}`; };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl border border-gray-200/50 p-8">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-4 relative overflow-hidden shadow-lg">
              <Router className="h-8 w-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-indigo-600 mb-2 flex items-center gap-4">
                {t('pbx.unified.title')}
                {getStatusBadge()}
              </h1>
              <p className="text-gray-600 text-lg">{t('pbx.unified.subtitle')} ✨</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setAutoRefresh(a => !a)} className={autoRefresh ? 'border-indigo-300 bg-indigo-50' : ''}>
              <Activity className="h-4 w-4 mr-2" />
              {autoRefresh ? t('grandstream.autoRefresh.on') : t('grandstream.autoRefresh.off')}
            </Button>
            <Button onClick={refreshAll} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {t('common.refresh') || 'تحديث'}
            </Button>
          </div>
        </div>
      </div>

      {connectionStatus === 'disconnected' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t('grandstream.connectionError')}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-slate-100 to-gray-100 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="overview">{t('pbx.unified.tabs.overview') || 'Overview'}</TabsTrigger>
          <TabsTrigger value="extensions">{t('grandstream.tabs.extensions')}</TabsTrigger>
          {/* Removed obsolete 'calls' tab to avoid duplicate call log buttons; unified under CDR */}
          <TabsTrigger value="monitoring">{t('grandstream.tabs.monitoring')}</TabsTrigger>
          <TabsTrigger value="cdr">{t('pbx.unified.tabs.cdr')}</TabsTrigger>
          <TabsTrigger value="ai">{t('pbx.unified.tabs.ai') || 'AI'}</TabsTrigger>
        </TabsList>

        {/* Overview (was pbx) */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow bg-white/80">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{t('grandstream.overview.totalExtensions')}</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{extensions.length}</div></CardContent>
            </Card>
            <Card className="shadow bg-white/80">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{t('grandstream.overview.activeCalls')}</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-green-600">{extensions.filter(e=>e.inCall).length}</div></CardContent>
            </Card>
            <Card className="shadow bg-white/80">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{t('grandstream.overview.waitingCalls')}</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-orange-600">{queues.reduce((s,q)=>s+q.waitingCalls,0)}</div></CardContent>
            </Card>
            <Card className="shadow bg-white/80">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{t('grandstream.overview.availableAgents')}</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-indigo-600">{queues.reduce((s,q)=>s+q.availableAgents,0)}</div></CardContent>
            </Card>
          </div>

          <Card className="bg-white/80">
            <CardHeader><CardTitle className="flex items-center gap-2"><Headphones className="h-5 w-5" />{t('grandstream.overview.queues')}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {queues.map(q => (
                  <div key={q.queueNumber} className="p-4 rounded-lg border bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{t('grandstream.overview.queueLabel')} {q.queueNumber}</span>
                      <Badge variant={q.waitingCalls>0 ? 'destructive':'secondary'}>{q.waitingCalls}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{t('grandstream.overview.availableAgents')}: {q.availableAgents}</div>
                      <div>{t('grandstream.overview.longestWait')}: {q.longestWait}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extensions */}
        <TabsContent value="extensions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />{t('grandstream.extensions.title') || 'Extensions'}</CardTitle>
              <CardDescription>{t('grandstream.extensions.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {extensions.map(ext => (
                  <div key={ext.extension} className="p-4 border rounded-lg bg-white/70">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t('grandstream.extensions.short')} {ext.extension}</span>
                      <Badge variant={ext.registered ? 'default':'secondary'}>{ext.registered ? t('grandstream.extensions.registered') : t('grandstream.extensions.unregistered')}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{t('grandstream.extensions.status')}: {ext.status}</div>
                      {ext.inCall && <div className="text-red-600 font-medium">{t('grandstream.extensions.busy')}</div>}
                      {ext.lastActivity && <div>{t('grandstream.extensions.lastActivity')}: {new Date(ext.lastActivity).toLocaleTimeString()}</div>}
                    </div>
                  </div>
                ))}
                {extensions.length === 0 && <div className="text-sm text-muted-foreground col-span-full text-center py-8">{t('grandstream.extensions.none') || 'No extensions loaded'}</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Removed obsolete 'calls' tab that used outdated CDR record fields */}

        {/* Monitoring (lightweight) */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />{t('grandstream.monitoring.title') || 'Monitoring'}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg bg-white/70">
                  <div className="text-xl font-bold text-green-600">{extensions.filter(e=>e.registered).length}</div>
                  <div className="text-xs text-muted-foreground">{t('grandstream.monitoring.registered')}</div>
                </div>
                <div className="text-center p-3 border rounded-lg bg-white/70">
                  <div className="text-xl font-bold text-blue-600">{extensions.filter(e=>e.inCall).length}</div>
                  <div className="text-xs text-muted-foreground">{t('grandstream.monitoring.activeCalls')}</div>
                </div>
                <div className="text-center p-3 border rounded-lg bg-white/70">
                  <div className="text-xl font-bold text-orange-600">{queues.reduce((s,q)=>s+q.waitingCalls,0)}</div>
                  <div className="text-xs text-muted-foreground">{t('grandstream.monitoring.waitingCalls')}</div>
                </div>
                <div className="text-center p-3 border rounded-lg bg-white/70">
                  <div className="text-xl font-bold text-purple-600">{queues.reduce((s,q)=>s+q.availableAgents,0)}</div>
                  <div className="text-xs text-muted-foreground">{t('grandstream.monitoring.availableAgents')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Existing CDR and AI tabs remain below (no change) */}
        {/* CDR Tab */}
        <TabsContent value="cdr" className="space-y-6">
          {/* CDR Diagnostics and Sync */}
          {cdrDiagnostics && (
            <Card className="bg-white/80">
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>CDR Connection Status</span>
                  <Button onClick={manualSyncCDR} disabled={syncLoading} size="sm" variant="outline" className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${syncLoading ? 'animate-spin' : ''}`} />
                    {syncLoading ? 'Syncing...' : 'Fetch from UCM'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-gray-600">Total Records</div>
                    <div className="text-lg font-bold">{cdrDiagnostics.totalRecords}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-600">Today's Calls</div>
                    <div className="text-lg font-bold text-blue-600">{cdrDiagnostics.todayRecords}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-600">Last Record</div>
                    <div className="text-sm">{cdrDiagnostics.lastRecord ? new Date(cdrDiagnostics.lastRecord.time).toLocaleTimeString() : 'None'}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-600">Health</div>
                    <Badge variant={cdrDiagnostics.ingestionHealth === 'healthy' ? 'default' : 'destructive'}>
                      {cdrDiagnostics.ingestionHealth}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">{t('cdr.stats.totalCalls')}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{cdrStats.totalCalls}</div></CardContent></Card>
            <Card className="bg-white/80 shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">{t('cdr.stats.activeCalls')}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{cdrStats.activeCalls}</div></CardContent></Card>
            <Card className="bg-white/80 shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">{t('cdr.stats.completedCalls')}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{cdrStats.completedCalls}</div></CardContent></Card>
            <Card className="bg-white/80 shadow"><CardHeader className="pb-2"><CardTitle className="text-sm">{t('cdr.stats.missedCalls')}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{cdrStats.missedCalls}</div></CardContent></Card>
          </div>
          {/* Filters */}
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-sm">{t('cdr.filters.title') || 'Filters'}</CardTitle>
              <CardDescription>{t('cdr.filters.subtitle') || 'Filter call records'}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={e=>{e.preventDefault(); setCdrPage(1); fetchCDR();}} className="grid md:grid-cols-6 gap-4">
                <div className="col-span-1 flex flex-col gap-1">
                  <label className="text-xs font-medium">{t('cdr.filters.src') || 'From'}</label>
                  <input className="border rounded px-2 py-1 text-sm" aria-label={t('cdr.filters.src')} title={t('cdr.filters.src')} value={cdrFilters.src} onChange={e=>setCdrFilters(f=>({...f,src:e.target.value}))} />
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <label className="text-xs font-medium">{t('cdr.filters.dst') || 'To'}</label>
                  <input className="border rounded px-2 py-1 text-sm" aria-label={t('cdr.filters.dst')} title={t('cdr.filters.dst')} value={cdrFilters.dst} onChange={e=>setCdrFilters(f=>({...f,dst:e.target.value}))} />
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <label className="text-xs font-medium">{t('cdr.filters.disposition') || 'Status'}</label>
                  <select className="border rounded px-2 py-1 text-sm" aria-label={t('cdr.filters.disposition')} title={t('cdr.filters.disposition')} value={cdrFilters.disposition} onChange={e=>setCdrFilters(f=>({...f,disposition:e.target.value}))}>
                    <option value="">{t('cdr.filters.any') || 'Any'}</option>
                    <option value="ANSWERED">ANSWERED</option>
                    <option value="NO ANSWER">NO ANSWER</option>
                    <option value="BUSY">BUSY</option>
                  </select>
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <label className="text-xs font-medium">{t('cdr.filters.actionType') || 'Action'}</label>
                  <input className="border rounded px-2 py-1 text-sm" aria-label={t('cdr.filters.actionType')} title={t('cdr.filters.actionType')} value={cdrFilters.actionType} onChange={e=>setCdrFilters(f=>({...f,actionType:e.target.value}))} />
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <label className="text-xs font-medium">{t('cdr.filters.dateFrom') || 'From Date'}</label>
                  <input type="date" className="border rounded px-2 py-1 text-sm" aria-label={t('cdr.filters.dateFrom')} title={t('cdr.filters.dateFrom')} value={cdrFilters.dateFrom} onChange={e=>setCdrFilters(f=>({...f,dateFrom:e.target.value}))} />
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <label className="text-xs font-medium">{t('cdr.filters.dateTo') || 'To Date'}</label>
                  <input type="date" className="border rounded px-2 py-1 text-sm" aria-label={t('cdr.filters.dateTo')} title={t('cdr.filters.dateTo')} value={cdrFilters.dateTo} onChange={e=>setCdrFilters(f=>({...f,dateTo:e.target.value}))} />
                </div>
                <div className="col-span-full flex items-center gap-2 pt-2">
                  <Button type="submit" size="sm" disabled={cdrLoading}>{t('cdr.filters.search') || 'Search'}</Button>
                  <Button type="button" variant="outline" size="sm" onClick={()=>{setCdrFilters({src:'',dst:'',disposition:'',actionType:'',dateFrom:'',dateTo:''}); setCdrPage(1); fetchCDR();}}>{t('cdr.filters.reset') || 'Reset'}</Button>
                  <div className="text-xs text-muted-foreground ml-auto">
                    {cdrLoading ? t('cdr.filters.loading') || 'Loading...' : t('cdr.filters.results', { count: cdrStats.totalCalls.toString() }) || `${cdrStats.totalCalls} results`}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PhoneCall className="h-5 w-5" />{t('cdr.recentCalls')}</CardTitle>
              <CardDescription>{t('cdr.recentCallsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {cdrError && <div className="text-sm text-red-600 py-4">{cdrError}</div>}
              {!cdrError && cdrRecords.length === 0 && !cdrLoading && (
                <div className="text-center py-8 text-muted-foreground">{connectionStatus==='connected'? t('cdr.noRecords') : t('cdr.connectFirst')}</div>
              )}
              {cdrLoading && <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">{t('cdr.filters.loading') || 'Loading...'}</div>}
              {!cdrLoading && cdrRecords.length > 0 && (
                <div className="relative max-h-96 overflow-auto rounded-md border">
                  <table className="min-w-full text-xs">
                    <thead className="text-xs">
                      <tr className="text-left bg-gray-50/90 backdrop-blur-sm">
                        <th className="py-2 px-2 font-medium sticky top-0 bg-gray-50/95 border-b z-10">{t('cdr.filters.time') || 'Time'}</th>
                        <th className="py-2 px-2 font-medium sticky top-0 bg-gray-50/95 border-b z-10">{t('cdr.filters.src') || 'From'}</th>
                        <th className="py-2 px-2 font-medium sticky top-0 bg-gray-50/95 border-b z-10">{t('cdr.filters.dst') || 'To'}</th>
                        <th className="py-2 px-2 font-medium sticky top-0 bg-gray-50/95 border-b z-10">{t('cdr.filters.disposition') || 'Status'}</th>
                        <th className="py-2 px-2 font-medium sticky top-0 bg-gray-50/95 border-b z-10">{t('cdr.filters.actionType') || 'Action'}</th>
                        <th className="py-2 px-2 font-medium sticky top-0 bg-gray-50/95 border-b z-10">{t('cdr.filters.duration') || 'Dur'}</th>
                        <th className="py-2 px-2 font-medium sticky top-0 bg-gray-50/95 border-b z-10">{t('cdr.filters.billsec') || 'Bill'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cdrRecords.map(r => (
                        <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-1 px-2 whitespace-nowrap">{r.calldate ? new Date(r.calldate).toLocaleString() : '-'}</td>
                          <td className="py-1 px-2">{r.src || '-'}</td>
                          <td className="py-1 px-2">{r.dst || '-'}</td>
                          <td className="py-1 px-2">{r.disposition || '-'}</td>
                          <td className="py-1 px-2">{r.actionType || '-'}</td>
                          <td className="py-1 px-2">{typeof r.duration === 'number' ? formatDuration(r.duration) : '-'}</td>
                          <td className="py-1 px-2">{typeof r.billsec === 'number' ? formatDuration(r.billsec) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2 justify-end mt-4 text-xs">
                    <span>{cdrPage} / {cdrPages}</span>
                    <Button variant="outline" size="sm" disabled={cdrPage<=1} onClick={()=>setCdrPage(p=>p-1)}>«</Button>
                    <Button variant="outline" size="sm" disabled={cdrPage>=cdrPages} onClick={()=>setCdrPage(p=>p+1)}>»</Button>
                    <select className="border rounded px-1 py-1" aria-label={t('cdr.filters.pageSize') || 'Page size'} title={t('cdr.filters.pageSize') || 'Page size'} value={cdrLimit} onChange={e=>{setCdrLimit(parseInt(e.target.value)); setCdrPage(1);}}>
                      {[10,25,50,100].map(n=> <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tab (minimal) */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />{t('aiAnswering.title') || 'AI Answering System'}</CardTitle>
              <CardDescription>{t('aiAnswering.subtitle') || 'Configure automated responses for each department'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {['sales','hr','marketing','manufacturing','support'].map(dep => (
                  <Button key={dep} variant={selectedDept===dep? 'default':'outline'} size="sm" onClick={()=>setSelectedDept(dep)}>
                    {t(`departments.${dep}`)}
                  </Button>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">{t('aiAnswering.messageSetup.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('aiAnswering.messageSetup.aiGeneration.description')}</p>
                <div className="p-3 border rounded bg-gray-50 text-sm">
                  {t('aiAnswering.departments.defaultMessages.'+selectedDept) || '...'}
                </div>
              </div>
              <Alert>
                <AlertDescription className="text-xs">
                  {t('pbx.unified.ai.lightNotice') || 'هذه نسخة مبسطة. سيتم دمج الميزات الكاملة لاحقاً حسب الحاجة.'}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
