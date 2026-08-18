import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { isFinePointer, prefersReducedMotion } from '../lib/anim';
import './hero.css';

type QuickFn = ReturnType<typeof gsap.quickTo>;

/** Découpe un mot en lettres animables (sans espaces). */
function Letters({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span key={i} className={`hero__letter${className ? ` ${className}` : ''}`}>
          {ch}
        </span>
      ))}
    </>
  );
}

/** Braises qui montent en fond de héros — valeurs aléatoires stables. */
function useEmbers(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        dur: 7 + Math.random() * 11,
        delay: -Math.random() * 20,
        opacity: 0.3 + Math.random() * 0.6,
        paper: Math.random() < 0.22,
      })),
    [count]
  );
}

interface HeroProps {
  started: boolean;
}

export default function Hero({ started }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const embers = useEmbers(22);

  /* Aurore ambiante — dérive lente des halos colorés. */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to('.hero__orb--1', {
        xPercent: 24,
        yPercent: -14,
        scale: 1.18,
        duration: 15,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to('.hero__orb--2', {
        xPercent: -20,
        yPercent: 12,
        scale: 0.9,
        duration: 19,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to('.hero__orb--3', {
        xPercent: 14,
        yPercent: -12,
        scale: 1.22,
        duration: 23,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* Halo lumineux qui suit le curseur (lerp doux). */
  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;
    const root = rootRef.current;
    if (!root) return;
    const spot = root.querySelector<HTMLElement>('.hero__spotlight');
    if (!spot) return;
    const hw = spot.offsetWidth / 2;
    const hh = spot.offsetHeight / 2;
    const xTo = gsap.quickTo(spot, 'x', { duration: 1, ease: 'power3.out' });
    const yTo = gsap.quickTo(spot, 'y', { duration: 1, ease: 'power3.out' });
    const scaleTo = gsap.quickTo(spot, 'scale', { duration: 0.6, ease: 'power2.out' });

    // Parallaxe de profondeur : chaque halo se déplace à sa propre vitesse.
    const orbDepths = [26, 40, 56];
    const orbs = Array.from(root.querySelectorAll<HTMLElement>('.hero__orb')).map((o, i) => ({
      x: gsap.quickTo(o, 'x', { duration: 1.5, ease: 'power3.out' }),
      y: gsap.quickTo(o, 'y', { duration: 1.5, ease: 'power3.out' }),
      depth: orbDepths[i % orbDepths.length],
    }));

    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    let idle: number | undefined;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const x = e.clientX - r.left - hw;
      const y = e.clientY - r.top - hh;
      xTo(x);
      yTo(y);
      // Le halo pulse selon la vitesse du curseur.
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      scaleTo(1 + Math.min(0.4, speed * 0.08));
      window.clearTimeout(idle);
      idle = window.setTimeout(() => scaleTo(1), 140);

      // Profondeur des halos selon la position du curseur dans le héros.
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      orbs.forEach((o) => {
        o.x(nx * o.depth);
        o.y(ny * o.depth);
      });
    };
    const onLeave = () => {
      orbs.forEach((o) => {
        o.x(0);
        o.y(0);
      });
    };
    root.addEventListener('mousemove', onMove, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    return () => {
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
      window.clearTimeout(idle);
    };
  }, []);

  /* Typo cinétique — les lettres du titre réagissent au passage du curseur. */
  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;
    const root = rootRef.current;
    if (!root) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>('.hero__letter'));
    if (!letters.length) return;

    const quicks: QuickFn[] = [];
    letters.forEach((l) => {
      quicks.push(
        gsap.quickTo(l, 'x', { duration: 0.7, ease: 'power3.out' }),
        gsap.quickTo(l, 'y', { duration: 0.7, ease: 'power3.out' })
      );
    });

    const onMove = (e: MouseEvent) => {
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        const f = Math.max(0, 1 - d / 260);
        quicks[i * 2](dx * 0.16 * f);
        quicks[i * 2 + 1](dy * 0.26 * f);
      });
    };
    const onLeave = () =>
      letters.forEach((_, i) => {
        quicks[i * 2](0);
        quicks[i * 2 + 1](0);
      });

    root.addEventListener('mousemove', onMove, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    return () => {
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  /* Séquence d'entrée, déclenchée à la fin du preloader. */
  useEffect(() => {
    if (!started) return;
    const root = rootRef.current;
    if (!root) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo(
      '.hero__aurora',
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 2.4, ease: 'power2.out' },
      0
    )
      .fromTo('.hero__embers', { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0.3)
      .fromTo(
        '.hero__line-inner',
        { yPercent: 118 },
        { yPercent: 0, duration: 1.35, stagger: 0.13 },
        0.12
      )
      .fromTo(
        '.hero__letter',
        { opacity: 0, scale: 0.82, filter: 'blur(10px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.016,
          ease: 'power3.out',
        },
        0.32
      )
      .fromTo(
        '.hero__sub',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=0.75'
      )
      .fromTo('.hero__foot', { opacity: 0 }, { opacity: 1, duration: 0.9 }, '-=0.6');
  }, [started]);

  /* Parallax de sortie — le héros se retire élégamment quand on scrolle. */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.to('.hero__content', {
        yPercent: -18,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero__bg', {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero__title', {
        skewY: -7,
        scale: 0.96,
        transformOrigin: 'center top',
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* Étincelles au clic — une explosion de particules à chaque pointerdown. */
  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;
    const root = rootRef.current;
    if (!root) return;

    const onPointerDown = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const sparks: HTMLElement[] = [];
      for (let i = 0; i < 12; i++) {
        const s = document.createElement('span');
        s.className = 'hero__spark';
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        const angle = Math.random() * Math.PI * 2;
        const dist = 45 + Math.random() * 95;
        s.style.setProperty('--sx', `${Math.cos(angle) * dist}px`);
        s.style.setProperty('--sy', `${Math.sin(angle) * dist - 45}px`);
        const size = 3 + Math.random() * 4;
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.background = Math.random() < 0.7 ? 'var(--accent)' : 'var(--paper)';
        root.appendChild(s);
        sparks.push(s);
      }
      gsap.fromTo(
        sparks,
        { scale: 1, opacity: 1 },
        {
          scale: 0,
          opacity: 0,
          duration: 0.75 + Math.random() * 0.4,
          ease: 'power3.out',
          x: (i: number) => parseFloat(sparks[i].style.getPropertyValue('--sx')),
          y: (i: number) => parseFloat(sparks[i].style.getPropertyValue('--sy')),
          onComplete: () => sparks.forEach((s) => s.remove()),
        }
      );
    };

    root.addEventListener('pointerdown', onPointerDown);
    return () => root.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <section className="hero" id="accueil" ref={rootRef} aria-label="Présentation de KAYO">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__veil" />
        <div className="hero__aurora">
          <span className="hero__orb hero__orb--1" />
          <span className="hero__orb hero__orb--2" />
          <span className="hero__orb hero__orb--3" />
        </div>
        <div className="hero__embers">
          {embers.map((e, i) => (
            <span
              key={i}
              className={`hero__ember${e.paper ? ' hero__ember--paper' : ''}`}
              style={{
                left: `${e.left}%`,
                width: e.size,
                height: e.size,
                opacity: e.opacity,
                animationDuration: `${e.dur}s`,
                animationDelay: `${e.delay}s`,
              }}
            />
          ))}
        </div>
        <span className="hero__spotlight" />
      </div>

      <div className="hero__content container">
        <h1 className="hero__title display">
          <span className="hero__line">
            <span className="hero__line-inner" aria-hidden="true">
              <Letters text="JE" /> <Letters text="CRÉE" />
            </span>
            <span className="sr-only">JE CRÉE</span>
          </span>
          <span className="hero__line">
            <span className="hero__line-inner" aria-hidden="true">
              <Letters text="DES" className="text-outline" />{' '}
              <span className="hero__grad">
                <Letters text="MONDES" />
              </span>
            </span>
            <span className="sr-only">DES MONDES</span>
          </span>
          <span className="hero__line">
            <span className="hero__line-inner" aria-hidden="true">
              <Letters text="VISUELS" />
              <span className="hero__period">.</span>
            </span>
            <span className="sr-only">VISUELS.</span>
          </span>
        </h1>
      </div>

      <div className="hero__foot container">
        <p className="hero__sub">
          Designer digital et directeur artistique indépendant. Je conçois des identités,
          interfaces et expériences visuelles pour des marques ambitieuses.
        </p>
        <div className="hero__scroll" aria-hidden="true">
          <span className="hero__scroll-line">
            <span className="scrollline" />
          </span>
          <span>Scroll pour explorer</span>
        </div>
      </div>
    </section>
  );
}
