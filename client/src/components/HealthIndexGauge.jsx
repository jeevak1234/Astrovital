import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { ShieldCheck, AlertCircle, Heart, Bone, ShieldAlert, Apple, Brain } from 'lucide-react';

export function HealthIndexGauge() {
  const { telemetry } = useTelemetry();
  const { healthIndex, predictiveRisks } = telemetry;

  // Radius and circumference for SVG circle
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthIndex / 100) * circumference;

  let gaugeColor = '#10b981'; // normal green
  let statusText = 'Optimal Mission Readiness';
  if (healthIndex < 65) {
    gaugeColor = '#ef4444';
    statusText = 'Critical Medical Alert';
  } else if (healthIndex < 82) {
    gaugeColor = '#f59e0b';
    statusText = 'Clinical Monitoring Flagged';
  }

  const riskItems = [
    { label: 'Cardio Risk', value: predictiveRisks.cardiovascularEventRisk, icon: Heart },
    { label: 'Bone Loss', value: predictiveRisks.boneDensityLossTrajectory, icon: Bone },
    { label: 'Immune Dysf.', value: predictiveRisks.immuneDysfunctionRisk, icon: ShieldAlert },
    { label: 'Nutr. Deficit', value: predictiveRisks.nutritionDeficiencyRisk, icon: Apple },
    { label: 'Behavioral', value: predictiveRisks.behavioralHealthRisk, icon: Brain },
  ];

  return (
    <div className="astro-card p-4 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Astronaut Health Index</h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">AHI-COMPOSITE</span>
      </div>

      {/* Radial Gauge Center */}
      <div className="flex items-center justify-center py-2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={gaugeColor}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center text score */}
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold font-mono text-slate-900">{healthIndex}</span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">/ 100</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-3">
        <p className="text-xs font-semibold text-slate-800">{statusText}</p>
        <p className="text-[10px] text-slate-500">Autonomous multi-system weighted predictive matrix</p>
      </div>

      {/* Predictive Risk Scores Mini-Matrix */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
          Predictive Spaceflight Risks
        </div>
        {riskItems.map((item, idx) => {
          const Icon = item.icon;
          const isHigh = item.value > 50;
          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Icon className="w-3 h-3 text-slate-400" />
                <span className="text-[11px]">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh ? 'bg-red-500' : item.value > 30 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, item.value)}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-700 w-6 text-right font-medium">
                  {item.value}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
