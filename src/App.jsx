import React, { useEffect } from 'react';

import HeroSection from './components/HeroSection';
import FlavorCarousel from './components/FlavorCarousel';
import BenefitsSection from './components/BenefitsSection';
import AlternatingFeatures from './components/AlternatingFeatures';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    // Lazy-initialize Lenis so it never touches window at module scope.
    // @studio-freight/lenis accesses window on import — dynamic import
    // keeps it safe even in environments where window isn't immediately ready.
    let lenis;
    let rafId;

    const initLenis = async () => {
      try {
        // Support both the legacy @studio-freight/lenis and the modern lenis package
        const LenisModule = await import('@studio-freight/lenis');
        const Lenis = LenisModule.default ?? LenisModule.Lenis;

        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothTouch: false,
          touchMultiplier: 2,
        });

        function raf(time) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
      } catch (err) {
        // Lenis failing should never crash the app
        console.warn('[Lenis] Failed to initialize smooth scroll:', err);
      }
    };

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full bg-background text-white selection:bg-primary selection:text-white">
      {/*
       * Each section (HeroSection, FlavorCarousel) owns its own Canvas.
       * There is NO global fixed Canvas here — that was causing the grey panel.
       */}
      <main className="relative w-full overflow-hidden">
        <HeroSection />
        <FlavorCarousel />
        <BenefitsSection />
        <AlternatingFeatures />
        <Footer />
      </main>
    </div>
  );
}
