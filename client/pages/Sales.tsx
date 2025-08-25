import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  FileText,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  MapPin,
  User
} from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Sales() {
  const { t, language } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("leads");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);

  // Static translation key maps to avoid dynamic template literals for i18n scanning
  const stageKeyMap: Record<string, string> = {
    leads: 'sales.stages.leads',
    new: 'sales.stages.new',
    qualified: 'sales.stages.qualified',
    proposal: 'sales.stages.proposal',
    negotiation: 'sales.stages.negotiation',
    won: 'sales.stages.won',
    lost: 'sales.stages.lost'
  };

  const tagKeyMap: Record<string, string> = {
    enterprise: 'sales.tags.enterprise',
    'hot-lead': 'sales.tags.hot-lead',
    startup: 'sales.tags.startup',
    'warm-lead': 'sales.tags.warm-lead',
    'closing-soon': 'sales.tags.closing-soon'
  };

  const handleExportLeads = () => {
    console.log('Exporting leads...');
    // Export functionality
  };

  const handleCreateLead = async (formData: any) => {
    console.log('Creating lead:', formData);
    setIsCreateLeadOpen(false);
  };

  const handleCallLead = (lead: any) => {
    console.log('Calling lead:', lead.contact);
    // Add call logic here
  };

  const handleEmailLead = (lead: any) => {
  const subject = language === 'ar' ? `متابعة بشأن ${lead.name}` : `Follow up on ${lead.name}`;
  const body = language === 'ar' ? `مرحبًا ${lead.contact},%0D%0A%0D%0A` : `Hi ${lead.contact},%0D%0A%0D%0A`;
  window.open(`mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${body}`);
  };

  const salesStats = [
    { 
      label: t('sales.stats.totalLeads'), 
      value: "247", 
      change: "+12%", 
      icon: Users,
      color: "text-blue-600"
    },
    { 
      label: t('sales.stats.activeDeals'), 
      value: "89", 
      change: "+8%", 
      icon: Target,
      color: "text-green-600"
    },
    { 
      label: t('sales.stats.revenueMTD'), 
      value: "$1.2M", 
      change: "+15%", 
      icon: DollarSign,
      color: "text-purple-600"
    },
    { 
      label: t('sales.stats.conversionRate'), 
      value: "23.4%", 
      change: "+2.1%", 
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const leads = [
    {
      id: "LEAD001",
      name: "TechCorp Inc",
      contact: "John Smith",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      value: 75000,
      stage: "qualified",
      probability: 60,
      source: "Website",
      assignedAgent: "Sarah Johnson",
  lastContact: "2 hours ago",
  nextFollowup: "Tomorrow 2:00 PM",
      tags: ["enterprise", "hot-lead"],
      company: "TechCorp Inc",
      location: "San Francisco, CA",
      notes: "Interested in enterprise package. Decision maker confirmed.",
      activities: [
        { type: "call", description: "Initial discovery call", date: "2024-01-15", outcome: "positive" },
        { type: "email", description: "Sent proposal", date: "2024-01-14", outcome: "delivered" }
      ]
    },
    {
      id: "LEAD002",
      name: "StartupXYZ",
      contact: "Emma Wilson",
      email: "emma@startupxyz.com",
      phone: "+1 (555) 987-6543",
      value: 25000,
      stage: "proposal",
      probability: 40,
      source: "Referral",
      assignedAgent: "Mike Davis",
  lastContact: "1 day ago",
  nextFollowup: "Next week",
      tags: ["startup", "warm-lead"],
      company: "StartupXYZ",
      location: "Austin, TX",
      notes: "Budget constraints but very interested. Need to follow up after Q1.",
      activities: [
        { type: "meeting", description: "Product demo", date: "2024-01-12", outcome: "positive" }
      ]
    },
    {
      id: "LEAD003",
      name: "Global Solutions",
      contact: "David Chen",
      email: "d.chen@globalsolutions.com",
      phone: "+1 (555) 456-7890",
      value: 150000,
      stage: "negotiation",
      probability: 80,
      source: "Cold Outreach",
      assignedAgent: "Sarah Johnson",
  lastContact: "30 minutes ago",
  nextFollowup: "Today 4:00 PM",
      tags: ["enterprise", "closing-soon"],
      company: "Global Solutions",
      location: "New York, NY",
      notes: "Contract review in progress. Legal team involved.",
      activities: [
        { type: "call", description: "Pricing negotiation", date: "2024-01-15", outcome: "positive" },
        { type: "email", description: "Contract sent", date: "2024-01-15", outcome: "delivered" }
      ]
    }
  ];

  const deals = [
    {
      id: "DEAL001",
      title: "TechCorp Enterprise License",
  client: "TechCorp Inc",
      value: 75000,
      stage: "negotiation",
      probability: 80,
      expectedClose: "2024-02-15",
      assignedAgent: "Sarah Johnson",
      activities: 12,
  lastActivity: "Contract review call",
      daysInStage: 5
    },
    {
      id: "DEAL002", 
      title: "StartupXYZ Growth Plan",
      client: "StartupXYZ",
      value: 25000,
      stage: "proposal",
      probability: 40,
      expectedClose: "2024-03-01",
      assignedAgent: "Mike Davis",
      activities: 8,
  lastActivity: "Proposal sent",
      daysInStage: 12
    }
  ];

  // Localize mock names and locations for Arabic
  const arLeadMap: Record<string, { name?: string; contact?: string; location?: string; notes?: string }> = {
    LEAD001: {
      name: "تك كورب",
      contact: "جون سميث",
      location: "سان فرانسيسكو، كاليفورنيا",
      notes: "مهتم بحزمة المؤسسات. تم تأكيد جهة اتخاذ القرار."
    },
    LEAD002: {
      name: "ستارت أب إكس واي زد",
      contact: "إيما ويلسون",
      location: "أوستن، تكساس",
      notes: "قيود في الميزانية لكن هناك اهتمام كبير. المتابعة بعد الربع الأول."
    },
    LEAD003: {
      name: "الحلول العالمية",
      contact: "ديفيد تشين",
      location: "نيويورك، نيويورك",
      notes: "مراجعة العقد قيد التنفيذ. الفريق القانوني مشارك."
    }
  };

  const arDealMap: Record<string, { client?: string; title?: string }> = {
    DEAL001: { client: "تك كورب", title: "رخصة المؤسسات لتك كورب" },
    DEAL002: { client: "ستارت أب إكس واي زد", title: "خطة نمو ستارت أب إكس واي زد" }
  };

  const arAgentNameMap: Record<string, string> = {
    'Sarah Johnson': 'سارة جونسون',
    'Mike Davis': 'مايك ديفيس',
    'Lisa Chen': 'ليزا تشين'
  };

  const localizedLeads = useMemo(() => {
    if (language !== 'ar') return leads;
    return leads.map((l) => ({
      ...l,
      name: arLeadMap[l.id]?.name ?? l.name,
      contact: arLeadMap[l.id]?.contact ?? l.contact,
  location: arLeadMap[l.id]?.location ?? l.location,
      notes: arLeadMap[l.id]?.notes ?? l.notes,
  assignedAgent: arAgentNameMap[l.assignedAgent] ?? l.assignedAgent,
  lastContact: l.id === 'LEAD001' ? 'منذ ساعتين' : l.id === 'LEAD002' ? 'منذ يوم' : 'منذ 30 دقيقة',
  nextFollowup: l.id === 'LEAD001' ? 'غدًا 2:00 م' : l.id === 'LEAD002' ? 'الأسبوع القادم' : 'اليوم 4:00 م'
    }));
  }, [language]);

  const localizedDeals = useMemo(() => {
    if (language !== 'ar') return deals;
    return deals.map((d) => ({
      ...d,
      title: arDealMap[d.id]?.title ?? d.title,
  client: arDealMap[d.id]?.client ?? d.client,
  assignedAgent: arAgentNameMap[d.assignedAgent] ?? d.assignedAgent,
  lastActivity: d.id === 'DEAL001' ? 'مكالمة مراجعة العقد' : 'تم إرسال العرض'
    }));
  }, [language]);

  const getStageColor = (stage: string) => {
    const colors = {
      new: "bg-gray-100 text-gray-800 border-gray-300",
      qualified: "bg-blue-100 text-blue-800 border-blue-300",
      proposal: "bg-yellow-100 text-yellow-800 border-yellow-300",
      negotiation: "bg-orange-100 text-orange-800 border-orange-300",
      won: "bg-green-100 text-green-800 border-green-300",
      lost: "bg-red-100 text-red-800 border-red-300"
    };
    return colors[stage as keyof typeof colors] || colors.new;
  };

  const getStageIcon = (stage: string) => {
    const icons = {
      new: Star,
      qualified: CheckCircle,
      proposal: FileText,
      negotiation: Clock,
      won: CheckCircle,
      lost: XCircle
    };
    const Icon = icons[stage as keyof typeof icons] || Star;
    return <Icon className="h-3 w-3" />;
  };

  const CreateLeadDialog = () => (
    <Dialog open={isCreateLeadOpen} onOpenChange={setIsCreateLeadOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('sales.lead.form.title')}</DialogTitle>
          <DialogDescription>
            {t('sales.lead.form.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lead-name">{t('sales.lead.form.leadName')}</Label>
              <Input id="lead-name" placeholder={t('sales.lead.form.placeholders.leadName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-person">{t('sales.lead.form.contactPerson')}</Label>
              <Input id="contact-person" placeholder={t('sales.lead.form.placeholders.contactPerson')} />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">{t('sales.lead.form.email')}</Label>
              <Input id="email" type="email" placeholder={t('sales.lead.form.placeholders.email')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('sales.lead.form.phone')}</Label>
              <Input id="phone" placeholder={t('sales.lead.form.placeholders.phone')} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="value">{t('sales.lead.form.dealValue')}</Label>
              <Input id="value" type="number" placeholder={t('sales.lead.form.placeholders.dealValue')} />
            </div>
            <div className="space-y-2">
        <Label htmlFor="source">{t('sales.lead.form.leadSource')}</Label>
              <Select>
                <SelectTrigger>
          <SelectValue placeholder={t('sales.lead.form.selectSource')} />
                </SelectTrigger>
                <SelectContent>
          <SelectItem value="website">{t('sales.lead.form.sources.website')}</SelectItem>
          <SelectItem value="referral">{t('sales.lead.form.sources.referral')}</SelectItem>
          <SelectItem value="cold-outreach">{t('sales.lead.form.sources.coldOutreach')}</SelectItem>
          <SelectItem value="social-media">{t('sales.lead.form.sources.socialMedia')}</SelectItem>
          <SelectItem value="trade-show">{t('sales.lead.form.sources.tradeShow')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
        <Label htmlFor="stage">{t('sales.lead.form.stage')}</Label>
              <Select defaultValue="new">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
          <SelectItem value="new">{t('sales.stages.new')}</SelectItem>
          <SelectItem value="qualified">{t('sales.stages.qualified')}</SelectItem>
          <SelectItem value="proposal">{t('sales.stages.proposal')}</SelectItem>
          <SelectItem value="negotiation">{t('sales.stages.negotiation')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
        <Label htmlFor="assigned-agent">{t('sales.lead.form.assignedAgent')}</Label>
              <Select>
                <SelectTrigger>
          <SelectValue placeholder={t('sales.lead.form.selectAgent')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="mike">Mike Davis</SelectItem>
                  <SelectItem value="lisa">Lisa Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('sales.lead.form.notes')}</Label>
            <Textarea id="notes" placeholder={t('sales.lead.form.notes')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">{t('sales.lead.form.tags')}</Label>
            <Input id="tags" placeholder={t('sales.lead.form.placeholders.tags')} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateLeadOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => {
              // Get form data and submit
              const formData = {
                name: "Sample Lead", // You'd get this from form
                contact: "John Doe",
                email: "john@example.com",
                value: 50000,
                stage: "new",
                source: "website"
              };
              handleCreateLead(formData);
            }}
          >
            {t('sales.actions.createLead')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Elite Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-gray-200/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-700 transform rotate-12 translate-y-1"></div>
              <TrendingUp className="h-8 w-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-emerald-600 mb-2">
                {t('sales.title') || 'Sales CRM'}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('sales.subtitle') || 'Manage leads, track deals, and drive revenue growth'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleExportLeads}
              className="bg-white/80 border-gray-200 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-200"
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('sales.actions.exportLeads') || 'Export Leads'}
            </Button>
            <Button 
              onClick={() => setIsCreateLeadOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('sales.actions.newLead') || 'New Lead'}
            </Button>
          </div>
        </div>
      </div>

      {/* Elite Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {salesStats.map((stat, index) => (
          <Card key={index} className="bg-white/80 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.label}</CardTitle>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-2">
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
              <p className="text-xs text-emerald-600/70">
                <span className="text-emerald-600">{stat.change}</span> {t('dashboard.stats.fromLastMonth') || 'from last month'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <TabsTrigger 
            value="leads"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('sales.tabs.leads') || 'Leads'}
          </TabsTrigger>
          <TabsTrigger 
            value="deals"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('sales.tabs.deals') || 'Deals'}
          </TabsTrigger>
          <TabsTrigger 
            value="quotes"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('sales.tabs.quotes') || 'Quotes'}
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('sales.tabs.analytics') || 'Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t('sales.filters.searchPlaceholder')} className="pl-8" />
                  </div>
                </div>
                <Select defaultValue="all-stages">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-stages">{t('sales.filters.allStages')}</SelectItem>
                    <SelectItem value="new">{t('sales.stages.new')}</SelectItem>
                    <SelectItem value="qualified">{t('sales.stages.qualified')}</SelectItem>
                    <SelectItem value="proposal">{t('sales.stages.proposal')}</SelectItem>
                    <SelectItem value="negotiation">{t('sales.stages.negotiation')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-agents">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-agents">{t('sales.filters.allAgents')}</SelectItem>
                    <SelectItem value="sarah">{t('sales.agents.sarah')}</SelectItem>
                    <SelectItem value="mike">{t('sales.agents.mike')}</SelectItem>
                    <SelectItem value="lisa">{t('sales.agents.lisa')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          <div className="space-y-4">
            {localizedLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{lead.name}</h3>
                          <Badge className={getStageColor(lead.stage)}>
                            {getStageIcon(lead.stage)}
                            <span className="ml-1">{t(stageKeyMap[lead.stage] || 'sales.stages.new')}</span>
                          </Badge>
                          {lead.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {t(tagKeyMap[tag] || 'sales.tags.enterprise')}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {lead.contact}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {lead.location}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('sales.lead.value')} </span>
                            <span className="font-semibold">${lead.value.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('sales.lead.probability')} </span>
                            <span className="font-semibold">{lead.probability}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('sales.lead.agent')} </span>
                            <span className="font-semibold">{lead.assignedAgent}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('sales.lead.lastContact')} </span>
                            <span className="font-semibold">{lead.lastContact}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Progress value={lead.probability} className="flex-1 h-2" />
                            <span className="text-xs text-muted-foreground">{lead.probability}%</span>
                          </div>
                          {lead.nextFollowup && (
                            <div className="flex items-center gap-1 text-sm text-orange-600">
                              <Calendar className="h-3 w-3" />
                              {t('sales.lead.nextFollowup')} {lead.nextFollowup}
                            </div>
                          )}
                        </div>

                        {lead.notes && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">{lead.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCallLead(lead)}
                        title={t('sales.actions.callLead')}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEmailLead(lead)}
                        title={t('sales.actions.sendEmail')}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log('Editing lead:', lead.name);
                        }}
                        title={t('sales.actions.editLead')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title={t('sales.actions.moreOptions')}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Pipeline Stages */}
            <Card>
              <CardHeader>
                <CardTitle>{t('sales.deals.pipelineTitle')}</CardTitle>
                <CardDescription>{t('sales.deals.byStage')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { stage: "new", count: 12, value: "$180K" },
                  { stage: "qualified", count: 8, value: "$340K" },
                  { stage: "proposal", count: 5, value: "$275K" },
                  { stage: "negotiation", count: 3, value: "$450K" },
                  { stage: "won", count: 2, value: "$150K" },
                  { stage: "lost", count: 1, value: "$25K" }
                ].map((item) => (
                  <div key={item.stage} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${getStageColor(item.stage).replace('text-', 'text-white bg-').split(' ')[2]}`}>
                        {getStageIcon(item.stage)}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{t(stageKeyMap[item.stage] || 'sales.stages.new')}</div>
                        <div className="text-sm text-muted-foreground">{t('sales.deals.dealsCount', { count: item.count })}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Deals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t('sales.deals.activeTitle')}</h3>
                <Button onClick={() => setIsCreateDealOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('sales.actions.newDeal')}
                </Button>
              </div>

              {localizedDeals.map((deal) => (
                <Card key={deal.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{deal.title}</h4>
                        <p className="text-sm text-muted-foreground">{deal.client}</p>
                      </div>
                      <Badge className={getStageColor(deal.stage)}>
                        {getStageIcon(deal.stage)}
                        <span className="ml-1">{t(stageKeyMap[deal.stage] || 'sales.stages.new')}</span>
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('sales.deal.value')} </span>
                        <span className="font-semibold">${deal.value.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('sales.deal.expectedClose')} </span>
                        <span className="font-semibold">{deal.expectedClose}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('sales.deal.agent')} </span>
                        <span className="font-semibold">{deal.assignedAgent}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{t('sales.deal.activitiesCount', { count: deal.activities })}</span>
                        <span>•</span>
                        <span>{t('sales.deal.daysInStage', { days: deal.daysInStage })}</span>
                        <span>•</span>
                        <span>{t('sales.deal.lastActivity', { activity: deal.lastActivity })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={deal.probability} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <Card>
              <CardHeader>
                <CardTitle>{t('sales.quotes.title')}</CardTitle>
                <CardDescription>
                  {t('sales.quotes.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('sales.quotes.emptyTitle')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('sales.quotes.emptyDescription')}
                  </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                    {t('sales.quotes.createQuote')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('sales.analytics.conversionFunnel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { stage: "leads", count: 247, percentage: 100 },
                    { stage: "qualified", count: 89, percentage: 36 },
                    { stage: "proposal", count: 34, percentage: 14 },
                    { stage: "negotiation", count: 12, percentage: 5 },
                    { stage: "won", count: 8, percentage: 3 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{t(stageKeyMap[item.stage] || 'sales.stages.new')}</span>
                        <span>{item.count} ({item.percentage}%)</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('sales.analytics.performanceMetrics')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('sales.metrics.averageDealSize')}</span>
                    <span className="font-semibold">$42,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('sales.metrics.salesCycleLength')}</span>
                    <span className="font-semibold">45 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('sales.metrics.winRate')}</span>
                    <span className="font-semibold">23.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('sales.metrics.revenueGrowth')}</span>
                    <span className="font-semibold text-success">+15.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CreateLeadDialog />
    </div>
  );
}
