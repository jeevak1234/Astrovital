import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import {
  PlayCircle, RefreshCw, Sun, Heart, Shield,
  HeartPulse, Brain, Users, CheckCircle2, AlertOctagon
} from 'lucide-react';

export function SimulatorPage() {
  const { triggerScenario, activeScenario, telemetry } = useTelemetry();
  const [feedback, setFeedback] = useState(null);

  const scenarios = [
    {
      id: 'solar_flare',
      name: 'Solar Particle Event (SPE) Flare',
      category: 'Space Radiation',
      icon: Sun,
      iconColor: 'text-purple-600 bg-purple-50',
      description: 'Simulates acute solar proton coronal mass ejection. Radiation dose rate spikes from 42 µSv/h to >2,400 µSv/h. Triggers automated storm shelter alarm.',
      targetHotspot: 'Radiation hull sensor & mission dosimeter',
      expectedAlert: 'CRITICAL: SOLAR PARTICLE EVENT EMERGENCY'
    },
    {
      id: 'arrhythmia',
      name: 'Ventricular Arrhythmia & Tachycardia',
      category: 'Cardiovascular',
      icon: Heart,
      iconColor: 'text-rose-600 bg-rose-50',
      description: 'Injects premature ventricular contractions (PVCs) into the live ECG stream and elevates heart rate to 135+ BPM with severe HRV suppression.',
      targetHotspot: '3D Heart chamber pulses rapidly & glows red',
      expectedAlert: 'CRITICAL: Cardiac Arrhythmia Detected (Lead II)'
    },
    {
      id: 'clot_risk',
      name: 'Deep Vein Thrombosis (Venous Stasis)',
      category: 'Vascular Hemodynamics',
      icon: Shield,
      iconColor: 'text-blue-600 bg-blue-50',
      description: 'Simulates severe microgravity fluid stagnation in the lower extremities. Venous blood velocity drops below 5 cm/s with elevated limb impedance.',
      targetHotspot: '3D Calf & femoral hotspots glow amber/red',
      expectedAlert: 'CRITICAL: High DVT Risk / Lower Limb Venous Stasis'
    },
    {
      id: 'wound_infection',
      name: 'Smart Bandage Wound Infection',
      category: 'Integumentary Biosensor',
      icon: HeartPulse,
      iconColor: 'text-amber-600 bg-amber-50',
      description: 'Nanofiber smart bandage detects bacterial proliferation: exudate pH shifts from 7.15 to alkaline 8.15 with local thermal rise to 38.6°C.',
      targetHotspot: '3D Forearm smart bandage glows red',
      expectedAlert: 'CRITICAL: Smart Bandage Infection Warning'
    },
    {
      id: 'sans_spike',
      name: 'SANS & Intracranial Pressure Surge',
      category: 'Neuro-Ocular (SANS)',
      icon: Brain,
      iconColor: 'text-cyan-600 bg-cyan-50',
      description: 'Cephalad fluid redistribution causes venous head congestion. Optic Nerve Sheath Diameter (ONSD) dilates from 4.8 mm to > 6.0 mm.',
      targetHotspot: '3D Head & optic chiasm hotspot glows red',
      expectedAlert: 'CRITICAL: Elevated Intracranial Pressure / SANS'
    },
    {
      id: 'long_isolation',
      name: 'Isolation Stress & Behavioral Health Deficit',
      category: 'Behavioral Health',
      icon: Users,
      iconColor: 'text-indigo-600 bg-indigo-50',
      description: 'Simulates circadian desynchronization, high vocal acoustic tension, and sleep deprivation during extended interplanetary confinement.',
      targetHotspot: 'Cognitive readiness & health index drop',
      expectedAlert: 'WARNING: Behavioral Health & Sleep Deprivation Risk'
    }
  ];

  const handleTrigger = (id, name) => {
    triggerScenario(id);
    setFeedback(`Scenario Activated: "${name}". Telemetry, 3D hotspots, and alert engine updated.`);
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">NASA Challenge Evaluator: Scenario Simulator</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              Interactive Testbench
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Inject realistic spaceflight medical anomalies to evaluate live autonomous detection, 3D body alerts, and clinical countermeasures
          </p>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => handleTrigger('reset', 'Nominal Baseline Reset')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Nominal Baselines</span>
        </button>
      </div>

      {/* Active notification banner */}
      {feedback && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs font-medium text-sky-900 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive = activeScenario === sc.id;

          return (
            <div
              key={sc.id}
              className={`astro-card p-5 flex flex-col justify-between transition-all ${
                isActive ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/10' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${sc.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {sc.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{sc.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{sc.description}</p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1 mb-4">
                  <div className="text-slate-500">
                    <strong className="text-slate-700">3D Body Effect:</strong> {sc.targetHotspot}
                  </div>
                  <div className="text-slate-500">
                    <strong className="text-slate-700">Triggered Alert:</strong> {sc.expectedAlert}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTrigger(sc.id, sc.name)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition ${
                  isActive
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                <span>{isActive ? 'Scenario Running Live' : 'Trigger Scenario Event'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
