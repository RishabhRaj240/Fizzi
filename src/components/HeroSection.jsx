import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import SodaCan from './SodaCan';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#1e0936' }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 40 }}
          style={{
            background: 'transparent',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          shadows
        >
          {/* Key light */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow />
          {/* Fill light */}
          <directionalLight position={[-5, 3, -5]} intensity={0.8} />
          {/* Rim light */}
          <spotLight
            position={[0, 10, -8]}
            intensity={3}
            angle={0.4}
            penumbra={0.5}
            color="#ffffff"
          />
          {/* Bottom bounce */}
          <pointLight position={[0, -5, 3]} intensity={0.6} color="#8888ff" />
          <Environment preset="studio" environmentIntensity={1.5} />

          <Suspense fallback={null}>
            <SodaCan flavor="blackcherry" scale={0.7} position={[0, 0, 0]} />
          </Suspense>
        </Canvas>
      </div>

      {/* Brand name — top left */}
      <div className="absolute top-10 left-10 z-20">
        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter">
          LiveGutsy
        </h1>
      </div>

      {/* Hero copy */}
      <div className="relative z-20 text-center pointer-events-none mt-[30vh]">
        <h2 className="text-6xl md:text-9xl font-display font-black text-white/90 italic tracking-tighter mix-blend-overlay">
          Soda Perfected
        </h2>
        <p className="mt-4 text-xl md:text-2xl font-body text-white/80">
          Soda for Gutsy People
        </p>
      </div>

      {/* CTA */}
      <div className="absolute bottom-20 z-20 pointer-events-auto">
        <button className="px-8 py-4 bg-primary text-white font-bold font-body rounded-full hover:shadow-[0_0_20px_rgba(0,64,224,0.8)] transition-shadow uppercase tracking-widest text-sm">
          Shop Now
        </button>
      </div>
    </section>
  );
}
