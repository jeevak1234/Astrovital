import express from 'express';

export function createScenariosRouter(physioEngine, hazardEngine) {
  const router = express.Router();

  const validScenarios = [
    'solar_flare',
    'arrhythmia',
    'clot_risk',
    'wound_infection',
    'sans_spike',
    'long_isolation',
    'reset'
  ];

  // Trigger scenario
  router.post('/trigger', (req, res) => {
    const { scenario } = req.body;

    if (!validScenarios.includes(scenario)) {
      return res.status(400).json({ error: `Unknown scenario: ${scenario}` });
    }

    if (scenario === 'reset') {
      physioEngine.resetScenario();
      hazardEngine.resetScenario();
      return res.json({ success: true, message: 'Simulation reset to nominal baselines.' });
    }

    physioEngine.injectScenario(scenario);
    hazardEngine.injectScenario(scenario);

    const scenarioMeta = {
      solar_flare: 'Solar Particle Event (SPE) injected: High radiation dose rate & alarm active.',
      arrhythmia: 'Ventricular Arrhythmia injected: Frequent PVCs & heart rate spike.',
      clot_risk: 'Venous Thrombosis risk injected: Femoral blood velocity drop & impedance increase.',
      wound_infection: 'Smart Bandage infection warning: Exudate pH shift to alkaline & thermal spike.',
      sans_spike: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS) spike: Elevated ONSD & cephalad congestion.',
      long_isolation: 'Isolation & Confinement stress injected: Acoustic voice stress & sleep deficit.'
    };

    res.json({
      success: true,
      scenario,
      description: scenarioMeta[scenario] || 'Scenario active.'
    });
  });

  return router;
}
