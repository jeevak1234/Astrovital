import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SensorHotspot } from './SensorHotspot';
import { useTelemetry } from '../../context/TelemetryContext';

export function BodyModel() {
  const { telemetry, setSelectedMetric } = useTelemetry();
  const { physio } = telemetry;
  const heartMeshRef = useRef();

  // Heartbeat pulse frequency based on live BPM
  const heartRate = physio.heartRate || 72;
  const beatsPerSecond = heartRate / 60;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (heartMeshRef.current) {
      // Systolic / diastolic contraction rhythm
      const pulse = 1 + 0.18 * Math.pow(Math.sin(t * beatsPerSecond * Math.PI), 8);
      heartMeshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Calculate hotspot statuses
  const heartStatus = physio.arrhythmiaDetected ? 'critical' : (physio.heartRate > 100 ? 'warning' : 'normal');
  const sansStatus = physio.opticNerveSheathDiameter > 5.8 ? 'critical' : (physio.opticNerveSheathDiameter > 5.3 ? 'warning' : 'normal');
  const clotStatus = physio.thrombosisStatus;
  const woundStatus = physio.woundInfectionWarning ? 'critical' : 'normal';
  const boneStatus = physio.boneMineralDensityLossPercent > 2.0 ? 'warning' : 'normal';
  const thermalStatus = physio.coreTempStatus;
  const lactateStatus = physio.sweatLactate > 7.0 ? 'warning' : 'normal';

  // Light-theme anatomical body material
  const bodyMaterial = (
    <meshStandardMaterial
      color="#cbd5e1"
      roughness={0.4}
      metalness={0.1}
      transparent
      opacity={0.88}
    />
  );

  const wireframeMaterial = (
    <meshBasicMaterial
      color="#94a3b8"
      wireframe
      transparent
      opacity={0.25}
    />
  );

  return (
    <group position={[0, -0.2, 0]}>
      {/* --- HEAD & CRANIUM --- */}
      <group position={[0, 1.85, 0]}>
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          {bodyMaterial}
        </mesh>
        <mesh>
          <sphereGeometry args={[0.225, 16, 16]} />
          {wireframeMaterial}
        </mesh>
      </group>

      {/* --- NECK --- */}
      <mesh position={[0, 1.58, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.15, 16]} />
        {bodyMaterial}
      </mesh>

      {/* --- THORAX & CHEST --- */}
      <group position={[0, 1.25, 0]}>
        <mesh>
          <cylinderGeometry args={[0.30, 0.25, 0.5, 32]} />
          {bodyMaterial}
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.305, 0.255, 0.5, 16]} />
          {wireframeMaterial}
        </mesh>

        {/* Pulsating Anatomical Heart Chamber */}
        <mesh ref={heartMeshRef} position={[-0.08, 0.05, 0.18]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color={heartStatus === 'critical' ? '#ef4444' : '#f43f5e'}
            emissive={heartStatus === 'critical' ? '#dc2626' : '#e11d48'}
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* --- ABDOMEN & SPINE --- */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.24, 0.26, 0.35, 32]} />
        {bodyMaterial}
      </mesh>

      {/* --- PELVIS & HIPS --- */}
      <group position={[0, 0.52, 0]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.22, 0.32, 32]} />
          {bodyMaterial}
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.265, 0.225, 0.32, 16]} />
          {wireframeMaterial}
        </mesh>
      </group>

      {/* --- LEFT ARM & FOREARM (WOUND SITE) --- */}
      <group position={[-0.42, 1.4, 0]}>
        {/* Shoulder */}
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          {bodyMaterial}
        </mesh>
        {/* Upper Arm */}
        <mesh position={[-0.15, -0.25, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.065, 0.055, 0.45, 16]} />
          {bodyMaterial}
        </mesh>
        {/* Forearm with Smart Bandage */}
        <mesh position={[-0.32, -0.65, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.055, 0.045, 0.45, 16]} />
          {bodyMaterial}
        </mesh>
        {/* Bandage Patch visual collar */}
        <mesh position={[-0.32, -0.65, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.058, 0.058, 0.12, 16]} />
          <meshStandardMaterial
            color={woundStatus === 'critical' ? '#ef4444' : '#0284c7'}
            roughness={0.2}
          />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.4, -0.95, 0]}>
          <boxGeometry args={[0.05, 0.1, 0.08]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* --- RIGHT ARM & FOREARM --- */}
      <group position={[0.42, 1.4, 0]}>
        {/* Shoulder */}
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          {bodyMaterial}
        </mesh>
        {/* Upper Arm */}
        <mesh position={[0.15, -0.25, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.065, 0.055, 0.45, 16]} />
          {bodyMaterial}
        </mesh>
        {/* Forearm */}
        <mesh position={[0.32, -0.65, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.055, 0.045, 0.45, 16]} />
          {bodyMaterial}
        </mesh>
        {/* Hand */}
        <mesh position={[0.4, -0.95, 0]}>
          <boxGeometry args={[0.05, 0.1, 0.08]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* --- LEFT LEG (FEMORAL / CALF CLOT RISK SENSOR) --- */}
      <group position={[-0.16, 0.32, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.11, 0.08, 0.6, 24]} />
          {bodyMaterial}
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.72, 0]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          {bodyMaterial}
        </mesh>
        {/* Calf / Shin */}
        <mesh position={[0, -1.08, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.6, 24]} />
          {bodyMaterial}
        </mesh>
        {/* Foot */}
        <mesh position={[0, -1.42, 0.08]}>
          <boxGeometry args={[0.1, 0.08, 0.22]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* --- RIGHT LEG --- */}
      <group position={[0.16, 0.32, 0]}>
        {/* Thigh */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.11, 0.08, 0.6, 24]} />
          {bodyMaterial}
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.72, 0]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          {bodyMaterial}
        </mesh>
        {/* Calf / Shin */}
        <mesh position={[0, -1.08, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.6, 24]} />
          {bodyMaterial}
        </mesh>
        {/* Foot */}
        <mesh position={[0, -1.42, 0.08]}>
          <boxGeometry args={[0.1, 0.08, 0.22]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* SENSOR HOTSPOTS (Glow Green/Amber/Red based on live telemetry) */}
      {/* ============================================================ */}

      {/* 1. Head / Optic Nerve / SANS */}
      <SensorHotspot
        position={[0, 1.88, 0.24]}
        label="ICP / SANS"
        value={`${physio.opticNerveSheathDiameter.toFixed(1)} mm`}
        status={sansStatus}
        onClick={() => setSelectedMetric('sans')}
      />

      {/* 2. Heart (ECG, Rate, Arrhythmia) */}
      <SensorHotspot
        position={[-0.1, 1.25, 0.32]}
        label="ECG Lead II"
        value={`${Math.round(physio.heartRate)} BPM`}
        status={heartStatus}
        onClick={() => setSelectedMetric('ecg')}
      />

      {/* 3. Wound Site (Forearm Smart-Bandage) */}
      <SensorHotspot
        position={[-0.72, 0.75, 0.12]}
        label="Smart Bandage"
        value={`pH ${physio.woundExudatePh.toFixed(1)}`}
        status={woundStatus}
        onClick={() => setSelectedMetric('wound')}
      />

      {/* 4. Torso Skin & Sweat Lactate */}
      <SensorHotspot
        position={[0.14, 1.15, 0.28]}
        label="Sweat Lactate"
        value={`${physio.sweatLactate.toFixed(1)} mM`}
        status={lactateStatus}
        onClick={() => setSelectedMetric('lactate')}
      />

      {/* 5. Hip / Pelvis & Spine (Bone Mineral Density) */}
      <SensorHotspot
        position={[0.24, 0.45, 0.22]}
        label="Hip BMD Load"
        value={`-${physio.boneMineralDensityLossPercent}%`}
        status={boneStatus}
        onClick={() => setSelectedMetric('bone')}
      />

      {/* 6. Lower Limb Calves (Venous Flow / DVT Clot Risk) */}
      <SensorHotspot
        position={[-0.16, -0.75, 0.16]}
        label="Venous Flow / DVT"
        value={`${physio.venousFlowVelocity.toFixed(1)} cm/s`}
        status={clotStatus}
        onClick={() => setSelectedMetric('thrombosis')}
      />

      {/* 7. Core Body Temperature */}
      <SensorHotspot
        position={[0, 0.9, 0.26]}
        label="Core Temp"
        value={`${physio.coreTemp.toFixed(1)}°C`}
        status={thermalStatus}
        onClick={() => setSelectedMetric('temperature')}
      />
    </group>
  );
}
