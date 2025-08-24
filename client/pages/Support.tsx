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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  HeadphonesIcon, 
  Users,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  TrendingUp,
  TrendingDown,
  FileText,
  Paperclip,
  Send,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Building,
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  Tag,
  Archive,
  RefreshCw,
  Download,
  Upload,
  Zap,
  Target,
  BarChart3,
  Play
} from "lucide-react";

export default function Support() {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("tickets");
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const supportStats = [
    { 
      label: t('support.stats.openTickets'), 
      value: "34", 
      change: "-8", 
      icon: HeadphonesIcon,
      color: "text-blue-600"
    },
    { 
      label: t('support.stats.resolvedToday'), 
      value: "156", 
      change: "+23", 
      icon: CheckCircle,
      color: "text-green-600"
    },
    { 
      label: t('support.stats.avgResponseTime'), 
      value: "2.3h", 
      change: "-0.5h", 
      icon: Clock,
      color: "text-purple-600"
    },
    { 
      label: t('support.stats.satisfactionScore'), 
      value: "4.8/5", 
      change: "+0.2", 
      icon: Star,
      color: "text-orange-600"
    }
  ];

  const tickets = [
    {
      id: "TICKET001",
      title: "Cannot access dashboard after login",
      description: "User reports being unable to access the main dashboard after successful login. Gets redirected to blank page.",
      category: "technical",
      priority: "high",
      status: "open",
      clientId: "CLIENT001",
      clientName: "TechCorp Inc",
      clientEmail: "support@techcorp.com",
      assignedAgent: "Sarah Johnson",
      tags: ["login", "dashboard", "access"],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T14:22:00Z",
      dueDate: "2024-01-16T10:30:00Z",
      attachments: [
        { name: "screenshot.png", size: "245 KB", type: "image/png" },
        { name: "browser_console.txt", size: "12 KB", type: "text/plain" }
      ],
      comments: [
        {
          id: "COMM001",
          userId: "USER001",
          userName: "John Smith",
          userType: "customer",
          content: "This is affecting our entire team. We cannot work without access to the dashboard.",
          isInternal: false,
          createdAt: "2024-01-15T10:35:00Z"
        },
        {
          id: "COMM002", 
          userId: "AGENT001",
          userName: "Sarah Johnson",
          userType: "agent",
          content: "I've reviewed the screenshots and it appears to be a browser caching issue. Please try clearing your browser cache and cookies.",
          isInternal: false,
          createdAt: "2024-01-15T11:15:00Z"
        }
      ],
      timeSpent: 2.5,
      estimatedResolution: "4 hours"
    },
    {
      id: "TICKET002",
      title: "Billing discrepancy in invoice #INV-2024-001",
      description: "Client reports incorrect charges on their monthly invoice. Expecting $500 but was charged $750.",
      category: "billing",
      priority: "medium",
      status: "in_progress",
      clientId: "CLIENT002",
      clientName: "StartupXYZ",
      clientEmail: "billing@startupxyz.com",
      assignedAgent: "Mike Davis",
      tags: ["billing", "invoice", "pricing"],
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-15T08:30:00Z",
      dueDate: "2024-01-17T09:15:00Z",
      attachments: [
        { name: "invoice_INV-2024-001.pdf", size: "156 KB", type: "application/pdf" }
      ],
      comments: [
        {
          id: "COMM003",
          userId: "USER002",
          userName: "Emma Wilson",
          userType: "customer",
          content: "We were charged for premium features that we never activated. Please review our account settings.",
          isInternal: false,
          createdAt: "2024-01-14T09:20:00Z"
        }
      ],
      timeSpent: 1.5,
      estimatedResolution: "2 days"
    },
    {
      id: "TICKET003",
      title: "Feature request: Dark mode for mobile app",
      description: "Multiple users requesting dark mode theme option for the mobile application.",
      category: "feature_request",
      priority: "low",
      status: "waiting_customer",
      clientId: "CLIENT003",
      clientName: "Global Solutions",
      clientEmail: "feedback@globalsolutions.com",
      assignedAgent: "Lisa Chen",
      tags: ["mobile", "dark-mode", "ui"],
      createdAt: "2024-01-12T14:45:00Z",
      updatedAt: "2024-01-14T16:20:00Z",
      dueDate: "2024-01-20T14:45:00Z",
      attachments: [],
      comments: [
        {
          id: "COMM004",
          userId: "AGENT003",
          userName: "Lisa Chen", 
          userType: "agent",
          content: "Thank you for the suggestion! This has been forwarded to our product team for evaluation. We'll update you on the roadmap timeline.",
          isInternal: false,
          createdAt: "2024-01-13T10:30:00Z"
        }
      ],
      timeSpent: 0.5,
      estimatedResolution: "Product evaluation"
    }
  ];

  const clients = [
    {
      id: "CLIENT001",
      name: "TechCorp Inc",
      company: "TechCorp Inc",
      email: "contact@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      tier: "enterprise",
      assignedAgent: "Sarah Johnson",
      joinDate: "2023-03-15",
      lastContact: "2024-01-15",
      totalTickets: 12,
      openTickets: 2,
      satisfaction: 4.7,
      revenue: 85000,
      address: {
        street: "123 Tech Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA"
      },
      contacts: [
        { name: "John Smith", role: "IT Director", email: "john@techcorp.com", isPrimary: true },
        { name: "Jane Doe", role: "Operations Manager", email: "jane@techcorp.com", isPrimary: false }
      ],
      tags: ["enterprise", "tech", "priority"],
      notes: "High-value client with complex technical requirements. Priority support needed."
    },
    {
      id: "CLIENT002",
      name: "StartupXYZ",
      company: "StartupXYZ",
      email: "hello@startupxyz.com",
      phone: "+1 (555) 987-6543",
      status: "active",
      tier: "growth",
      assignedAgent: "Mike Davis",
      joinDate: "2023-08-22",
      lastContact: "2024-01-14",
      totalTickets: 8,
      openTickets: 1,
      satisfaction: 4.2,
      revenue: 25000,
      address: {
        street: "456 Innovation Ave",
        city: "Austin",
        state: "TX",
        zipCode: "73301",
        country: "USA"
      },
      contacts: [
        { name: "Emma Wilson", role: "CEO", email: "emma@startupxyz.com", isPrimary: true }
      ],
      tags: ["startup", "growth", "tech"],
      notes: "Fast-growing startup, very responsive to new features and improvements."
    },
    {
      id: "CLIENT003",
      name: "Global Solutions",
      company: "Global Solutions Ltd",
      email: "support@globalsolutions.com",
      phone: "+1 (555) 456-7890",
      status: "active",
      tier: "enterprise",
      assignedAgent: "Lisa Chen",
      joinDate: "2022-11-10",
      lastContact: "2024-01-12",
      totalTickets: 25,
      openTickets: 1,
      satisfaction: 4.9,
      revenue: 150000,
      address: {
        street: "789 Global Plaza",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      contacts: [
        { name: "David Chen", role: "CTO", email: "david@globalsolutions.com", isPrimary: true },
        { name: "Maria Rodriguez", role: "Project Manager", email: "maria@globalsolutions.com", isPrimary: false }
      ],
      tags: ["enterprise", "global", "strategic"],
      notes: "Strategic long-term partner. Excellent relationship and regular feedback provider."
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-red-100 text-red-800 border-red-300",
      in_progress: "bg-yellow-100 text-yellow-800 border-yellow-300",
      waiting_customer: "bg-blue-100 text-blue-800 border-blue-300",
      resolved: "bg-green-100 text-green-800 border-green-300",
      closed: "bg-gray-100 text-gray-800 border-gray-300",
      active: "bg-green-100 text-green-800 border-green-300",
      inactive: "bg-gray-100 text-gray-800 border-gray-300",
      churned: "bg-red-100 text-red-800 border-red-300"
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: "bg-purple-100 text-purple-800",
      billing: "bg-green-100 text-green-800",
      general: "bg-blue-100 text-blue-800",
      feature_request: "bg-indigo-100 text-indigo-800",
      bug_report: "bg-red-100 text-red-800"
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getTierColor = (tier: string) => {
    const colors = {
      basic: "bg-gray-100 text-gray-800",
      growth: "bg-blue-100 text-blue-800",
      enterprise: "bg-purple-100 text-purple-800"
    };
    return colors[tier as keyof typeof colors] || colors.basic;
  };

  const getStatusTranslationKey = (status: string) => {
    const statusMap: Record<string, string> = {
      'open': 'open',
      'in_progress': 'inProgress',
      'waiting_customer': 'waitingCustomer',
      'resolved': 'resolved',
      'closed': 'closed',
      'active': 'active',
      'inactive': 'inactive',
      'churned': 'churned'
    };
    return statusMap[status] || status;
  };

  const getCategoryTranslationKey = (category: string) => {
    const categoryMap: Record<string, string> = {
      'technical': 'technical',
      'billing': 'billing',
      'general': 'general',
      'feature_request': 'featureRequest',
      'bug_report': 'bugReport'
    };
    return categoryMap[category] || category;
  };

  const CreateTicketDialog = () => (
    <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('support.ticket.createTitle')}</DialogTitle>
          <DialogDescription>
            {t('support.ticket.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('support.ticket.details')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ticket-title">{t('support.ticket.title')}</Label>
                <Input id="ticket-title" placeholder={t('support.ticket.titlePlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-select">{t('support.ticket.client')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('support.ticket.selectClient')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techcorp">TechCorp Inc</SelectItem>
                    <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                    <SelectItem value="globalsolutions">Global Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('support.ticket.category')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('support.ticket.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">{t('support.category.technical')}</SelectItem>
                    <SelectItem value="billing">{t('support.category.billing')}</SelectItem>
                    <SelectItem value="general">{t('support.category.general')}</SelectItem>
                    <SelectItem value="feature_request">{t('support.category.featureRequest')}</SelectItem>
                    <SelectItem value="bug_report">{t('support.category.bugReport')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">{t('support.ticket.priority')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('support.ticket.selectPriority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('support.priority.low')}</SelectItem>
                    <SelectItem value="medium">{t('support.priority.medium')}</SelectItem>
                    <SelectItem value="high">{t('support.priority.high')}</SelectItem>
                    <SelectItem value="urgent">{t('support.priority.urgent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('support.ticket.description')}</Label>
              <Textarea 
                id="description" 
                placeholder={t('support.ticket.descriptionPlaceholder')}
                className="min-h-[120px]"
              />
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('support.ticket.assignment')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assigned-agent">{t('support.ticket.assignedAgent')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('support.ticket.autoAssign')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Davis</SelectItem>
                    <SelectItem value="lisa">Lisa Chen</SelectItem>
                    <SelectItem value="auto">{t('support.ticket.autoAssign')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">{t('support.ticket.dueDate')}</Label>
                <Input id="due-date" type="datetime-local" />
              </div>
            </div>
          </div>

          {/* Tags & Attachments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('support.ticket.additionalInfo')}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">{t('support.ticket.tags')}</Label>
                <Input id="tags" placeholder={t('support.ticket.tagsPlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachments">{t('support.ticket.attachments')}</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t('support.ticket.dragDropFiles')}
                  </p>
                  <Button variant="outline" className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    {t('support.actions.browseFiles')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateTicketOpen(false)}>
            {t('support.actions.cancel')}
          </Button>
          <Button onClick={() => setIsCreateTicketOpen(false)}>
            {t('support.actions.createTicket')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const CreateClientDialog = () => (
    <Dialog open={isCreateClientOpen} onOpenChange={setIsCreateClientOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('support.client.createTitle')}</DialogTitle>
          <DialogDescription>
            {t('support.client.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('support.client.companyInfo')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name">{t('support.client.companyName')}</Label>
                <Input id="company-name" placeholder={t('support.client.companyNamePlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-tier">{t('support.client.clientTier')}</Label>
                <Select defaultValue="basic">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">{t('support.tier.basic')}</SelectItem>
                    <SelectItem value="growth">{t('support.tier.growth')}</SelectItem>
                    <SelectItem value="enterprise">{t('support.tier.enterprise')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">{t('support.client.primaryEmail')}</Label>
                <Input id="company-email" type="email" placeholder={t('support.client.emailPlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-phone">{t('support.client.phone')}</Label>
                <Input id="company-phone" placeholder={t('support.client.phonePlaceholder')} />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('support.client.address')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">{t('support.client.streetAddress')}</Label>
                <Input id="street" placeholder={t('support.client.streetPlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t('support.client.city')}</Label>
                <Input id="city" placeholder={t('support.client.cityPlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">{t('support.client.state')}</Label>
                <Input id="state" placeholder={t('support.client.statePlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">{t('support.client.zipCode')}</Label>
                <Input id="zip" placeholder={t('support.client.zipPlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('support.client.country')}</Label>
                <Input id="country" defaultValue={t('support.client.countryDefault')} />
              </div>
            </div>
          </div>

          {/* Primary Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('support.client.primaryContact')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">{t('support.client.contactName')}</Label>
                <Input id="contact-name" placeholder={t('support.client.contactNamePlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-role">{t('support.client.contactRole')}</Label>
                <Input id="contact-role" placeholder={t('support.client.contactRolePlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">{t('support.client.contactEmail')}</Label>
                <Input id="contact-email" type="email" placeholder={t('support.client.contactEmailPlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">{t('support.client.contactPhone')}</Label>
                <Input id="contact-phone" placeholder={t('support.client.contactPhonePlaceholder')} />
              </div>
            </div>
          </div>

          {/* Assignment & Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('support.client.accountManagement')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assigned-agent">{t('support.ticket.assignedAgent')}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('support.client.selectAgent')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Davis</SelectItem>
                    <SelectItem value="lisa">Lisa Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-tags">{t('support.client.clientTags')}</Label>
                <Input id="client-tags" placeholder={t('support.client.clientTagsPlaceholder')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-notes">{t('support.client.notes')}</Label>
              <Textarea id="client-notes" placeholder={t('support.client.notesPlaceholder')} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateClientOpen(false)}>
            {t('support.actions.cancel')}
          </Button>
          <Button onClick={() => setIsCreateClientOpen(false)}>
            {t('support.client.addClient')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('support.title')}</h1>
          <p className="text-muted-foreground">{t('support.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('support.actions.reports')}
          </Button>
          <Button onClick={() => setIsCreateTicketOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('support.actions.newTicket')}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {supportStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{stat.change}</span> {t('support.stats.fromYesterday')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">{t('support.tabs.tickets')}</TabsTrigger>
          <TabsTrigger value="clients">{t('support.tabs.clients')}</TabsTrigger>
          <TabsTrigger value="knowledge">{t('support.tabs.knowledge')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('support.tabs.analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t('support.filters.searchTickets')} className="pl-8" />
                  </div>
                </div>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">{t('support.filters.allStatus')}</SelectItem>
                    <SelectItem value="open">{t('support.status.open')}</SelectItem>
                    <SelectItem value="in_progress">{t('support.status.inProgress')}</SelectItem>
                    <SelectItem value="waiting_customer">{t('support.status.waitingCustomer')}</SelectItem>
                    <SelectItem value="resolved">{t('support.status.resolved')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-priority">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-priority">{t('support.filters.allPriority')}</SelectItem>
                    <SelectItem value="urgent">{t('support.priority.urgent')}</SelectItem>
                    <SelectItem value="high">{t('support.priority.high')}</SelectItem>
                    <SelectItem value="medium">{t('support.priority.medium')}</SelectItem>
                    <SelectItem value="low">{t('support.priority.low')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Ticket Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback>{ticket.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{ticket.title}</h3>
                            <Badge className={getStatusColor(ticket.status)}>
                              {t(`support.status.${getStatusTranslationKey(ticket.status)}`)}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {t({ low: 'support.priority.low', medium: 'support.priority.medium', high: 'support.priority.high', urgent: 'support.priority.urgent' }[ticket.priority] || 'support.priority.medium')}
                            </Badge>
                            <Badge className={getCategoryColor(ticket.category)}>
                              {t(`support.category.${getCategoryTranslationKey(ticket.category)}`)}
                            </Badge>
                            <Badge variant="outline">
                              #{ticket.id}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="grid gap-4 md:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('support.ticket.clientLabel')} </span>
                        <span className="font-semibold">{ticket.clientName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('support.ticket.agentLabel')} </span>
                        <span className="font-semibold">{ticket.assignedAgent}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('support.ticket.createdLabel')} </span>
                        <span className="font-semibold">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('support.ticket.timeSpentLabel')} </span>
                        <span className="font-semibold">{ticket.timeSpent}{t('support.ticket.timeSpentValue')}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <div className="flex gap-1">
                        {ticket.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Attachments */}
                    {ticket.attachments.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                        <div className="flex gap-2">
                          {ticket.attachments.map((attachment, index) => (
                            <div key={index} className="text-xs bg-muted px-2 py-1 rounded">
                              {attachment.name} ({attachment.size})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        {t('support.actions.reply')}
                      </Button>
                      {ticket.status === "open" && (
                        <Button size="sm" variant="outline">
                          <Play className="mr-1 h-3 w-3" />
                          {t('support.actions.startWork')}
                        </Button>
                      )}
                      {ticket.status === "in_progress" && (
                        <Button size="sm" variant="outline">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {t('support.actions.resolve')}
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Archive className="mr-1 h-3 w-3" />
                        {t('support.actions.archive')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('support.tabs.clients')}</h3>
            <Button onClick={() => setIsCreateClientOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('support.actions.addClient')}
            </Button>
          </div>

          <div className="space-y-4">
            {clients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Client Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="" />
                          <AvatarFallback>{client.company.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{client.company}</h3>
                            <Badge className={getStatusColor(client.status)}>
                              {t(`support.status.${getStatusTranslationKey(client.status)}`)}
                            </Badge>
                            <Badge className={getTierColor(client.tier)}>
                              {t({ basic: 'support.tier.basic', growth: 'support.tier.growth', enterprise: 'support.tier.enterprise' }[client.tier] || 'support.tier.basic')}
                            </Badge>
                            {client.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {client.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {client.address.city}, {client.address.state}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {client.assignedAgent}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Client Metrics */}
                    <div className="grid gap-4 md:grid-cols-5 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{client.totalTickets}</div>
                        <div className="text-muted-foreground">{t('support.client.totalTickets')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{client.openTickets}</div>
                        <div className="text-muted-foreground">{t('support.client.openTickets')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold flex items-center justify-center gap-1">
                          {client.satisfaction}
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="text-muted-foreground">{t('support.client.satisfaction')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">${client.revenue.toLocaleString()}</div>
                        <div className="text-muted-foreground">{t('support.client.annualRevenue')}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{client.lastContact}</div>
                        <div className="text-muted-foreground">{t('support.client.lastContact')}</div>
                      </div>
                    </div>

                    {/* Primary Contacts */}
                    <div className="space-y-2">
                      <h4 className="font-medium">{t('support.client.primaryContacts')}</h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {client.contacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-sm text-muted-foreground">{contact.role}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {contact.email}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {client.notes && (
                      <div className="bg-muted p-3 rounded-lg">
                        <h4 className="font-medium mb-1">{t('support.client.clientNotes')}</h4>
                        <p className="text-sm">{client.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('support.knowledge.title')}</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('support.actions.addArticle')}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: t('support.knowledge.articleTitles.passwordReset'), category: t('support.category.account'), views: 1250, helpful: 89 },
              { title: t('support.knowledge.articleTitles.integrationSetup'), category: t('support.category.technical'), views: 890, helpful: 95 },
              { title: t('support.knowledge.articleTitles.billingFaq'), category: t('support.category.billing'), views: 756, helpful: 82 },
              { title: t('support.knowledge.articleTitles.mobileFeatures'), category: t('support.category.product'), views: 634, helpful: 91 },
              { title: t('support.knowledge.articleTitles.apiDocs'), category: t('support.category.technical'), views: 567, helpful: 88 },
              { title: t('support.knowledge.articleTitles.dataExport'), category: t('support.category.technical'), views: 423, helpful: 86 }
            ].map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{article.title}</h4>
                        <Badge variant="outline" className="mt-1">
                          {article.category}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{article.views} {t('support.knowledge.views')}</span>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {article.helpful}%
                      </div>
                    </div>
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
                  {t('support.analytics.ticketTrends')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('support.analytics.ticketsThisMonth')}</span>
                    <span className="font-semibold">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('support.analytics.avgResolutionTime')}</span>
                    <span className="font-semibold">4.2 {t('support.analytics.hours')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('support.analytics.firstResponseTime')}</span>
                    <span className="font-semibold">18 {t('support.analytics.minutes')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('support.analytics.customerSatisfaction')}</span>
                    <span className="font-semibold">4.8/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('support.analytics.agentPerformance')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { agent: "Sarah Johnson", tickets: 45, rating: 4.9, response: "12" },
                    { agent: "Mike Davis", tickets: 38, rating: 4.7, response: "15" },
                    { agent: "Lisa Chen", tickets: 42, rating: 4.8, response: "14" }
                  ].map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{agent.agent}</div>
                        <div className="text-sm text-muted-foreground">{agent.tickets} {t('support.analytics.tickets') || 'tickets'}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {agent.rating}
                        </div>
                        <div className="text-muted-foreground">{agent.response} {t('support.analytics.minutes')} {t('support.analytics.avg') || 'avg'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CreateTicketDialog />
      <CreateClientDialog />
    </div>
  );
}
