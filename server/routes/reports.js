import express from 'express';

export function createReportsRouter(physioEngine, hazardEngine, alertEngine, historyBuffer) {
  const router = express.Router();

  // Generate Flight Surgeon Clinical Summary Report
  router.get('/flight-surgeon-summary', (req, res) => {
    const physio = physioEngine.state;
    const hazards = hazardEngine.state;
    const alertEvaluation = alertEngine.evaluate(physio, hazards);

    const report = {
      reportId: `NASA-MED72-SOL${hazards.missionDay}-${Date.now().toString().slice(-6)}`,
      generatedAt: new Date().toISOString(),
      classification: 'OFFICIAL USE ONLY // NASA FLIGHT MEDICINE // HRP PROTOCOL',
      astronaut: {
        id: 'ASTRO-772',
        name: 'Cmdr. Alex Vance',
        age: 38,
        bloodType: 'O-Positive',
        mission: 'ARES-IV Expedition to Mars (Transit Phase 1)',
        suitUnit: 'BIO-SUIT MARK-V #04',
        missionDay: hazards.missionDay,
        transitDistanceAu: hazards.distanceAu,
        lightCommsDelaySec: hazards.oneWayCommsDelaySec
      },
      healthOverview: {
        astronautHealthIndex: alertEvaluation.astronautHealthIndex,
        clinicalFitnessCategory: alertEvaluation.astronautHealthIndex > 80 ? 'Class 1 Flight Ready' : (alertEvaluation.astronautHealthIndex > 60 ? 'Class 2 Monitored' : 'Class 3 Medical Intervention Required'),
        autonomousDecisionMode: hazards.autonomousModeActive ? 'AUTONOMOUS CLINICAL DECISION SUPPORT ACTIVE (Delay > 60s)' : 'TELEMEDICINE REAL-TIME'
      },
      systemAssessments: [
        {
          system: 'Cardiovascular & Rhythm',
          status: physio.arrhythmiaDetected ? 'CRITICAL' : (physio.heartRate > 95 ? 'WARNING' : 'NOMINAL'),
          metrics: {
            heartRate: `${Math.round(physio.heartRate)} BPM`,
            rhythm: physio.rhythmType,
            hrvRmssd: `${Math.round(physio.hrv)} ms`,
            bloodPressure: `${physio.systolicBp}/${physio.diastolicBp} mmHg`
          },
          clinicalNotes: physio.arrhythmiaDetected
            ? 'Frequent PVCs noted. Correlate with electrolyte panel and microgravity thoracic fluid displacement.'
            : 'Hemodynamic indices within expected microgravity adaptations. Stroke volume stable.'
        },
        {
          system: 'Venous Hemodynamics & Thrombosis',
          status: physio.thrombosisStatus.toUpperCase(),
          metrics: {
            venousVelocity: `${physio.venousFlowVelocity.toFixed(1)} cm/s`,
            limbImpedance: `${Math.round(physio.limbImpedance)} Ω`,
            clotRiskScore: `${Math.round(physio.clotRiskScore)}%`
          },
          clinicalNotes: physio.clotRiskScore > 50
            ? 'Venous stasis in internal jugular/femoral veins secondary to cephalad fluid shift. High risk of thrombosis.'
            : 'Venous return adequate. Recommend continued adherence to compression garment protocol.'
        },
        {
          system: 'Neuro-Ocular & SANS Evaluation',
          status: physio.sansRiskFlag.toUpperCase(),
          metrics: {
            onsd: `${physio.opticNerveSheathDiameter.toFixed(2)} mm`,
            cephaladShiftScore: `${Math.round(physio.cephaladFluidShiftScore)}/100`,
            papilledemaRisk: physio.opticNerveSheathDiameter > 5.5 ? 'Moderate to High' : 'Low'
          },
          clinicalNotes: physio.opticNerveSheathDiameter > 5.5
            ? 'Optic nerve sheath dilation exceeds 5.5 mm threshold. Suggests sustained intracranial venous congestion.'
            : 'No significant globe flattening or choroidal folds identified by proxy telemetric indicators.'
        },
        {
          system: 'Smart Bandage Biosensor & Integumentary',
          status: physio.woundInfectionWarning ? 'CRITICAL' : 'NOMINAL',
          metrics: {
            woundPh: physio.woundExudatePh.toFixed(2),
            woundLocalTemp: `${physio.woundBandageTemp.toFixed(1)}°C`,
            healingIndex: `${Math.round(physio.woundHealingProgress)}%`
          },
          clinicalNotes: physio.woundInfectionWarning
            ? 'Alkaline exudate shift and thermal spike indicate localized opportunistic bacterial proliferation.'
            : 'Wound closure progressing steadily with optimal exudate moisture control.'
        },
        {
          system: 'Musculoskeletal & Bone Density',
          status: physio.boneMineralDensityLossPercent > 2.0 ? 'WARNING' : 'NOMINAL',
          metrics: {
            bmdLossToDate: `-${physio.boneMineralDensityLossPercent}%`,
            monthlyLossRate: `${physio.projectedLossTrajectory}% / 30d`,
            dailyAredLoad: `${physio.dailyExerciseLoadAccumulated} kN*s (93% compliance)`
          },
          clinicalNotes: 'ARED countermeasure loading mitigating proximal femur and lumbar demineralization curve.'
        },
        {
          system: 'Radiation & Environmental Exposures',
          status: hazards.speAlert ? 'CRITICAL' : 'NOMINAL',
          metrics: {
            liveDoseRate: `${hazards.doseRate.toFixed(1)} µSv/h`,
            cumulativeDose: `${hazards.cumulativeDose.toFixed(2)} mSv`,
            careerPermissibleLimit: `${hazards.careerLimitDose} mSv`,
            cabinCo2: `${hazards.cabinCo2.toFixed(2)} mmHg`
          },
          clinicalNotes: hazards.speAlert
            ? 'EMERGENCY: Solar particle event in progress. Verify storm shelter water wall positioning.'
            : 'Background GCR exposure within expected Mars transit shielding margins.'
        }
      ],
      activeAlerts: alertEvaluation.activeAlerts,
      recommendations: [
        'Maintain daily 2.5 hours prescribed ARED resistance and T2 treadmill protocol.',
        'Drink minimum 2,400 mL electrolyte-supplemented water daily to counter cephalad fluid diuresis.',
        'Inspect smart-bandage telemetry twice daily; keep topical silver dressing in reserve.',
        'Perform weekly fundus camera and optical coherence tomography (OCT) telemedicine scans.'
      ],
      disclaimer: 'Simulated data for demonstration only. Not for real medical use. NASA Space Apps Challenge 2026.'
    };

    res.json(report);
  });

  return router;
}
