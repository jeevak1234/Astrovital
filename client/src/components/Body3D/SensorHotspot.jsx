import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export function SensorHotspot({ position, label, value, status, onClick }) {
  const meshRef = useRef();
  const ringRef = useRef();

  // Status colors: green, amber, red
  const colorMap = {
    normal: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    critical: '#ef4444' // red-500
  };

  const activeColor = colorMap[status] || colorMap.normal;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      const scale = 1 + (Math.sin(t * 3) + 1) * 0.25;
      ringRef.current.scale.set(scale, scale, scale);
      ringRef.current.material.opacity = 0.8 - (scale - 1) * 1.2;
    }
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
    }
  });

  return (
    <group position={position}>
      {/* Outer pulsing beacon ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial color={activeColor} transparent opacity={0.6} depthTest={false} />
      </mesh>

      {/* Core glowing hotspot sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="cursor-pointer"
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Interactive 2D label tag */}
      <Html
        position={[0, 0.08, 0]}
        center
        distanceFactor={6}
        className="pointer-events-auto select-none"
      >
        <button
          onClick={onClick}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap shadow-sm border transition-all duration-200 hover:scale-105 ${
            status === 'critical'
              ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-400/30'
              : status === 'warning'
              ? 'bg-amber-50 text-amber-700 border-amber-300'
              : 'bg-white/95 text-slate-700 border-slate-200 hover:border-emerald-400'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status === 'critical'
                ? 'bg-red-500 animate-ping'
                : status === 'warning'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />
          <span>{label}</span>
          <span className="text-slate-400 font-mono text-[9px]">{value}</span>
        </button>
      </Html>
    </group>
  );
}
