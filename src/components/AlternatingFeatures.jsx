import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import SodaCan from './SodaCan';
import CanvasErrorBoundary from './CanvasErrorBoundary';

/* Small inline canvas that fits inside the h-64 card slot */
function CanCard({ flavor }) {
  return (
    <div className="w-full md:w-1/2 h-64 rounded-3xl relative overflow-hidden border border-white/10">
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 38 }}
          gl={{
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          dpr={[1, 2]}
          frameloop="always"
          shadows={false}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={2.5} />
          <directionalLight position={[-5, 3, -5]} intensity={0.8} />
          <spotLight position={[0, 10, -8]} intensity={3} angle={0.4} penumbra={0.5} />
          <pointLight position={[0, -5, 3]} intensity={0.6} color="#8888ff" />
          <Suspense fallback={null}>
            <SodaCan flavor={flavor} scale={0.45} position={[0, 0, 0]} />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

export default function AlternatingFeatures() {
  return (
    <section className="py-32 bg-black text-white relative z-10">
      <div className="max-w-6xl mx-auto px-10 flex flex-col gap-32">

        {/* Row 1 — text left, Watermelon can right */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <h3 className="text-3xl font-display font-bold mb-4 text-[#FF2D78]">Real Fruit Extracts</h3>
            <p className="text-lg font-body text-white/70">
              We extract our flavors directly from real, organic fruits.
              No artificial syrups or laboratory concoctions. Just nature's best.
            </p>
          </div>
          <CanCard flavor="watermelon" />
        </div>

        {/* Row 2 — Lime can left, text right */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          <div className="w-full md:w-1/2">
            <h3 className="text-3xl font-display font-bold mb-4 text-[#00C9A7]">Zero Sugar Crash</h3>
            <p className="text-lg font-body text-white/70">
              With only 3–5g of sugar from natural sources, you get the sweet pop you want
              without the afternoon slump. It's sustained energy.
            </p>
          </div>
          <CanCard flavor="lime" />
        </div>

        {/* Row 3 — text left, Orange can right */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <h3 className="text-3xl font-display font-bold mb-4 text-[#FF6B00]">Unapologetically Bold</h3>
            <p className="text-lg font-body text-white/70">
              Our jewel-tone gradients aren't just for show. They represent the intense,
              unapologetic flavor profile inside every single can of Fizzi.
            </p>
          </div>
          <CanCard flavor="orange" />
        </div>

      </div>
    </section>
  );
}
