import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/anim';
import Eyebrow from './Eyebrow';
import './process.css';

const STEPS = [
  {
    num: '01',
    title: 'Comprendre',
    desc: 'Immersion dans votre univers, vos enjeux et votre audience. On écoute avant de dessiner.',
    tag: 'Écoute & analyse',
  },
  {
    num: '02',
    title: 'Explorer',
    desc: 'Moodboards, pistes créatives, détournements. On teste les directions avec audace.',
    tag: 'Recherche & pistes',
  },
  {
    num: '03',
    title: 'Construire',
    desc: 'Design system, interfaces, motion. Chaque pixel trouve sa raison d’être.',
    tag: 'Design & prototypage',
  },
  {
    num: '04',
    title: 'Révéler',
    desc: 'Livraison, accompagnement, évolution. L’expérience continue de grandir.',
    tag: 'Lancement & suivi',
  },
];

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop : scroll horizontal épinglé
      mm.add('(min-width: 901px)', () => {
        const track = trackRef.current;
        const section = rootRef.current;
        if (!track || !section) return;
        const dist = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(
          '.process__bar-fill',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${dist()}`,
              scrub: 1,
            },
          }
        );
      });

      // Mobile : empilement vertical + révélation
      mm.add('(max-width: 900px)', () => {
        gsap.fromTo(
          '.process__step',
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.process__track', start: 'top 84%', once: true },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section process" id="processus" ref={rootRef} aria-label="Processus">
      <div className="container">
        <div className="process__head">
          <Eyebrow index="07" label="Processus" />
          <h2 className="display process__title">
            MÉTHO<span className="text-outline">DE</span>
          </h2>
        </div>
      </div>

      <div className="process__viewport">
        <div className="process__track" ref={trackRef}>
          {STEPS.map((s) => (
            <article className="process__step" key={s.num} aria-label={`Étape ${s.num} — ${s.title}`}>
              <span className="process__step-glow" aria-hidden="true" />
              <span className="process__step-num display">{s.num}</span>
              <div className="process__step-body">
                <h3 className="process__step-title display">{s.title}</h3>
                <p className="process__step-desc">{s.desc}</p>
              </div>
              <div className="process__step-meta">
                <span>{s.tag}</span>
                <span className="process__step-dot" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="process__bar" aria-hidden="true">
          <span className="process__bar-fill" />
        </div>
      </div>
    </section>
  );
}
