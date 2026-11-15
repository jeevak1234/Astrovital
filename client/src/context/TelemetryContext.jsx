import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const TelemetryContext = createContext();

export function TelemetryProvider({ children }) {
  // Core telemetry state
  const [telemetry, setTelemetry] = useState({
    timestamp: new Date().toISOString(),
    astronaut: {
      id: 'ASTRO-772',
      name: 'Cmdr. Alex Vance',
      mission: 'ARES-IV Mars Transit Phase 1',
      suitId: 'BIO-SUIT-MARK-V-04',
      missionDay: 42
    },
    physio: {
      heartRate: 72,
      hrv: 58,
      arrhythmiaDetected: false,
      rhythmType: 'Normal Sinus Rhythm',
      coreTemp: 37.05,
      coreTempStatus: 'normal',
      skinTempTorso: 34.2,
      skinTempExtremities: 31.8,
      skinTempHelmet: 33.1,
      venousFlowVelocity: 14.5,
      limbImpedance: 465,
      clotRiskScore: 18,
      thrombosisStatus: 'normal',
      sweatLactate: 2.8,
      muscleExertion: 22,
      muscleFatigueScore: 16,
      cortisolLevel: 12.4,
      inflammationIndex: 1.8,
      immuneRiskScore: 24,
      opticNerveSheathDiameter: 4.8,
      cephaladFluidShiftScore: 48,
      sansRiskFlag: 'Normal',
      woundBandageTemp: 34.8,
      woundExudatePh: 7.15,
      woundMoisture: 62,
      woundHealingProgress: 78,
      woundInfectionWarning: false,
      boneMineralDensityLossPercent: 1.4,
      projectedLossTrajectory: 1.15,
      dailyExerciseLoadAccumulated: 840,
      boneRiskScore: 22,
      spo2: 98.4,
      respirationRate: 14.2,
      systolicBp: 118,
      diastolicBp: 76,
      hydrationLevel: 88,
    },
    hazards: {
      doseRate: 42.5,
      cumulativeDose: 148.2,
      careerLimitDose: 600.0,
      speAlert: false,
      radiationShieldingStatus: 'Optimal (Storm Shelter Standby)',
      radiationRiskLevel: 'nominal',
      missionDay: 42,
      sleepQualityScore: 84,
      voiceAcousticStressScore: 28,
      socialInteractionScore: 88,
      behavioralHealthRisk: 22,
      distanceKm: 54200000,
      distanceAu: 0.362,
      oneWayCommsDelaySec: 180.8,
      autonomousModeActive: true,
      gravityMode: 'microgravity',
      effectiveG: 0.0,
      cabinCo2: 2.4,
      cabinO2Percent: 21.1,
      cabinPressureKpa: 101.3,
      cabinHumidity: 44.5,
      cabinTemperature: 21.8,
    },
    healthIndex: 94,
    predictiveRisks: {
      cardiovascularEventRisk: 12,
      boneDensityLossTrajectory: 24,
      immuneDysfunctionRisk: 18,
      nutritionDeficiencyRisk: 15,
      behavioralHealthRisk: 22
    },
    activeAlerts: []
  });

  // Rolling ECG buffer for real-time oscilloscope
  const [ecgPoints, setEcgPoints] = useState(() => Array.from({ length: 60 }, (_, i) => ({ x: i, y: 0 })));
  
  // Rolling historical chart data
  const [historyData, setHistoryData] = useState([]);

  // Active modal/drawer metric from 3D body clicks
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Connection status
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'live', 'simulated'
  const [activeScenario, setActiveScenario] = useState('nominal');

  // Client-side fallback generator to ensure 100% uptime even if server is offline
  const clientTimeStepRef = useRef(0);
  const clientEcgPhaseRef = useRef(0);

  useEffect(() => {
    // Attempt WebSocket connection
    let ws = null;
    let sse = null;
    let fallbackInterval = null;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname || 'localhost';
      const wsUrl = import.meta.env.VITE_WS_URL || (window.location.port === '3000' ? `${protocol}//${host}:5000` : null);

      if (wsUrl) {
        ws = new WebSocket(wsUrl);
      } else {
        setupFallbackSimulation();
      }

      ws.onopen = () => {
        setConnectionStatus('live');
        console.log('[ASTROVITAL] WebSocket connected to backend telemetry engine.');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'TELEMETRY_UPDATE' || data.type === 'INIT') {
            setTelemetry(prev => ({
              ...prev,
              timestamp: data.timestamp,
              physio: { ...prev.physio, ...data.physio },
              hazards: { ...prev.hazards, ...data.hazards },
              healthIndex: data.healthIndex,
              predictiveRisks: data.predictiveRisks,
              activeAlerts: data.activeAlerts || []
            }));

            // Append to history
            setHistoryData(prev => {
              const updated = [...prev, {
                time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                heartRate: data.physio.heartRate,
                spo2: data.physio.spo2,
                coreTemp: data.physio.coreTemp,
                clotRisk: data.physio.clotRiskScore,
                sweatLactate: data.physio.sweatLactate,
                onsd: data.physio.opticNerveSheathDiameter,
                radiationDose: data.hazards.doseRate,
                healthIndex: data.healthIndex
              }];
              return updated.slice(-30);
            });
          } else if (data.type === 'ECG_TICK') {
            setEcgPoints(prev => {
              const next = [...prev.slice(1), { x: prev[prev.length - 1].x + 1, y: data.ecgPoint }];
              return next;
            });
          }
        } catch (e) {
          console.error('[ASTROVITAL] WS message decode error:', e);
        }
      };

      ws.onerror = () => {
        setupFallbackSimulation();
      };

      ws.onclose = () => {
        setupFallbackSimulation();
      };
    } catch (err) {
      setupFallbackSimulation();
    }

    function setupFallbackSimulation() {
      setConnectionStatus('simulated');
      if (fallbackInterval) return;

      fallbackInterval = setInterval(() => {
        clientTimeStepRef.current += 1;
        const t = clientTimeStepRef.current;
        const noise = (s = 1) => (Math.random() - 0.5) * s;

        // Generate next ECG point
        clientEcgPhaseRef.current += 0.1;
        const hr = 72 + noise(2);
        const beatPeriod = 60 / hr;
        const phase = (clientEcgPhaseRef.current % beatPeriod) / beatPeriod;
        let y = 0;
        if (phase > 0.1 && phase < 0.2) y = 0.2 * Math.sin(((phase - 0.1) / 0.1) * Math.PI);
        else if (phase >= 0.28 && phase < 0.30) y = -0.15;
        else if (phase >= 0.30 && phase < 0.33) y = 1.35;
        else if (phase >= 0.33 && phase < 0.36) y = -0.35;
        else if (phase >= 0.45 && phase < 0.60) y = 0.32 * Math.sin(((phase - 0.45) / 0.15) * Math.PI);
        else y = noise(0.04);

        setEcgPoints(prev => [...prev.slice(1), { x: prev[prev.length - 1].x + 1, y }]);

        // Once every second update vitals
        if (t % 10 === 0) {
          setTelemetry(prev => {
            const newHr = Math.round(72 + Math.sin(t / 20) * 4 + noise(1));
            const newTemp = Number((37.05 + Math.sin(t / 40) * 0.1 + noise(0.02)).toFixed(2));
            const newFlow = Number((14.5 + noise(0.2)).toFixed(1));
            const newClot = Math.round(18 + noise(1));
            const newLactate = Number((2.8 + noise(0.1)).toFixed(2));
            const newOnsd = Number((4.8 + noise(0.03)).toFixed(2));
            const newRadiation = Number((42.5 + noise(1)).toFixed(1));
            const newHealth = Math.round(94 + noise(1));

            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            setHistoryData(hPrev => [...hPrev.slice(-29), {
              time: timeStr,
              heartRate: newHr,
              spo2: 98.4,
              coreTemp: newTemp,
              clotRisk: newClot,
              sweatLactate: newLactate,
              onsd: newOnsd,
              radiationDose: newRadiation,
              healthIndex: newHealth
            }]);

            return {
              ...prev,
              timestamp: new Date().toISOString(),
              physio: {
                ...prev.physio,
                heartRate: newHr,
                coreTemp: newTemp,
                venousFlowVelocity: newFlow,
                clotRiskScore: newClot,
                sweatLactate: newLactate,
                opticNerveSheathDiameter: newOnsd,
                spo2: Number((98.4 + noise(0.2)).toFixed(1)),
                systolicBp: Math.round(118 + noise(1.5)),
                diastolicBp: Math.round(76 + noise(1))
              },
              hazards: {
                ...prev.hazards,
                doseRate: newRadiation,
                cumulativeDose: Number((prev.hazards.cumulativeDose + 0.0001).toFixed(3)),
                distanceKm: prev.hazards.distanceKm + 21
              },
              healthIndex: newHealth
            };
          });
        }
      }, 100);
    }

    return () => {
      if (ws) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  // Scenario triggers
  const triggerScenario = async (scenarioKey) => {
    setActiveScenario(scenarioKey);
    try {
      await fetch('/api/scenarios/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioKey })
      });
    } catch (e) {
      console.info('Backend not responding to scenario, simulation applying locally.');
    }
  };

  const acknowledgeAlert = async (alertId) => {
    setTelemetry(prev => ({
      ...prev,
      activeAlerts: prev.activeAlerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a)
    }));
    try {
      await fetch(`/api/alerts/${alertId}/acknowledge`, { method: 'POST' });
    } catch (e) {}
  };

  const resolveAlert = async (alertId) => {
    setTelemetry(prev => ({
      ...prev,
      activeAlerts: prev.activeAlerts.filter(a => a.id !== alertId)
    }));
    try {
      await fetch(`/api/alerts/${alertId}/resolve`, { method: 'POST' });
    } catch (e) {}
  };

  const setGravityMode = async (mode) => {
    setTelemetry(prev => ({
      ...prev,
      hazards: { ...prev.hazards, gravityMode: mode }
    }));
    try {
      await fetch('/api/telemetry/gravity-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
    } catch (e) {}
  };

  return (
    <TelemetryContext.Provider value={{
      telemetry,
      ecgPoints,
      historyData,
      selectedMetric,
      setSelectedMetric,
      connectionStatus,
      activeScenario,
      triggerScenario,
      acknowledgeAlert,
      resolveAlert,
      setGravityMode
    }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error('useTelemetry must be used within a TelemetryProvider');
  return context;
}
