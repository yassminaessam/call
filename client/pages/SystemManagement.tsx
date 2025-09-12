import { Activity, Shield, Database, Server, Cpu, HardDrive, Network, Monitor, AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

export default function SystemManagement() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-full mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-indigo-600 mb-2">{t('dashboard.systemManagement') || 'System Management'}</h1>
            <div className="w-16 h-1 bg-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t('dashboard.systemDescription') || 'System Administration and Maintenance'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* System Status */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.system.cpuUsage') || 'CPU Usage'}</p>
                <p className="text-3xl font-bold text-blue-600">23%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
              <Cpu className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.system.memoryUsage') || 'Memory Usage'}</p>
                <p className="text-3xl font-bold text-green-600">67%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full w-2/3"></div>
                </div>
              </div>
              <Database className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.system.diskUsage') || 'Disk Usage'}</p>
                <p className="text-3xl font-bold text-orange-600">45%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-orange-600 h-2 rounded-full w-5/12"></div>
                </div>
              </div>
              <HardDrive className="w-12 h-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.system.networkSpeed') || 'Network Speed'}</p>
                <p className="text-3xl font-bold text-purple-600">1.2 GB/s</p>
                <p className="text-sm text-green-600">{t('dashboard.system.stable') || 'Stable'}</p>
              </div>
              <Network className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* System Services */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.system.services') || 'System Services'}</h3>
              <Server className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.system.webServer') || 'Web Server'}</span>
                </div>
                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                  {t('dashboard.system.running') || 'Running'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.system.database') || 'Database'}</span>
                </div>
                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                  {t('dashboard.system.running') || 'Running'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.system.apiService') || 'API Service'}</span>
                </div>
                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                  {t('dashboard.system.running') || 'Running'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.system.backupService') || 'Backup Service'}</span>
                </div>
                <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
                  {t('dashboard.system.warning') || 'Warning'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.system.security') || 'Security Status'}</h3>
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.system.firewall') || 'Firewall'}</span>
                </div>
                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                  {t('dashboard.system.active') || 'Active'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.system.sslCertificate') || 'SSL Certificate'}</span>
                </div>
                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                  {t('dashboard.system.valid') || 'Valid'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.system.antiVirus') || 'Anti-virus'}</span>
                </div>
                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                  {t('dashboard.system.updated') || 'Updated'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{t('dashboard.system.monitoring') || 'System Monitoring'}</span>
                </div>
                <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full font-medium">
                  {t('dashboard.system.active') || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.system.systemLogs') || 'System Logs'}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">[INFO] {t('dashboard.system.logs.systemStartup') || 'System startup completed successfully'}</span>
              </div>
              <span className="text-xs text-gray-500">09:15:32</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">[INFO] {t('dashboard.system.logs.userLogin') || 'User authentication successful'}</span>
              </div>
              <span className="text-xs text-gray-500">09:12:18</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">[WARN] {t('dashboard.system.logs.highMemory') || 'Memory usage above 60%'}</span>
              </div>
              <span className="text-xs text-gray-500">09:10:45</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">[INFO] {t('dashboard.system.logs.backupCompleted') || 'Backup operation completed'}</span>
              </div>
              <span className="text-xs text-gray-500">08:30:12</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.system.quickActions') || 'Quick Actions'}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <Server className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-blue-900">{t('dashboard.system.restartServices') || 'Restart Services'}</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-900">{t('dashboard.system.backupDatabase') || 'Backup Database'}</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <Monitor className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium text-purple-900">{t('dashboard.system.viewLogs') || 'View Logs'}</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="font-medium text-orange-900">{t('dashboard.system.securityScan') || 'Security Scan'}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}