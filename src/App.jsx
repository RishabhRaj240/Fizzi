import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

import HeroSection from './components/HeroSection';
import FlavorCarousel from './components/FlavorCarousel';
import BenefitsSection from './components/BenefitsSection';
import AlternatingFeatures from './components/AlternatingFeatures';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    // Smooth scrolling via Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
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
