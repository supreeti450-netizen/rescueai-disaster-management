import React, { useState, useEffect } from 'react';
import { RescueProvider } from './context/RescueContext';
import { Navbar } from './components/layout/Navbar';
import { ResponderSidebar } from './components/layout/ResponderSidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CitizenReportPage } from './pages/CitizenReportPage';
import { CitizenSosPage } from './pages/CitizenSosPage';
import { CitizenAiAnalysisPage } from './pages/CitizenAiAnalysisPage';
import { CitizenStatusPage } from './pages/CitizenStatusPage';
import { ResponderDashboardPage } from './pages/ResponderDashboardPage';
import { EmergenciesPage } from './pages/EmergenciesPage';
import { VictimsPage } from './pages/VictimsPage';
import { FullMapPage } from './pages/FullMapPage';
import { RescueTeamsPage } from './pages/RescueTeamsPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { SheltersPage } from './pages/SheltersPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { OperationsPage } from './pages/OperationsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';


function AppContent() {
  // Path management with hash & pushState support
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) return hash;
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath());

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = hash || window.location.pathname || '/';
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route extraction
  const [cleanPath, queryString] = currentPath.split('?');
  const queryParams = new URLSearchParams(queryString || '');
  const emergencyIdParam = queryParams.get('id') || undefined;

  const isResponder = [
    '/dashboard',
    '/emergencies',
    '/victims',
    '/map',
    '/rescue-teams',
    '/operations',
    '/hospitals',
    '/shelters',
    '/resources',
    '/alerts',
    '/ai-insights',
    '/analytics',
    '/settings',
  ].some((r) => cleanPath === r);

  const renderPage = () => {
    switch (cleanPath) {
      case '/':
        return <LandingPage navigate={navigate} />;
      case '/report-emergency':
        return <CitizenReportPage navigate={navigate} />;
      case '/sos':
        return <CitizenSosPage navigate={navigate} />;
      case '/ai-analysis':
        return <CitizenAiAnalysisPage navigate={navigate} emergencyId={emergencyIdParam} />;
      case '/emergency-status':
        return <CitizenStatusPage navigate={navigate} emergencyId={emergencyIdParam} />;
      case '/dashboard':
        return <ResponderDashboardPage navigate={navigate} />;
      case '/emergencies':
        return <EmergenciesPage navigate={navigate} />;
      case '/victims':
        return <VictimsPage navigate={navigate} />;
      case '/map':
        return <FullMapPage navigate={navigate} />;
      case '/rescue-teams':
        return <RescueTeamsPage navigate={navigate} />;
      case '/operations':
        return <OperationsPage navigate={navigate} />;
      case '/hospitals':
        return <HospitalsPage />;
      case '/shelters':
        return <SheltersPage />;
      case '/resources':
        return <ResourcesPage />;
      case '/alerts':
        return <AlertsPage />;
      case '/ai-insights':
        return <AIInsightsPage navigate={navigate} />;
      case '/analytics':
        return <AnalyticsPage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <LandingPage navigate={navigate} />;
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar currentPath={cleanPath} navigate={navigate} />

      {/* Main Body */}
      {isResponder ? (
        <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
          <ResponderSidebar currentPath={cleanPath} navigate={navigate} />
          <main className="flex-1 overflow-x-hidden min-w-0 bg-[#F8FAFC]">
            <ErrorBoundary>
              {renderPage()}
            </ErrorBoundary>
          </main>
        </div>
      ) : (
        <main className="flex-1 flex flex-col">
          <ErrorBoundary>
            {renderPage()}
          </ErrorBoundary>
        </main>
      )}

      {/* Common Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <RescueProvider>
      <AppContent />
    </RescueProvider>
  );
}
