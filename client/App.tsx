import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import CRMLayout from "@/components/CRMLayout";
import { TranslationProvider, useTranslation } from "@/contexts/TranslationContext";
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

// Critical above-the-fold page (keep eager): Dashboard
import Dashboard from "@/pages/Dashboard";

// Lazy loaded feature pages
const CallCenter = lazy(() => import('@/pages/CallCenter'));
const AIAnswering = lazy(() => import('@/pages/AIAnswering'));
const Sales = lazy(() => import('@/pages/Sales'));
const HR = lazy(() => import('@/pages/HR'));
const Marketing = lazy(() => import('@/pages/Marketing'));
const Manufacturing = lazy(() => import('@/pages/Manufacturing'));
const Support = lazy(() => import('@/pages/Support'));
const SettingsPage = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const TranslationDemo = lazy(() => import('@/pages/TranslationDemo'));

// Placeholder components for routes (currently unused but kept for future lazy modules)
const PlaceholderPage = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-6">
        {t('common.placeholders.comingSoon')}
      </p>
      <div className="px-4 py-2 bg-muted rounded-lg text-sm">
        {t('common.placeholders.moduleLabel')} {title}
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <TranslationProvider>
        <AppContent />
      </TranslationProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { ready } = useTranslation();
  
  // Show loading state while translations initialize
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner label="Loading translations..." />
          <p className="mt-4 text-sm text-muted-foreground">
            Initializing language system...
          </p>
        </div>
      </div>
    );
  }
  
  return <AppRoutes />;
}

function AppRoutes() {
  const { language } = useTranslation();

  return (
    <BrowserRouter key={language}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <LoadingSpinner label="Loading module..." />
        </div>
      }> 
        <Routes>
        <Route path="/" element={
          <CRMLayout>
            <Dashboard />
          </CRMLayout>
        } />

        <Route path="/calls" element={
          <CRMLayout>
            <CallCenter />
          </CRMLayout>
        } />

        <Route path="/sales" element={
          <CRMLayout>
            <Sales />
          </CRMLayout>
        } />

        <Route path="/hr" element={
          <CRMLayout>
            <HR />
          </CRMLayout>
        } />

        <Route path="/marketing" element={
          <CRMLayout>
            <Marketing />
          </CRMLayout>
        } />

        <Route path="/manufacturing" element={
          <CRMLayout>
            <Manufacturing />
          </CRMLayout>
        } />

        <Route path="/support" element={
          <CRMLayout>
            <Support />
          </CRMLayout>
        } />

        <Route path="/ai-answering" element={
          <CRMLayout>
            <AIAnswering />
          </CRMLayout>
        } />

        <Route path="/settings" element={
          <CRMLayout>
            <SettingsPage />
          </CRMLayout>
        } />

        <Route path="/translation-demo" element={
          <CRMLayout>
            <TranslationDemo />
          </CRMLayout>
        } />

        <Route path="*" element={
          <CRMLayout>
            <NotFound />
          </CRMLayout>
        } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
