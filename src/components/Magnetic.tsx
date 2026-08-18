import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/anim';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/**
 * Enveloppe magnétique : l'élément est attiré par le curseur,
 * puis revient élastiquement à sa position d'origine.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.45,
      ease: 'power3.out',
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.35)',
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
