import { useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
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
import { Switch } from "@/components/ui/switch";
import { 
  Target, 
  TrendingUp, 
  Mail,
  MessageSquare,
  Share2,
  Eye,
  MousePointer,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Play,
  Pause,
  Copy,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Smartphone,
  Image,
  Video,
  FileText,
  Settings
} from "lucide-react";

export default function Marketing() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("campaigns");
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [selectedCampaignType, setSelectedCampaignType] = useState("email");

  // Helper function to get translated campaign names
  const getCampaignName = (campaignId: string) => {
    const nameMap: Record<string, string> = {
      'CAMP001': t('marketing.sampleData.campaigns.q1ProductLaunch'),
      'CAMP002': t('marketing.sampleData.campaigns.summerSale2024'),
      'CAMP003': t('marketing.sampleData.campaigns.customerSuccessStories')
    };
    return nameMap[campaignId] || campaignId;
  };

  // Helper function to get translated campaign descriptions
  const getCampaignDescription = (campaignId: string) => {
    const descMap: Record<string, string> = {
      'CAMP001': t('marketing.sampleData.campaigns.q1ProductLaunchDesc'),
      'CAMP002': t('marketing.sampleData.campaigns.summerSale2024Desc'),
      'CAMP003': t('marketing.sampleData.campaigns.customerSuccessStoriesDesc')
    };
    return descMap[campaignId] || '';
  };

  // Helper function to get translated segment names
  const getSegmentName = (segmentId: string) => {
    const nameMap: Record<string, string> = {
      'SEG001': t('marketing.sampleData.segments.enterpriseCustomers'),
      'SEG002': t('marketing.sampleData.segments.highValueProspects'),
      'SEG003': t('marketing.sampleData.segments.trialUsers')
    };
    return nameMap[segmentId] || segmentId;
  };

  // Helper function to get translated segment descriptions
  const getSegmentDescription = (segmentId: string) => {
    const descMap: Record<string, string> = {
      'premium-customers': t('marketing.segments.premiumCustomersDesc'),
      'enterprise-leads': t('marketing.segments.enterpriseLeadsDesc'),
      'trial-users': t('marketing.segments.trialUsersDesc'),
      'dormant-users': t('marketing.segments.dormantUsersDesc')
    };
    return descMap[segmentId] || '';
  };

  // Helper function to get translated status labels
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'running': t('marketing.status.running'),
      'paused': t('marketing.status.paused'),
      'completed': t('marketing.status.completed'),
      'draft': t('marketing.status.draft')
    };
    return statusMap[status] || status;
  };

  // Helper function to get translated type labels
  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'email': t('marketing.type.email'),
      'social': t('marketing.type.social'),
      'mixed': t('marketing.type.mixed'),
      'sms': t('marketing.type.sms')
    };
    return typeMap[type] || type;
  };  // Helper function to get translated audience segment text
  const getAudienceSegment = (segment: string) => {
    const segmentMap: Record<string, string> = {
      'Existing Customers': t('marketing.sampleData.segments.existingCustomers'),
      'Mid-Market Prospects': t('marketing.sampleData.segments.midMarketProspects'),
      'All Prospects': t('marketing.sampleData.segments.allProspects')
    };
    return segmentMap[segment] || segment;
  };

  // Helper function to get translated criteria text
  const getCriteria = (criteria: string) => {
    const criteriaMap: Record<string, string> = {
      'Enterprise plan users': t('marketing.sampleData.segments.enterprisePlanUsers'),
      'Company size 50-500 employees': t('marketing.sampleData.segments.companySize50to500'),
      'All leads and customers': t('marketing.sampleData.segments.allLeadsAndCustomers')
    };
    return criteriaMap[criteria] || criteria;
  };

  const marketingStats = [
    { 
      label: t('marketing.stats.activeCampaigns'), 
      value: "23", 
      change: "+5", 
      icon: Target,
      color: "text-blue-600"
    },
    { 
      label: t('marketing.stats.totalReach'), 
      value: "45.2K", 
      change: "+12%", 
      icon: Users,
      color: "text-green-600"
    },
    { 
      label: t('marketing.stats.conversionRate'), 
      value: "3.2%", 
      change: "+0.8%", 
      icon: TrendingUp,
      color: "text-purple-600"
    },
    { 
      label: t('marketing.stats.revenueGenerated'), 
      value: "$127K", 
      change: "+23%", 
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  const campaigns = [
    {
      id: "CAMP001",
      name: getCampaignName("CAMP001"),
      description: getCampaignDescription("CAMP001"),
      type: "email",
      status: "running",
      createdDate: "2024-01-01",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      budget: 15000,
      spent: 8400,
      totalRecipients: 12500,
      analytics: {
        sent: 12500,
        delivered: 12245,
        opened: 4898,
        clicked: 1469,
        unsubscribed: 23,
        bounced: 255,
        converted: 147,
        revenue: 42000
      },
      audience: {
        segment: getAudienceSegment("Existing Customers"),
        criteria: getCriteria("Enterprise plan users")
      }
    },
    {
      id: "CAMP002",
      name: getCampaignName("CAMP002"),
      description: getCampaignDescription("CAMP002"),
      type: "mixed",
      status: "scheduled",
      createdDate: "2024-01-10",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      budget: 25000,
      spent: 0,
      totalRecipients: 18750,
      analytics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        bounced: 0,
        converted: 0,
        revenue: 0
      },
      audience: {
        segment: getAudienceSegment("Mid-Market Prospects"),
        criteria: getCriteria("Company size 50-500 employees")
      }
    },
    {
      id: "CAMP003",
      name: getCampaignName("CAMP003"),
      description: getCampaignDescription("CAMP003"),
      type: "social",
      status: "completed",
      createdDate: "2023-12-01",
      startDate: "2023-12-15",
      endDate: "2024-01-15",
      budget: 8000,
      spent: 7200,
      totalRecipients: 25000,
      analytics: {
        sent: 25000,
        delivered: 24500,
        opened: 9800,
        clicked: 2450,
        unsubscribed: 12,
        bounced: 500,
        converted: 89,
        revenue: 28500
      },
      audience: {
        segment: getAudienceSegment("All Prospects"),
        criteria: getCriteria("All leads and customers")
      }
    }
  ];

  const segments = [
    {
      id: "SEG001",
      name: getSegmentName("SEG001"),
      description: getSegmentDescription("SEG001"),
      count: 342,
      criteria: {
        companySize: "1000+",
        planType: t('marketing.sampleData.criteria.enterprise'),
        industry: [t('marketing.sampleData.criteria.technology'), t('marketing.sampleData.criteria.finance'), t('marketing.sampleData.criteria.healthcare')]
      }
    },
    {
      id: "SEG002", 
      name: getSegmentName("SEG002"),
      description: getSegmentDescription("SEG002"),
      count: 1250,
      criteria: {
        leadScore: "80+",
        companySize: "100-1000",
        budget: "$50K+"
      }
    },
    {
      id: "SEG003",
      name: getSegmentName("SEG003"),
      description: getSegmentDescription("SEG003"),
      count: 890,
      criteria: {
        planType: t('marketing.sampleData.criteria.trial'),
        daysInTrial: "7-30",
        engagement: t('marketing.sampleData.criteria.high')
      }
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800 border-gray-300",
      scheduled: "bg-blue-100 text-blue-800 border-blue-300",
      running: "bg-green-100 text-green-800 border-green-300",
      paused: "bg-yellow-100 text-yellow-800 border-yellow-300",
      completed: "bg-purple-100 text-purple-800 border-purple-300",
      cancelled: "bg-red-100 text-red-800 border-red-300"
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      social: Share2,
      web: Globe,
      mixed: Target
    };
    const Icon = icons[type as keyof typeof icons] || Target;
    return <Icon className="h-3 w-3" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      email: "bg-blue-100 text-blue-800",
      sms: "bg-green-100 text-green-800",
      social: "bg-purple-100 text-purple-800",
      web: "bg-orange-100 text-orange-800",
      mixed: "bg-pink-100 text-pink-800"
    };
    return colors[type as keyof typeof colors] || colors.email;
  };

  const CreateCampaignDialog = () => (
    <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('marketing.actions.createCampaign')}</DialogTitle>
          <DialogDescription>
            {t('marketing.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Campaign Basics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('marketing.campaign.details')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">{t('marketing.campaign.name')}</Label>
                <Input id="campaign-name" placeholder={t('marketing.placeholders.campaignName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-type">{t('marketing.campaign.type')}</Label>
                <Select value={selectedCampaignType} onValueChange={setSelectedCampaignType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">{t('marketing.filters.email')}</SelectItem>
                    <SelectItem value="sms">{t('marketing.filters.sms')}</SelectItem>
                    <SelectItem value="social">{t('marketing.filters.social')}</SelectItem>
                    <SelectItem value="web">{t('marketing.filters.web')}</SelectItem>
                    <SelectItem value="mixed">{t('marketing.filters.mixed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('marketing.campaign.description')}</Label>
              <Textarea id="description" placeholder={t('marketing.campaign.description')} />
            </div>
          </div>

          {/* Audience Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('marketing.campaign.targetAudience')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="segment">{t('marketing.campaign.audienceSegment')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('marketing.campaign.selectSegment')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise">{t('marketing.campaign.enterpriseCustomers')}</SelectItem>
                    <SelectItem value="high-value">{t('marketing.campaign.highValueProspects')}</SelectItem>
                    <SelectItem value="trial">{t('marketing.campaign.trialUsers')}</SelectItem>
                    <SelectItem value="custom">{t('marketing.campaign.customSegment')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated-reach">{t('marketing.campaign.estimatedReach')}</Label>
                <Input id="estimated-reach" placeholder={t('marketing.placeholders.estimatedReach')} disabled />
              </div>
            </div>
          </div>

          {/* Content Creation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('marketing.campaign.content')}</h3>
            {selectedCampaignType === "email" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('marketing.campaign.emailSubject')}</Label>
                  <Input id="subject" placeholder={t('marketing.placeholders.subject')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">{t('marketing.campaign.emailTemplate')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('marketing.campaign.selectTemplate')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-launch">{t('marketing.campaign.productLaunch')}</SelectItem>
                      <SelectItem value="newsletter">{t('marketing.campaign.newsletter')}</SelectItem>
                      <SelectItem value="promotion">{t('marketing.campaign.promotion')}</SelectItem>
                      <SelectItem value="custom">{t('marketing.campaign.custom')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="message">{t('marketing.campaign.messageContent')}</Label>
              <Textarea 
                id="message" 
                placeholder={t('marketing.campaign.messagePlaceholder')}
                className="min-h-[150px]"
              />
            </div>
          </div>

          {/* Schedule & Budget */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('marketing.campaign.scheduleBudget')}</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="start-date">{t('marketing.campaign.startDate')}</Label>
                <Input id="start-date" type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">{t('marketing.campaign.endDate')}</Label>
                <Input id="end-date" type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">{t('marketing.campaign.budget')}</Label>
                <Input id="budget" type="number" placeholder={t('marketing.placeholders.budget')} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="ab-test" />
              <Label htmlFor="ab-test">{t('marketing.campaign.enableABTesting')}</Label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateCampaignOpen(false)}>
            {t('marketing.actions.saveDraft')}
          </Button>
          <Button onClick={() => setIsCreateCampaignOpen(false)}>
            {t('marketing.actions.createCampaign')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Elite Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-gray-200/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 transform rotate-12 translate-y-1"></div>
              <Target className="h-8 w-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-2">
                {t('marketing.title') || 'Marketing'}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('marketing.subtitle') || 'Create campaigns, manage audiences, and track performance'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="bg-white/80 border-gray-200 hover:bg-white hover:border-purple-300 hover:shadow-md transition-all duration-200"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {t('marketing.actions.analytics') || 'Analytics'}
            </Button>
            <Button 
              onClick={() => setIsCreateCampaignOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('marketing.actions.newCampaign') || 'New Campaign'}
            </Button>
          </div>
        </div>
      </div>

      {/* Elite Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketingStats.map((stat, index) => (
          <Card key={index} className="bg-white/80 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{stat.label}</CardTitle>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-2">
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
              <p className="text-xs text-purple-600/70">
                <span className="text-purple-600">{stat.change}</span> {t('common.fromLastMonth') || 'from last month'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <TabsTrigger 
            value="campaigns"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            {t('marketing.tabs.campaigns') || 'Campaigns'}
          </TabsTrigger>
          <TabsTrigger value="audiences">{t('marketing.tabs.audiences')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('marketing.tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="templates">{t('marketing.tabs.templates')}</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t('marketing.filters.searchCampaigns')} className="pl-8" />
                  </div>
                </div>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">{t('marketing.filters.allStatus')}</SelectItem>
                    <SelectItem value="draft">{t('marketing.filters.draft')}</SelectItem>
                    <SelectItem value="scheduled">{t('marketing.filters.scheduled')}</SelectItem>
                    <SelectItem value="running">{t('marketing.filters.running')}</SelectItem>
                    <SelectItem value="completed">{t('marketing.filters.completed')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-types">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">{t('marketing.filters.allTypes')}</SelectItem>
                    <SelectItem value="email">{t('marketing.filters.email')}</SelectItem>
                    <SelectItem value="sms">{t('marketing.filters.sms')}</SelectItem>
                    <SelectItem value="social">{t('marketing.filters.social')}</SelectItem>
                    <SelectItem value="web">{t('marketing.filters.web')}</SelectItem>
                    <SelectItem value="mixed">{t('marketing.filters.mixed')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Campaign Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getTypeIcon(campaign.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{campaign.name}</h3>
                            <Badge className={getStatusColor(campaign.status)}>
                              {getStatusLabel(campaign.status)}
                            </Badge>
                            <Badge className={getTypeColor(campaign.type)}>
                              {getTypeIcon(campaign.type)}
                              <span className="ml-1">{getTypeLabel(campaign.type)}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{campaign.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.status === "running" && (
                          <Button variant="ghost" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {campaign.status === "paused" && (
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="grid gap-4 md:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('marketing.campaign.recipients')} </span>
                        <span className="font-semibold">{campaign.totalRecipients.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('marketing.campaign.budgetLabel')} </span>
                        <span className="font-semibold">${campaign.budget.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('marketing.campaign.spent')} </span>
                        <span className="font-semibold">${campaign.spent.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('marketing.campaign.period')} </span>
                        <span className="font-semibold">{campaign.startDate} - {campaign.endDate}</span>
                      </div>
                    </div>

                    {/* Campaign Performance */}
                    {campaign.analytics.sent > 0 && (
                      <div className="space-y-3">
                        <div className="grid gap-4 md:grid-cols-6 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{campaign.analytics.sent.toLocaleString()}</div>
                            <div className="text-muted-foreground">{t('marketing.performance.sent')}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{campaign.analytics.delivered.toLocaleString()}</div>
                            <div className="text-muted-foreground">{t('marketing.performance.delivered')}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{campaign.analytics.opened.toLocaleString()}</div>
                            <div className="text-muted-foreground">{t('marketing.performance.opened')}</div>
                            <div className="text-xs text-muted-foreground">
                              {((campaign.analytics.opened / campaign.analytics.delivered) * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{campaign.analytics.clicked.toLocaleString()}</div>
                            <div className="text-muted-foreground">{t('marketing.performance.clicked')}</div>
                            <div className="text-xs text-muted-foreground">
                              {((campaign.analytics.clicked / campaign.analytics.opened) * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{campaign.analytics.converted.toLocaleString()}</div>
                            <div className="text-muted-foreground">{t('marketing.performance.converted')}</div>
                            <div className="text-xs text-muted-foreground">
                              {((campaign.analytics.converted / campaign.analytics.clicked) * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">${campaign.analytics.revenue.toLocaleString()}</div>
                            <div className="text-muted-foreground">{t('marketing.performance.revenue')}</div>
                            <div className="text-xs text-muted-foreground">
                              {t('marketing.performance.roi')}: {(((campaign.analytics.revenue - campaign.spent) / campaign.spent) * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>

                        {/* Performance Bars */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="w-16">{t('marketing.performance.openRate')}</span>
                            <Progress 
                              value={(campaign.analytics.opened / campaign.analytics.delivered) * 100} 
                              className="flex-1 h-2" 
                            />
                            <span className="w-12 text-right">
                              {((campaign.analytics.opened / campaign.analytics.delivered) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="w-16">{t('marketing.performance.clickRate')}</span>
                            <Progress 
                              value={(campaign.analytics.clicked / campaign.analytics.opened) * 100} 
                              className="flex-1 h-2" 
                            />
                            <span className="w-12 text-right">
                              {((campaign.analytics.clicked / campaign.analytics.opened) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audiences" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('marketing.audiences.title')}</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('marketing.actions.createSegment')}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segments.map((segment) => (
              <Card key={segment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{segment.name}</CardTitle>
                      <CardDescription>{segment.description}</CardDescription>
                    </div>
                    <Badge variant="outline">
                      {segment.count.toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(segment.criteria).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-medium">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      {t('marketing.actions.view')}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      {t('marketing.actions.edit')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('marketing.campaign.performance')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('marketing.analytics.totalCampaigns')}</span>
                    <span className="font-semibold">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('marketing.analytics.averageOpenRate')}</span>
                    <span className="font-semibold">24.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('marketing.analytics.averageClickRate')}</span>
                    <span className="font-semibold">3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('marketing.analytics.conversionRate')}</span>
                    <span className="font-semibold">1.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('marketing.performance.roi')}</span>
                    <span className="font-semibold text-success">+245%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  {t('marketing.channels.channelPerformance')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { channel: t('marketing.channels.email'), percentage: 45, color: "bg-blue-500", width: "w-[45%]" },
                    { channel: t('marketing.channels.socialMedia'), percentage: 30, color: "bg-purple-500", width: "w-[30%]" },
                    { channel: t('marketing.channels.sms'), percentage: 15, color: "bg-green-500", width: "w-[15%]" },
                    { channel: t('marketing.channels.web'), percentage: 10, color: "bg-orange-500", width: "w-[10%]" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.channel}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color} ${item.width}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                {t('marketing.analytics.revenueTrend')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t('marketing.analytics.revenueTrendPlaceholder')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('marketing.templates.title')}</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('marketing.templates.createTemplate')}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: t('marketing.campaign.productLaunch'), type: 'email', icon: FileText, usage: 12 },
              { name: t('marketing.campaign.newsletter'), type: 'email', icon: Mail, usage: 8 },
              { name: t('marketing.campaign.promotion'), type: 'mixed', icon: Target, usage: 15 },
              { name: t('marketing.campaign.welcomeSeries'), type: 'email', icon: Users, usage: 5 },
              { name: t('marketing.templates.socialPost'), type: 'social', icon: Share2, usage: 23 },
              { name: t('marketing.templates.eventInvitation'), type: 'mixed', icon: Calendar, usage: 7 }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <template.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{getTypeLabel(template.type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t('marketing.templates.usedTimes', { count: template.usage })}
                    </span>
                    <Button variant="outline" size="sm">
                      {t('marketing.templates.useTemplate')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateCampaignDialog />
    </div>
  );
}
