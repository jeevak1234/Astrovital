import express from 'express';

export function createAlertsRouter(alertEngine) {
  const router = express.Router();

  // Get active and historical alerts
  router.get('/', (req, res) => {
    res.json({
      alerts: alertEngine.alerts,
      activeCount: alertEngine.alerts.filter(a => !a.resolved).length
    });
  });

  // Acknowledge alert
  router.post('/:id/acknowledge', (req, res) => {
    const { id } = req.params;
    const alert = alertEngine.acknowledgeAlert(id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json({ success: true, alert });
  });

  // Resolve alert
  router.post('/:id/resolve', (req, res) => {
    const { id } = req.params;
    const alert = alertEngine.resolveAlert(id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json({ success: true, alert });
  });

  return router;
}
