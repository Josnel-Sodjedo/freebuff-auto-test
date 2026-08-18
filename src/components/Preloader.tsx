import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/anim';
import './preloader.css';

/**
 * Transition d'entrée : fond papier, KAYO®, compteur 00 → 100,
 * puis rideau qui se lève pour révéler le site.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone();
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: onDone });

      tl.to(
        counter,
        {
          v: 100,
          duration: 1.25,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (numRef.current) {
              numRef.current.textContent = String(Math.round(counter.v)).padStart(2, '0');
            }
          },
        },
        0
      )
        .fromTo(
          '.pre__kayo',
          { yPercent: 120 },
          { yPercent: 0, duration: 0.9, ease: 'power4.out' },
          0.08
        )
        .fromTo('.pre__meta', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.35)
        .to('.pre__bar', { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0)
        .to('.pre__kayo', { yPercent: -120, duration: 0.65, ease: 'power4.in' }, 1.4)
        .to('.pre__meta', { opacity: 0, duration: 0.3 }, 1.4)
        .to(rootRef.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, 1.55);
    }, rootRef);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div className="pre" ref={rootRef} aria-hidden="true">
      <div className="pre__inner">
        <span className="pre__mask">
          <span className="pre__kayo display">KAYO®</span>
        </span>
        <div className="pre__meta">
          <span className="pre__meta-left">Portfolio — Sélection 2026</span>
          <span className="pre__num">
            <span ref={numRef}>00</span> %
          </span>
        </div>
        <span className="pre__bar" />
      </div>
    </div>
  );
}
