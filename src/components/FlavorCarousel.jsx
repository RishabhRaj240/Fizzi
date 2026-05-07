import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SodaCan from './SodaCan';

const flavors = [
  { name: 'Black Cherry', key: 'blackcherry', bg: '#3D0066', accent: '#FF2D78' },
  { name: 'Lime',         key: 'lime',        bg: '#1a4a00', accent: '#A8FF3E' },
  { name: 'Watermelon',   key: 'watermelon',  bg: '#4a0020', accent: '#FF4FA3' },
  { name: 'Orange',       key: 'orange',      bg: '#4a2000', accent: '#FF6B00' },
  { name: 'Blueberry',    key: 'blueberry',   bg: '#00104a', accent: '#4D8EFF' },
];

export default function FlavorCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const canRef = useRef();
  const isAnimating = useRef(false);
  const current = flavors[activeIndex];

  /**
   * dir = +1 → next (right arrow): can exits LEFT, enters from RIGHT
   * dir = -1 → prev (left arrow):  can exits RIGHT, enters from LEFT
   */
  const navigate = (dir) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const exitX  = dir * -9;   // exit direction (opposite of arrow)
    const enterX = dir *  9;   // entry side (opposite of exit)
    const newIndex = (activeIndex + dir + flavors.length) % flavors.length;

    if (canRef.current) {
      // Slide current can off screen
      gsap.to(canRef.current.position, {
        x: exitX,
        duration: 0.38,
        ease: 'power2.in',
        onComplete: () => {
          // Swap flavor instantly while off-screen, snap to entry side
          setActiveIndex(newIndex);
          canRef.current.position.x = enterX;

          // Slide new can in
          gsap.to(canRef.current.position, {
            x: 0,
            duration: 0.45,
            ease: 'power2.out',
            onComplete: () => {
              isAnimating.current = false;
            },
          });
        },
      });
    } else {
      setActiveIndex(newIndex);
      isAnimating.current = false;
    }
  };

  return (
    <section
      id="carousel"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: current.bg,
        transition: 'background 0.7s ease',
      }}
    >
      {/* ── 3D Canvas ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 40 }}
          style={{
            background: 'transparent',
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
          }}
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          shadows
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.8} />
          <spotLight position={[0, 10, -8]} intensity={3} angle={0.4} penumbra={0.5} color="#ffffff" />
          <pointLight position={[0, -5, 3]} intensity={0.6} color="#8888ff" />
          <Environment preset="studio" environmentIntensity={1.5} />

          <Suspense fallback={null}>
            <SodaCan
              ref={canRef}
              flavor={current.key}
              scale={0.7}
              position={[0, 0, 0]}
              instantSwap
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Flavor heading ── */}
      <div className="absolute top-20 text-center z-20 pointer-events-none">
        <p
          className="text-xs uppercase tracking-[0.35em] font-body font-bold mb-3"
          style={{ color: `${current.accent}99` }}
        >
          Choose Your Flavor
        </p>
        <h3
          key={current.key}
          className="text-6xl md:text-8xl font-display font-black italic"
          style={{
            color: current.accent,
            animation: 'flavorPop 0.4s ease-out both',
          }}
        >
          {current.name}
        </h3>
      </div>

      {/* ── LEFT arrow ── */}
      <button
        id="carousel-prev"
        aria-label="Previous flavor"
        onClick={() => navigate(-1)}
        className="absolute left-6 md:left-10 z-20 group"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <span
          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderColor: `${current.accent}55`,
            backdropFilter: 'blur(8px)',
            boxShadow: `0 0 20px ${current.accent}22`,
          }}
        >
          <ChevronLeft
            size={26}
            style={{ color: current.accent }}
            className="group-hover:scale-110 transition-transform"
          />
        </span>
      </button>

      {/* ── RIGHT arrow ── */}
      <button
        id="carousel-next"
        aria-label="Next flavor"
        onClick={() => navigate(1)}
        className="absolute right-6 md:right-10 z-20 group"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <span
          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderColor: `${current.accent}55`,
            backdropFilter: 'blur(8px)',
            boxShadow: `0 0 20px ${current.accent}22`,
          }}
        >
          <ChevronRight
            size={26}
            style={{ color: current.accent }}
            className="group-hover:scale-110 transition-transform"
          />
        </span>
      </button>

      {/* ── Flavor selector dots ── */}
      <div className="absolute bottom-32 z-20 flex gap-4 items-center">
        {flavors.map((f, i) => (
          <button
            key={f.key}
            onClick={() => {
              if (i === activeIndex || isAnimating.current) return;
              navigate(i > activeIndex ? 1 : -1);
            }}
            aria-label={f.name}
            className="transition-all duration-300 rounded-full border-2"
            style={{
              width:  i === activeIndex ? 40 : 14,
              height: 14,
              background:   i === activeIndex ? f.accent : 'rgba(255,255,255,0.3)',
              borderColor:  i === activeIndex ? f.accent : 'transparent',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* ── Tagline ── */}
      <div className="absolute bottom-20 z-20 pointer-events-none">
        <p className="font-body text-white/70 text-base text-center tracking-wide">
          3–5g sugar · 9g fiber · 5 delicious flavors
        </p>
      </div>

      <style>{`
        @keyframes flavorPop {
          0%   { transform: scale(0.85) translateY(14px); opacity: 0; }
          100% { transform: scale(1)    translateY(0);    opacity: 1; }
        }
      `}</style>
    </section>
  );
}
