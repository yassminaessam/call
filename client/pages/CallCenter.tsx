import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/contexts/TranslationContext";
import { 
  Phone, 
  PhoneCall, 
  Clock, 
  Calendar,
  User,
  Play,
  Pause,
  Download,
  Upload,
  MessageSquare,
  Bell,
  Search,
  Filter,
  Plus,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  BarChart3,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Bot,
  Languages,
  Headphones,
  FileText,
  Eye,
  Send,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Call {
  id: string;
  from: string;
  to: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'missed' | 'ongoing' | 'failed';
  duration: number;
  startTime: string;
  endTime?: string;
  recording?: {
    url: string;
    duration: number;
    format: string;
  };
  transcription?: {
    text: string;
    confidence: number;
    language: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
  };
  aiAnalysis?: {
    summary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    intent: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
  aiReply?: {
    text: string;
    tone: string;
    voiceGenerated?: {
      url: string;
      duration: number;
    };
  };
}

export default function CallCenter() {
  const { toast } = useToast();
  const { t, language } = useTranslation();

  // Debug translations
  React.useEffect(() => {
    console.log('🌐 CallCenter language:', language);
    console.log('🌐 CallCenter title translation:', t('callCenter.title'));
    console.log('🌐 CallCenter subtitle translation:', t('callCenter.subtitle'));
  }, [language, t]);
  const [isOnCall, setIsOnCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [processingStatus, setProcessingStatus] = useState<any>(null);
  const [calls, setCalls] = useState<Call[]>([
    {
      id: 'CA12345',
      from: '+20100000000',
      to: '+1234567890',
      direction: 'inbound',
      status: 'completed',
      duration: 120,
      startTime: '2024-01-20T10:30:00Z',
      endTime: '2024-01-20T10:32:00Z',
      recording: {
        url: 'https://example.com/recording1.mp3',
        duration: 120,
        format: 'mp3'
      },
      transcription: {
        text: 'مرحباً، أريد الاستفسار عن منتجاتكم الجديدة وأسعارها.',
        confidence: 0.95,
        language: 'ar-SA',
        status: 'completed'
      },
      aiAnalysis: {
        summary: 'العميل يستفسر عن المنتجات الجديدة والأسعار',
        sentiment: 'positive',
        intent: 'product_inquiry',
        category: 'sales',
        priority: 'medium'
      },
      aiReply: {
        text: 'شكراً لاتصالك بنا. سنرسل لك كتالوج المنتجات الجديدة مع الأسعار خلال ساعة.',
        tone: 'professional',
        voiceGenerated: {
          url: 'https://example.com/response1.mp3',
          duration: 8
        }
      }
    }
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    direction: 'all',
    department: 'all',
    dateRange: 'today'
  });

  useEffect(() => {
    fetchCalls();
  }, [filters]);

  const fetchCalls = async () => {
    try {
      // Simulate API call
      console.log('Fetching calls with filters:', filters);
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  const handleStartCall = () => {
    setIsOnCall(true);
    setCallDuration(0);

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    (window as any).callTimer = timer;

    toast({
      title: t('callCenter.callStarted'),
      description: t('callCenter.callRecordingActive'),
    });
  };

  const handleEndCall = () => {
    if ((window as any).callTimer) {
      clearInterval((window as any).callTimer);
    }
    setIsOnCall(false);

    toast({
      title: t('callCenter.callEnded'),
      description: `${t('common.duration')}: ${Math.floor(callDuration / 60)}:${String(callDuration % 60).padStart(2, '0')}`,
    });

    // Simulate creating new call record
    const newCall: Call = {
      id: `CA${Date.now()}`,
      from: '+1234567890',
      to: '+20100000000',
      direction: 'outbound',
      status: 'completed',
      duration: callDuration,
      startTime: new Date(Date.now() - callDuration * 1000).toISOString(),
      endTime: new Date().toISOString(),
      recording: {
        url: `https://example.com/recording${Date.now()}.mp3`,
        duration: callDuration,
        format: 'mp3'
      }
    };

    setCalls(prev => [newCall, ...prev]);
    setCallDuration(0);
  };

  const processCall = async (callId: string, force = false) => {
    try {
      setProcessingStatus({ callId, status: 'processing' });
      
      // Simulate API call to process call
      const response = await fetch(`/api/webhooks/process-call/${callId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force })
      });

      if (response.ok) {
        toast({
          title: t('callCenter.call.transcriptionStarted'),
          description: t('callCenter.call.transcriptionStarted'),
        });
        
        // Simulate processing updates
        setTimeout(() => {
          setProcessingStatus({ callId, status: 'transcription' });
        }, 2000);
        
        setTimeout(() => {
          setProcessingStatus({ callId, status: 'ai_analysis' });
        }, 5000);
        
        setTimeout(() => {
          setProcessingStatus({ callId, status: 'completed' });
          
          // Update call with processed data
          setCalls(prev => prev.map(call => {
            if (call.id === callId) {
              return {
                ...call,
                transcription: {
                  text: 'مرحباً، أريد معرفة المزيد عن خدماتكم',
                  confidence: 0.92,
                  language: 'ar-SA',
                  status: 'completed'
                },
                aiAnalysis: {
                  summary: 'العميل يستفسر عن الخدمات المتاحة',
                  sentiment: 'positive',
                  intent: 'service_inquiry',
                  category: 'support',
                  priority: 'medium'
                },
                aiReply: {
                  text: 'شكراً لاتصالك. سيتواصل معك أحد ممثلي خدمة العملاء خلال 30 دقيقة.',
                  tone: 'professional'
                }
              };
            }
            return call;
          }));
          
          toast({
            title: t('callCenter.call.transcriptionCompleted'),
            description: t('callCenter.call.transcriptionCompleted'),
          });
        }, 8000);
      }
    } catch (error) {
      console.error('Error processing call:', error);
      toast({
        title: t('common.error'),
        description: t('common.error'),
        variant: "destructive",
      });
    }
  };

  const regenerateAIResponse = async (callId: string) => {
    try {
      toast({
        title: t('callCenter.call.regenerate'),
        description: t('callCenter.call.regenerate'),
      });
      
      // Simulate API call
      setTimeout(() => {
        setCalls(prev => prev.map(call => {
          if (call.id === callId) {
            return {
              ...call,
              aiReply: {
                text: 'شكراً لتواصلك معنا. نقدر اهتمامك وسنعمل على توفير أفضل الحلول لك.',
                tone: 'friendly',
                voiceGenerated: {
                  url: 'https://example.com/new-response.mp3',
                  duration: 10
                }
              }
            };
          }
          return call;
        }));
        
        toast({
          title: t('common.success'),
          description: t('common.success'),
        });
      }, 3000);
    } catch (error) {
      console.error('Error regenerating response:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: t('callCenter.statuses.completed'), variant: 'default' as const },
      missed: { label: t('callCenter.statuses.missed'), variant: 'destructive' as const },
      ongoing: { label: t('callCenter.statuses.ongoing'), variant: 'secondary' as const },
      failed: { label: t('callCenter.statuses.failed'), variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'inbound' ? 
      <PhoneIncoming className="h-4 w-4 text-green-600" /> : 
      <PhoneOutgoing className="h-4 w-4 text-blue-600" />;
  };

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-gray-600'
    };
    return colors[sentiment as keyof typeof colors] || colors.neutral;
  };

  const getSentimentLabel = (sentiment: string) => {
    const sentiments = {
      positive: t('callCenter.sentiments.positive'),
      negative: t('callCenter.sentiments.negative'),
      neutral: t('callCenter.sentiments.neutral')
    };
    return sentiments[sentiment as keyof typeof sentiments] || sentiment;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityLabel = (priority: string) => {
    const priorities = {
      urgent: t('callCenter.priorities.urgent'),
      high: t('callCenter.priorities.high'),
      medium: t('callCenter.priorities.medium'),
      low: t('callCenter.priorities.low')
    };
    return priorities[priority as keyof typeof priorities] || priority;
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Elite Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-gray-200/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-600"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-4 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-700 transform rotate-12 translate-y-1"></div>
              <Headphones className="h-8 w-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-600 mb-2 flex items-center gap-3">
                {t('callCenter.title') || 'Call Center'}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('callCenter.subtitle') || 'Advanced Call Management System'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => processCall('all')} 
              variant="outline"
              className="bg-white/80 border-gray-200 hover:bg-white hover:border-green-300 hover:shadow-md transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('callCenter.processAllCalls') || 'Process All Calls'}
            </Button>
            <Button 
              onClick={isOnCall ? handleEndCall : handleStartCall}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isOnCall ? (
                <>
                  <PhoneCall className="h-4 w-4 mr-2" />
                  {t('callCenter.endCall') || 'End Call'}
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  {t('callCenter.startNewCall') || 'Start New Call'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOnCall && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Phone className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>{t('callCenter.call.processing')} - {t('common.duration')}: {formatDuration(callDuration)}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <Mic className="h-3 w-3 mr-1" />
                  {t('callCenter.call.recording')}
                </Badge>
                <Badge variant="outline">
                  <Bot className="h-3 w-3 mr-1" />
                  {t('callCenter.call.aiAnalysis')}
                </Badge>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="calls" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <TabsTrigger 
            value="calls" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('callCenter.tabs.callLog') || 'Call Log'}
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('callCenter.tabs.analytics') || 'Analytics'}
          </TabsTrigger>
          <TabsTrigger 
            value="ai-responses"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('callCenter.tabs.aiResponses') || 'AI Responses'}
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('callCenter.tabs.settings') || 'Settings'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calls">
          <div className="grid gap-6">
            {/* Elite Filters Card */}
            <Card className="bg-white/80 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200/50">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  {t('callCenter.filters.title') || 'Filter Calls'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="status">{t('callCenter.filters.status')}</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('callCenter.filters.allStatuses')}</SelectItem>
                        <SelectItem value="completed">{t('callCenter.statuses.completed')}</SelectItem>
                        <SelectItem value="missed">{t('callCenter.statuses.missed')}</SelectItem>
                        <SelectItem value="ongoing">{t('callCenter.statuses.ongoing')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="direction">{t('callCenter.filters.direction')}</Label>
                    <Select value={filters.direction} onValueChange={(value) => setFilters(prev => ({ ...prev, direction: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('callCenter.filters.allDirections')}</SelectItem>
                        <SelectItem value="inbound">{t('callCenter.directions.inbound')}</SelectItem>
                        <SelectItem value="outbound">{t('callCenter.directions.outbound')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">{t('callCenter.filters.department')}</Label>
                    <Select value={filters.department} onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('callCenter.filters.allDepartments')}</SelectItem>
                        <SelectItem value="sales">{t('nav.sales')}</SelectItem>
                        <SelectItem value="support">{t('nav.support')}</SelectItem>
                        <SelectItem value="hr">{t('nav.hr')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateRange">{t('callCenter.filters.dateRange')}</Label>
                    <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">{t('callCenter.filters.today')}</SelectItem>
                        <SelectItem value="week">{t('callCenter.filters.thisWeek')}</SelectItem>
                        <SelectItem value="month">{t('callCenter.filters.thisMonth')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Elite Call List */}
            <div className="grid gap-4">
              {calls.map((call) => (
                <Card key={call.id} className="bg-white border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-blue-300/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-600"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getDirectionIcon(call.direction)}
                        <div>
                          <div className="font-medium">{call.from} → {call.to}</div>
                          <div className="text-sm text-muted-foreground">
                            {t('callCenter.call.callId')}: {call.id}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(call.status)}
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(call.duration)}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-4">
                      {formatDateTime(call.startTime)}
                    </div>

                    {/* Processing Status */}
                    {processingStatus?.callId === call.id && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span className="font-medium">{t('callCenter.call.processing')}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {processingStatus.status === 'processing' && t('callCenter.call.processingSteps.loadingRecording')}
                          {processingStatus.status === 'transcription' && t('callCenter.call.processingSteps.convertingToText')}
                          {processingStatus.status === 'ai_analysis' && t('callCenter.call.processingSteps.aiAnalyzing')}
                          {processingStatus.status === 'completed' && t('callCenter.call.processingSteps.completed')}
                        </div>
                        <Progress value={
                          processingStatus.status === 'processing' ? 25 :
                          processingStatus.status === 'transcription' ? 50 :
                          processingStatus.status === 'ai_analysis' ? 75 : 100
                        } className="mt-2" />
                      </div>
                    )}

                    {/* Call Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Recording */}
                      {call.recording && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Volume2 className="h-4 w-4" />
                            <span className="font-medium">{t('callCenter.call.recording')}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3 mr-1" />
                              {t('callCenter.call.play')}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              {t('callCenter.call.download')}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Transcription */}
                      {call.transcription ? (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">{t('callCenter.call.transcription')}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(call.transcription.confidence * 100)}% {t('callCenter.call.accuracy')}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {call.transcription.text.substring(0, 100)}...
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            {t('callCenter.call.viewFull')}
                          </Button>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Languages className="h-4 w-4" />
                            <span className="font-medium">{t('callCenter.call.transcription')}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => processCall(call.id)}
                            disabled={!call.recording}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            {t('callCenter.call.process')}
                          </Button>
                        </div>
                      )}

                      {/* AI Analysis */}
                      {call.aiAnalysis ? (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="h-4 w-4" />
                            <span className="font-medium">{t('callCenter.call.aiAnalysis')}</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>{t('callCenter.call.sentiment')}:</span>
                              <span className={getSentimentColor(call.aiAnalysis.sentiment)}>
                                {getSentimentLabel(call.aiAnalysis.sentiment)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('common.priority')}:</span>
                              <span className={getPriorityColor(call.aiAnalysis.priority)}>
                                {getPriorityLabel(call.aiAnalysis.priority)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : call.transcription ? (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="h-4 w-4" />
                            <span className="font-medium">{t('callCenter.call.aiAnalysis')}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => processCall(call.id)}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            {t('callCenter.call.process')}
                          </Button>
                        </div>
                      ) : null}
                    </div>

                    {/* AI Reply */}
                    {call.aiReply && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-medium">{t('callCenter.call.aiReply')}</span>
                            <Badge variant="outline">{call.aiReply.tone}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => regenerateAIResponse(call.id)}>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              {t('callCenter.call.regenerate')}
                            </Button>
                            {call.aiReply.voiceGenerated && (
                              <Button size="sm" variant="outline">
                                <Volume2 className="h-3 w-3 mr-1" />
                                {t('callCenter.call.listen')}
                              </Button>
                            )}
                            <Button size="sm">
                              <Send className="h-3 w-3 mr-1" />
                              {t('callCenter.call.send')}
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                          {call.aiReply.text}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-blue-700 flex items-center gap-2">
                    <div className="bg-blue-500 rounded-lg p-1.5">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    {t('callCenter.analytics.totalCalls') || 'Total Calls'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <p className="text-sm text-blue-600/70">{t('callCenter.analytics.totalCallsChange') || '+12% from last month'}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-green-700 flex items-center gap-2">
                    <div className="bg-green-500 rounded-lg p-1.5">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    {t('callCenter.analytics.answerRate') || 'Answer Rate'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <p className="text-sm text-green-600/70">{t('callCenter.analytics.answerRateChange') || '+5% from last month'}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-purple-700 flex items-center gap-2">
                    <div className="bg-purple-500 rounded-lg p-1.5">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    {t('callCenter.analytics.smartProcessing') || 'Smart Processing'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <p className="text-sm text-purple-600/70">{t('callCenter.analytics.smartProcessingDesc') || 'of calls processed'}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-orange-700 flex items-center gap-2">
                    <div className="bg-orange-500 rounded-lg p-1.5">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    {t('callCenter.analytics.customerSatisfaction') || 'Customer Satisfaction'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                  <p className="text-sm text-orange-600/70">{t('callCenter.analytics.customerSatisfactionChange') || '+0.3 from last month'}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-responses">
          <Card>
            <CardHeader>
              <CardTitle>{t('callCenter.aiResponses.title')}</CardTitle>
              <CardDescription>
                {t('callCenter.aiResponses.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4" />
                <p>{t('callCenter.aiResponses.empty')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('callCenter.settings.twilio.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="twilioSid">{t('callCenter.settings.twilio.accountSid')}</Label>
                  <Input id="twilioSid" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                </div>
                <div>
                  <Label htmlFor="twilioPhone">{t('callCenter.settings.twilio.phoneNumber')}</Label>
                  <Input id="twilioPhone" placeholder="+1234567890" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('callCenter.settings.ai.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="aiModel">{t('callCenter.settings.ai.modelLabel')}</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">{t('callCenter.settings.ai.models.gpt4')}</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">{t('callCenter.settings.ai.models.gpt35')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Arabic copy fixes in content literals (non-dictionary)
// - Fixed garbled characters in default Arabic strings on the Call Center page
// - In the analytics and AI responses sections, replace garbled Arabic strings
//   Search for: "سيتم عرض الردود   الذكية هنا" and replace with the correct form below if present.
//   Correct: "سيتم عرض الردود الذكية هنا"
// - In AI reply sample text, fix: "خلال   اعة" -> "خلال ساعة"
//   This content is provided via translations or mock data where present.
