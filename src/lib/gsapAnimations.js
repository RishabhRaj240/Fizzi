import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGsapAnimations = (canRef, sceneRef, setFlavor) => {
  useEffect(() => {
    if (!canRef.current || !sceneRef.current) return;

    // Reset rotation and position
    canRef.current.position.set(0, 0, 0);
    canRef.current.rotation.set(0, 0, 0);

    const tl = gsap.timeline();

    // -- HERO SECTION TO CAROUSEL (0 to 1 progress)
    tl.to(canRef.current.position, {
      y: 0,
      z: 2,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });

    // -- FLAVOR CAROUSEL SECTION -- 
    // We pin the carousel section and scrub through flavors
    ScrollTrigger.create({
      trigger: '#carousel',
      start: 'top top',
      end: '+=4000', // Scroll for 4000px to go through 5 flavors
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        // 5 flavors = 5 slices of progress
        if (progress < 0.2) setFlavor('blackcherry');
        else if (progress < 0.4) setFlavor('lime');
        else if (progress < 0.6) setFlavor('orange');
        else if (progress < 0.8) setFlavor('blueberry');
        else setFlavor('watermelon');
        
        // Spin the can multiple times over the scroll
        canRef.current.rotation.y = progress * Math.PI * 10;
      }
    });

    // -- BENEFITS SECTION --
    // Panel 1: Tilts left
    gsap.to(canRef.current.rotation, {
      z: 0.2,
      x: 0.1,
      scrollTrigger: {
        trigger: '#panel-1',
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      }
    });
    
    // Panel 2: Straighten and scale slightly
    gsap.to(canRef.current.scale, {
      x: 1.1, y: 1.1, z: 1.1,
      scrollTrigger: {
        trigger: '#panel-2',
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      }
    });

    // Panel 3: Reset scale, tilt right
    gsap.to(canRef.current.rotation, {
      z: -0.2,
      scrollTrigger: {
        trigger: '#panel-3',
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      }
    });

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [canRef, sceneRef, setFlavor]);
};
