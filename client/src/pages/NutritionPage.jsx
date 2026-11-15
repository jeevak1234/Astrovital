import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Apple, Droplets, Dumbbell, ShieldCheck, Sun, Flame, CheckCircle } from 'lucide-react';

export function NutritionPage() {
  const { telemetry } = useTelemetry();
  const { hazards, physio } = telemetry;

  const nutrients = [
    { name: 'Caloric Intake', current: 2840, target: 3000, unit: 'kcal', percent: 95, icon: Flame, color: 'bg-orange-500' },
    { name: 'Hydration Intake', current: 2650, target: 2800, unit: 'mL', percent: 94, icon: Droplets, color: 'bg-sky-500' },
    { name: 'Vitamin D3', current: 800, target: 800, unit: 'IU', percent: 100, icon: Sun, color: 'bg-amber-500' },
    { name: 'Calcium', current: 1150, target: 1200, unit: 'mg', percent: 96, icon: ShieldCheck, color: 'bg-teal-500' },
    { name: 'Protein', current: 108, target: 115, unit: 'g', percent: 94, icon: Apple, color: 'bg-emerald-500' },
    { name: 'Sodium', current: 2100, target: 2300, unit: 'mg', percent: 91, icon: Apple, color: 'bg-indigo-500' },
  ];

  const exercises = [
    {
      device: 'Advanced Resistive Exercise Device (ARED)',
      target: '900 kN*s mechanical load',
      achieved: `${physio.dailyExerciseLoadAccumulated} kN*s`,
      percent: Math.min(100, Math.round((physio.dailyExerciseLoadAccumulated / 900) * 100)),
      status: 'Completed',
      notes: 'Preserves bone mineral density in lumbar vertebrae & femoral neck'
    },
    {
      device: 'T2 Combined Treadmill & Harness Ergometer',
      target: '35 minutes continuous cardio @ 75% VO2 max',
      achieved: '35 minutes',
      percent: 100,
      status: 'Completed',
      notes: 'Maintains stroke volume and orthostatic tolerance'
    },
    {
      device: 'Cycle Ergometer with Vibration Isolation (CEVIS)',
      target: '20 minutes interval HIIT',
      achieved: '20 minutes',
      percent: 100,
      status: 'Completed',
      notes: 'Enhances peak capillary oxygen transport'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Nutrition & Exercise Countermeasures</h1>
          <p className="text-xs text-slate-500">
            Daily metabolic intake and biomechanical load balancing to mitigate bone/muscle mass loss in microgravity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> 96% Daily Plan Compliance
          </span>
        </div>
      </div>

      {/* Nutrients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nutrients.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.name} className="astro-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">{n.name}</span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700">{n.percent}%</span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xl font-extrabold font-mono text-slate-900">
                  {n.current} <span className="text-xs text-slate-400 font-normal">{n.unit}</span>
                </span>
                <span className="text-xs text-slate-400">Target: {n.target} {n.unit}</span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${n.color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, n.percent)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Biomechanical Exercise Countermeasures */}
      <div className="astro-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">NASA Countermeasure Physical Prescription</h3>
              <p className="text-[11px] text-slate-500">Daily mechanical strain logs countering skeletal demineralization</p>
            </div>
          </div>
          <span className="text-xs font-bold font-mono text-slate-700">SOL {hazards.missionDay}</span>
        </div>

        <div className="space-y-3">
          {exercises.map((ex, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{ex.device}</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                    {ex.status}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">{ex.notes}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Accumulated Load</span>
                  <span className="font-mono font-bold text-slate-800">{ex.achieved}</span>
                </div>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 rounded-full transition-all"
                    style={{ width: `${ex.percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
