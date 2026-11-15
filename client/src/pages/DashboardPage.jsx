import React from 'react';
import { HumanBodyCanvas } from '../components/Body3D/HumanBodyCanvas';
import { EcgMonitor } from '../components/EcgMonitor';
import { HealthIndexGauge } from '../components/HealthIndexGauge';
import { VitalsStrip } from '../components/VitalsStrip';
import { useTelemetry } from '../context/TelemetryContext';
import { AlertTriangle, CheckCircle, Radio, Compass, Orbit, Activity } from 'lucide-react';

export function DashboardPage() {
  const { telemetry, setSelectedMetric, acknowledgeAlert } = useTelemetry();
  const { activeAlerts, hazards, physio } = telemetry;

  return (
    <div className="space-y-4">
      {/* Top Vitals Horizontal Strip */}
      <VitalsStrip />

      {/* Main Mission Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: ECG & Cardiac Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <EcgMonitor />

          {/* Quick Active Hotspot Sensor Index */}
          <div className="astro-card p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Suit Bio-Sensors Status
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">7 ACTIVE SITES</span>
            </div>

            <div className="space-y-2">
              {[
                { id: 'sans', name: 'Optic Nerve Sheath (SANS)', val: `${physio.opticNerveSheathDiameter.toFixed(2)} mm`, status: physio.opticNerveSheathDiameter > 5.8 ? 'critical' : (physio.opticNerveSheathDiameter > 5.3 ? 'warning' : 'normal') },
                { id: 'ecg', name: 'Cardiac ECG Patch Lead II', val: `${Math.round(physio.heartRate)} BPM`, status: physio.arrhythmiaDetected ? 'critical' : 'normal' },
                { id: 'wound', name: 'Smart Bandage (Forearm)', val: `pH ${physio.woundExudatePh.toFixed(1)}`, status: physio.woundInfectionWarning ? 'critical' : 'normal' },
                { id: 'lactate', name: 'Sweat Lactate Sensor', val: `${physio.sweatLactate.toFixed(1)} mM`, status: physio.sweatLactate > 7.0 ? 'warning' : 'normal' },
                { id: 'bone', name: 'Bone Strain (Hip & Lumbar)', val: `-${physio.boneMineralDensityLossPercent}%`, status: 'normal' },
                { id: 'thrombosis', name: 'Lower Limb Doppler / DVT', val: `${physio.venousFlowVelocity.toFixed(1)} cm/s`, status: physio.thrombosisStatus },
                { id: 'temperature', name: 'Core Body Thermal Sensor', val: `${physio.coreTemp.toFixed(1)}°C`, status: physio.coreTempStatus },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedMetric(s.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-sky-50/70 border border-slate-100 hover:border-sky-200 transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      s.status === 'critical' ? 'bg-red-500 animate-ping' : s.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className="text-xs font-medium text-slate-700">{s.name}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-900">{s.val}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: 3D Rotatable Human Body Model */}
        <div className="lg:col-span-5 flex flex-col">
          <HumanBodyCanvas />
        </div>

        {/* Right Column: Astronaut Health Index & Active Alerts Feed */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <HealthIndexGauge />

          {/* Active Alerts Feed */}
          <div className="astro-card p-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className={`w-4 h-4 ${activeAlerts.length > 0 ? 'text-red-500' : 'text-slate-400'}`} />
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Active Alerts</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeAlerts.length > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {activeAlerts.length} ACTIVE
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activeAlerts.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs font-medium text-slate-700">All systems nominal</p>
                  <p className="text-[10px] text-slate-400">No active alerts requiring intervention</p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-2.5 rounded-xl border text-xs ${
                      alert.severity === 'critical'
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="truncate">{alert.title}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 bg-white/80 rounded font-mono">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-[11px] leading-tight text-slate-600 mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-400">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!alert.acknowledged ? (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2 py-0.5 bg-white border border-slate-300 hover:border-slate-400 rounded text-[10px] font-semibold text-slate-800 shadow-sm"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold">Acknowledged</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Mission Sol & Distance Footer */}
            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Orbit className="w-3.5 h-3.5 text-sky-500" />
                Sol {hazards.missionDay} Mars Transit
              </span>
              <span className="font-mono text-slate-700 font-medium">
                {(hazards.distanceKm / 1e6).toFixed(1)}M km
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
