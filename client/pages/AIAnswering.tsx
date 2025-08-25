import { useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Volume2, 
  Settings,
  TrendingUp,
  Users,
  Target,
  Factory,
  HeadphonesIcon,
  Play,
  Pause,
  Download,
  Upload,
  Wand2,
  Mic,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AIAnswering() {
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState("sales");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Static map for department names to avoid dynamic template literal translation keys
  const deptName = {
    sales: t('departments.sales'),
    hr: t('departments.hr'),
    marketing: t('departments.marketing'),
    manufacturing: t('departments.manufacturing'),
    support: t('departments.support'),
    it: t('departments.it')
  } as const;

  // Pre-resolve department default messages & status keys to avoid dynamic template literals inside t()
  const deptDefaultMessages: Record<string, string> = {
    sales: t('aiAnswering.departments.defaultMessages.sales'),
    hr: t('aiAnswering.departments.defaultMessages.hr'),
    marketing: t('aiAnswering.departments.defaultMessages.marketing'),
    manufacturing: t('aiAnswering.departments.defaultMessages.manufacturing'),
    support: t('aiAnswering.departments.defaultMessages.support')
  };

  const deptStatusLabel = (status: string) =>
    status === 'active'
      ? t('aiAnswering.departments.active')
      : t('aiAnswering.departments.inactive');

  const departments = [
    {
      id: "sales",
      // name translation key: departments.sales
      name: deptName.sales,
      icon: TrendingUp,
      color: "bg-sales text-white",
  defaultMessage: deptDefaultMessages.sales,
      voiceUrl: "/audio/sales-default.mp3",
      language: "en-US",
      autoGenerate: true,
      status: "active"
    },
    {
      id: "hr",
      name: deptName.hr,
      icon: Users,
      color: "bg-hr text-white",
  defaultMessage: deptDefaultMessages.hr,
      voiceUrl: "/audio/hr-default.mp3", 
      language: "en-US",
      autoGenerate: true,
      status: "active"
    },
    {
      id: "marketing",
      name: deptName.marketing,
      icon: Target,
      color: "bg-marketing text-white",
  defaultMessage: deptDefaultMessages.marketing,
      voiceUrl: "/audio/marketing-default.mp3",
      language: "en-US", 
      autoGenerate: false,
      status: "active"
    },
    {
      id: "manufacturing",
      name: deptName.manufacturing,
      icon: Factory,
      color: "bg-manufacturing text-white",
  defaultMessage: deptDefaultMessages.manufacturing,
      voiceUrl: null,
      language: "en-US",
      autoGenerate: false,
      status: "inactive"
    },
    {
      id: "support",
      name: deptName.support,
      icon: HeadphonesIcon,
      color: "bg-support text-white",
  defaultMessage: deptDefaultMessages.support,
      voiceUrl: "/audio/support-default.mp3",
      language: "en-US",
      autoGenerate: true,
      status: "active"
    }
  ];

  const currentDept = departments.find(d => d.id === selectedDepartment);

  const handleGenerateMessage = async () => {
    setIsGenerating(true);
    // Simulate API call to OpenAI
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  const languages = [
    { value: "en-US", label: t('aiAnswering.messageSetup.language.options.en-US') },
    { value: "en-GB", label: t('aiAnswering.messageSetup.language.options.en-GB') },
    { value: "es-ES", label: t('aiAnswering.messageSetup.language.options.es-ES') },
    { value: "fr-FR", label: t('aiAnswering.messageSetup.language.options.fr-FR') },
    { value: "de-DE", label: t('aiAnswering.messageSetup.language.options.de-DE') }
  ];

  const voiceProviders = [
    { value: "elevenlabs", label: t('aiAnswering.voiceSettings.provider.options.elevenlabs') },
    { value: "google", label: t('aiAnswering.voiceSettings.provider.options.google') },
    { value: "playht", label: t('aiAnswering.voiceSettings.provider.options.playht') },
    { value: "aws", label: t('aiAnswering.voiceSettings.provider.options.aws') }
  ];

  return (
    <div className="space-y-6">
      {/* Elite Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-gray-200/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-4 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 transform rotate-12 translate-y-1"></div>
              <MessageSquare className="h-8 w-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-2">
                {t('aiAnswering.title') || 'AI Answering System'}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('aiAnswering.subtitle') || 'Configure automated responses for each department'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="bg-white/80 border-gray-200 hover:bg-white hover:border-purple-300 hover:shadow-md transition-all duration-200"
            >
              <Settings className="mr-2 h-4 w-4" />
              {t('aiAnswering.actions.globalSettings') || 'Global Settings'}
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSaving ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {t('aiAnswering.actions.saveChanges') || 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Department Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('aiAnswering.departments.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  selectedDepartment === dept.id 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-muted"
                }`}
              >
                <div className={`p-2 rounded ${dept.color}`}>
                  <dept.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{deptName[dept.id as keyof typeof deptName]}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={dept.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {deptStatusLabel(dept.status)}
                    </Badge>
                    {dept.autoGenerate && (
                      <Badge variant="outline" className="text-xs">
                        {t('aiAnswering.departments.autoGen')}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Department Configuration */}
        <div className="space-y-6">
          {currentDept && (
            <>
              {/* Department Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${currentDept.color}`}>
                        <currentDept.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{t('aiAnswering.departmentConfig.title', { name: deptName[currentDept.id as keyof typeof deptName] })}</CardTitle>
                        <CardDescription>
                          {t('aiAnswering.departmentConfig.subtitle')}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={currentDept.status === "active"}
                        className="data-[state=checked]:bg-success"
                      />
                      <span className="text-sm font-medium">
                        {deptStatusLabel(currentDept.status)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Tabs defaultValue="message" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="message">{t('aiAnswering.tabs.message')}</TabsTrigger>
                  <TabsTrigger value="voice">{t('aiAnswering.tabs.voice')}</TabsTrigger>
                  <TabsTrigger value="analytics">{t('aiAnswering.tabs.analytics')}</TabsTrigger>
                </TabsList>

                <TabsContent value="message" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        {t('aiAnswering.messageSetup.title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Message Text */}
                      <div className="space-y-2">
                        <Label htmlFor="message">{t('aiAnswering.messageSetup.messageLabel')}</Label>
                        <Textarea
                          id="message"
                          defaultValue={currentDept.defaultMessage}
                          className="min-h-[120px]"
                          placeholder={t('aiAnswering.messageSetup.messagePlaceholder')}
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{t('aiAnswering.messageSetup.charactersCount', { count: currentDept.defaultMessage.length })}</span>
                          <span>{t('aiAnswering.messageSetup.estimatedDuration', { seconds: 25 })}</span>
                        </div>
                      </div>

                      {/* AI Generation */}
                        <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Switch checked={currentDept.autoGenerate} />
                          <div>
                            <div className="font-medium">{t('aiAnswering.messageSetup.aiGeneration.title')}</div>
                            <div className="text-sm text-muted-foreground">
                              {t('aiAnswering.messageSetup.aiGeneration.description')}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Input 
                            placeholder={t('aiAnswering.messageSetup.aiGeneration.placeholder')}
                            className="flex-1"
                          />
                          <Button 
                            onClick={handleGenerateMessage} 
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Wand2 className="mr-2 h-4 w-4" />
                            )}
                            {t('aiAnswering.messageSetup.aiGeneration.generateButton')}
                          </Button>
                        </div>
                      </div>                      {/* Language Settings */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="language">{t('aiAnswering.messageSetup.language.label')}</Label>
                          <Select defaultValue={currentDept.language}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tone">{t('aiAnswering.messageSetup.tone.label')}</Label>
                          <Select defaultValue="professional">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">{t('aiAnswering.messageSetup.tone.options.professional')}</SelectItem>
                              <SelectItem value="friendly">{t('aiAnswering.messageSetup.tone.options.friendly')}</SelectItem>
                              <SelectItem value="formal">{t('aiAnswering.messageSetup.tone.options.formal')}</SelectItem>
                              <SelectItem value="casual">{t('aiAnswering.messageSetup.tone.options.casual')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="voice" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5" />
                        {t('aiAnswering.voiceSettings.title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Current Voice Preview */}
                      {currentDept.voiceUrl && (
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">{t('aiAnswering.voiceSettings.currentVoice.title')}</div>
                            <Badge variant="outline">{t('aiAnswering.voiceSettings.currentVoice.generated')}</Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 h-2 bg-background rounded-full">
                              <div className="h-full w-1/3 bg-primary rounded-full" />
                            </div>
                            <span className="text-sm text-muted-foreground">{t('aiAnswering.voiceSettings.currentVoice.duration', { current: '0:08', total: '0:25' })}</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Voice Provider */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="provider">{t('aiAnswering.voiceSettings.provider.label')}</Label>
                          <Select defaultValue="elevenlabs">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {voiceProviders.map((provider) => (
                                <SelectItem key={provider.value} value={provider.value}>
                                  {provider.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="voice">{t('aiAnswering.voiceSettings.voiceModel.label')}</Label>
                          <Select defaultValue="professional-female">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional-female">{t('aiAnswering.voiceSettings.voiceModel.options.professional-female')}</SelectItem>
                              <SelectItem value="professional-male">{t('aiAnswering.voiceSettings.voiceModel.options.professional-male')}</SelectItem>
                              <SelectItem value="friendly-female">{t('aiAnswering.voiceSettings.voiceModel.options.friendly-female')}</SelectItem>
                              <SelectItem value="friendly-male">{t('aiAnswering.voiceSettings.voiceModel.options.friendly-male')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Voice Settings */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="speed">{t('aiAnswering.voiceSettings.speed.label')}</Label>
                          <Select defaultValue="normal">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="slow">{t('aiAnswering.voiceSettings.speed.options.slow')}</SelectItem>
                              <SelectItem value="normal">{t('aiAnswering.voiceSettings.speed.options.normal')}</SelectItem>
                              <SelectItem value="fast">{t('aiAnswering.voiceSettings.speed.options.fast')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pitch">{t('aiAnswering.voiceSettings.pitch.label')}</Label>
                          <Select defaultValue="normal">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">{t('aiAnswering.voiceSettings.pitch.options.low')}</SelectItem>
                              <SelectItem value="normal">{t('aiAnswering.voiceSettings.pitch.options.normal')}</SelectItem>
                              <SelectItem value="high">{t('aiAnswering.voiceSettings.pitch.options.high')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emotion">{t('aiAnswering.voiceSettings.emotion.label')}</Label>
                          <Select defaultValue="neutral">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="neutral">{t('aiAnswering.voiceSettings.emotion.options.neutral')}</SelectItem>
                              <SelectItem value="happy">{t('aiAnswering.voiceSettings.emotion.options.happy')}</SelectItem>
                              <SelectItem value="calm">{t('aiAnswering.voiceSettings.emotion.options.calm')}</SelectItem>
                              <SelectItem value="excited">{t('aiAnswering.voiceSettings.emotion.options.excited')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Generate Voice */}
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <Button className="flex-1">
                          <Mic className="mr-2 h-4 w-4" />
                          {t('aiAnswering.voiceSettings.actions.generateVoice')}
                        </Button>
                        <Button variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          {t('aiAnswering.voiceSettings.actions.uploadCustom')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('aiAnswering.analytics.messagesPlayed')}</CardTitle>
                        <Play className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">147</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-success">+23%</span> {t('common.fromLastMonth')}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('aiAnswering.analytics.callbackRate')}</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">68%</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-success">+5%</span> {t('common.fromLastMonth')}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('aiAnswering.analytics.avgListenTime')}</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">18s</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-destructive">-2s</span> {t('common.fromLastMonth')}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('aiAnswering.analytics.recentResponses')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { caller: t('aiAnswering.analytics.sampleData.caller1'), time: t('aiAnswering.analytics.sampleData.timeAgo.2min'), duration: "25s", completed: true },
                          { caller: t('aiAnswering.analytics.sampleData.caller2'), time: t('aiAnswering.analytics.sampleData.timeAgo.15min'), duration: "18s", completed: false },
                          { caller: t('aiAnswering.analytics.sampleData.caller3'), time: t('aiAnswering.analytics.sampleData.timeAgo.1hour'), duration: "22s", completed: true },
                          { caller: t('aiAnswering.analytics.sampleData.caller4'), time: t('aiAnswering.analytics.sampleData.timeAgo.2hours'), duration: "15s", completed: false }
                        ].map((response, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${response.completed ? 'bg-success' : 'bg-warning'}`} />
                              <div>
                                <div className="font-medium">{response.caller}</div>
                                <div className="text-sm text-muted-foreground">{response.time}</div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {response.duration} • {response.completed ? t('aiAnswering.analytics.fullMessage') : t('aiAnswering.analytics.partial')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
