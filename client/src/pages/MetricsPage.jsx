import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import {
  Heart, Thermometer, Shield, Droplets, Activity,
  Brain, HeartPulse, Bone, Sparkles, Wind, AlertTriangle, CheckCircle, ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function MetricsPage() {
  const { telemetry, historyData, setSelectedMetric } = useTelemetry();
  const { physio } = telemetry;
  const [activeModule, setActiveModule] = useState('ecg');

  const modules = [
    {
      id: 'ecg',
      title: '1. Electrocardiogram & Arrhythmia Detection',
      icon: Heart,
      status: physio.arrhythmiaDetected ? 'critical' : (physio.heartRate > 100 ? 'warning' : 'normal'),
      currentValue: `${Math.round(physio.heartRate)} BPM`,
      normalRange: '60 - 90 BPM | Sinus Rhythm',
      dataKey: 'heartRate',
      metrics: [
        { label: 'Heart Rate', val: `${Math.round(physio.heartRate)} BPM` },
        { label: 'HRV (RMSSD)', val: `${Math.round(physio.hrv)} ms` },
        { label: 'Rhythm', val: physio.rhythmType },
        { label: 'Stroke Vol.', val: `${physio.strokeVolume} mL` }
      ],
      description: 'Lead II bio-patch monitoring for ectopic ventricular beats and microgravity cardiac deconditioning.',
      clinicalRationale: 'Fluid shifting to the chest reduces resting ventricular filling volume, occasionally precipitating benign or pathological ectopic rhythms.'
    },
    {
      id: 'core_temp',
      title: '2. Core Body Temperature (Space Fever)',
      icon: Thermometer,
      status: physio.coreTempStatus,
      currentValue: `${physio.coreTemp.toFixed(2)} °C`,
      normalRange: '36.80 - 37.30 °C',
      dataKey: 'coreTemp',
      metrics: [
        { label: 'Core Temp', val: `${physio.coreTemp.toFixed(2)} °C` },
        { label: 'Space Fever Offset', val: '+0.45 °C' },
        { label: 'Circadian Phase', val: 'Active Day 1400 UTC' }
      ],
      description: 'Ingestible core thermal pill tracking internal setpoint elevation during mission activities.',
      clinicalRationale: 'Convective heat dissipation is severely reduced in weightlessness without air currents, leading to elevated core temperatures during rest and exercise.'
    },
    {
      id: 'skin_temp',
      title: '3. Skin Temperature Across Suit Zones',
      icon: Thermometer,
      status: 'normal',
      currentValue: `Torso: ${physio.skinTempTorso}°C`,
      normalRange: 'Torso: 33-35°C | Limbs: 30-33°C',
      dataKey: 'coreTemp',
      metrics: [
        { label: 'Torso Zone', val: `${physio.skinTempTorso} °C` },
        { label: 'Extremities', val: `${physio.skinTempExtremities} °C` },
        { label: 'Visor / Helmet', val: `${physio.skinTempHelmet} °C` }
      ],
      description: 'Liquid Cooling and Ventilation Garment (LCVG) multi-zone sensor array preventing thermal stress.',
      clinicalRationale: 'Maintains cutaneous thermal equilibrium during intra-vehicular activities and high-metabolic extravehicular spacewalks.'
    },
    {
      id: 'thrombosis',
      title: '4. Venous Thrombosis Risk & Blood Flow',
      icon: Shield,
      status: physio.thrombosisStatus,
      currentValue: `${physio.venousFlowVelocity.toFixed(1)} cm/s`,
      normalRange: 'Flow > 12.0 cm/s | Risk < 25%',
      dataKey: 'clotRisk',
      metrics: [
        { label: 'Venous Velocity', val: `${physio.venousFlowVelocity.toFixed(1)} cm/s` },
        { label: 'Limb Impedance', val: `${Math.round(physio.limbImpedance)} Ω` },
        { label: 'Clot Risk Index', val: `${Math.round(physio.clotRiskScore)} %` }
      ],
      description: 'Limb plethysmography and ultrasonic Doppler detecting venous stasis in jugular and femoral veins.',
      clinicalRationale: 'Cephalad fluid redistribution eliminates lower extremity hydrostatic pressure, predisposing to venous blood pooling and documented microgravity thrombosis.'
    },
    {
      id: 'lactate',
      title: '5. Sweat Lactate & Muscle Fatigue',
      icon: Droplets,
      status: physio.sweatLactate > 7.0 ? 'warning' : 'normal',
      currentValue: `${physio.sweatLactate.toFixed(2)} mmol/L`,
      normalRange: '1.5 - 5.0 mmol/L (Fatigue > 7.5)',
      dataKey: 'sweatLactate',
      metrics: [
        { label: 'Sweat Lactate', val: `${physio.sweatLactate.toFixed(2)} mM` },
        { label: 'Exertion Level', val: `${physio.muscleExertion} %` },
        { label: 'Fatigue Score', val: `${physio.muscleFatigueScore} / 100` }
      ],
      description: 'Continuous microfluidic enzymatic sweat sensor assessing anaerobic threshold without blood draws.',
      clinicalRationale: 'Allows the astronaut and flight surgeon to monitor muscle fatigue accumulation in real time during EVA operations and countermeasure training.'
    },
    {
      id: 'immune',
      title: '6. Immune System & Stress Hormones',
      icon: Sparkles,
      status: 'normal',
      currentValue: `Cortisol: ${physio.cortisolLevel.toFixed(1)} µg/dL`,
      normalRange: 'Cortisol: 8-18 µg/dL | CRP < 3.0 mg/L',
      dataKey: 'healthIndex',
      metrics: [
        { label: 'Salivary Cortisol', val: `${physio.cortisolLevel.toFixed(1)} µg/dL` },
        { label: 'hs-CRP Index', val: `${physio.inflammationIndex.toFixed(2)} mg/L` },
        { label: 'Immune Risk Score', val: `${physio.immuneRiskScore} / 100` }
      ],
      description: 'Bio-layer interferometry measuring circadian glucocorticoids and systemic inflammatory cytokines.',
      clinicalRationale: 'Long-duration space radiation, confinement, and altered circadian rhythms provoke latent viral reactivation (EBV, VZV) and immune cell dysregulation.'
    },
    {
      id: 'sans',
      title: '7. Intracranial Pressure & SANS Risk',
      icon: Brain,
      status: physio.opticNerveSheathDiameter > 5.8 ? 'critical' : (physio.opticNerveSheathDiameter > 5.3 ? 'warning' : 'normal'),
      currentValue: `${physio.opticNerveSheathDiameter.toFixed(2)} mm ONSD`,
      normalRange: '4.4 - 5.0 mm (< 5.8 mm threshold)',
      dataKey: 'onsd',
      metrics: [
        { label: 'ONSD Proxy', val: `${physio.opticNerveSheathDiameter.toFixed(2)} mm` },
        { label: 'Fluid Shift Score', val: `${Math.round(physio.cephaladFluidShiftScore)} / 100` },
        { label: 'SANS Flag', val: physio.sansRiskFlag }
      ],
      description: 'Acoustic and ocular sheath measurement proxy detecting elevated intracranial pressure.',
      clinicalRationale: 'Lack of gravity allows 1.5 - 2 liters of interstitial fluids to pool cephalad, increasing venous head pressures and causing optic disc edema (SANS).'
    },
    {
      id: 'wound',
      title: '8. Smart Bandage Wound Biosensor',
      icon: HeartPulse,
      status: physio.woundInfectionWarning ? 'critical' : 'normal',
      currentValue: `pH ${physio.woundExudatePh.toFixed(2)}`,
      normalRange: 'pH 6.8 - 7.4 | Temp 34-35.5 °C',
      dataKey: 'coreTemp',
      metrics: [
        { label: 'Exudate pH', val: physio.woundExudatePh.toFixed(2) },
        { label: 'Bandage Temp', val: `${physio.woundBandageTemp.toFixed(1)} °C` },
        { label: 'Moisture', val: `${Math.round(physio.woundMoisture)} %` },
        { label: 'Healing Progress', val: `${Math.round(physio.woundHealingProgress)} %` }
      ],
      description: 'Smart nanofiber bandage on forearm with embedded optical pH, moisture, and impedance sensors.',
      clinicalRationale: 'Alkaline pH shift (>7.8) and localized thermal increases identify bacterial colonization days before visible signs appear.'
    },
    {
      id: 'bone',
      title: '9. Bone Loss & Mechanical Loading (BMD)',
      icon: Bone,
      status: physio.boneMineralDensityLossPercent > 2.0 ? 'warning' : 'normal',
      currentValue: `-${physio.boneMineralDensityLossPercent} % BMD`,
      normalRange: '< 1.2 % loss per 30 days',
      dataKey: 'healthIndex',
      metrics: [
        { label: 'BMD Loss to Date', val: `-${physio.boneMineralDensityLossPercent} %` },
        { label: '30-Day Trajectory', val: `-${physio.projectedLossTrajectory} %` },
        { label: 'Daily ARED Load', val: `${physio.dailyExerciseLoadAccumulated} kN*s` },
        { label: 'Bone Risk Score', val: `${physio.boneRiskScore} / 100` }
      ],
      description: 'Predictive biomechanical model integrating daily ARED/T2 mechanical strain logs.',
      clinicalRationale: 'Absence of weight-bearing loading activates osteoclastic resorption, causing 1.0-1.5% bone loss per month, primarily in the lumbar spine and femoral neck.'
    },
    {
      id: 'vitals',
      title: '10. General Vitals & Respiratory Dynamics',
      icon: Wind,
      status: 'normal',
      currentValue: `SpO2 ${physio.spo2.toFixed(1)} %`,
      normalRange: 'SpO2 96-100% | BP 120/80 | RR 12-18',
      dataKey: 'spo2',
      metrics: [
        { label: 'SpO2 Oxygen', val: `${physio.spo2.toFixed(1)} %` },
        { label: 'Respiration Rate', val: `${physio.respirationRate.toFixed(1)} br/min` },
        { label: 'Blood Pressure', val: `${physio.systolicBp}/${physio.diastolicBp} mmHg` },
        { label: 'Hydration Level', val: `${physio.hydrationLevel} %` }
      ],
      description: 'Integrated cardiorespiratory monitoring with suit pressure and oxygen feedback.',
      clinicalRationale: 'Guarantees continuous hemodynamic stability and correlates pulmonary ventilation with cabin oxygen partial pressures.'
    }
  ];

  const selected = modules.find(m => m.id === activeModule) || modules[0];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Astronaut Health Telemetry Modules</h1>
          <p className="text-xs text-slate-500">10 continuous bio-sensor domains streaming real-time suit telemetry</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>All 10 suit sensors active and streaming</span>
        </div>
      </div>

      {/* Grid of all 10 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {modules.map((m) => {
          const Icon = m.icon;
          const isSelected = activeModule === m.id;
          const isCritical = m.status === 'critical';
          const isWarning = m.status === 'warning';

          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`astro-card p-3.5 text-left transition-all ${
                isSelected ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/20' : 'hover:border-slate-300'
              } ${isCritical ? 'border-red-300' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${
                  isCritical ? 'bg-red-50 text-red-600' : isWarning ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`w-2 h-2 rounded-full ${
                  isCritical ? 'bg-red-500 animate-ping' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
              </div>

              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{m.title}</h4>
              <p className="text-base font-extrabold font-mono text-slate-900 mt-1">{m.currentValue}</p>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                <span className="truncate">{m.normalRange}</span>
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Inspection Drawer for Active Module */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <selected.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{selected.title}</h2>
              <p className="text-xs text-slate-500">{selected.description}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedMetric(selected.id)}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition self-start sm:self-auto"
          >
            Open 3D Focus & Action Protocol
          </button>
        </div>

        {/* Live Chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Live Streaming Telemetry (30s Window)</h4>
            <span className="text-[10px] text-slate-400 font-mono">1 Hz Sample Rate</span>
          </div>
          <div className="h-56 w-full bg-slate-50 rounded-xl border border-slate-200 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey={selected.dataKey}
                  stroke="#0284c7"
                  strokeWidth={2.4}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Values */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {selected.metrics.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">{item.label}</span>
              <p className="text-base font-bold font-mono text-slate-900 mt-1">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Clinical Notes */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs text-slate-700">
          <span className="font-bold text-slate-900 block mb-1">NASA Spaceflight Adaptation Rationale:</span>
          <p className="leading-relaxed">{selected.clinicalRationale}</p>
        </div>
      </div>
    </div>
  );
}
