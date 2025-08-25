import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Bot, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/contexts/TranslationContext';

interface CallRecord {
  id: string;
  phoneNumber: string;
  timestamp: Date;
  duration: number;
  status: 'completed' | 'processing' | 'failed' | 'pending';
  department: 'sales' | 'support' | 'hr' | 'general';
  priority: 'high' | 'medium' | 'low';
  aiAnalysis?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    summary: string;
    keywords: string[];
    confidence: number;
    transcript?: string;
    recommendations?: string[];
  };
  customerInfo?: {
    name?: string;
    email?: string;
    previousCalls?: number;
  };
}

interface SystemStats {
  totalCalls: number;
  processedCalls: number;
  avgProcessingTime: number;
  successRate: number;
  queueLength: number;
}

interface AIConfig {
  openaiApiKey: string;
  speechToTextProvider: 'google' | 'azure' | 'aws';
  textToSpeechProvider: 'elevenlabs' | 'google' | 'azure' | 'aws';
  enableRealTimeProcessing: boolean;
  confidenceThreshold: number;
  languages: string[];
  departmentPrompts: {
    [key: string]: string;
  };
}

const AdvancedCallCenter: React.FC = () => {
  const { t } = useTranslation();
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalCalls: 0,
    processedCalls: 0,
    avgProcessingTime: 0,
    successRate: 0,
    queueLength: 0
  });
  const [processingQueue, setProcessingQueue] = useState<string[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    openaiApiKey: '',
    speechToTextProvider: 'google',
    textToSpeechProvider: 'elevenlabs',
    enableRealTimeProcessing: true,
    confidenceThreshold: 0.8,
    languages: ['en', 'ar'],
    departmentPrompts: {
      sales: 'Analyze this sales call for lead quality, customer interest level, and follow-up recommendations.',
      support: 'Analyze this support call for issue resolution, customer satisfaction, and technical insights.',
      hr: 'Analyze this HR call for compliance, employee satisfaction, and policy adherence.',
      general: 'Provide a general analysis of this call including sentiment and key topics.'
    }
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('calls');

  // Sample data for demonstration
  useEffect(() => {
    const sampleCalls: CallRecord[] = [
      {
        id: '1',
        phoneNumber: '+1234567890',
        timestamp: new Date(Date.now() - 3600000),
        duration: 324,
        status: 'completed',
        department: 'sales',
        priority: 'high',
        aiAnalysis: {
          sentiment: 'positive',
          summary: 'Customer showed strong interest in premium package. Ready to proceed with purchase.',
          keywords: ['premium', 'purchase', 'interested', 'budget approved'],
          confidence: 0.92,
          transcript: 'Customer: I am very interested in your premium package...',
          recommendations: ['Schedule follow-up call', 'Send pricing proposal', 'Connect with account manager']
        },
        customerInfo: {
          name: 'John Smith',
          email: 'john.smith@email.com',
          previousCalls: 2
        }
      },
      {
        id: '2',
        phoneNumber: '+1987654321',
        timestamp: new Date(Date.now() - 7200000),
        duration: 156,
        status: 'processing',
        department: 'support',
        priority: 'medium'
      },
      {
        id: '3',
        phoneNumber: '+1122334455',
        timestamp: new Date(Date.now() - 10800000),
        duration: 89,
        status: 'failed',
        department: 'hr',
        priority: 'low'
      }
    ];

    setCalls(sampleCalls);
    setSystemStats({
      totalCalls: 156,
      processedCalls: 142,
      avgProcessingTime: 45,
      successRate: 91.0,
      queueLength: 3
    });
    setProcessingQueue(['2']);
  }, []);

  const processCall = async (callId: string) => {
    try {
      setProcessingQueue(prev => [...prev, callId]);
      
      // Simulate API call to process call with AI
      const response = await fetch(`/api/call-center/process/${callId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiConfig })
      });

      if (response.ok) {
        const result = await response.json();
        setCalls(prev => prev.map(call => 
          call.id === callId 
            ? { ...call, status: 'completed', aiAnalysis: result.analysis }
            : call
        ));
      }
    } catch (error) {
      console.error('Error processing call:', error);
      setCalls(prev => prev.map(call => 
        call.id === callId ? { ...call, status: 'failed' } : call
      ));
    } finally {
      setProcessingQueue(prev => prev.filter(id => id !== callId));
    }
  };

  const regenerateAnalysis = async (callId: string) => {
    try {
      const response = await fetch(`/api/call-center/regenerate/${callId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiConfig })
      });

      if (response.ok) {
        const result = await response.json();
        setCalls(prev => prev.map(call => 
          call.id === callId 
            ? { ...call, aiAnalysis: result.analysis }
            : call
        ));
      }
    } catch (error) {
      console.error('Error regenerating analysis:', error);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(calls, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `call-center-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredCalls = calls.filter(call => {
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || call.department === filterDepartment;
    const matchesSearch = searchTerm === '' || 
      call.phoneNumber.includes(searchTerm) ||
      call.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('callCenter.advanced.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('callCenter.advanced.description')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            {t('callCenter.ai.enabled')}
          </Badge>
          {processingQueue.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('callCenter.processing.queue', { count: processingQueue.length })}
            </Badge>
          )}
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('callCenter.stats.totalCalls')}</p>
                <p className="text-2xl font-bold">{systemStats.totalCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('callCenter.stats.processed')}</p>
                <p className="text-2xl font-bold">{systemStats.processedCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('callCenter.stats.avgTime')}</p>
                <p className="text-2xl font-bold">{systemStats.avgProcessingTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('callCenter.stats.successRate')}</p>
                <p className="text-2xl font-bold">{systemStats.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('callCenter.stats.queue')}</p>
                <p className="text-2xl font-bold">{systemStats.queueLength}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="calls">{t('callCenter.tabs.calls')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('callCenter.tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="config">{t('callCenter.tabs.config')}</TabsTrigger>
        </TabsList>

        <TabsContent value="calls" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <Input
                placeholder={t('callCenter.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('callCenter.filter.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('callCenter.filter.all')}</SelectItem>
                  <SelectItem value="completed">{t('callCenter.status.completed')}</SelectItem>
                  <SelectItem value="processing">{t('callCenter.status.processing')}</SelectItem>
                  <SelectItem value="failed">{t('callCenter.status.failed')}</SelectItem>
                  <SelectItem value="pending">{t('callCenter.status.pending')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('callCenter.filter.department')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('callCenter.filter.all')}</SelectItem>
                  <SelectItem value="sales">{t('departments.sales')}</SelectItem>
                  <SelectItem value="support">{t('departments.support')}</SelectItem>
                  <SelectItem value="hr">{t('departments.hr')}</SelectItem>
                  <SelectItem value="general">{t('departments.general')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('callCenter.export')}
            </Button>
          </div>

          {/* Calls List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Call List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('callCenter.list.title')} ({filteredCalls.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredCalls.map((call) => (
                  <Card 
                    key={call.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedCall?.id === call.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCall(call)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{call.phoneNumber}</span>
                        </div>
                        <Badge variant={getStatusBadgeVariant(call.status)}>
                          {t(`callCenter.status.${call.status}`)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>{call.timestamp.toLocaleString()}</span>
                        <span>{Math.floor(call.duration / 60)}:{String(call.duration % 60).padStart(2, '0')}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{t(`departments.${call.department}`)}</Badge>
                          <Badge variant="outline" className={getPriorityColor(call.priority)}>
                            {t(`callCenter.priority.${call.priority}`)}
                          </Badge>
                        </div>
                        
                        {call.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              processCall(call.id);
                            }}
                            disabled={processingQueue.includes(call.id)}
                          >
                            {processingQueue.includes(call.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {call.customerInfo?.name && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">{call.customerInfo.name}</span>
                          {call.customerInfo.email && (
                            <span className="text-muted-foreground ml-2">({call.customerInfo.email})</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Call Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('callCenter.details.title')}</h3>
              {selectedCall ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        {selectedCall.phoneNumber}
                      </CardTitle>
                      {selectedCall.aiAnalysis && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => regenerateAnalysis(selectedCall.id)}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          {t('callCenter.regenerate')}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">{t('callCenter.details.timestamp')}:</span>
                        <p className="text-muted-foreground">{selectedCall.timestamp.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t('callCenter.details.duration')}:</span>
                        <p className="text-muted-foreground">
                          {Math.floor(selectedCall.duration / 60)}:{String(selectedCall.duration % 60).padStart(2, '0')}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">{t('callCenter.details.department')}:</span>
                        <p className="text-muted-foreground">{t(`departments.${selectedCall.department}`)}</p>
                      </div>
                      <div>
                        <span className="font-medium">{t('callCenter.details.priority')}:</span>
                        <p className="text-muted-foreground">{t(`callCenter.priority.${selectedCall.priority}`)}</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    {selectedCall.customerInfo && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">{t('callCenter.details.customer')}</h4>
                        <div className="space-y-1 text-sm">
                          {selectedCall.customerInfo.name && (
                            <p><span className="font-medium">{t('callCenter.details.name')}:</span> {selectedCall.customerInfo.name}</p>
                          )}
                          {selectedCall.customerInfo.email && (
                            <p><span className="font-medium">{t('callCenter.details.email')}:</span> {selectedCall.customerInfo.email}</p>
                          )}
                          {selectedCall.customerInfo.previousCalls && (
                            <p><span className="font-medium">{t('callCenter.details.previousCalls')}:</span> {selectedCall.customerInfo.previousCalls}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI Analysis */}
                    {selectedCall.aiAnalysis && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          {t('callCenter.ai.analysis')}
                        </h4>
                        
                        <div className="space-y-3">
                          {/* Sentiment */}
                          <div>
                            <span className="font-medium text-sm">{t('callCenter.ai.sentiment')}:</span>
                            <p className={`text-sm ${getSentimentColor(selectedCall.aiAnalysis.sentiment)}`}>
                              {t(`callCenter.sentiment.${selectedCall.aiAnalysis.sentiment}`)} 
                              <span className="text-muted-foreground ml-2">
                                ({Math.round(selectedCall.aiAnalysis.confidence * 100)}% {t('callCenter.ai.confidence')})
                              </span>
                            </p>
                          </div>

                          {/* Summary */}
                          <div>
                            <span className="font-medium text-sm">{t('callCenter.ai.summary')}:</span>
                            <p className="text-sm text-muted-foreground mt-1">{selectedCall.aiAnalysis.summary}</p>
                          </div>

                          {/* Keywords */}
                          <div>
                            <span className="font-medium text-sm">{t('callCenter.ai.keywords')}:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedCall.aiAnalysis.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Recommendations */}
                          {selectedCall.aiAnalysis.recommendations && (
                            <div>
                              <span className="font-medium text-sm">{t('callCenter.ai.recommendations')}:</span>
                              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                {selectedCall.aiAnalysis.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Transcript */}
                          {selectedCall.aiAnalysis.transcript && (
                            <div>
                              <span className="font-medium text-sm">{t('callCenter.ai.transcript')}:</span>
                              <div className="text-sm text-muted-foreground mt-1 p-3 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
                                {selectedCall.aiAnalysis.transcript}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('callCenter.details.selectCall')}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('callCenter.analytics.sentiment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('callCenter.sentiment.positive')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('callCenter.sentiment.neutral')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-1/5 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('callCenter.sentiment.negative')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div className="w-1/20 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('callCenter.analytics.departments')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('departments.sales')}</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('departments.support')}</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('departments.hr')}</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('departments.general')}</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t('callCenter.config.ai')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t('callCenter.config.openaiKey')}</label>
                  <Input
                    type="password"
                    value={aiConfig.openaiApiKey}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                    placeholder="sk-..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">{t('callCenter.config.speechToText')}</label>
                  <Select 
                    value={aiConfig.speechToTextProvider} 
                    onValueChange={(value: any) => setAiConfig(prev => ({ ...prev, speechToTextProvider: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Speech-to-Text</SelectItem>
                      <SelectItem value="azure">Azure Speech</SelectItem>
                      <SelectItem value="aws">AWS Transcribe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">{t('callCenter.config.textToSpeech')}</label>
                  <Select 
                    value={aiConfig.textToSpeechProvider} 
                    onValueChange={(value: any) => setAiConfig(prev => ({ ...prev, textToSpeechProvider: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      <SelectItem value="google">Google Text-to-Speech</SelectItem>
                      <SelectItem value="azure">Azure Speech</SelectItem>
                      <SelectItem value="aws">AWS Polly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">{t('callCenter.config.confidence')}</label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiConfig.confidenceThreshold}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('callCenter.config.prompts')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(aiConfig.departmentPrompts).map(([dept, prompt]) => (
                  <div key={dept}>
                    <label className="text-sm font-medium">{t(`departments.${dept}`)}</label>
                    <textarea
                      className="w-full p-2 border rounded-md text-sm"
                      rows={3}
                      value={prompt}
                      onChange={(e) => setAiConfig(prev => ({
                        ...prev,
                        departmentPrompts: {
                          ...prev.departmentPrompts,
                          [dept]: e.target.value
                        }
                      }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedCallCenter;