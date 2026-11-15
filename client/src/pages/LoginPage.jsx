import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { Activity, Shield, UserCheck, Stethoscope, Radio, ArrowRight, CheckCircle2 } from 'lucide-react';

export function LoginPage({ onLoginSuccess }) {
  const { currentRole, switchRole } = useAuth();
  const [selectedRoleKey, setSelectedRoleKey] = useState('SURGEON');

  const roleCards = [
    {
      key: 'SURGEON',
      role: ROLES.SURGEON,
      icon: Stethoscope,
      iconBg: 'bg-emerald-50 text-emerald-600',
      badge: 'CLINICAL COMMAND',
      permissions: [
        'Full Telemetry & Bio-Sensor Access',
        'Acknowledge & Resolve Critical Medical Alerts',
        'Prescribe NASA Countermeasures (LBNP, Electrolytes, ARED)',
        'Sign & Export NASA Form MED-72 Reports'
      ]
    },
    {
      key: 'ASTRONAUT',
      role: ROLES.ASTRONAUT,
      icon: UserCheck,
      iconBg: 'bg-sky-50 text-sky-600',
      badge: 'CREW SUIT HUD',
      permissions: [
        'Real-Time Suit Biometrics & ECG Oscilloscope',
        'Smart-Bandage & Ocular Health Inspection',
        'Log Daily Nutrition & Exercise Mechanical Load',
        'Immediate Audio-Visual Alert Notification'
      ]
    },
    {
      key: 'MISSION_CONTROL',
      role: ROLES.MISSION_CONTROL,
      icon: Radio,
      iconBg: 'bg-indigo-50 text-indigo-600',
      badge: 'FLIGHT OPERATIONS',
      permissions: [
        'Deep Space Comms Delay & Distance Telemetry',
        'Solar Particle Event (SPE) Radiation Alarm',
        'ECLSS Cabin Life Support Parameters',
        'Historical Telemetry CSV Export'
      ]
    }
  ];

  const handleEnterDashboard = () => {
    switchRole(selectedRoleKey);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-8">
      {/* Brand Header */}
      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs font-semibold text-sky-700 shadow-sm">
          <Activity className="w-3.5 h-3.5 animate-pulse text-sky-600" />
          <span>NASA Space Apps Challenge 2026</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          ASTROVITAL Access Portal
        </h1>
        <p className="text-sm text-slate-500">
          Select your mission operational role to enter the real-time astronaut health monitoring and clinical decision support system.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full px-4 mb-8">
        {roleCards.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedRoleKey === item.key;
          const role = item.role;

          return (
            <div
              key={item.key}
              onClick={() => setSelectedRoleKey(item.key)}
              className={`astro-card p-6 cursor-pointer flex flex-col justify-between transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-sky-500 border-sky-400 shadow-elevated bg-white'
                  : 'hover:border-slate-300 bg-white/80 opacity-90 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${item.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{role.avatar}</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{role.title}</h3>
                    <p className="text-xs text-slate-500 font-mono">{role.name}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed">
                  {role.description}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Role Capabilities:
                  </span>
                  {item.permissions.map((perm, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{isSelected ? 'Role Selected' : 'Select Role'}</span>
                  {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enter Dashboard Action */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleEnterDashboard}
          className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-elevated flex items-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Launch Mission Control Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400">
          Active Profile: <strong>{ROLES[selectedRoleKey]?.name}</strong> ({ROLES[selectedRoleKey]?.title})
        </span>
      </div>
    </div>
  );
}
