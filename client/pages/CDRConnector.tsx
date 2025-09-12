// DEPRECATED: Unified into PBXDashboard (/pbx) which contains CDR + PBX + AI.
// This file remains for transition/testing and will be removed after confirmation.
// NOTE: This file was rewritten to remove hidden encoding (UTF-16 / BOM) issues that caused
// 'Unexpected character �' in Vite/SWC. Ensure any future edits save as UTF-8 without BOM.

import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Phone, PhoneCall, Clock, Users, ArrowUpRight, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface CDRRecord {
  id: string;
  caller: string;
  callee: string;
  duration: number;
  timestamp: string;
  status: 'completed' | 'missed' | 'busy';
}

export default function CDRConnector() {
  const { t } = useTranslation();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [cdrRecords, setCdrRecords] = useState<CDRRecord[]>([]);
  const [stats, setStats] = useState({
    totalCalls: 150,
    activeCalls: 3,
    completedCalls: 142,
    missedCalls: 8
  });

  useEffect(() => {
    checkConnectionStatus();
    loadCDRRecords();
    const interval = setInterval(() => {
      checkConnectionStatus();
      loadCDRRecords();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/cdr/status');
      const data = await response.json();
      setConnectionStatus(data.status || 'disconnected');
      if (data.stats) setStats(data.stats);
    } catch (error) {
      console.error('Failed to check CDR status:', error);
      setConnectionStatus('disconnected');
    }
  };

  const loadCDRRecords = async () => {
    try {
      const response = await fetch('/api/cdr/records?limit=10');
      const data = await response.json();
      setCdrRecords(
        data.records || [
          {
            id: '1',
            caller: '1001',
            callee: '1002',
            duration: 125,
            timestamp: new Date().toISOString(),
            status: 'completed'
          },
            {
            id: '2',
            caller: '1003',
            callee: '200',
            duration: 0,
            timestamp: new Date(Date.now() - 300000).toISOString(),
            status: 'missed'
          }
        ]
      );
    } catch (error) {
      console.error('Failed to load CDR records:', error);
    }
  };

  const getStatusColor = (status: typeof connectionStatus) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStatusText = (status: typeof connectionStatus) => {
    switch (status) {
      case 'connected':
        return t('cdr.status.connected') || 'متصل';
      case 'connecting':
        return t('cdr.status.connecting') || 'جاري الاتصال';
      default:
        return t('cdr.status.disconnected') || 'غير متصل';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const refreshData = () => {
    setConnectionStatus('connecting');
    checkConnectionStatus();
    loadCDRRecords();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="h-8 w-8 text-indigo-600" />
              {t('cdr.dashboard.title') || 'لوحة مراقبة المكالمات'}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('cdr.dashboard.subtitle') || 'مراقبة ومتابعة المكالمات والإحصائيات في الوقت الفعلي'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`${getStatusColor(connectionStatus)} text-white border-none px-3 py-1`}
            >
              {getStatusText(connectionStatus)}
            </Badge>
            <Button variant="outline" size="sm" onClick={refreshData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {t('common.refresh') || 'تحديث'}
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/cdr-settings')}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {t('cdr.settings') || 'إعدادات الاتصال'}
            </Button>
          </div>
        </div>

        {connectionStatus === 'disconnected' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {t('cdr.alerts.disconnected') || 'غير متصل بنظام CDR. يرجى التحقق من إعدادات الاتصال.'}
              <Button
                variant="link"
                className="text-red-600 p-0 ml-2 h-auto"
                onClick={() => (window.location.href = '/cdr-settings')}
              >
                {t('cdr.settings') || 'إعدادات الاتصال'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('cdr.stats.totalCalls') || 'إجمالي المكالمات'}
              </CardTitle>
              <Phone className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
              <p className="text-xs text-muted-foreground">{t('cdr.stats.today') || 'اليوم'}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('cdr.stats.activeCalls') || 'المكالمات النشطة'}
              </CardTitle>
              <PhoneCall className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeCalls}</div>
              <p className="text-xs text-muted-foreground">{t('cdr.stats.ongoing') || 'جارية الآن'}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('cdr.stats.completedCalls') || 'المكالمات المكتملة'}
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.completedCalls}</div>
              <p className="text-xs text-muted-foreground">{t('cdr.stats.successful') || 'مكتملة بنجاح'}</p>
            </CardContent>
          </Card>
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('cdr.stats.missedCalls') || 'المكالمات المفقودة'}
              </CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.missedCalls}</div>
              <p className="text-xs text-muted-foreground">{t('cdr.stats.unanswered') || 'غير مجابة'}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              {t('cdr.recentCalls') || 'المكالمات الأخيرة'}
            </CardTitle>
            <CardDescription>{t('cdr.recentCallsDesc') || 'آخر 10 مكالمات في النظام'}</CardDescription>
          </CardHeader>
          <CardContent>
            {cdrRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {connectionStatus === 'connected'
                  ? t('cdr.noRecords') || 'لا توجد مكالمات حديثة'
                  : t('cdr.connectFirst') || 'يرجى الاتصال بنظام CDR أولاً'}
              </div>
            ) : (
              <div className="space-y-3">
                {cdrRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {record.caller} → {record.callee}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(record.timestamp).toLocaleString('ar-EG')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={record.status === 'completed' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {record.status === 'completed'
                          ? 'مكتملة'
                          : record.status === 'missed'
                          ? 'مفقودة'
                          : 'مشغول'}
                      </Badge>
                      <span className="text-sm text-gray-500 min-w-[50px] text-right">
                        {formatDuration(record.duration)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
