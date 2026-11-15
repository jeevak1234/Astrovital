# ASTROVITAL: Smart Astronaut Health Monitoring System
### NASA Space Apps Challenge – "Create Health Monitoring Software for Astronauts on Space Missions"

> **CLINICAL DISCLAIMER:** *Simulated data for demonstration only. Not for real medical use.*

---

## 🚀 Mission Overview

**ASTROVITAL** is a mission-control telemetry dashboard and autonomous clinical decision support system designed to monitor an astronaut's physical, physiological, and behavioral health during long-duration space missions (such as an interplanetary transit to Mars or deep-space Lunar Gateway operations).

Since physical spacesuit hardware is simulated, ASTROVITAL features an embedded **Physiological & Environmental Simulation Engine** that streams realistic multi-channel telemetry at 1 Hz, with a high-resolution 10 Hz Lead II ECG oscilloscope stream.

---

## 🌟 Key Features

### 1. Interactive 3D Human Body Model (Three.js / React Three Fiber)
- **Rotatable, zoomable 3D anatomical human figure** positioned in the center of the dashboard.
- **Pulsating 3D heart chamber** that contracts and expands in real time at the astronaut's live heart rate (BPM).
- **Interactive bio-sensor hotspots** with animated pulsing halo rings:
  - **Head / Ocular Sheath**: Optic Nerve Sheath Diameter (ONSD), intracranial pressure, and Spaceflight-Associated Neuro-ocular Syndrome (SANS) detection.
  - **Heart (Left Thorax)**: Lead II ECG patch, heart rate, HRV, and arrhythmia detection.
  - **Forearm (Smart Bandage)**: Wound exudate pH, temperature, and moisture sensor.
  - **Torso**: Sweat lactate patch and skin temperature zone.
  - **Spine & Hips**: Biomechanical mechanical strain gauge and bone mineral density (BMD) loss tracking.
  - **Calves / Lower Limbs**: Ultrasonic Doppler flow and impedance plethysmography for deep vein thrombosis (DVT) risk.
- **Dynamic Status Glow**: Hotspots automatically glow **Green (Normal)**, **Amber (Warning)**, or **Red (Critical)** based on live telemetry thresholds.
- **Click to Inspect**: Clicking any hotspot opens a detailed diagnostic modal featuring a 30-second rolling trend line chart, clinical context, and flight surgeon countermeasure protocols.

### 2. 10 Continuous Health Modules
1. **ECG Lead II**: Real-time waveform canvas, BPM, HRV (RMSSD), and irregular rhythm flag (premature ventricular contractions).
2. **Core Body Temperature**: Tracks internal thermal setpoint elevation ("Space Fever") secondary to impaired convective cooling.
3. **Multi-Zone Skin Temperature**: Liquid Cooling and Ventilation Garment (LCVG) zones (torso, extremities, helmet).
4. **Blood Clot & Deep Vein Thrombosis (DVT) Risk**: Venous flow velocity (cm/s) and limb impedance (Ω) detecting cephalad-shift-induced venous stasis.
5. **Sweat Lactate Biosensor**: Non-invasive enzymatic patch measuring muscle exertion and anaerobic fatigue threshold.
6. **Immune System & Stress**: Salivary/serum cortisol levels, hs-CRP inflammatory index, and mission-day immune dysregulation trajectory.
7. **Intracranial Pressure (SANS) Proxy**: Non-invasive Optic Nerve Sheath Diameter (ONSD mm) detecting microgravity cephalad congestion.
8. **Smart Bandage Wound Biosensor**: Monitors wound microenvironment pH, local temperature, and moisture to flag bacterial infection before visible symptoms emerge.
9. **Bone Loss & Mechanical Loading (BMD)**: Cumulative bone mineral density loss curve contrasted against daily Advanced Resistive Exercise Device (ARED) loading.
10. **Cardiorespiratory Vitals**: Arterial SpO2 (%), respiration rate (br/min), blood pressure (mmHg), and hydration index.

### 3. Spaceflight Hazard Panel (NASA's 5 Hazards)
1. **Space Radiation**: Real-time galactic cosmic ray (GCR) flux and cumulative dose (mSv) tracked against NASA's 600 mSv career limit, with Solar Particle Event (SPE) emergency alarm.
2. **Isolation & Confinement**: Sleep actigraphy score, voice acoustic stress analysis, social interaction score, and behavioral health risk index.
3. **Distance from Earth**: Dynamic mission day counter, distance (km & AU), speed-of-light one-way latency, and autonomous clinical mode indicator when delay exceeds 60 seconds.
4. **Gravity Fields**: Interactive gravity regime baseline selector (**0G Microgravity Transit**, **0.16G Lunar**, **0.38G Mars Surface**, **1.00G Earth**) which dynamically recalculates physiological expectations.
5. **Hostile Closed Environment**: Life support (ECLSS) monitoring for cabin pCO2 (mmHg), pO2 (%), atmospheric pressure (kPa), humidity, and temperature.

### 4. Risk & Alert Engine
- **Astronaut Health Index (AHI: 0 - 100)**: Multi-system weighted clinical readiness score.
- **Predictive Risk Scores**: Cardiovascular events, bone demineralization, immune dysfunction, nutrition deficiency, and behavioral stress.
- **Alert Center**: Categorized by severity (`Critical`, `Warning`), with clinical rationale, recommended countermeasures, and 1-click **Acknowledge** and **Resolve** workflows.
- **Multi-Role Visibility**: Alerts display simultaneously on the Astronaut suit HUD and Flight Surgeon console.

### 5. Challenge Evaluator: Scenario Simulator
Allows evaluators and judges to trigger live spaceflight emergencies:
- **Solar Particle Event (SPE)**: Radiation spike to >2,400 µSv/h; triggers shelter alarm.
- **Ventricular Arrhythmia**: PVC bursts on ECG; rapid 3D heart pulse; red cardio alert.
- **Venous Thrombosis Risk**: Venous flow drops to 4 cm/s; calf hotspot turns red; triggers LBNP protocol.
- **Smart Bandage Infection**: Forearm wound exudate shifts to alkaline pH 8.15; thermal spike.
- **SANS Intracranial Pressure Surge**: ONSD dilates past 6.0 mm; head hotspot turns red.
- **Nominal Reset**: Restores all bio-sensors to nominal baselines.

### 6. Official Flight Surgeon Clinical Report (NASA Form MED-72)
- Certified medical summary with complete vital breakdown, multi-system diagnostic matrix, and digital physician sign-off.
- **Export Telemetry CSV** button for historical analysis.
- **Print Clinical PDF** for physical medical bay documentation.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Three.js / React Three Fiber + `@react-three/drei`
- **Backend**: Node.js, Express, WebSocket (`ws`), Server-Sent Events (SSE)
- **Database & Auth**: Firebase (Firestore & Firebase Auth) + graceful offline development simulation mode
- **UI Design**: Clean, light clinical theme (`#f8fafc` soft background, `#ffffff` cards, medical blue `#0284c7`, teal `#0d9488`, emerald `#10b981`, amber `#f59e0b`, red `#ef4444`)

---

## 📂 Project Structure

```
astrovital/
├── README.md                      # Comprehensive project guide
├── package.json                   # Root package manager (concurrently runner)
├── .env.example                   # Environment keys template
├── run_astrovital.py              # Instant 1-click Python web runner
├── run_astrovital.bat             # Windows double-clickable launcher
├── server/
│   ├── package.json
│   ├── index.js                   # Express + WebSocket + SSE server
│   ├── simulation/
│   │   ├── physiologicalEngine.js # 10 health modules simulation
│   │   ├── hazardEngine.js        # NASA 5 hazards simulation
│   │   └── alertEngine.js         # AHI & predictive risk engine
│   └── routes/
│       ├── telemetry.js           # REST & CSV export
│       ├── alerts.js              # Acknowledge & resolve endpoints
│       ├── scenarios.js           # Emergency injection triggers
│       └── reports.js             # NASA Form MED-72 generator
├── client/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── firebase.js            # Firebase & mock fallback
│       ├── context/
│       │   ├── TelemetryContext.jsx
│       │   └── AuthContext.jsx
│       ├── components/
│       │   ├── Body3D/
│       │   │   ├── HumanBodyCanvas.jsx
│       │   │   ├── BodyModel.jsx
│       │   │   └── SensorHotspot.jsx
│       │   ├── EcgMonitor.jsx     # Oscilloscope canvas
│       │   ├── HealthIndexGauge.jsx
│       │   ├── VitalsStrip.jsx
│       │   └── MetricModal.jsx
│       └── pages/
│           ├── DashboardPage.jsx
│           ├── MetricsPage.jsx
│           ├── HazardsPage.jsx
│           ├── AlertsPage.jsx
│           ├── SimulatorPage.jsx
│           ├── NutritionPage.jsx
│           └── ReportsPage.jsx
└── standalone/
    └── index.html                 # Zero-compile standalone web build
```

---

## ⚡ Quick Start & Execution

### Option A: Instant 1-Click Launch (No Node.js Required)
From the workspace root directory, simply run:
```bash
python run_astrovital.py
```
*Or double-click `run_astrovital.bat` on Windows.*

This will serve the full interactive WebGL 3D application on `http://127.0.0.1:8080` and open your default web browser automatically!

### Option B: Full-Stack React + Node.js Development
If you have Node.js 18+ installed:

1. Install dependencies:
   ```bash
   cd astrovital
   npm run install:all
   ```

2. Configure environment (optional, mock mode works out-of-the-box):
   ```bash
   cp .env.example .env
   ```

3. Launch both backend server and React Vite client concurrently:
   ```bash
   npm run dev
   ```
   - Client: `http://localhost:3000`
   - Server: `http://localhost:5000`

---

## ⚕️ Scientific References & Spaceflight Baselines
- **NASA Human Research Program (HRP)**: *Evidence Report: Risk of Spaceflight-Associated Neuro-ocular Syndrome (SANS)*.
- **NASA HRP**: *Risk of Cardiovascular Disease and other Degenerative Tissue Effects from Radiation*.
- **ESA / NASA**: *Venous thrombosis in a female astronaut during spaceflight* (N Engl J Med 2020).
- **Bio-telemetry standards**: ECLSS cabin air partial pressures, ARED mechanical resistive load prescriptions.
