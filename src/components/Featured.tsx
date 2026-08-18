import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/anim';
import { ProjectArt } from './ProjectCard';
import './featured.css';

/**
 * Projet à la une — AURA.
 * Effet de travelling : le fond reste quasi fixe, l'image et les textes
 * se déplacent à des vitesses différentes pendant le scroll.
 */
export default function Featured() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      tl.fromTo('.feat__bg', { scale: 1.16 }, { scale: 1 }, 0)
        .fromTo('.feat__word', { xPercent: -5, opacity: 0.2 }, { xPercent: 2, opacity: 1 }, 0)
        .fromTo('.feat__art', { yPercent: 12, rotate: 2.5 }, { yPercent: -7, rotate: 0 }, 0)
        .fromTo('.feat__title', { y: 110, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1 }, 0)
        .fromTo('.feat__tagline', { y: 60, opacity: 0 }, { y: 0, opacity: 1 }, 0.12)
        .fromTo('.feat__kicker', { y: 34, opacity: 0 }, { y: 0, opacity: 1 }, 0.05)
        .fromTo('.feat__chip--1', { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, 0.1)
        .fromTo('.feat__chip--2', { y: -40, opacity: 0 }, { y: 0, opacity: 1 }, 0.2)
        .fromTo('.feat__label--tl', { x: -70, opacity: 0.2 }, { x: 30, opacity: 1 }, 0)
        .fromTo('.feat__label--br', { x: 70, opacity: 0.2 }, { x: -30, opacity: 1 }, 0);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="feat" ref={rootRef} aria-label="Projet à la une — AURA">
      <div className="feat__pin">
        <div className="feat__bg" aria-hidden="true">
          <span className="feat__word display text-outline--soft">AURA</span>
          <span className="feat__aurora" />
        </div>

        <div className="container feat__grid">
          <div className="feat__text">
            <p className="eyebrow feat__kicker">
              <span className="eyebrow__index">( 02 )</span>
              <span className="eyebrow__line" aria-hidden="true" />
              <span>Projet à la une — 2026</span>
            </p>
            <h2 className="display feat__title">
              AURA<span className="feat__period">.</span>
            </h2>
            <p className="feat__tagline serif-i">
              Une identité pensée comme une expérience.
            </p>
          </div>

          <div className="feat__art" data-cursor="explore">
            <ProjectArt type="aura" />
            <span className="feat__chip feat__chip--1 chip">
              Identité visuelle & expérience digitale
            </span>
            <span className="feat__chip feat__chip--2 chip">
              Paris — Cosmétique sensorielle
            </span>
          </div>
        </div>

        <div className="container feat__labels" aria-hidden="true">
          <span className="feat__label--tl">01 / 04 — Aura Studio</span>
          <span className="feat__label--br">Packaging · Digital · Espace</span>
        </div>
      </div>
    </section>
  );
}
