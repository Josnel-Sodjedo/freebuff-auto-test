import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { isFinePointer, prefersReducedMotion } from '../lib/anim';

type CursorState = 'default' | 'view' | 'explore' | 'link' | 'hidden';

/**
 * Curseur personnalisé minimaliste :
 *  - point précis + anneau qui suit avec inertie
 *  - « VOIR → » / « EXPLORER » sur les projets et images
 *  - attraction magnétique sur les liens
 * Désactivé sur écran tactile et pour `prefers-reduced-motion`.
 */
export default function Cursor() {
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion());
  const [state, setState] = useState<CursorState>('default');
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

    const onMove = (e: globalThis.MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const apply = (s: CursorState, label = '') => {
      setState(s);
      if (labelRef.current) labelRef.current.textContent = label;
    };

    const onOver = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const cursorEl = target.closest('[data-cursor]');
      if (cursorEl) {
        const mode = cursorEl.getAttribute('data-cursor');
        apply(mode === 'explore' ? 'explore' : 'view', mode === 'explore' ? 'EXPLORER' : 'VOIR →');
      } else if (target.closest('a, button, [data-magnetic]')) {
        apply('link');
      } else {
        apply('default');
      }
    };

    const onLeave = () => apply('hidden');
    const onEnter = () => apply('default');

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.25, ease: 'power2.out' });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className={`cursor cursor--${state}`} aria-hidden="true">
      <div ref={dotRef} className="cursor__dot" />
      <div ref={ringRef} className="cursor__ring">
        <span ref={labelRef} className="cursor__label" />
      </div>
    </div>
  );
}
