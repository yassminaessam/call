import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Users,
  TrendingUp,
  Package,
  HeadphonesIcon,
  Activity,
  BarChart3,
  Target,
  Factory,
  MessageSquare,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleQuickCall = () => {
    console.log('Quick call initiated');
    navigate('/calls?tab=active');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-600 mb-2">{t('dashboard.title') || 'Fusion CRM'}</h1>
            <div className="w-16 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t('dashboard.subtitle') || 'Elite Operations Dashboard'}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={handleQuickCall} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2">
              <Phone className="mr-2 h-4 w-4" />
              {t('dashboard.systemOnline') || 'System Online'}
            </Button>
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
              {t('dashboard.welcomeBack') || 'Welcome back, admin'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">99%</div>
            <div className="text-gray-700 text-sm font-medium">{t('dashboard.stats.systemUptime') || 'System Uptime'}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">24</div>
            <div className="text-gray-700 text-sm font-medium">{t('dashboard.stats.activeCalls') || 'Active Calls'}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">$12,580</div>
            <div className="text-gray-700 text-sm font-medium">{t('dashboard.stats.dailyRevenue') || 'Daily Revenue'}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">156</div>
            <div className="text-gray-700 text-sm font-medium">{t('dashboard.stats.activeUsers') || 'Active Users'}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 font-medium">
              <Phone className="mr-2 h-4 w-4" />
              {t('dashboard.allSystems') || 'All Systems'}
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium">
              <BarChart3 className="mr-2 h-4 w-4" />
              {t('dashboard.operations') || 'Operations'}
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium">
              <Target className="mr-2 h-4 w-4" />
              {t('nav.marketing') || 'Marketing'}
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium">
              <Package className="mr-2 h-4 w-4" />
              {t('nav.support') || 'Support'}
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium">
              <TrendingUp className="mr-2 h-4 w-4" />
              {t('nav.sales') || 'Sales'}
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium">
              <MessageSquare className="mr-2 h-4 w-4" />
              {t('nav.aiAnswering') || 'AI Answering'}
            </Button>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium">
              <Activity className="mr-2 h-4 w-4" />
              {t('nav.manufacturing') || 'Manufacturing'}
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium">
              <HeadphonesIcon className="mr-2 h-4 w-4" />
              {t('nav.hr') || 'HR'}
            </Button>
          </div>
        </div>

        {/* Department Modules */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* AI Answering Module */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
               onClick={() => navigate('/ai-answering')}>
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
              <Badge className="bg-white/20 text-white px-2 py-1 text-xs rounded-full font-medium">AI</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('nav.aiAnswering') || 'AI Answering'}</h3>
            <p className="text-purple-100 text-sm mb-4">{t('aiAnswering.description') || 'Smart Response System'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ⚡ {t('common.active') || 'Active'}
            </div>
          </div>

          {/* Call Center Module */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
               onClick={() => navigate('/calls')}>
            <div className="flex items-center justify-between mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('nav.callCenter') || 'Call Center'}</h3>
            <p className="text-green-100 text-sm mb-4">{t('callCenter.description') || 'Call and Communication Management'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ○ {t('common.active') || 'Active'}
            </div>
          </div>

          {/* HR Module */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
               onClick={() => navigate('/hr')}>
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-white" />
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs text-white font-medium">◊ {t('common.active') || 'Active'}</div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('nav.hr') || 'Human Resources'}</h3>
            <p className="text-blue-100 text-sm mb-4">{t('hr.description') || 'Employee and HR Management'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ✓ {t('common.active') || 'Active'}
            </div>
          </div>

          {/* Marketing Module */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
               onClick={() => navigate('/marketing')}>
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-white" />
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs text-white font-medium">✓ {t('common.active') || 'Active'}</div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('nav.marketing') || 'Marketing'}</h3>
            <p className="text-purple-100 text-sm mb-4">{t('marketing.description') || 'Marketing Campaigns and Customer Management'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ○ {t('common.active') || 'Active'}
            </div>
          </div>

          {/* Manufacturing Module */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
               onClick={() => navigate('/manufacturing')}>
            <div className="flex items-center justify-between mb-4">
              <Factory className="w-8 h-8 text-white" />
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs text-white font-medium">⚡ {t('common.active') || 'Active'}</div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('nav.manufacturing') || 'Manufacturing'}</h3>
            <p className="text-orange-100 text-sm mb-4">{t('manufacturing.description') || 'Production Operations Management'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ✓ {t('common.active') || 'Active'}
            </div>
          </div>

          {/* Sales Module */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
               onClick={() => navigate('/sales')}>
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs text-white font-medium">✓ {t('common.active') || 'Active'}</div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('nav.sales') || 'Sales'}</h3>
            <p className="text-green-100 text-sm mb-4">{t('sales.description') || 'Sales and Deals Management'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ✓ {t('common.active') || 'Active'}
            </div>
          </div>

          {/* Support Module */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
               onClick={() => navigate('/support')}>
            <div className="flex items-center justify-center mb-4">
              <HeadphonesIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('nav.support') || 'Support'}</h3>
            <p className="text-cyan-100 text-sm mb-4">{t('support.description') || 'Customer Service and Technical Support'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ○ {t('common.active') || 'Active'}
            </div>
          </div>
        </div>

        {/* Bottom Section - CRM Management */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Settings Module */}
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-8 h-8 text-white" />
              <Badge className="bg-white/20 text-white px-2 py-1 text-xs rounded-full font-medium">ADMIN</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('nav.settings') || 'Settings'}</h3>
            <p className="text-gray-100 text-sm mb-4">{t('settings.description') || 'System Settings and Configuration'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ⚙ {t('common.active') || 'Active'}
            </div>
          </div>

          {/* CRM Analytics */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('dashboard.analytics') || 'CRM Analytics'}</h3>
            <p className="text-blue-100 text-sm mb-4">{t('dashboard.analyticsDescription') || 'Data Analysis and Reports'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ○ {t('common.active') || 'Active'}
            </div>
          </div>

          {/* System Management */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{t('dashboard.systemManagement') || 'System Management'}</h3>
            <p className="text-indigo-100 text-sm mb-4">{t('dashboard.systemDescription') || 'System Administration and Maintenance'}</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block text-white font-medium">
              ○ {t('common.active') || 'Active'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}