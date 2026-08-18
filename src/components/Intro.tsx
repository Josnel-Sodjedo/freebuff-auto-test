import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion, splitIntoWords } from '../lib/anim';
import Eyebrow from './Eyebrow';
import './intro.css';

export default function Intro() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const title = rootRef.current?.querySelector<HTMLElement>('.intro__title');
      const text = rootRef.current?.querySelector<HTMLElement>('.intro__text');
      if (!title || !text) return;

      // Titre révélé mot par mot au scroll
      const words = splitIntoWords(title);
      gsap.fromTo(
        words,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.05,
          ease: 'power4.out',
          scrollTrigger: { trigger: title, start: 'top 82%', once: true },
        }
      );

      // Paragraphe révélé progressivement (scrub)
      const pWords = splitIntoWords(text);
      gsap.fromTo(
        pWords,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: { trigger: text, start: 'top 88%', end: 'bottom 45%', scrub: 0.6 },
        }
      );

      gsap.fromTo(
        '.intro__steps',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.intro__steps', start: 'top 90%', once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section intro" ref={rootRef} aria-label="Introduction">
      <div className="container">
        <Eyebrow index="01" label="Introduction" />
        <div className="intro__grid">
          <h2 className="display intro__title">
            DES IDÉES AUX EXPÉRIENCES.
          </h2>
          <div className="intro__aside">
            <p className="intro__text">
              Je conçois des identités et expériences numériques qui donnent une forme
              aux idées et une personnalité aux marques. Chaque projet est un récit
              visuel, pensé dans ses moindres détails.
            </p>
            <div className="intro__steps" aria-hidden="true">
              <span className="intro__step">
                <span className="intro__step-num">01</span>
                Concept
                <span className="intro__step-line" />
              </span>
              <span className="intro__step">
                <span className="intro__step-num">02</span>
                Design
                <span className="intro__step-line" />
              </span>
              <span className="intro__step">
                <span className="intro__step-num">03</span>
                Réalité
                <span className="intro__step-line" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
