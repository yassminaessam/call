import { BarChart3, TrendingUp, Users, Phone, DollarSign, Activity, Clock, Target } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Analytics() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-600 mb-2">{t('dashboard.analyticsTitle') || 'CRM Analytics'}</h1>
            <div className="w-16 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t('dashboard.analyticsDescription') || 'Data Analysis and Reports'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.analytics.totalRevenue') || 'Total Revenue'}</p>
                <p className="text-3xl font-bold text-green-600">$124,580</p>
                <p className="text-sm text-green-600">+12.5% {t('dashboard.analytics.fromLastMonth') || 'from last month'}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.analytics.totalCalls') || 'Total Calls'}</p>
                <p className="text-3xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-blue-600">+8.2% {t('dashboard.analytics.fromLastWeek') || 'from last week'}</p>
              </div>
              <Phone className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.analytics.activeUsers') || 'Active Users'}</p>
                <p className="text-3xl font-bold text-purple-600">342</p>
                <p className="text-sm text-purple-600">+5.1% {t('dashboard.analytics.fromYesterday') || 'from yesterday'}</p>
              </div>
              <Users className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.analytics.conversionRate') || 'Conversion Rate'}</p>
                <p className="text-3xl font-bold text-orange-600">23.4%</p>
                <p className="text-sm text-orange-600">+2.1% {t('dashboard.analytics.fromLastMonth') || 'from last month'}</p>
              </div>
              <Target className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.analytics.revenueChart') || 'Revenue Trends'}</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('dashboard.analytics.chartPlaceholder') || 'Chart visualization will be implemented here'}</p>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.analytics.activityChart') || 'Daily Activity'}</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('dashboard.analytics.chartPlaceholder') || 'Chart visualization will be implemented here'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.analytics.departmentPerformance') || 'Department Performance'}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">{t('nav.sales') || 'Sales'}</h4>
              <p className="text-2xl font-bold text-blue-600">92%</p>
              <p className="text-sm text-blue-600">{t('dashboard.analytics.performance') || 'Performance'}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">{t('nav.support') || 'Support'}</h4>
              <p className="text-2xl font-bold text-green-600">88%</p>
              <p className="text-sm text-green-600">{t('dashboard.analytics.performance') || 'Performance'}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">{t('nav.marketing') || 'Marketing'}</h4>
              <p className="text-2xl font-bold text-purple-600">85%</p>
              <p className="text-sm text-purple-600">{t('dashboard.analytics.performance') || 'Performance'}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900">{t('nav.hr') || 'HR'}</h4>
              <p className="text-2xl font-bold text-orange-600">90%</p>
              <p className="text-sm text-orange-600">{t('dashboard.analytics.performance') || 'Performance'}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.analytics.recentActivity') || 'Recent Activity'}</h3>
            <Clock className="w-5 h-5 text-gray-600" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{t('dashboard.analytics.activity.newSale') || 'New sale recorded'} - $2,450</span>
              </div>
              <span className="text-xs text-gray-500">2 {t('dashboard.analytics.minutesAgo') || 'minutes ago'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{t('dashboard.analytics.activity.supportTicket') || 'Support ticket resolved'}</span>
              </div>
              <span className="text-xs text-gray-500">5 {t('dashboard.analytics.minutesAgo') || 'minutes ago'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{t('dashboard.analytics.activity.marketingCampaign') || 'Marketing campaign launched'}</span>
              </div>
              <span className="text-xs text-gray-500">15 {t('dashboard.analytics.minutesAgo') || 'minutes ago'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}