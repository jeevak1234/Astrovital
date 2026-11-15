import express from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { PhysiologicalEngine } from './simulation/physiologicalEngine.js';
import { HazardEngine } from './simulation/hazardEngine.js';
import { AlertEngine } from './simulation/alertEngine.js';
import { createTelemetryRouter } from './routes/telemetry.js';
import { createAlertsRouter } from './routes/alerts.js';
import { createScenariosRouter } from './routes/scenarios.js';
import { createReportsRouter } from './routes/reports.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simulation Engines
const physioEngine = new PhysiologicalEngine();
const hazardEngine = new HazardEngine();
const alertEngine = new AlertEngine();

// Rolling history buffer (120 points for smooth charts)
const historyBuffer = [];
const MAX_HISTORY = 120;

// Initialize buffer with realistic starting points
for (let i = 0; i < 40; i++) {
  const p = physioEngine.update();
  const h = hazardEngine.update();
  const evalRes = alertEngine.evaluate(p, h);
  historyBuffer.push({
    timestamp: new Date(Date.now() - (40 - i) * 1000).toISOString(),
    ...p,
    ...h,
    healthIndex: evalRes.astronautHealthIndex
  });
}

// Routes
app.use('/api/telemetry', createTelemetryRouter(physioEngine, hazardEngine, alertEngine, historyBuffer));
app.use('/api/alerts', createAlertsRouter(alertEngine));
app.use('/api/scenarios', createScenariosRouter(physioEngine, hazardEngine));
app.use('/api/reports', createReportsRouter(physioEngine, hazardEngine, alertEngine, historyBuffer));

// Root health check
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ASTROVITAL Telemetry Engine',
    mission: 'ARES-IV Mars Expedition',
    timestamp: new Date().toISOString()
  });
});

// Server-Sent Events (SSE) streaming endpoint
const sseClients = new Set();
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  // Send immediate state on connection
  const physio = physioEngine.state;
  const hazards = hazardEngine.state;
  const evalRes = alertEngine.evaluate(physio, hazards);

  ws.send(JSON.stringify({
    type: 'INIT',
    timestamp: new Date().toISOString(),
    physio,
    hazards,
    healthIndex: evalRes.astronautHealthIndex,
    predictiveRisks: evalRes.predictiveRisks,
    activeAlerts: evalRes.activeAlerts
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'SCENARIO_TRIGGER') {
        physioEngine.injectScenario(data.scenario);
        hazardEngine.injectScenario(data.scenario);
      } else if (data.type === 'ACKNOWLEDGE_ALERT') {
        alertEngine.acknowledgeAlert(data.alertId);
      } else if (data.type === 'GRAVITY_MODE') {
        physioEngine.setGravityMode(data.mode);
        hazardEngine.setGravityMode(data.mode);
      }
    } catch (e) {
      console.error('WS parse error:', e);
    }
  });
});

// High-speed broadcast loop (1 Hz full telemetry tick + 10 Hz ECG point)
setInterval(() => {
  const physio = physioEngine.update();
  const hazards = hazardEngine.update();
  const evalRes = alertEngine.evaluate(physio, hazards);
  const ecgPoint = physioEngine.getNextEcgPoint();

  const packet = {
    timestamp: new Date().toISOString(),
    physio,
    hazards,
    ecgPoint,
    healthIndex: evalRes.astronautHealthIndex,
    predictiveRisks: evalRes.predictiveRisks,
    activeAlerts: evalRes.activeAlerts
  };

  // Push to history buffer
  historyBuffer.push({
    timestamp: packet.timestamp,
    ...physio,
    ...hazards,
    healthIndex: evalRes.astronautHealthIndex
  });

  if (historyBuffer.length > MAX_HISTORY) {
    historyBuffer.shift();
  }

  // Broadcast via WebSocket
  const serialized = JSON.stringify({ type: 'TELEMETRY_UPDATE', ...packet });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(serialized);
    }
  });

  // Broadcast via SSE
  const sseData = `data: ${serialized}\n\n`;
  sseClients.forEach((client) => {
    client.write(sseData);
  });
}, 1000);

// Sub-second ECG wave tick (10 Hz for smooth real-time waveform display)
setInterval(() => {
  const ecgPoint = physioEngine.getNextEcgPoint();
  const miniPacket = JSON.stringify({
    type: 'ECG_TICK',
    ecgPoint,
    heartRate: physioEngine.state.heartRate,
    arrhythmiaDetected: physioEngine.state.arrhythmiaDetected,
    timestamp: Date.now()
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(miniPacket);
    }
  });
}, 100);

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 ASTROVITAL Smart Astronaut Health Monitoring System Backend`);
  console.log(`🛰️  Mission Control Server listening on http://localhost:${PORT}`);
  console.log(`📡 WebSocket stream available at ws://localhost:${PORT}`);
  console.log(`📊 SSE Live stream available at http://localhost:${PORT}/api/stream`);
  console.log(`⚕️  Simulated data for demonstration only. Not for real medical use.`);
  console.log(`================================================================`);
});

export default app;
export { app, server };
