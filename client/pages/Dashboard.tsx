import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Users,
  TrendingUp,
  Package,
  HeadphonesIcon,
  Activity,
  Calendar,
  BarChart3,
  PhoneCall,
  UserCheck,
  Target,
  Factory,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";
import { formatCurrency } from "@/lib/i18n";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleQuickCall = () => {
    console.log('Quick call initiated');
    navigate('/calls?tab=active');
  };
  const egpRevenue = formatCurrency(1200000, 'ar-EG', { maximumFractionDigits: 0 });

  const departments = [
    {
      name: t('nav.sales'),
      icon: TrendingUp,
      color: "bg-sales text-white",
  stats: { leads: 247, deals: 89, revenue: egpRevenue },
      path: "/sales"
    },
    {
      name: t('nav.hr'),
      icon: Users,
      color: "bg-hr text-white",
      stats: { employees: 156, pending: 12, attendance: "94%" },
      path: "/hr"
    },
    {
      name: t('nav.marketing'),
      icon: Target,
      color: "bg-marketing text-white",
      stats: { campaigns: 23, reach: "45K", conversion: "3.2%" },
      path: "/marketing"
    },
    {
      name: t('nav.manufacturing'),
      icon: Factory,
      color: "bg-manufacturing text-white",
      stats: { orders: 67, inventory: 2341, quality: "99.1%" },
      path: "/manufacturing"
    },
    {
      name: t('nav.support'),
      icon: HeadphonesIcon,
      color: "bg-support text-white",
      stats: { tickets: 34, resolved: 156, satisfaction: "4.8/5" },
      path: "/support"
    }
  ];

  const recentActivity = [
    {
      type: "call",
      content: t('dashboard.recentActivities.newCall', { name: 'John Smith', type: t('dashboard.recentActivities.salesInquiry') }),
      time: t('dashboard.recentActivities.minutesAgo', { minutes: 2 }),
      icon: PhoneCall
    },
    {
      type: "lead",
      content: t('dashboard.recentActivities.newLead', { company: 'TechCorp Inc.' }),
      time: t('dashboard.recentActivities.minutesAgo', { minutes: 5 }),
      icon: UserCheck
    },
    {
      type: "support",
      content: t('dashboard.recentActivities.ticketResolved', { number: '1234', agent: 'Sarah' }),
      time: t('dashboard.recentActivities.minutesAgo', { minutes: 12 }),
      icon: MessageSquare
    },
    {
      type: "hr",
      content: t('dashboard.recentActivities.newHire', { name: 'Alex Johnson' }),
      time: t('dashboard.recentActivities.hoursAgo', { hours: 1 }),
      icon: Users
    },
    {
      type: "manufacturing",
      content: t('dashboard.recentActivities.orderShipped', { number: '5678' }),
      time: t('dashboard.recentActivities.hoursAgo', { hours: 2 }),
      icon: Package
    }
  ];

  const quickStats = [
    { label: t('dashboard.stats.totalCallsToday'), value: "127", change: "+12%", icon: Phone },
    { label: t('dashboard.stats.activeDeals'), value: "89", change: "+8%", icon: TrendingUp },
    { label: t('dashboard.stats.openTickets'), value: "34", change: "-15%", icon: HeadphonesIcon },
    { label: t('dashboard.stats.teamMembers'), value: "156", change: "+3%", icon: Users }
  ];

  // Map keys used in dept.stats to explicit translation keys to avoid dynamic template literals in t()
  const deptStatLabel: Record<string, string> = {
    leads: t('dashboard.deptStats.leads'),
    deals: t('dashboard.deptStats.deals'),
    revenue: t('dashboard.deptStats.revenue'),
    employees: t('dashboard.deptStats.employees'),
    pending: t('dashboard.deptStats.pending'),
    attendance: t('dashboard.deptStats.attendance'),
    campaigns: t('dashboard.deptStats.campaigns'),
    reach: t('dashboard.deptStats.reach'),
    conversion: t('dashboard.deptStats.conversion'),
    orders: t('dashboard.deptStats.orders'),
    inventory: t('dashboard.deptStats.inventory'),
    quality: t('dashboard.deptStats.quality'),
    tickets: t('dashboard.deptStats.tickets'),
    resolved: t('dashboard.deptStats.resolved'),
    satisfaction: t('dashboard.deptStats.satisfaction')
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleQuickCall}>
            <Phone className="mr-2 h-4 w-4" />
            {t('dashboard.makeQuickCall')}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/calls">
              {t('nav.callCenter')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{stat.change}</span> {t('dashboard.stats.fromLastMonth')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${dept.color}`}>
                    <dept.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                    <CardDescription>{t('dashboard.departmentOverview')}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={dept.path}>{t('common.view')}</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {Object.entries(dept.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="font-semibold">{value}</div>
                    <div className="text-muted-foreground capitalize">{deptStatLabel[key] || key}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & AI Answering Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('dashboard.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-muted">
                    <activity.icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.content}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('dashboard.aiAnsweringStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <dept.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{dept.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success">
                    {t('common.active')}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/ai-answering">{t('settings.tabs.ai')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
