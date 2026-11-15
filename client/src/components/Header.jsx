import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';
import { Activity, Radio, Clock, Shield, ChevronDown, UserCheck } from 'lucide-react';

export function Header() {
  const { currentRole, switchRole } = useAuth();
  const { telemetry, connectionStatus } = useTelemetry();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const { hazards } = telemetry;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Mission Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">ASTROVITAL</span>
                <span className="text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded">
                  NASA SPACE APPS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Smart Astronaut Health Monitoring System</p>
            </div>
          </div>

          {/* Mission Latency & Status Pill */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            {/* Comms Delay */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Comms Delay:</span>
              <span className="font-mono font-semibold text-slate-800">
                {(hazards.oneWayCommsDelaySec / 60).toFixed(1)} min
              </span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-1.5 py-0.2 rounded">
                AUTONOMOUS MODE
              </span>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className={`w-2 h-2 rounded-full ${
                connectionStatus === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-teal-500'
              }`} />
              <span className="text-slate-500">Telemetry:</span>
              <span className="font-medium text-slate-800 capitalize">{connectionStatus} Stream</span>
            </div>
          </div>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-sm"
            >
              <span className="text-lg">{currentRole.avatar}</span>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">{currentRole.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{currentRole.callsign}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-elevated py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Active Role
                </div>
                {Object.keys(ROLES).map((key) => {
                  const role = ROLES[key];
                  const isSelected = role.id === currentRole.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        switchRole(key);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition ${
                        isSelected ? 'bg-sky-50/70 border-l-2 border-sky-600' : ''
                      }`}
                    >
                      <span className="text-xl">{role.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{role.title}</span>
                          {isSelected && <UserCheck className="w-3 h-3 text-sky-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500">{role.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
