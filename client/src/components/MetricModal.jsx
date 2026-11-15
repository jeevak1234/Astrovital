import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { X, Activity, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function MetricModal() {
  const { selectedMetric, setSelectedMetric, telemetry, historyData } = useTelemetry();
  const { physio, hazards } = telemetry;

  if (!selectedMetric) return null;

  // Metadata per module
  const moduleConfig = {
    ecg: {
      title: 'Electrocardiogram & Cardiac Dynamics',
      sensor: 'Bio-Suit Embedded Lead II Electrodes & Acoustic Patch',
      currentValue: `${Math.round(physio.heartRate)} BPM`,
      normalRange: '60 - 90 BPM | Sinus Rhythm',
      status: physio.arrhythmiaDetected ? 'critical' : (physio.heartRate > 100 ? 'warning' : 'normal'),
      dataKey: 'heartRate',
      unit: 'BPM',
      description: 'Tracks electrical depolarizations, heart rate variability, and microgravity cardiac atrophy/arrhythmia triggers. Spaceflight fluid shifts reduce left ventricular end-diastolic volume.',
      protocol: 'If ectopic PVC frequency increases: initiate 12-lead ECG recording, verify magnesium/potassium electrolyte status, decrease workload on exercise ergometer.'
    },
    sans: {
      title: 'Intracranial Pressure & SANS Assessment',
      sensor: 'Ocular Ultrasound Proxy / Suit Helmet Acoustic Sensor',
      currentValue: `${physio.opticNerveSheathDiameter.toFixed(2)} mm`,
      normalRange: '4.4 - 5.0 mm (< 5.8 mm threshold)',
      status: physio.opticNerveSheathDiameter > 5.8 ? 'critical' : (physio.opticNerveSheathDiameter > 5.3 ? 'warning' : 'normal'),
      dataKey: 'onsd',
      unit: 'mm',
      description: 'Monitors non-invasive Optic Nerve Sheath Diameter (ONSD) and cephalad fluid congestion. Spaceflight-Associated Neuro-ocular Syndrome (SANS) causes hyperopic shifts, cotton-wool spots, and optic disc edema.',
      protocol: 'Prescribe 2 hours daily in Lower Body Negative Pressure (LBNP) chamber (-25 mmHg) to draw fluids back to lower extremities. Use head-up tilt sleep bag.'
    },
    thrombosis: {
      title: 'Deep Vein Thrombosis & Venous Flow',
      sensor: 'Femoral & Calf Limb Plethysmography & Micro-Doppler',
      currentValue: `${physio.venousFlowVelocity.toFixed(1)} cm/s (Impedance: ${Math.round(physio.limbImpedance)} Ω)`,
      normalRange: 'Flow > 12.0 cm/s | Impedance 440-480 Ω',
      status: physio.thrombosisStatus,
      dataKey: 'clotRisk',
      unit: '% Risk',
      description: 'Microgravity alters hydrostatic gradients, resulting in blood stagnation in the internal jugular and femoral veins. Increases risk of deep vein thrombosis and retrograde flow.',
      protocol: 'Don thigh-high elastic compression garments. Perform active pneumatic calf compression cycles. Ensure 2,500 mL daily hydration volume.'
    },
    wound: {
      title: 'Smart Bandage Biosensor & Integumentary',
      sensor: 'Nanofiber Smart Dressing with Embedded pH / Temp / Moisture Array',
      currentValue: `pH ${physio.woundExudatePh.toFixed(2)} | Temp ${physio.woundBandageTemp.toFixed(1)}°C`,
      normalRange: 'pH 6.8 - 7.4 | Temp 34.0 - 35.5°C | Moisture 55-75%',
      status: physio.woundInfectionWarning ? 'critical' : 'normal',
      dataKey: 'coreTemp',
      unit: '°C',
      description: 'Monitors wound microenvironment in real time. Alkaline pH (>7.8) and local temperature rise detect opportunistic bacterial infection before macroscopic symptoms appear.',
      protocol: 'If alkaline pH spike detected: activate microfluidic silver-sulfadiazine antimicrobial elution. Schedule sterile debridement in medical bay.'
    },
    lactate: {
      title: 'Sweat Lactate & Muscle Exertion',
      sensor: 'Microfluidic Sweat Biosensor Patch (Torso / Forearm)',
      currentValue: `${physio.sweatLactate.toFixed(2)} mmol/L`,
      normalRange: '1.5 - 5.0 mmol/L (Anaerobic threshold > 7.5)',
      status: physio.sweatLactate > 7.0 ? 'warning' : 'normal',
      dataKey: 'sweatLactate',
      unit: 'mmol/L',
      description: 'Non-invasively measures sweat lactate to track metabolic exertion and muscle fatigue during extravehicular activity (EVA) or ARED resistance workouts.',
      protocol: 'Reduce metabolic workload by 25%. Maintain oxygen delivery to spacesuit at 4.3 psi pure O2. Ingest carbohydrate electrolyte gel.'
    },
    bone: {
      title: 'Bone Loss & Mechanical Loading (BMD)',
      sensor: 'Bio-Suit Mechanical Strain Gauge & Daily ARED Telemetry',
      currentValue: `-${physio.boneMineralDensityLossPercent}% BMD loss`,
      normalRange: '< 1.2% loss per 30 days microgravity',
      status: physio.boneMineralDensityLossPercent > 2.0 ? 'warning' : 'normal',
      dataKey: 'healthIndex',
      unit: 'Score',
      description: 'Tracks trabecular and cortical bone demineralization in calcaneus, femoral neck, and lumbar spine. Spaceflight causes 1.0 - 1.5% bone loss per month without resistive exercise.',
      protocol: 'Ensure 100% compliance with daily Advanced Resistive Exercise Device (ARED) squats and deadlifts (target 900 kN*s). Ingest 800 IU Vitamin D3 + 1,200 mg Calcium.'
    },
    temperature: {
      title: 'Core & Suit Multi-Zone Temperature',
      sensor: 'Ingestible Core Pill + Multi-Zone Skin Garment Array',
      currentValue: `Core: ${physio.coreTemp.toFixed(2)}°C | Torso: ${physio.skinTempTorso}°C`,
      normalRange: 'Core 36.8 - 37.3°C | Extremities 30 - 34°C',
      status: physio.coreTempStatus,
      dataKey: 'coreTemp',
      unit: '°C',
      description: 'Monitors "Space Fever" - elevated core body temperature caused by impaired sweating efficiency and altered convective heat loss in weightlessness.',
      protocol: 'Adjust Liquid Cooling and Ventilation Garment (LCVG) coolant inlet temperature to 16°C. Increase cabin air velocity.'
    },
    vitals: {
      title: 'Vital Signs & Respiratory Index',
      sensor: 'Acoustic Chest Sensor & Pulse Oximeter Collar',
      currentValue: `SpO2 ${physio.spo2.toFixed(1)}% | BP ${physio.systolicBp}/${physio.diastolicBp} | RR ${physio.respirationRate.toFixed(1)}`,
      normalRange: 'SpO2 96-100% | BP 110-130/70-85 | RR 12-18',
      status: 'normal',
      dataKey: 'spo2',
      unit: '%',
      description: 'Cardiorespiratory telemetry continuous assessment, synchronizing oxygen saturation with cabin partial pressure oxygen (ppO2).',
      protocol: 'Maintain nominal cabin pressure at 101.3 kPa with 21.0% O2.'
    },
    hazards: {
      title: 'Interplanetary Radiation Exposure',
      sensor: 'Active Tissue-Equivalent Proportional Counter (TEPC)',
      currentValue: `${hazards.doseRate.toFixed(1)} µSv/h (Cum: ${hazards.cumulativeDose.toFixed(2)} mSv)`,
      normalRange: 'Ambient GCR: 35 - 55 µSv/h | Career limit: 600 mSv',
      status: hazards.speAlert ? 'critical' : 'normal',
      dataKey: 'radiationDose',
      unit: 'µSv/h',
      description: 'Continuous monitoring of Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE). High-Z and high-energy (HZE) ions present cancer and acute radiation risks.',
      protocol: 'In case of SPE alarm: Crew must immediately take shelter inside the water-walled Storm Shelter until proton flux subsides below 10 pfu.'
    }
  };

  const current = moduleConfig[selectedMetric] || moduleConfig.ecg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              current.status === 'critical' ? 'bg-red-50 text-red-600' : current.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{current.title}</h2>
              <p className="text-xs text-slate-500">{current.sensor}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedMetric(null)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Current Value</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">{current.currentValue}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Nominal Range</span>
              <p className="text-xs font-medium text-slate-700 mt-1.5">{current.normalRange}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Clinical Status</span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  current.status === 'critical' ? 'bg-red-500 animate-ping' : current.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span className={`text-xs font-semibold uppercase ${
                  current.status === 'critical' ? 'text-red-700' : current.status === 'warning' ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {current.status}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Trend Graph */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Live Streaming Trend</h4>
              <span className="text-[10px] text-slate-400 font-mono">30-second rolling window</span>
            </div>
            <div className="h-48 w-full bg-slate-50/50 rounded-xl border border-slate-200 p-2">
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
                    dataKey={current.dataKey}
                    stroke={current.status === 'critical' ? '#ef4444' : '#0284c7'}
                    strokeWidth={2.2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clinical Rationale & Spaceflight Physiology */}
          <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-sky-900">
              <Info className="w-4 h-4 text-sky-600" />
              <span>NASA Spaceflight Physiology Context</span>
            </div>
            <p className="leading-relaxed">{current.description}</p>
          </div>

          {/* Countermeasure Protocol */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Flight Surgeon Clinical Protocol</span>
            </div>
            <p className="leading-relaxed text-slate-600">{current.protocol}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={() => setSelectedMetric(null)}
            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
