import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { BodyModel } from './BodyModel';
import { RotateCw, ZoomIn, Info } from 'lucide-react';

export function HumanBodyCanvas() {
  const controlsRef = useRef();

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[520px] bg-gradient-to-b from-slate-50/80 via-white to-slate-100/90 rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="w-full h-full cursor-grab active:cursor-grabbing">
        <PerspectiveCamera makeDefault position={[0, 0.4, 3.8]} fov={45} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={6.0}
          maxPolarAngle={Math.PI / 2 + 0.3}
          minPolarAngle={Math.PI / 6}
        />

        {/* Studio Medical Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, 4, -5]} intensity={0.5} color="#e0f2fe" />
        <pointLight position={[0, 2, 2]} intensity={0.4} />

        {/* 3D Body and Hotspots */}
        <BodyModel />

        {/* Subtle holographic stage pedestal */}
        <mesh position={[0, -1.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 32]} />
          <meshBasicMaterial color="#e2e8f0" transparent opacity={0.6} />
        </mesh>
        <gridHelper args={[4, 16, '#94a3b8', '#e2e8f0']} position={[0, -1.75, 0]} />
      </Canvas>

      {/* Control Overlay Buttons */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive Bio-Suit Telemetry Mesh</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={handleResetView}
          title="Reset Camera View"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-sky-600 hover:border-sky-300 shadow-sm transition"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Reset View</span>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 text-[11px] text-slate-500 bg-white/80 backdrop-blur px-2.5 py-1 rounded-md border border-slate-200/60 pointer-events-none flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-sky-500" />
        <span>Click any pulsing sensor beacon to open real-time diagnostic panel</span>
      </div>
    </div>
  );
}
