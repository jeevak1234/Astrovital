/**
 * ASTROVITAL Risk & Alert Engine
 * Evaluates physiological state & environmental hazards.
 * Computes:
 * - Astronaut Health Index (AHI: 0 - 100)
 * - 5 Predictive Risk Scores (Cardiovascular, Bone Loss, Immune, Nutrition, Behavioral)
 * - Actionable clinical alert feed with severity and NASA countermeasure checklists
 */

export class AlertEngine {
  constructor() {
    this.alerts = [];
    this.alertCounter = 1;
    this.acknowledgedAlertIds = new Set();
  }

  acknowledgeAlert(id) {
    this.acknowledgedAlertIds.add(id);
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date().toISOString();
    }
    return alert;
  }

  resolveAlert(id) {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
    }
    return alert;
  }

  evaluate(physio, hazards) {
    const newAlerts = [];
    const timestamp = new Date().toISOString();

    // 1. Cardiovascular & Arrhythmia Checks
    let cardioScore = 95;
    if (physio.arrhythmiaDetected) {
      cardioScore -= 45;
      newAlerts.push({
        id: `ALT-CARD-${Date.now()}`,
        code: 'CARD_ARRHYTHMIA_PVC',
        category: 'Cardiovascular',
        title: 'Cardiac Arrhythmia Detected',
        severity: 'critical',
        source: 'ECG Suit Lead II / Patch',
        value: `${Math.round(physio.heartRate)} BPM (${physio.rhythmType})`,
        normalRange: '60 - 90 BPM (Sinus)',
        message: 'High frequency of premature ventricular contractions detected with reduced heart rate variability.',
        recommendation: 'Instruct astronaut to reduce physical exertion, hydrate with electrolyte solution, and review 12-lead ECG telemetry. Flight Surgeon notified.',
        timestamp,
        acknowledged: false,
        resolved: false
      });
    } else if (physio.heartRate > 100) {
      cardioScore -= 18;
      newAlerts.push({
        id: `ALT-CARD-${Date.now()}`,
        code: 'CARD_TACHYCARDIA',
        category: 'Cardiovascular',
        title: 'Sinus Tachycardia',
        severity: 'warning',
        source: 'ECG Suit Sensor',
        value: `${Math.round(physio.heartRate)} BPM`,
        normalRange: '60 - 90 BPM',
        message: 'Elevated resting heart rate observed during non-strenuous flight timeline.',
        recommendation: 'Check hydration status, cabin CO2 levels, and perform autonomic calming protocol.',
        timestamp,
        acknowledged: false,
        resolved: false
      });
    }

    // 2. Venous Thrombosis / Blood Clot Risk
    let thrombosisScore = 96;
    if (physio.clotRiskScore > 60 || physio.venousFlowVelocity < 6.0) {
      thrombosisScore -= 50;
      newAlerts.push({
        id: `ALT-THROMB-${Date.now()}`,
        code: 'VASC_VENOUS_STASIS_CRITICAL',
        category: 'Vascular / Clot',
        title: 'High Deep Vein Thrombosis Risk (Femoral/Calf)',
        severity: 'critical',
        source: 'Lower Extremity Plethysmography & Doppler',
        value: `${physio.venousFlowVelocity.toFixed(1)} cm/s flow / ${Math.round(physio.limbImpedance)} Ω`,
        normalRange: '> 12.0 cm/s flow / 440-480 Ω',
        message: 'Significant venous velocity deceleration and impedance elevation indicating venous stasis in lower limbs.',
        recommendation: 'Deploy pneumatic Lower Body Negative Pressure (LBNP) compression cycle (30 mmHg for 45 min) and assess for bilateral calf tenderness.',
        timestamp,
        acknowledged: false,
        resolved: false
      });
    } else if (physio.clotRiskScore > 35) {
      thrombosisScore -= 20;
      newAlerts.push({
        id: `ALT-THROMB-${Date.now()}`,
        code: 'VASC_VENOUS_STASIS_WARN',
        category: 'Vascular / Clot',
        title: 'Moderate Venous Blood Pooling Alert',
        severity: 'warning',
        source: 'Limb Impedance Sensors',
        value: `Clot Risk: ${Math.round(physio.clotRiskScore)}%`,
        normalRange: '< 25%',
        message: 'Microgravity-induced cephalad shift causing venous pooling in peripheral venous reservoirs.',
        recommendation: 'Prescribe 20 minutes active calf raises and pneumatic compression sock donning.',
        timestamp,
        acknowledged: false,
        resolved: false
      });
    }

    // 3. Intracranial Pressure & SANS Risk
    let neuroSansScore = 92;
    if (physio.opticNerveSheathDiameter > 5.8) {
      neuroSansScore -= 40;
      newAlerts.push({
        id: `ALT-SANS-${Date.now()}`,
        code: 'NEURO_SANS_HYPERTENSION',
        category: 'Neuro-Ocular (SANS)',
        title: 'Elevated Intracranial Pressure / SANS Alert',
        severity: 'critical',
        source: 'Ocular Ultrasound Proxy / Suit Helmet Sensors',
        value: `ONSD: ${physio.opticNerveSheathDiameter.toFixed(2)} mm`,
        normalRange: '4.4 - 5.0 mm',
        message: 'Optic nerve sheath dilation indicating cephalad fluid congestion and elevated intracranial pressure.',
        recommendation: 'Perform fundoscopy inspection for optic disc edema (papilledema), schedule 2 hours in LBNP device, sleep in head-up tilt sleep bag.',
        timestamp,
        acknowledged: false,
        resolved: false
      });
    } else if (physio.opticNerveSheathDiameter > 5.3) {
      neuroSansScore -= 18;
      newAlerts.push({
        id: `ALT-SANS-${Date.now()}`,
        code: 'NEURO_SANS_WARN',
        category: 'Neuro-Ocular (SANS)',
        title: 'Borderline Ocular Sheath Diameter',
        severity: 'warning',
        source: 'Optic Nerve Sheath Proxy',
        value: `ONSD: ${physio.opticNerveSheathDiameter.toFixed(2)} mm`,
        normalRange: '4.4 - 5.0 mm',
        message: 'Gradual increase in optic sheath width tracking with microgravity cephalad fluid redistribution.',
        recommendation: 'Monitor visual acuity chart and log contrast sensitivity testing.',
        timestamp,
        acknowledged: false,
        resolved: false
      });
    }

    // 4. Wound & Smart-Bandage Sensor
    let woundScore = 94;
    if (physio.woundInfectionWarning || physio.woundExudatePh > 7.7) {
      woundScore -= 42;
      newAlerts.push({
        id: `ALT-WOUND-${Date.now()}`,
        code: 'WOUND_INFECTION_DETECTED',
        category: 'Wound Care',
        title: 'Smart Bandage: Microenvironment Infection Alert',
        severity: 'critical',
        source: 'Forearm Biosensor Bandage',
        value: `pH ${physio.woundExudatePh.toFixed(2)} | Temp ${physio.woundBandageTemp.toFixed(1)}°C`,
        normalRange: 'pH 6.8 - 7.3 | Temp 34-35.5°C',
        message: 'Alkaline exudate shift and localized hyperthermia characteristic of gram-negative bacterial colonization in microgravity.',
        recommendation: 'Perform sterile bandage change, photograph wound with multispectral camera, initiate topical antiseptic protocol.',
        timestamp,
        acknowledged: false,
        resolved: false
      });
    }

    // 5. Radiation / Solar Flare Alert
    let radiationScore = 95;
    if (hazards.speAlert || hazards.doseRate > 500) {
      radiationScore -= 60;
      newAlerts.push({
        id: `ALT-RAD-${Date.now()}`,
        code: 'RAD_SPE_EVENT_CRITICAL',
        category: 'Space Radiation',
        title: 'SOLAR PARTICLE EVENT (SPE) EMERGENCY ALARM',
        severity: 'critical',
        source: 'Suit Dosimeter & Hull Radiation Monitors',
        value: `${hazards.doseRate.toFixed(1)} µSv/h`,
        normalRange: '35 - 55 µSv/h (GCR ambient)',
        message: 'Solar energetic proton flux exceeding protective thresholds. Acute radiation dose danger.',
        recommendation: 'ALL CREW IMMEDIATELY RETREAT TO SHIELDED STORM SHELTER. Deploy polyethylene water wall barriers.',
        timestamp,
        acknowledged: false,
        resolved: false
      });
    }

    // 6. Thermal Core Checks
    let thermalScore = 95;
    if (physio.coreTemp > 38.0) {
      thermalScore -= 30;
      newAlerts.push({
        id: `ALT-TEMP-${Date.now()}`,
        code: 'THERMAL_SPACE_FEVER',
        category: 'Thermoregulation',
        title: 'Elevated Core Body Temperature (Space Fever)',
        severity: 'warning',
        source: 'Core Body Thermal Sensor',
        value: `${physio.coreTemp.toFixed(2)}°C`,
        normalRange: '36.8 - 37.3°C',
        message: 'Impaired convective heat dissipation in microgravity environment elevated core setpoint.',
        recommendation: 'Adjust Liquid Cooling and Ventilation Garment (LCVG) coolant loop flow rate to High.',
        timestamp,
        acknowledged: false,
        resolved: false
      });
    }

    // Deduplicate and append new alerts that aren't already active
    for (const na of newAlerts) {
      const existing = this.alerts.find(a => a.code === na.code && !a.resolved);
      if (!existing) {
        this.alerts.unshift(na);
      }
    }

    // Keep alert list manageable (last 30 alerts)
    if (this.alerts.length > 30) {
      this.alerts = this.alerts.slice(0, 30);
    }

    // Calculate overall Astronaut Health Index (0 - 100)
    const ahi = Math.round(
      0.24 * cardioScore +
      0.16 * thrombosisScore +
      0.14 * neuroSansScore +
      0.14 * woundScore +
      0.14 * radiationScore +
      0.10 * thermalScore +
      0.08 * (100 - hazards.behavioralHealthRisk)
    );

    const safeAhi = Math.max(12, Math.min(99, ahi));

    // Predictive Risk Scores (0 - 100)
    const predictiveRisks = {
      cardiovascularEventRisk: Math.min(98, Math.max(5, Math.round(100 - cardioScore + (physio.arrhythmiaDetected ? 50 : 0)))),
      boneDensityLossTrajectory: Math.min(95, Math.max(10, Math.round(physio.boneRiskScore + physio.boneMineralDensityLossPercent * 18))),
      immuneDysfunctionRisk: Math.min(90, Math.max(12, Math.round(physio.immuneRiskScore + (physio.cortisolLevel > 16 ? 25 : 0)))),
      nutritionDeficiencyRisk: Math.min(85, Math.max(8, Math.round(100 - physio.hydrationLevel + 12))),
      behavioralHealthRisk: Math.min(92, Math.max(10, hazards.behavioralHealthRisk))
    };

    return {
      astronautHealthIndex: safeAhi,
      predictiveRisks,
      activeAlerts: this.alerts.filter(a => !a.resolved),
      allAlerts: this.alerts
    };
  }
}
