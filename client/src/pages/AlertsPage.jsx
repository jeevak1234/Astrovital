import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { AlertTriangle, CheckCircle, Clock, ShieldCheck, Filter, BellRing } from 'lucide-react';

export function AlertsPage() {
  const { telemetry, acknowledgeAlert, resolveAlert } = useTelemetry();
  const { activeAlerts } = telemetry;
  const [filter, setFilter] = useState('all');

  const filtered = activeAlerts.filter((a) => {
    if (filter === 'critical') return a.severity === 'critical';
    if (filter === 'warning') return a.severity === 'warning';
    if (filter === 'acknowledged') return a.acknowledged;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Alert Center & Clinical Escalation</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {activeAlerts.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Rule-based threshold alerts synchronized across Astronaut suit HUD and Flight Surgeon telemetry
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          {['all', 'critical', 'warning', 'acknowledged'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                filter === f
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="astro-card p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No matching alerts</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              All bio-sensors and environmental parameters are currently operating within nominal safety margins.
            </p>
          </div>
        ) : (
          filtered.map((alert) => {
            const isCritical = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                className={`astro-card p-5 border-l-4 transition-all ${
                  isCritical ? 'border-l-red-500 bg-red-50/10' : 'border-l-amber-500 bg-amber-50/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isCritical ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Source: {alert.source}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-slate-500">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Sensor Telemetry Value
                    </span>
                    <p className="font-mono font-bold text-slate-800 text-sm">{alert.value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Normal Baseline: {alert.normalRange}</p>
                    <p className="text-slate-600 mt-2 leading-relaxed">{alert.message}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                      NASA Medical Countermeasure Action
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium">{alert.recommendation}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Visibility:</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[10px] font-semibold">Astronaut HUD</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[10px] font-semibold">Flight Surgeon Console</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                      >
                        Acknowledge Alert
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                        <CheckCircle className="w-4 h-4" /> Acknowledged
                      </span>
                    )}

                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
                    >
                      Resolve & Clear
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
