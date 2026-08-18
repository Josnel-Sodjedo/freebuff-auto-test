import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { pad2, prefersReducedMotion, splitIntoWords } from '../lib/anim';
import Eyebrow from './Eyebrow';
import './about.css';

const STATS = [
  { value: 8, suffix: '+', label: 'années d’expérience' },
  { value: 42, suffix: '', label: 'projets réalisés' },
  { value: 17, suffix: '', label: 'marques accompagnées' },
  { value: 9, suffix: '', label: 'pays' },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Titre — révélation ligne par ligne
      rootRef.current?.querySelectorAll<HTMLElement>('.about__title-line').forEach((line, li) => {
        const words = splitIntoWords(line);
        gsap.fromTo(
          words,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.045,
            ease: 'power4.out',
            scrollTrigger: { trigger: line, start: 'top 84%', once: true },
          }
        );
      });

      // Paragraphe
      gsap.fromTo(
        '.about__text, .about__sign',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about__text', start: 'top 88%', once: true },
        }
      );

      // Portrait
      gsap.fromTo(
        '.about__portrait',
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about__portrait', start: 'top 85%', once: true },
        }
      );

      // Compteurs animés
      rootRef.current?.querySelectorAll<HTMLElement>('.about__stat').forEach((stat) => {
        const num = stat.querySelector<HTMLElement>('.about__stat-num em');
        const target = parseInt(stat.dataset.value ?? '0', 10);
        if (!num) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: stat, start: 'top 88%', once: true },
          onUpdate: () => {
            num.textContent = pad2(Math.round(obj.v));
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section about" id="apropos" ref={rootRef} aria-label="À propos">
      <div className="container">
        <Eyebrow index="05" label="À propos" />

        <h2 className="display about__title">
          <span className="about__title-line">JE NE DESSINE PAS SEULEMENT</span>
          <span className="about__title-line about__title-line--2">
            DES INTERFACES. JE CONÇOIS DES SENSATIONS.
          </span>
        </h2>

        <div className="about__grid">
          <div>
            <p className="about__text">
              <strong>KAYO</strong> est designer digital et directeur artistique indépendant,
              basé entre Paris et Nantes. Depuis plus de huit ans, il accompagne des marques
              ambitieuses — startups, studios, maisons de luxe — dans la création
              d’identités et d’expériences numériques singulières.
              <br />
              <br />
              Son approche mêle <strong>rigueur éditoriale</strong>, sens du récit et
              expérimentation constante. Chaque projet est traité comme une œuvre :
              typographie millimétrée, mouvement pensé, matière soignée.
            </p>
            <p className="about__sign serif-i">— KAYO, designer digital</p>
          </div>

          <figure className="about__portrait">
            <span className="about__portrait-ring" aria-hidden="true" />
            <span className="about__portrait-core display" aria-hidden="true">
              KAYO
              <span>PORTRAIT</span>
            </span>
            <figcaption className="about__portrait-caption">
              ( Portrait — Paris, 2026 )
            </figcaption>
          </figure>
        </div>

        <div className="about__stats">
          {STATS.map((s, i) => (
            <div key={s.label} className="about__stat" data-value={s.value}>
              <p className="about__stat-num display">
                <em>00</em>
                {s.suffix && <em aria-hidden="true">{s.suffix}</em>}
              </p>
              <p className="about__stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
