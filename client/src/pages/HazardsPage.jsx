import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import {
  Radio, Users, Compass, Globe, Wind,
  AlertTriangle, ShieldAlert, CheckCircle, Clock, Orbit
} from 'lucide-react';

export function HazardsPage() {
  const { telemetry, setGravityMode } = useTelemetry();
  const { hazards, physio } = telemetry;

  const careerLimitPercent = Math.min(100, (hazards.cumulativeDose / hazards.careerLimitDose) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">NASA 5 Human Spaceflight Hazards</h1>
          <p className="text-xs text-slate-500">
            Real-time environmental risk telemetry during deep space exploration (Mars Transit Phase 1)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            NASA HRP RED PROTOCOL
          </span>
        </div>
      </div>

      {/* Grid of the 5 NASA Hazards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ============================================================ */}
        {/* HAZARD 1: SPACE RADIATION */}
        {/* ============================================================ */}
        <div className="astro-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">1. Space Radiation (SPE & GCR)</h3>
                <p className="text-[11px] text-slate-500">Galactic Cosmic Rays & Solar Energetic Particle Events</p>
              </div>
            </div>
            {hazards.speAlert ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse border border-red-300">
                <AlertTriangle className="w-3 h-3" /> SPE ALARM ACTIVE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-3 h-3" /> Nominal GCR
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Live Dose Rate</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-slate-900">{hazards.doseRate.toFixed(1)}</span>
                <span className="text-xs text-slate-500">µSv/h</span>
              </div>
              <span className="text-[10px] text-slate-400">Normal GCR: 35-55 µSv/h</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Cumulative Mission Dose</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-slate-900">{hazards.cumulativeDose.toFixed(2)}</span>
                <span className="text-xs text-slate-500">mSv</span>
              </div>
              <span className="text-[10px] text-slate-400">Career Limit: {hazards.careerLimitDose} mSv</span>
            </div>
          </div>

          {/* Career Limit Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>NASA Astronaut Career Radiation Limit</span>
              <span className="font-mono">{careerLimitPercent.toFixed(1)}% of 600 mSv</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  careerLimitPercent > 50 ? 'bg-amber-500' : 'bg-purple-600'
                }`}
                style={{ width: `${careerLimitPercent}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-purple-900">
            <strong>Shielding Status:</strong> {hazards.radiationShieldingStatus}
          </div>
        </div>

        {/* ============================================================ */}
        {/* HAZARD 2: ISOLATION AND CONFINEMENT */}
        {/* ============================================================ */}
        <div className="astro-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">2. Isolation & Confinement</h3>
                <p className="text-[11px] text-slate-500">Circadian Stability & Behavioral Health Readiness</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Sol {hazards.missionDay}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Sleep Quality Index</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-slate-900">{hazards.sleepQualityScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">8.2 hrs Actigraphy</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Voice Acoustic Stress</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-mono text-slate-900">{hazards.voiceAcousticStressScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <span className="text-[10px] text-slate-400">Low Vocal Tension</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Social Interaction Score</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-slate-900">{hazards.socialInteractionScore}%</span>
              </div>
              <span className="text-[10px] text-slate-400">Crew cohesiveness nominal</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Behavioral Health Risk</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-xl font-bold font-mono ${hazards.behavioralHealthRisk > 40 ? 'text-amber-600' : 'text-slate-900'}`}>
                  {hazards.behavioralHealthRisk}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Within acceptable limits</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Autonomous decision support monitors linguistic stress markers and circadian lighting schedules to mitigate neurobehavioral decline during long transit isolation.
          </p>
        </div>

        {/* ============================================================ */}
        {/* HAZARD 3: DISTANCE FROM EARTH */}
        {/* ============================================================ */}
        <div className="astro-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">3. Distance from Earth & Autonomy</h3>
                <p className="text-[11px] text-slate-500">Interplanetary Telemetry & Light Latency</p>
              </div>
            </div>
            {hazards.autonomousModeActive && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                AUTONOMOUS MODE ACTIVE
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Distance from Earth</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                {(hazards.distanceKm / 1e6).toFixed(1)} M km
              </p>
              <span className="text-[10px] text-slate-400">{hazards.distanceAu.toFixed(3)} AU</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Comms Delay (1-Way)</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                {(hazards.oneWayCommsDelaySec / 60).toFixed(1)} min
              </p>
              <span className="text-[10px] text-slate-400">{hazards.oneWayCommsDelaySec.toFixed(0)} seconds</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Round-Trip Ping</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                {((hazards.oneWayCommsDelaySec * 2) / 60).toFixed(1)} min
              </p>
              <span className="text-[10px] text-slate-400">Deep Space Network</span>
            </div>
          </div>

          <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-200 text-xs text-sky-900 space-y-1">
            <strong>Clinical Autonomy Rationale:</strong>
            <p>
              Because communication delay exceeds 3 minutes, real-time ground flight surgeon emergency interventions are impossible. ASTROVITAL automatically activates onboard AI decision trees for acute triage and countermeasure deployment.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* HAZARD 4: GRAVITY FIELDS & TRANSITIONS */}
        {/* ============================================================ */}
        <div className="astro-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">4. Gravity Fields & Transitions</h3>
                <p className="text-[11px] text-slate-500">Adapting physiological baselines across gravity regimes</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
              {hazards.gravityMode} ({hazards.effectiveG}G)
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Select Gravity Baseline Mode (Changes physiological baselines dynamically):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'microgravity', label: '0G Transit', g: '0.00 G' },
                { id: 'lunar', label: 'Lunar Base', g: '0.16 G' },
                { id: 'mars', label: 'Martian Surface', g: '0.38 G' },
                { id: 'earth', label: 'Earth Pre-Flight', g: '1.00 G' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setGravityMode(m.id)}
                  className={`p-2 rounded-xl text-center border text-xs font-semibold transition ${
                    hazards.gravityMode === m.id
                      ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <p className="leading-tight">{m.label}</p>
                  <p className={`text-[10px] font-mono mt-0.5 ${hazards.gravityMode === m.id ? 'text-teal-100' : 'text-slate-400'}`}>
                    {m.g}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Cephalad Shift</span>
              <span className="font-bold text-slate-800 font-mono text-sm">
                {hazards.gravityMode === 'microgravity' ? 'Severe (+48%)' : (hazards.gravityMode === 'mars' ? 'Mild (+14%)' : 'None')}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Bone Resorption</span>
              <span className="font-bold text-slate-800 font-mono text-sm">
                {hazards.gravityMode === 'microgravity' ? '1.2% / mo' : (hazards.gravityMode === 'mars' ? '0.5% / mo' : '0.0%')}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold">Venous Pooling</span>
              <span className="font-bold text-slate-800 font-mono text-sm">
                {hazards.gravityMode === 'microgravity' ? 'Elevated' : 'Nominal'}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* HAZARD 5: HOSTILE CLOSED ENVIRONMENT */}
        {/* ============================================================ */}
        <div className="astro-card p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">5. Hostile Closed Environment (ECLSS Life Support)</h3>
                <p className="text-[11px] text-slate-500">Cabin atmosphere, toxic trace scrubbing, and pressure regulation</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3 h-3" /> ECLSS Nominal
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Cabin pCO2</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">{hazards.cabinCo2.toFixed(2)} mmHg</p>
              <span className="text-[10px] text-slate-400">Threshold: &lt; 4.0 mmHg</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Oxygen Partial (pO2)</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">{hazards.cabinO2Percent.toFixed(1)} %</p>
              <span className="text-[10px] text-slate-400">Nominal 21.0%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Cabin Pressure</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">{hazards.cabinPressureKpa.toFixed(1)} kPa</p>
              <span className="text-[10px] text-slate-400">14.7 psi (1 atm)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Relative Humidity</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">{hazards.cabinHumidity.toFixed(1)} %</p>
              <span className="text-[10px] text-slate-400">Target 40 - 55%</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Cabin Temp</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">{hazards.cabinTemperature.toFixed(1)} °C</p>
              <span className="text-[10px] text-slate-400">Comfort 21 - 23°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
