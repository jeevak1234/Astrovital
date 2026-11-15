import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Heart, Activity, Droplets, Thermometer, Wind, Radio, Shield } from 'lucide-react';

export function VitalsStrip() {
  const { telemetry, setSelectedMetric } = useTelemetry();
  const { physio, hazards } = telemetry;

  const vitals = [
    {
      id: 'ecg',
      label: 'Heart Rate',
      value: Math.round(physio.heartRate),
      unit: 'BPM',
      normal: '60 - 90',
      status: physio.arrhythmiaDetected ? 'critical' : (physio.heartRate > 100 ? 'warning' : 'normal'),
      icon: Heart,
      iconColor: 'text-rose-500 bg-rose-50'
    },
    {
      id: 'vitals',
      label: 'Blood Pressure',
      value: `${physio.systolicBp}/${physio.diastolicBp}`,
      unit: 'mmHg',
      normal: '120/80',
      status: 'normal',
      icon: Activity,
      iconColor: 'text-sky-500 bg-sky-50'
    },
    {
      id: 'vitals',
      label: 'SpO2 Oxygen',
      value: physio.spo2.toFixed(1),
      unit: '%',
      normal: '95 - 100',
      status: physio.spo2 < 95 ? 'warning' : 'normal',
      icon: Droplets,
      iconColor: 'text-teal-500 bg-teal-50'
    },
    {
      id: 'vitals',
      label: 'Respiration',
      value: physio.respirationRate.toFixed(1),
      unit: 'br/min',
      normal: '12 - 18',
      status: 'normal',
      icon: Wind,
      iconColor: 'text-indigo-500 bg-indigo-50'
    },
    {
      id: 'temperature',
      label: 'Core Body Temp',
      value: physio.coreTemp.toFixed(1),
      unit: '°C',
      normal: '36.8 - 37.3',
      status: physio.coreTempStatus,
      icon: Thermometer,
      iconColor: 'text-amber-500 bg-amber-50'
    },
    {
      id: 'thrombosis',
      label: 'Venous Flow',
      value: physio.venousFlowVelocity.toFixed(1),
      unit: 'cm/s',
      normal: '> 12.0',
      status: physio.thrombosisStatus,
      icon: Shield,
      iconColor: 'text-blue-500 bg-blue-50'
    },
    {
      id: 'hazards',
      label: 'Radiation Flux',
      value: hazards.doseRate.toFixed(1),
      unit: 'µSv/h',
      normal: '< 55.0',
      status: hazards.speAlert ? 'critical' : 'normal',
      icon: Radio,
      iconColor: 'text-purple-500 bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {vitals.map((v) => {
        const Icon = v.icon;
        const isCritical = v.status === 'critical';
        const isWarning = v.status === 'warning';

        return (
          <button
            key={v.label}
            onClick={() => setSelectedMetric(v.id)}
            className={`astro-card p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
              isCritical
                ? 'border-red-300 ring-2 ring-red-400/20 bg-red-50/30'
                : isWarning
                ? 'border-amber-300 bg-amber-50/20'
                : 'hover:border-sky-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                {v.label}
              </span>
              <div className={`p-1 rounded-md ${v.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold font-mono ${
                isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {v.value}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{v.unit}</span>
            </div>

            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
              <span>Norm: {v.normal}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isCritical ? 'bg-red-500 animate-ping' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
