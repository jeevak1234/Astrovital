import React from 'react';
import { UserCheck, LayoutDashboard, Layers, ShieldAlert, AlertTriangle, PlayCircle, Apple, FileText } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export function Navigation({ activeTab, setActiveTab }) {
  const { telemetry } = useTelemetry();
  const activeAlertsCount = telemetry.activeAlerts ? telemetry.activeAlerts.length : 0;

  const navItems = [
    { id: 'dashboard', label: '1. Main Dashboard', icon: LayoutDashboard },
    { id: 'modules', label: '2. Health Modules (10)', icon: Layers },
    { id: 'hazards', label: '3. Spaceflight Hazards (5)', icon: ShieldAlert },
    {
      id: 'alerts',
      label: '4. Alert Center',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null
    },
    { id: 'simulator', label: '5. Scenario Simulator', icon: PlayCircle },
    { id: 'nutrition', label: '6. Nutrition & Countermeasures', icon: Apple },
    { id: 'reports', label: '7. Flight Surgeon Report', icon: FileText },
    { id: 'login', label: 'Role Access Portal', icon: UserCheck },
  ];

  return (
    <nav className="bg-white border-b border-slate-200/90 shadow-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
