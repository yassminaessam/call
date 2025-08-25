import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "@/contexts/TranslationContext";
import { 
  User, 
  Shield, 
  Database, 
  Bell, 
  Phone, 
  Bot, 
  Building, 
  Users, 
  Palette,
  Save,
  RefreshCw,
  Download,
  Upload,
  Key,
  Globe,
  Mail,
  Clock,
  Languages,
  CreditCard,
  Eye,
  EyeOff,
  Activity,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Renamed to avoid any potential symbol conflicts with icon names or other imports
export default function SettingsPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "My CRM Company",
    companyEmail: "admin@company.com",
    timezone: "UTC",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    
    // User Profile
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    
    // Security
    twoFactorEnabled: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    apiAccess: true,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    callNotifications: true,
    taskReminders: true,
    
    // Call Center
    defaultCallDuration: "30",
    autoRecording: true,
    callQuality: "HD",
    voicemailEnabled: true,
    
    // AI Settings
    aiEnabled: true,
    aiProvider: "openai",
    aiModel: "gpt-4",
    autoResponse: false,
    responseTime: "instant",
    
    // Database
    backupFrequency: "daily",
    retentionPeriod: "1year",
    dataEncryption: true,
    
    // API Keys
    openaiKey: "sk-*********************",
    elevenLabsKey: "el_*********************",
    twilioSid: "AC*********************",
    
    // Theme
    theme: "light",
    primaryColor: "blue",
    sidebarCollapsed: false,
    
    // Grandstream PBX Settings
    pbxHost: "192.168.1.100",
    pbxPort: "8088",
    pbxUsername: "admin",
    pbxPassword: "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: t('settings.messages.saveSuccess.title'),
        description: t('settings.messages.saveSuccess.description'),
      });
    } catch (error) {
      toast({
        title: t('settings.messages.saveError.title'),
        description: t('settings.messages.saveError.description'),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'crm-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings(prev => ({ ...prev, ...imported }));
          toast({
            title: t('settings.messages.importSuccess.title'),
            description: t('settings.messages.importSuccess.description'),
          });
        } catch (error) {
          toast({
            title: t('settings.messages.importError.title'),
            description: t('settings.messages.importError.description'),
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Elite Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-slate-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl p-4 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-700 transform rotate-12 translate-y-1"></div>
              <Settings className="h-8 w-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-600 mb-2">
                {t('settings.title') || 'System Settings'}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('settings.subtitle') || 'Manage your CRM platform configuration and preferences'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleExportSettings}
              className="bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('common.export') || 'Export'}
            </Button>
            <div>
              <label htmlFor="import-settings" className="cursor-pointer inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200">
                <Upload className="h-4 w-4 mr-2" />
                {t('common.import') || 'Import'}
              </label>
              <input
                id="import-settings"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportSettings}
              />
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {t('common.save') || 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="general">{t('settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="profile">{t('settings.tabs.profile')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.tabs.security')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="calls">{t('settings.tabs.calls')}</TabsTrigger>
          <TabsTrigger value="ai">{t('settings.tabs.ai')}</TabsTrigger>
          <TabsTrigger value="database">{t('settings.tabs.database')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('settings.tabs.integrations')}</TabsTrigger>
          <TabsTrigger value="grandstream">{t('settings.tabs.grandstream')}</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {t('settings.general.companyInfo.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.general.companyInfo.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">{t('settings.general.companyInfo.companyName')}</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyEmail">{t('settings.general.companyInfo.companyEmail')}</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) => setSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t('settings.general.localization.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.general.localization.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">{t('settings.general.localization.timezone')}</Label>
                    <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">{t('settings.options.timezones.utc')}</SelectItem>
                        <SelectItem value="EST">{t('settings.options.timezones.est')}</SelectItem>
                        <SelectItem value="PST">{t('settings.options.timezones.pst')}</SelectItem>
                        <SelectItem value="GMT">{t('settings.options.timezones.gmt')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">{t('settings.general.localization.language')}</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{t('settings.options.languages.en')}</SelectItem>
                        <SelectItem value="es">{t('settings.options.languages.es')}</SelectItem>
                        <SelectItem value="fr">{t('settings.options.languages.fr')}</SelectItem>
                        <SelectItem value="de">{t('settings.options.languages.de')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateFormat">{t('settings.general.localization.dateFormat')}</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">{t('settings.options.dateFormats.MM/DD/YYYY')}</SelectItem>
                        <SelectItem value="DD/MM/YYYY">{t('settings.options.dateFormats.DD/MM/YYYY')}</SelectItem>
                        <SelectItem value="YYYY-MM-DD">{t('settings.options.dateFormats.YYYY-MM-DD')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">{t('settings.general.localization.currency')}</Label>
                    <Select value={settings.currency} onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">{t('settings.options.currencies.usd')}</SelectItem>
                        <SelectItem value="EUR">{t('settings.options.currencies.eur')}</SelectItem>
                        <SelectItem value="GBP">{t('settings.options.currencies.gbp')}</SelectItem>
                        <SelectItem value="CAD">{t('settings.options.currencies.cad')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('settings.profile.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t('settings.profile.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => setSettings(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t('settings.profile.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => setSettings(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('settings.profile.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role">{t('settings.profile.role')}</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{settings.role}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {t('settings.profile.roleNote')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('settings.security.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.security.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.security.twoFactor.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.security.twoFactor.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.security.apiAccess.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.security.apiAccess.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.apiAccess}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, apiAccess: checked }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">{t('settings.security.sessionTimeout')}</Label>
                    <Select value={settings.sessionTimeout} onValueChange={(value) => setSettings(prev => ({ ...prev, sessionTimeout: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">{t('settings.options.sessionTimeouts.15')}</SelectItem>
                        <SelectItem value="30">{t('settings.options.sessionTimeouts.30')}</SelectItem>
                        <SelectItem value="60">{t('settings.options.sessionTimeouts.60')}</SelectItem>
                        <SelectItem value="240">{t('settings.options.sessionTimeouts.240')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="passwordExpiry">{t('settings.security.passwordExpiry')}</Label>
                    <Select value={settings.passwordExpiry} onValueChange={(value) => setSettings(prev => ({ ...prev, passwordExpiry: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">{t('settings.options.passwordExpiry.30')}</SelectItem>
                        <SelectItem value="60">{t('settings.options.passwordExpiry.60')}</SelectItem>
                        <SelectItem value="90">{t('settings.options.passwordExpiry.90')}</SelectItem>
                        <SelectItem value="never">{t('settings.options.passwordExpiry.never')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('settings.notifications.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.notifications.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.notifications.email.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.email.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.notifications.sms.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.sms.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.notifications.push.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.push.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.notifications.calls.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.calls.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.callNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, callNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.notifications.tasks.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notifications.tasks.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.taskReminders}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, taskReminders: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Call Center Settings */}
        <TabsContent value="calls">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {t('settings.calls.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.calls.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultCallDuration">{t('settings.calls.defaultDuration')}</Label>
                  <Select value={settings.defaultCallDuration} onValueChange={(value) => setSettings(prev => ({ ...prev, defaultCallDuration: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">{t('settings.options.callDurations.15')}</SelectItem>
                      <SelectItem value="30">{t('settings.options.callDurations.30')}</SelectItem>
                      <SelectItem value="60">{t('settings.options.callDurations.60')}</SelectItem>
                      <SelectItem value="unlimited">{t('settings.options.callDurations.unlimited')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="callQuality">{t('settings.calls.callQuality')}</Label>
                  <Select value={settings.callQuality} onValueChange={(value) => setSettings(prev => ({ ...prev, callQuality: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">{t('settings.options.callQualities.standard')}</SelectItem>
                      <SelectItem value="HD">{t('settings.options.callQualities.hd')}</SelectItem>
                      <SelectItem value="ultra">{t('settings.options.callQualities.ultra')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.calls.autoRecording.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.calls.autoRecording.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoRecording}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRecording: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.calls.voicemail.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.calls.voicemail.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.voicemailEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, voicemailEnabled: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {t('settings.ai.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.ai.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('settings.ai.assistant.title')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.ai.assistant.description')}
                  </p>
                </div>
                <Switch
                  checked={settings.aiEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, aiEnabled: checked }))}
                />
              </div>
              {settings.aiEnabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="aiProvider">{t('settings.ai.provider')}</Label>
                      <Select value={settings.aiProvider} onValueChange={(value) => setSettings(prev => ({ ...prev, aiProvider: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">{t('settings.options.aiProviders.openai')}</SelectItem>
                          <SelectItem value="anthropic">{t('settings.options.aiProviders.anthropic')}</SelectItem>
                          <SelectItem value="google">{t('settings.options.aiProviders.google')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="aiModel">{t('settings.ai.model')}</Label>
                      <Select value={settings.aiModel} onValueChange={(value) => setSettings(prev => ({ ...prev, aiModel: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">{t('settings.options.aiModels.gpt-4')}</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">{t('settings.options.aiModels.gpt-3.5-turbo')}</SelectItem>
                          <SelectItem value="claude-3">{t('settings.options.aiModels.claude-3')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.ai.autoResponse.title')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.ai.autoResponse.description')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoResponse}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoResponse: checked }))}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('settings.database.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.database.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backupFrequency">{t('settings.database.backupFrequency')}</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => setSettings(prev => ({ ...prev, backupFrequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">{t('settings.options.backupFrequencies.hourly')}</SelectItem>
                      <SelectItem value="daily">{t('settings.options.backupFrequencies.daily')}</SelectItem>
                      <SelectItem value="weekly">{t('settings.options.backupFrequencies.weekly')}</SelectItem>
                      <SelectItem value="monthly">{t('settings.options.backupFrequencies.monthly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="retentionPeriod">{t('settings.database.retentionPeriod')}</Label>
                  <Select value={settings.retentionPeriod} onValueChange={(value) => setSettings(prev => ({ ...prev, retentionPeriod: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6months">{t('settings.options.retentionPeriods.6months')}</SelectItem>
                      <SelectItem value="1year">{t('settings.options.retentionPeriods.1year')}</SelectItem>
                      <SelectItem value="2years">{t('settings.options.retentionPeriods.2years')}</SelectItem>
                      <SelectItem value="5years">{t('settings.options.retentionPeriods.5years')}</SelectItem>
                      <SelectItem value="indefinite">{t('settings.options.retentionPeriods.indefinite')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('settings.database.dataEncryption.title')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.database.dataEncryption.description')}
                  </p>
                </div>
                <Switch
                  checked={settings.dataEncryption}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataEncryption: checked }))}
                />
              </div>
              
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  {t('settings.database.backupNote')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  {t('settings.integrations.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.integrations.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="openaiKey">{t('settings.integrations.openaiKey')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="openaiKey"
                      type={showApiKey ? "text" : "password"}
                      value={settings.openaiKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, openaiKey: e.target.value }))}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="elevenLabsKey">{t('settings.integrations.elevenLabsKey')}</Label>
                  <Input
                    id="elevenLabsKey"
                    type="password"
                    value={settings.elevenLabsKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, elevenLabsKey: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="twilioSid">{t('settings.integrations.twilioSid')}</Label>
                  <Input
                    id="twilioSid"
                    type="password"
                    value={settings.twilioSid}
                    onChange={(e) => setSettings(prev => ({ ...prev, twilioSid: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {t('settings.integrations.appearance.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.integrations.appearance.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">{t('settings.integrations.appearance.theme')}</Label>
                    <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t('settings.options.themes.light')}</SelectItem>
                        <SelectItem value="dark">{t('settings.options.themes.dark')}</SelectItem>
                        <SelectItem value="system">{t('settings.options.themes.system')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">{t('settings.integrations.appearance.primaryColor')}</Label>
                    <Select value={settings.primaryColor} onValueChange={(value) => setSettings(prev => ({ ...prev, primaryColor: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">{t('settings.options.colors.blue')}</SelectItem>
                        <SelectItem value="green">{t('settings.options.colors.green')}</SelectItem>
                        <SelectItem value="purple">{t('settings.options.colors.purple')}</SelectItem>
                        <SelectItem value="orange">{t('settings.options.colors.orange')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.integrations.appearance.sidebarCollapsed.title')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.integrations.appearance.sidebarCollapsed.description')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.sidebarCollapsed}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sidebarCollapsed: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Grandstream PBX Settings */}
        <TabsContent value="grandstream">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t('settings.grandstream.title')}
                </CardTitle>
                <CardDescription>
                  {t('settings.grandstream.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pbxHost">{t('settings.grandstream.host')}</Label>
                    <Input
                      id="pbxHost"
                      value={settings.pbxHost || '192.168.1.100'}
                      onChange={(e) => setSettings(prev => ({ ...prev, pbxHost: e.target.value }))}
                      placeholder={t('settings.grandstream.placeholders.host')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pbxPort">{t('settings.grandstream.port')}</Label>
                    <Input
                      id="pbxPort"
                      value={settings.pbxPort || '8088'}
                      onChange={(e) => setSettings(prev => ({ ...prev, pbxPort: e.target.value }))}
                      placeholder={t('settings.grandstream.placeholders.port')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pbxUsername">{t('settings.grandstream.username')}</Label>
                    <Input
                      id="pbxUsername"
                      value={settings.pbxUsername || 'admin'}
                      onChange={(e) => setSettings(prev => ({ ...prev, pbxUsername: e.target.value }))}
                      placeholder={t('settings.grandstream.placeholders.username')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pbxPassword">{t('settings.grandstream.password')}</Label>
                    <div className="relative">
                      <Input
                        id="pbxPassword"
                        type={showApiKey ? 'text' : 'password'}
                        value={settings.pbxPassword || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, pbxPassword: e.target.value }))}
                        placeholder={t('settings.grandstream.placeholders.password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">{t('settings.grandstream.connectionTest')}</h4>
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        toast({
                          title: t('settings.grandstream.testing'),
                          description: t('settings.grandstream.testingDescription'),
                        });
                      }}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      {t('settings.grandstream.testConnection')}
                    </Button>
                    <Badge variant="outline" className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {t('settings.grandstream.status.connected')}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">{t('settings.grandstream.extensions')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Extension 1001</h5>
                          <p className="text-sm text-muted-foreground">{t('common.departments.salesDepartment')}</p>
                        </div>
                        <Badge variant="default">{t('common.online')}</Badge>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">Extension 1002</h5>
                          <p className="text-sm text-muted-foreground">{t('common.departments.supportDepartment')}</p>
                        </div>
                        <Badge variant="secondary">{t('common.busy')}</Badge>
                      </div>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">{t('settings.grandstream.queues')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-center">
                        <h5 className="font-medium">Queue 100</h5>
                        <p className="text-sm text-muted-foreground">General</p>
                        <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
                        <p className="text-xs text-muted-foreground">Waiting</p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <h5 className="font-medium">Queue 200</h5>
                        <p className="text-sm text-muted-foreground">Sales</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">2</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <h5 className="font-medium">Queue 300</h5>
                        <p className="text-sm text-muted-foreground">Support</p>
                        <p className="text-2xl font-bold text-orange-600 mt-2">1</p>
                        <p className="text-xs text-muted-foreground">Waiting</p>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
