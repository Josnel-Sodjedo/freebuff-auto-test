import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { prefersReducedMotion } from '../lib/anim';
import { setLenis } from '../lib/lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll (Lenis) synchronisé avec GSAP ScrollTrigger.
 * Désactivé pour `prefers-reduced-motion`.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);
}

/** Rafraîchit ScrollTrigger une fois les polices chargées (positions des pins). */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 1200);
    return () => window.clearTimeout(t);
  }, []);
}
