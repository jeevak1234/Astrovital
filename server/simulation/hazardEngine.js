/**
 * ASTROVITAL Spaceflight Hazard Engine
 * Simulates NASA's 5 Hazards of Human Spaceflight:
 * 1. Space Radiation (SPE & GCR)
 * 2. Isolation and Confinement
 * 3. Distance from Earth (Comms latency & autonomy)
 * 4. Gravity Fields (Transitions)
 * 5. Hostile Closed Environments (ECLSS life support parameters)
 */

export class HazardEngine {
  constructor() {
    this.timeStep = 0;
    this.activeScenario = null;
    this.scenarioTimer = 0;

    this.state = {
      // 1. Space Radiation
      doseRate: 42.5, // µSv/h (ambient GCR interplanetary flux)
      cumulativeDose: 148.2, // mSv total mission accumulated
      careerLimitDose: 600.0, // mSv (NASA astronaut career standard limit)
      speAlert: false, // Solar Particle Event alert
      radiationShieldingStatus: 'Optimal (Storm Shelter Standby)',
      radiationRiskLevel: 'nominal',

      // 2. Isolation & Confinement
      missionDay: 42,
      sleepQualityScore: 84, // %
      voiceAcousticStressScore: 28, // 0-100 (elevated = acute stress)
      socialInteractionScore: 88, // %
      behavioralHealthRisk: 22, // 0-100
      circadianDisruptionIndex: 18,

      // 3. Distance from Earth
      distanceKm: 54200000, // 54.2 million km (Mars Transit Phase 1)
      distanceAu: 0.362,
      oneWayCommsDelaySec: 180.8, // 3.01 minutes light delay
      autonomousModeActive: true, // Enabled when delay > 60s
      earthSignalStrength: 82, // %

      // 4. Gravity Fields
      gravityMode: 'microgravity',
      effectiveG: 0.0, // 0G microgravity
      vestibularAdaptationDays: 4, // neurovestibular re-adaptation progress

      // 5. Hostile Closed Environment (ECLSS life support)
      cabinCo2: 2.4, // mmHg (ISS typical 2.0-3.5; NASA threshold 4.0)
      cabinO2Percent: 21.1, // %
      cabinPressureKpa: 101.3, // kPa (14.7 psi)
      cabinHumidity: 44.5, // %
      cabinTemperature: 21.8, // °C
      particulateIndex: 12, // µg/m³
      eclssStatus: 'nominal',
    };
  }

  injectScenario(scenarioName) {
    this.activeScenario = scenarioName;
    this.scenarioTimer = 40;
  }

  resetScenario() {
    this.activeScenario = null;
    this.scenarioTimer = 0;
  }

  setGravityMode(mode) {
    this.state.gravityMode = mode;
    if (mode === 'microgravity') this.state.effectiveG = 0.0;
    else if (mode === 'lunar') this.state.effectiveG = 0.166;
    else if (mode === 'mars') this.state.effectiveG = 0.38;
    else if (mode === 'earth') this.state.effectiveG = 1.0;
  }

  update() {
    this.timeStep += 1;

    if (this.scenarioTimer > 0) {
      this.scenarioTimer -= 1;
      if (this.scenarioTimer <= 0) {
        this.activeScenario = null;
      }
    }

    const noise = (scale = 1) => (Math.random() - 0.5) * scale;

    // --- Scenario Injections ---
    if (this.activeScenario === 'solar_flare') {
      this.state.doseRate = Math.min(2450.0, this.state.doseRate + 120.0 + noise(10));
      this.state.cumulativeDose = Number((this.state.cumulativeDose + 0.15).toFixed(2));
      this.state.speAlert = true;
      this.state.radiationShieldingStatus = 'WARNING: ACTIVE SPE STORM SHELTER PROTOCOL REQUIRED';
      this.state.radiationRiskLevel = 'critical';
    } else {
      this.state.doseRate = Number((42.5 + noise(1.2)).toFixed(1));
      this.state.cumulativeDose = Number((this.state.cumulativeDose + 0.0001).toFixed(3));
      this.state.speAlert = false;
      this.state.radiationShieldingStatus = 'Optimal (Storm Shelter Standby)';
      this.state.radiationRiskLevel = 'nominal';
    }

    if (this.activeScenario === 'long_isolation') {
      this.state.voiceAcousticStressScore = Math.min(88, this.state.voiceAcousticStressScore + 1.2);
      this.state.behavioralHealthRisk = Math.min(78, this.state.behavioralHealthRisk + 1.0);
      this.state.sleepQualityScore = Math.max(45, this.state.sleepQualityScore - 0.8);
      this.state.socialInteractionScore = Math.max(38, this.state.socialInteractionScore - 0.9);
    } else {
      this.state.voiceAcousticStressScore = Math.min(38, Math.max(18, Math.round(28 + noise(1.2))));
      this.state.behavioralHealthRisk = Math.min(32, Math.max(14, Math.round(22 + noise(0.8))));
      this.state.sleepQualityScore = Math.min(94, Math.max(76, Math.round(84 + noise(1))));
      this.state.socialInteractionScore = Math.min(95, Math.max(78, Math.round(88 + noise(1))));
    }

    // Distance progression (Mars transit speed ~21 km/s)
    this.state.distanceKm += 21;
    this.state.distanceAu = Number((this.state.distanceKm / 149597870.7).toFixed(4));
    this.state.oneWayCommsDelaySec = Number((this.state.distanceKm / 299792.458).toFixed(1));
    this.state.autonomousModeActive = this.state.oneWayCommsDelaySec > 60;

    // ECLSS environment fluctuations
    this.state.cabinCo2 = Number((2.4 + noise(0.08)).toFixed(2));
    this.state.cabinO2Percent = Number((21.1 + noise(0.05)).toFixed(1));
    this.state.cabinPressureKpa = Number((101.3 + noise(0.05)).toFixed(1));
    this.state.cabinHumidity = Number((44.5 + noise(0.3)).toFixed(1));
    this.state.cabinTemperature = Number((21.8 + noise(0.1)).toFixed(1));

    return { ...this.state };
  }
}
