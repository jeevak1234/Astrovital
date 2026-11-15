import React, { useRef, useEffect } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export function EcgMonitor() {
  const { telemetry, ecgPoints } = useTelemetry();
  const { physio } = telemetry;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear background (clinical light theme: soft medical grid)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw ECG Grid (Light medical pink/cyan grid lines)
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Baseline axis
    const midY = height / 2;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    if (!ecgPoints || ecgPoints.length < 2) return;

    // Waveform line
    ctx.beginPath();
    const isCritical = physio.arrhythmiaDetected;
    ctx.strokeStyle = isCritical ? '#ef4444' : '#0284c7'; // red if arrhythmia, sky blue if nominal
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const stepX = width / (ecgPoints.length - 1);
    const scaleY = height * 0.38;

    ecgPoints.forEach((pt, index) => {
      const x = index * stepX;
      const y = midY - pt.y * scaleY;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Lead II live sweep dot
    const lastX = (ecgPoints.length - 1) * stepX;
    const lastY = midY - ecgPoints[ecgPoints.length - 1].y * scaleY;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = isCritical ? '#dc2626' : '#0369a1';
    ctx.fill();
  }, [ecgPoints, physio.arrhythmiaDetected]);

  return (
    <div className="astro-card p-4 flex flex-col justify-between">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${physio.arrhythmiaDetected ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-600'}`}>
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Suit Lead II ECG</h3>
            <p className="text-[10px] text-slate-500 font-mono">25 mm/s | 10 mm/mV</p>
          </div>
        </div>

        {/* Arrhythmia status badge */}
        <div>
          {physio.arrhythmiaDetected ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              Arrhythmia Flag
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3 h-3" />
              Sinus Rhythm
            </span>
          )}
        </div>
      </div>

      {/* Canvas Waveform */}
      <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          width={480}
          height={110}
          className="w-full h-24 block"
        />
        <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-400">
          FILTER: 0.05-40Hz
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Heart Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-slate-900">{Math.round(physio.heartRate)}</span>
            <span className="text-[10px] text-slate-500">BPM</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">HRV (RMSSD)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-slate-900">{Math.round(physio.hrv)}</span>
            <span className="text-[10px] text-slate-500">ms</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Rhythm Type</span>
          <div className="text-[11px] font-medium text-slate-700 truncate mt-1">
            {physio.arrhythmiaDetected ? 'Frequent PVCs' : 'Normal Sinus'}
          </div>
        </div>
      </div>
    </div>
  );
}
