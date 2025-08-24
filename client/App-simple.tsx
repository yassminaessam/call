import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { TranslationProvider, useTranslation } from "@/contexts/TranslationContext";

function SimpleDashboard() {
  const { t } = useTranslation();
  const modules = [
    { key: 'dashboard', path: '/' },
    { key: 'callCenter', path: '/calls' },
    { key: 'sales', path: '/sales' },
    { key: 'hr', path: '/hr' },
    { key: 'marketing', path: '/marketing' },
    { key: 'manufacturing', path: '/manufacturing' },
    { key: 'support', path: '/support' },
    { key: 'aiAnswering', path: '/ai-answering' }
  ];
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{t('simpleDashboard.title')}</h1>
      <p className="text-gray-600 mb-8">{t('simpleDashboard.subtitle')}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map(m => {
          const base = `simpleDashboard.modules.${m.key}`;
          const titleKeyMap: Record<string,string> = {
            dashboard: 'simpleDashboard.modules.dashboard.title',
            callCenter: 'simpleDashboard.modules.callCenter.title',
            sales: 'simpleDashboard.modules.sales.title',
            hr: 'simpleDashboard.modules.hr.title',
            marketing: 'simpleDashboard.modules.marketing.title',
            manufacturing: 'simpleDashboard.modules.manufacturing.title',
            support: 'simpleDashboard.modules.support.title',
            aiAnswering: 'simpleDashboard.modules.aiAnswering.title'
          };
          const descKeyMap: Record<string,string> = {
            dashboard: 'simpleDashboard.modules.dashboard.description',
            callCenter: 'simpleDashboard.modules.callCenter.description',
            sales: 'simpleDashboard.modules.sales.description',
            hr: 'simpleDashboard.modules.hr.description',
            marketing: 'simpleDashboard.modules.marketing.description',
            manufacturing: 'simpleDashboard.modules.manufacturing.description',
            support: 'simpleDashboard.modules.support.description',
            aiAnswering: 'simpleDashboard.modules.aiAnswering.description'
          };
          const linkKeyMap: Record<string,string> = {
            dashboard: 'simpleDashboard.modules.dashboard.link',
            callCenter: 'simpleDashboard.modules.callCenter.link',
            sales: 'simpleDashboard.modules.sales.link',
            hr: 'simpleDashboard.modules.hr.link',
            marketing: 'simpleDashboard.modules.marketing.link',
            manufacturing: 'simpleDashboard.modules.manufacturing.link',
            support: 'simpleDashboard.modules.support.link',
            aiAnswering: 'simpleDashboard.modules.aiAnswering.link'
          };
          return (
            <div key={m.key} className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{t(titleKeyMap[m.key] || `${base}.title`)}</h2>
              <p className="text-gray-600 mb-4">{t(descKeyMap[m.key] || `${base}.description`)}</p>
              <Link to={m.path} className="text-blue-600 hover:text-blue-800">{t(linkKeyMap[m.key] || `${base}.link`)}</Link>
            </div>
          );
        })}
      </div>
      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">{t('simpleDashboard.complete.title')}</h3>
        <p className="text-green-700">{t('simpleDashboard.complete.intro')}</p>
        <ul className="list-disc list-inside text-green-700 mt-2 space-y-1">
          {['firebase','buttons','notifications','exportImport','api','design'].map(f => {
            const featureMap: Record<string,string> = {
              firebase: 'simpleDashboard.complete.features.firebase',
              buttons: 'simpleDashboard.complete.features.buttons',
              notifications: 'simpleDashboard.complete.features.notifications',
              exportImport: 'simpleDashboard.complete.features.exportImport',
              api: 'simpleDashboard.complete.features.api',
              design: 'simpleDashboard.complete.features.design'
            };
            return <li key={f}>{t(featureMap[f] || `simpleDashboard.complete.features.${f}`)}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <TranslationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<SimpleDashboard />} />
        </Routes>
      </BrowserRouter>
    </TranslationProvider>
  );
}

export default App;
