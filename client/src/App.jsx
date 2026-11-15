import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MetricModal } from './components/MetricModal';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MetricsPage } from './pages/MetricsPage';
import { HazardsPage } from './pages/HazardsPage';
import { AlertsPage } from './pages/AlertsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { NutritionPage } from './pages/NutritionPage';
import { ReportsPage } from './pages/ReportsPage';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-900">
      {/* Top Prominent Clinical Disclaimer */}
      <DisclaimerBanner />

      {/* Main Header with Logo, Latency, and Role Switcher */}
      <Header />

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Active Page View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'login' && <LoginPage onLoginSuccess={() => setActiveTab('dashboard')} />}
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'modules' && <MetricsPage />}
        {activeTab === 'hazards' && <HazardsPage />}
        {activeTab === 'alerts' && <AlertsPage />}
        {activeTab === 'simulator' && <SimulatorPage />}
        {activeTab === 'nutrition' && <NutritionPage />}
        {activeTab === 'reports' && <ReportsPage />}
      </main>

      {/* Interactive 3D Hotspot Diagnostic Modal */}
      <MetricModal />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ASTROVITAL</span>
            <span>&bull;</span>
            <span>NASA Space Apps Challenge 2026</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Simulated data for demonstration only. Not for real medical use.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TelemetryProvider>
        <AppContent />
      </TelemetryProvider>
    </AuthProvider>
  );
}
