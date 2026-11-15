/**
 * ASTROVITAL Physiological Simulation Engine
 * Based on NASA Human Research Program (HRP) spaceflight physiology baselines.
 * Simulates microgravity adaptations: cephalad fluid shifts, cardiovascular deconditioning,
 * bone demineralization, immune dysregulation, sweat biomarkers, and wound healing.
 */

export class PhysiologicalEngine {
  constructor() {
    this.timeStep = 0;
    this.gravityMode = 'microgravity'; // 'microgravity', 'mars', 'lunar', 'earth'
    this.activeScenario = null;
    this.scenarioTimer = 0;

    // Baseline Astronaut Profile (Cmdr. Alex Vance - Mission Day 42 Mars Transit)
    this.state = {
      // 1. ECG & Cardiovascular
      heartRate: 72,
      hrv: 58, // ms (RMSSD)
      arrhythmiaDetected: false,
      rhythmType: 'Normal Sinus Rhythm',
      cardiacOutput: 5.2, // L/min
      strokeVolume: 72, // mL

      // 2. Core Body Temperature
      coreTemp: 37.05, // °C (slight spaceflight elevation: space fever)
      coreTempStatus: 'normal',

      // 3. Skin Temperature Across Suit Zones
      skinTempTorso: 34.2,
      skinTempExtremities: 31.8,
      skinTempHelmet: 33.1,

      // 4. Blood Clot & Venous Thrombosis Risk
      venousFlowVelocity: 14.5, // cm/s in femoral / jugular vein (normal > 12)
      limbImpedance: 465, // Ohms (detects blood pooling / stasis)
      clotRiskScore: 18, // 0 - 100%
      thrombosisStatus: 'normal',

      // 5. Sweat Lactate & Muscle Exertion
      sweatLactate: 2.8, // mmol/L (resting: 1.5 - 4.0; fatigue > 7.5)
      muscleExertion: 22, // 0 - 100%
      muscleFatigueScore: 16,

      // 6. Immune System & Stress
      cortisolLevel: 12.4, // µg/dL (normal 8 - 18)
      inflammationIndex: 1.8, // hs-CRP mg/L (normal < 3.0)
      immuneRiskScore: 24, // 0 - 100

      // 7. Intracranial Pressure (ICP) & SANS Proxy
      opticNerveSheathDiameter: 4.8, // mm (normal 4.4 - 5.0; SANS risk > 5.8)
      cephaladFluidShiftScore: 48, // 0 - 100 (elevated in 0G)
      sansRiskFlag: 'Normal',

      // 8. Wound Monitoring (Smart Bandage on left forearm)
      woundBandageTemp: 34.8, // °C
      woundExudatePh: 7.15, // normal healing 6.8 - 7.4 (infection > 7.8)
      woundMoisture: 62, // % (optimal 50 - 75%)
      woundHealingProgress: 78, // %
      woundInfectionWarning: false,

      // 9. Bone Loss & Mechanical Load
      boneMineralDensityLossPercent: 1.4, // % lost since launch
      projectedLossTrajectory: 1.15, // % per 30 days in microgravity
      dailyExerciseLoadAccumulated: 840, // kN*s (ARED target: 900)
      boneRiskScore: 22,

      // 10. Additional Vitals
      spo2: 98.4, // %
      respirationRate: 14.2, // breaths/min
      systolicBp: 118,
      diastolicBp: 76,
      hydrationLevel: 88, // %
    };

    // ECG Waveform buffer generator
    this.ecgPhase = 0;
  }

  setGravityMode(mode) {
    this.gravityMode = mode;
  }

  injectScenario(scenarioName) {
    this.activeScenario = scenarioName;
    this.scenarioTimer = 35; // scenario runs for 35 ticks
  }

  resetScenario() {
    this.activeScenario = null;
    this.scenarioTimer = 0;
  }

  // Realistic waveform point generation (P-Q-R-S-T curve)
  getNextEcgPoint() {
    const hr = this.state.heartRate;
    const beatPeriod = 60 / hr; // seconds per beat
    this.ecgPhase += 0.05; // sample increment

    const t = (this.ecgPhase % beatPeriod) / beatPeriod;
    let v = 0;

    if (this.activeScenario === 'arrhythmia' && Math.random() < 0.28) {
      // Ectopic ventricular burst / PVC
      v = (Math.random() - 0.5) * 2.8;
      return Number(v.toFixed(3));
    }

    // P Wave: 0.1 - 0.2
    if (t > 0.1 && t < 0.2) {
      v = 0.2 * Math.sin(((t - 0.1) / 0.1) * Math.PI);
    }
    // QRS complex: 0.28 - 0.36
    else if (t >= 0.28 && t < 0.30) {
      v = -0.15 * Math.sin(((t - 0.28) / 0.02) * Math.PI); // Q dip
    } else if (t >= 0.30 && t < 0.33) {
      v = 1.35 * Math.sin(((t - 0.30) / 0.03) * Math.PI); // R peak
    } else if (t >= 0.33 && t < 0.36) {
      v = -0.35 * Math.sin(((t - 0.33) / 0.03) * Math.PI); // S wave
    }
    // T Wave: 0.45 - 0.60
    else if (t >= 0.45 && t < 0.60) {
      v = 0.32 * Math.sin(((t - 0.45) / 0.15) * Math.PI);
    } else {
      // Baseline baseline noise
      v = (Math.random() - 0.5) * 0.04;
    }

    return Number(v.toFixed(3));
  }

  update() {
    this.timeStep += 1;

    // Handle scenario countdown
    if (this.scenarioTimer > 0) {
      this.scenarioTimer -= 1;
      if (this.scenarioTimer <= 0) {
        this.activeScenario = null;
      }
    }

    // Gravity modifiers
    let gravityFluidShiftFactor = 1.0;
    let gravityBoneLossFactor = 1.0;
    if (this.gravityMode === 'microgravity') {
      gravityFluidShiftFactor = 1.3;
      gravityBoneLossFactor = 1.25;
    } else if (this.gravityMode === 'lunar') {
      gravityFluidShiftFactor = 0.6;
      gravityBoneLossFactor = 0.7;
    } else if (this.gravityMode === 'mars') {
      gravityFluidShiftFactor = 0.4;
      gravityBoneLossFactor = 0.5;
    } else if (this.gravityMode === 'earth') {
      gravityFluidShiftFactor = 0.05;
      gravityBoneLossFactor = 0.05;
    }

    // Smooth baseline noise
    const noise = (scale = 1) => (Math.random() - 0.5) * scale;

    // --- Scenario Injections ---
    if (this.activeScenario === 'arrhythmia') {
      this.state.heartRate = Math.min(142, Math.max(122, this.state.heartRate + noise(5) + 3));
      this.state.hrv = Math.max(18, this.state.hrv - 1.5);
      this.state.arrhythmiaDetected = true;
      this.state.rhythmType = 'Frequent Premature Ventricular Contractions (PVC)';
    } else {
      this.state.heartRate = Math.min(84, Math.max(62, this.state.heartRate + noise(1.2)));
      this.state.hrv = Math.min(74, Math.max(48, this.state.hrv + noise(1.5)));
      this.state.arrhythmiaDetected = false;
      this.state.rhythmType = 'Normal Sinus Rhythm';
    }

    if (this.activeScenario === 'clot_risk') {
      this.state.venousFlowVelocity = Math.max(4.2, this.state.venousFlowVelocity - 0.4);
      this.state.limbImpedance = Math.min(590, this.state.limbImpedance + 4);
      this.state.clotRiskScore = Math.min(88, this.state.clotRiskScore + 3);
      this.state.thrombosisStatus = this.state.clotRiskScore > 65 ? 'critical' : 'warning';
    } else {
      this.state.venousFlowVelocity = Math.min(16.5, Math.max(12.5, this.state.venousFlowVelocity + noise(0.25)));
      this.state.limbImpedance = Math.min(480, Math.max(450, this.state.limbImpedance + noise(1.5)));
      this.state.clotRiskScore = Math.min(25, Math.max(12, this.state.clotRiskScore + noise(0.5)));
      this.state.thrombosisStatus = 'normal';
    }

    if (this.activeScenario === 'wound_infection') {
      this.state.woundExudatePh = Math.min(8.3, this.state.woundExudatePh + 0.04);
      this.state.woundBandageTemp = Math.min(38.8, this.state.woundBandageTemp + 0.1);
      this.state.woundMoisture = Math.min(94, this.state.woundMoisture + 1);
      this.state.woundInfectionWarning = true;
      this.state.woundHealingProgress = Math.max(45, this.state.woundHealingProgress - 0.5);
    } else {
      this.state.woundExudatePh = Math.min(7.35, Math.max(6.95, this.state.woundExudatePh + noise(0.01)));
      this.state.woundBandageTemp = Math.min(35.2, Math.max(34.2, this.state.woundBandageTemp + noise(0.05)));
      this.state.woundMoisture = Math.min(68, Math.max(58, this.state.woundMoisture + noise(0.4)));
      this.state.woundInfectionWarning = false;
      this.state.woundHealingProgress = Math.min(88, Math.max(76, this.state.woundHealingProgress + 0.05));
    }

    if (this.activeScenario === 'sans_spike') {
      this.state.opticNerveSheathDiameter = Math.min(6.25, this.state.opticNerveSheathDiameter + 0.05);
      this.state.cephaladFluidShiftScore = Math.min(92, this.state.cephaladFluidShiftScore + 1.5);
      this.state.sansRiskFlag = 'Elevated SANS Risk';
    } else {
      const baseOnsd = 4.75 + (gravityFluidShiftFactor - 1.0) * 0.2;
      this.state.opticNerveSheathDiameter = Number((baseOnsd + noise(0.04)).toFixed(2));
      this.state.cephaladFluidShiftScore = Math.min(65, Math.max(35, 45 * gravityFluidShiftFactor + noise(1)));
      this.state.sansRiskFlag = this.state.opticNerveSheathDiameter > 5.4 ? 'Borderline' : 'Normal';
    }

    // Thermal simulation
    this.state.coreTemp = Number((37.05 + Math.sin(this.timeStep / 60) * 0.15 + noise(0.02)).toFixed(2));
    this.state.coreTempStatus = this.state.coreTemp > 37.8 ? 'warning' : 'normal';

    this.state.skinTempTorso = Number((34.2 + noise(0.05)).toFixed(1));
    this.state.skinTempExtremities = Number((31.8 + noise(0.1)).toFixed(1));
    this.state.skinTempHelmet = Number((33.1 + noise(0.08)).toFixed(1));

    // Sweat lactate & exertion
    this.state.sweatLactate = Number((2.8 + noise(0.12)).toFixed(2));
    this.state.muscleExertion = Math.min(45, Math.max(15, Math.round(22 + noise(1))));
    this.state.muscleFatigueScore = Math.min(35, Math.max(10, Math.round(16 + noise(0.8))));

    // Immune & Cortisol
    this.state.cortisolLevel = Number((12.4 + noise(0.3)).toFixed(1));
    this.state.inflammationIndex = Number((1.8 + noise(0.05)).toFixed(2));
    this.state.immuneRiskScore = Math.min(40, Math.max(15, Math.round(24 + noise(0.6))));

    // Bone loss simulation
    this.state.boneMineralDensityLossPercent = Number((1.4 * gravityBoneLossFactor).toFixed(2));
    this.state.projectedLossTrajectory = Number((1.15 * gravityBoneLossFactor).toFixed(2));
    this.state.dailyExerciseLoadAccumulated = Math.min(950, Math.round(840 + (this.timeStep % 100)));
    this.state.boneRiskScore = Math.round(20 * gravityBoneLossFactor);

    // Standard vitals
    this.state.spo2 = Number((98.4 + noise(0.2)).toFixed(1));
    this.state.respirationRate = Number((14.2 + noise(0.3)).toFixed(1));
    this.state.systolicBp = Math.round(118 + noise(2));
    this.state.diastolicBp = Math.round(76 + noise(1.5));
    this.state.hydrationLevel = Math.min(96, Math.max(82, Math.round(88 + noise(0.4))));

    return { ...this.state };
  }
}
