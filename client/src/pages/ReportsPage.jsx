import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function ReportsPage() {
  const { telemetry } = useTelemetry();
  const { currentRole } = useAuth();
  const { physio, hazards, healthIndex, activeAlerts } = telemetry;
  const [signedOff, setSignedOff] = useState(false);

  const handleDownloadCsv = () => {
    // Generate CSV client-side
    const headers = [
      'Timestamp', 'HeartRate_BPM', 'HRV_ms', 'SpO2_Percent', 'Systolic_BP', 'Diastolic_BP',
      'CoreTemp_C', 'VenousFlow_cm_s', 'ClotRisk_Percent', 'SweatLactate_mM', 'ONSD_mm',
      'Wound_pH', 'BMD_Loss_Percent', 'RadiationDose_uSv_h', 'Cabin_CO2_mmHg', 'HealthIndex'
    ];

    const row = [
      new Date().toISOString(),
      Math.round(physio.heartRate),
      Math.round(physio.hrv),
      physio.spo2.toFixed(1),
      physio.systolicBp,
      physio.diastolicBp,
      physio.coreTemp.toFixed(2),
      physio.venousFlowVelocity.toFixed(1),
      Math.round(physio.clotRiskScore),
      physio.sweatLactate.toFixed(2),
      physio.opticNerveSheathDiameter.toFixed(2),
      physio.woundExudatePh.toFixed(2),
      physio.boneMineralDensityLossPercent.toFixed(2),
      hazards.doseRate.toFixed(1),
      hazards.cabinCo2.toFixed(2),
      healthIndex
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ASTROVITAL_FlightSurgeon_Sol${hazards.missionDay}_Telemetry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Flight Surgeon Clinical Medical Report</h1>
          <p className="text-xs text-slate-500">Official Spaceflight Health Record (NASA Form MED-72 / HRP Protocol)</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Telemetry CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Clinical PDF</span>
          </button>
        </div>
      </div>

      {/* Official Medical Document Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-6 printable-document">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-widest text-sky-700 uppercase">NATIONAL AERONAUTICS AND SPACE ADMINISTRATION</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              MISSION HEALTH CLINICAL SUMMARY (FORM MED-72)
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              CLASSIFICATION: OFFICIAL MEDICAL USE ONLY // RESTRICTED ACCESS
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-600">
            <p><strong>REPORT ID:</strong> MED72-SOL{hazards.missionDay}-772</p>
            <p><strong>TIMESTAMP:</strong> {new Date().toISOString()}</p>
            <p><strong>LATENCY:</strong> {(hazards.oneWayCommsDelaySec / 60).toFixed(1)} min light-delay</p>
          </div>
        </div>

        {/* Astronaut Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Astronaut</span>
            <p className="font-bold text-slate-900 mt-0.5">Cmdr. Alex Vance</p>
            <span className="text-slate-500 font-mono text-[10px]">ID: ASTRO-772</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Mission</span>
            <p className="font-bold text-slate-900 mt-0.5">ARES-IV Expedition</p>
            <span className="text-slate-500 text-[10px]">Mars Transit Phase 1</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Mission Sol</span>
            <p className="font-bold text-slate-900 mt-0.5">Sol {hazards.missionDay}</p>
            <span className="text-slate-500 text-[10px]">{(hazards.distanceKm / 1e6).toFixed(1)} M km from Earth</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Health Index</span>
            <p className="font-bold text-slate-900 mt-0.5">{healthIndex} / 100</p>
            <span className="text-emerald-700 font-semibold text-[10px]">
              {healthIndex > 80 ? 'Class 1 Flight Ready' : 'Class 2 Monitored'}
            </span>
          </div>
        </div>

        {/* Comprehensive System Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Bio-Telemetry Clinical Assessment Matrix
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Organ / Sensor Domain</th>
                  <th className="p-3">Current Telemetry</th>
                  <th className="p-3">Normal Space Baseline</th>
                  <th className="p-3">Clinical Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Cardiovascular & ECG</td>
                  <td className="p-3 font-mono">{Math.round(physio.heartRate)} BPM | {Math.round(physio.hrv)} ms HRV</td>
                  <td className="p-3 text-slate-500">60 - 90 BPM | Sinus</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      physio.arrhythmiaDetected ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {physio.arrhythmiaDetected ? 'ARRHYTHMIA' : 'NOMINAL'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Neuro-Ocular & SANS</td>
                  <td className="p-3 font-mono">{physio.opticNerveSheathDiameter.toFixed(2)} mm ONSD</td>
                  <td className="p-3 text-slate-500">4.4 - 5.0 mm (&lt; 5.8 mm)</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {physio.sansRiskFlag}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Venous Hemodynamics / DVT</td>
                  <td className="p-3 font-mono">{physio.venousFlowVelocity.toFixed(1)} cm/s | {Math.round(physio.limbImpedance)} Ω</td>
                  <td className="p-3 text-slate-500">&gt; 12.0 cm/s flow</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      physio.thrombosisStatus === 'critical' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {physio.thrombosisStatus}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Smart Bandage Forearm</td>
                  <td className="p-3 font-mono">pH {physio.woundExudatePh.toFixed(2)} | {physio.woundBandageTemp.toFixed(1)}°C</td>
                  <td className="p-3 text-slate-500">pH 6.8 - 7.4</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      physio.woundInfectionWarning ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {physio.woundInfectionWarning ? 'INFECTION RISK' : 'HEALING NOMINAL'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Bone Mineral Density (BMD)</td>
                  <td className="p-3 font-mono">-{physio.boneMineralDensityLossPercent}% cumulative</td>
                  <td className="p-3 text-slate-500">&lt; 1.2% / month</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      COMPENSATED
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Space Radiation Exposure</td>
                  <td className="p-3 font-mono">{hazards.doseRate.toFixed(1)} µSv/h | {hazards.cumulativeDose.toFixed(2)} mSv</td>
                  <td className="p-3 text-slate-500">600 mSv career limit</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      hazards.speAlert ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {hazards.speAlert ? 'SPE EVENT' : 'NOMINAL GCR'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Countermeasure Recommendations */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <h4 className="font-bold text-slate-900 uppercase">Flight Surgeon Clinical Recommendations:</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Prescribed 2.5 hours daily ARED resistance training maintained at 93%+ compliance.</li>
            <li>Hydration volume minimum 2,600 mL daily with sodium electrolyte replenishment.</li>
            <li>Monitor Smart-Bandage optical telemetry twice daily during crew hygiene block.</li>
            <li>In the event of communication blackout exceeding 15 minutes, autonomous triage algorithms remain authorized for immediate countermeasure dispatch.</li>
          </ul>
        </div>

        {/* Flight Surgeon Digital Sign-off */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Attending Flight Surgeon</span>
            <p className="font-bold text-slate-900">Dr. Evelyn Reed, MD, PhD</p>
            <p className="text-slate-500 text-[11px]">NASA Flight Medicine Division, Houston Johnson Space Center</p>
          </div>

          <div>
            {!signedOff ? (
              <button
                onClick={() => setSignedOff(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                Sign & Validate Clinical Report
              </button>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Digitally Certified & Transmitted to Mars Transit Vehicle Onboard Archive</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
