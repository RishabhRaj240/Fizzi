import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SodaCan from './SodaCan';
import CanvasErrorBoundary from './CanvasErrorBoundary';

/* ─── Shared lights ───────────────────────────────────────────────────── */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} />
      <directionalLight position={[-5, 3, -5]} intensity={0.8} />
      <spotLight position={[0, 10, -8]} intensity={3} angle={0.4} penumbra={0.5} />
      <pointLight position={[0, -5, 3]} intensity={0.6} color="#8888ff" />
    </>
  );
}

/* ─── Can that reads x from a proxy ref each frame ───────────────────── */
function MovingCan({ proxy, flavor }) {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) groupRef.current.position.x = proxy.current.x;
  });
  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        <SodaCan flavor={flavor} scale={0.7} position={[0, 0, 0]} />
      </Suspense>
    </group>
  );
}

/* ─── One panel with its own Canvas ──────────────────────────────────── */
function Panel({ id, bg, textSide, accentColor, title, body, animStartX, animEndX, flavor }) {
  const proxy = useRef({ x: animEndX }); // rest position

  useEffect(() => {
    // Register here — safe for Vite (client-only) but also guards against
    // any environment where window isn't ready yet.
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    proxy.current.x = animStartX; // off-screen start

    const tween = gsap.to(proxy.current, {
      x: animEndX,
      ease: 'none',
      scrollTrigger: {
        trigger: `#${id}`,
        start: 'top bottom',
        end: 'top top',
        scrub: 1.5,
      },
    });

    return () => tween.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLeft = textSide === 'left';

  return (
    <section
      id={id}
      className="relative w-full h-screen flex items-center overflow-hidden"
      style={{
        background: bg,
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
      }}
    >
      {/* 3D Canvas — full section, pointer-events off */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 40 }}
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
            <Lights />
            <MovingCan proxy={proxy} flavor={flavor} />
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* Text card */}
      <div
        className="relative glass-card p-10 rounded-3xl max-w-md mx-10 md:mx-32"
        style={{
          zIndex: 20,
          textAlign: isLeft ? 'left' : 'right',
        }}
      >
        <h2
          className="text-4xl md:text-6xl font-display font-black mb-4"
          style={{ color: accentColor }}
        >
          {title}
        </h2>
        <p className="text-xl font-body text-white/80">{body}</p>
      </div>
    </section>
  );
}

/* ─── BenefitsSection ─────────────────────────────────────────────────── */
export default function BenefitsSection() {
  return (
    <div className="w-full relative z-10">

      {/* Panel 1 — text LEFT, can enters from right, rests RIGHT (+2.5) */}
      <Panel
        id="bp-1"
        bg="black"
        textSide="left"
        accentColor="#ffffff"
        title="Gut-Friendly Goodness"
        body="9g of prebiotic fiber in every can to keep your microbiome dancing."
        animStartX={9}
        animEndX={2.5}
        flavor="lime"
      />

      {/* Panel 2 — text RIGHT, can enters from right (+9→-2.5) = RIGHT → LEFT */}
      <Panel
        id="bp-2"
        bg="#1a0033"
        textSide="right"
        accentColor="#00C9A7"
        title={<>Light Calories,<br />Big Flavor</>}
        body="Under 40 calories per serving. Sweetened by nature, not chemistry."
        animStartX={9}
        animEndX={-2.5}
        flavor="watermelon"
      />

      {/* Panel 3 — text LEFT, can enters from left (-9→+2.5) = LEFT → RIGHT */}
      <Panel
        id="bp-3"
        bg="#0d2a45"
        textSide="left"
        accentColor="#FF6B00"
        title="Naturally Refreshing"
        body="Pure botanical extracts and real fruit essences. No fake aftertaste."
        flavor="orange"
        animStartX={-9}
        animEndX={2.5}
      />

    </div>
  );
}
