import express from 'express';

export function createTelemetryRouter(physioEngine, hazardEngine, alertEngine, historyBuffer) {
  const router = express.Router();

  // Current live snapshot
  router.get('/current', (req, res) => {
    const physio = physioEngine.state;
    const hazards = hazardEngine.state;
    const alertEvaluation = alertEngine.evaluate(physio, hazards);

    res.json({
      timestamp: new Date().toISOString(),
      astronaut: {
        id: 'ASTRO-772',
        name: 'Cmdr. Alex Vance',
        mission: 'ARES-IV Mars Transit Phase 1',
        suitId: 'BIO-SUIT-MARK-V-04',
        missionDay: hazards.missionDay
      },
      physio,
      hazards,
      healthIndex: alertEvaluation.astronautHealthIndex,
      predictiveRisks: alertEvaluation.predictiveRisks,
      activeAlertsCount: alertEvaluation.activeAlerts.length
    });
  });

  // Historical telemetry buffer for charts
  router.get('/history', (req, res) => {
    res.json({
      count: historyBuffer.length,
      data: historyBuffer
    });
  });

  // CSV Export endpoint
  router.get('/export-csv', (req, res) => {
    if (historyBuffer.length === 0) {
      return res.status(404).send('No telemetry data available for export.');
    }

    const headers = [
      'Timestamp',
      'HeartRate_BPM',
      'HRV_ms',
      'SpO2_Percent',
      'Systolic_BP',
      'Diastolic_BP',
      'CoreTemp_C',
      'SkinTemp_Torso_C',
      'VenousFlow_cm_s',
      'ClotRisk_Percent',
      'SweatLactate_mmol_L',
      'Cortisol_ug_dL',
      'ONSD_mm',
      'Wound_pH',
      'Wound_Temp_C',
      'BMD_Loss_Percent',
      'Radiation_DoseRate_uSv_h',
      'CumulativeDose_mSv',
      'Cabin_CO2_mmHg',
      'HealthIndex'
    ];

    const rows = historyBuffer.map(item => [
      item.timestamp,
      item.heartRate,
      item.hrv,
      item.spo2,
      item.systolicBp,
      item.diastolicBp,
      item.coreTemp,
      item.skinTempTorso,
      item.venousFlowVelocity,
      item.clotRiskScore,
      item.sweatLactate,
      item.cortisolLevel,
      item.opticNerveSheathDiameter,
      item.woundExudatePh,
      item.woundBandageTemp,
      item.boneMineralDensityLossPercent,
      item.doseRate,
      item.cumulativeDose,
      item.cabinCo2,
      item.healthIndex
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ASTROVITAL_Telemetry_MissionLog.csv"');
    res.send(csvContent);
  });

  // Set Gravity baseline
  router.post('/gravity-mode', (req, res) => {
    const { mode } = req.body;
    if (['microgravity', 'lunar', 'mars', 'earth'].includes(mode)) {
      physioEngine.setGravityMode(mode);
      hazardEngine.setGravityMode(mode);
      res.json({ success: true, mode });
    } else {
      res.status(400).json({ error: 'Invalid gravity mode' });
    }
  });

  return router;
}
