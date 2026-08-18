import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/anim';
import Eyebrow from './Eyebrow';
import ProjectCard from './ProjectCard';
import { PROJECTS } from './projects-data';
import './projects.css';

export default function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.projects__head > *',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.projects__head', start: 'top 85%', once: true },
        }
      );
      gsap.fromTo(
        '.project-card',
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.projects__grid', start: 'top 80%', once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section projects" id="projets" ref={rootRef} aria-label="Projets">
      <div className="container">
        <div className="projects__head">
          <Eyebrow index="02" label="Projets" />
          <div className="projects__heading">
            <h2 className="display projects__title">
              PROJETS<span className="text-outline">(04)</span>
            </h2>
            <p className="projects__note">
              Quatre univers, quatre récits.
              <br />
              Sélection 2024 — 2026.
            </p>
          </div>
        </div>

        <div className="projects__grid">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
