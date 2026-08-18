import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { isFinePointer, prefersReducedMotion } from '../lib/anim';
import type { Project } from './projects-data';

/** Une composition générative CSS/SVG par projet — aucune image externe. */
export function ProjectArt({ type }: { type: Project['art'] }) {
  const uid = useId().replace(/:/g, '');

  if (type === 'forme') {
    return (
      <div className="art art--forme" aria-hidden="true">
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={`fg-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff4d00" />
              <stop offset="55%" stopColor="#e9e4da" />
              <stop offset="100%" stopColor="#ff4d00" />
            </linearGradient>
            <linearGradient id={`fg2-${uid}`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e9e4da" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff4d00" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M10 330 C 130 40, 270 40, 390 250"
            fill="none"
            stroke={`url(#fg-${uid})`}
            strokeWidth="2.5"
          />
          <path
            d="M10 260 C 150 360, 250 10, 390 130"
            fill="none"
            stroke={`url(#fg2-${uid})`}
            strokeWidth="1.5"
          />
          <path
            d="M10 200 C 110 260, 300 60, 390 60"
            fill="none"
            stroke="rgba(233,228,218,0.25)"
            strokeWidth="1"
            strokeDasharray="3 8"
          />
          <circle cx="120" cy="290" r="7" fill="#ff4d00" />
          <circle cx="285" cy="105" r="4.5" fill="#e9e4da" />
          <circle cx="345" cy="230" r="3" fill="#e9e4da" opacity="0.7" />
        </svg>
      </div>
    );
  }

  if (type === 'eclat') {
    const lines = Array.from({ length: 26 }, (_, i) => {
      const angle = (i / 26) * Math.PI * 2;
      const x1 = 200 + Math.cos(angle) * 46;
      const y1 = 200 + Math.sin(angle) * 46;
      const len = 130 + ((i * 37) % 55);
      const x2 = 200 + Math.cos(angle) * len;
      const y2 = 200 + Math.sin(angle) * len;
      return { x1, y1, x2, y2, i };
    });
    return (
      <div className="art art--eclat" aria-hidden="true">
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          {lines.map((l) => (
            <line
              key={l.i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={l.i % 5 === 0 ? '#ff4d00' : 'rgba(233,228,218,0.4)'}
              strokeWidth={l.i % 5 === 0 ? 1.4 : 0.8}
            />
          ))}
          <circle cx="200" cy="200" r="34" fill="none" stroke="rgba(233,228,218,0.5)" strokeWidth="1" />
          <circle cx="200" cy="200" r="13" fill="#ff4d00" />
          <circle
            cx="200"
            cy="200"
            r="92"
            fill="none"
            stroke="rgba(255,77,0,0.4)"
            strokeWidth="1"
            strokeDasharray="3 9"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`art art--${type}`} aria-hidden="true">
      <span className="art__orb art__orb--1" />
      <span className="art__orb art__orb--2" />
      <span className="art__halo" />
      <span className="art__ring" />
      <span className="art__core" />
      {type === 'noir' && (
        <>
          <span className="art__check" />
          <span className="art__circle" />
          <span className="art__disc" />
          <span className="art__bars" />
        </>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  /* Inclinaison fausse-3D au survol + déplacement des couches internes. */
  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;
    const el = tiltRef.current;
    if (!el) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-depth]'));

    const onMove = (e: globalThis.MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateX: ny * -9,
        rotateY: nx * 11,
        transformPerspective: 900,
        duration: 0.65,
        ease: 'power2.out',
      });
      layers.forEach((layer) => {
        const d = parseFloat(layer.dataset.depth ?? '10');
        gsap.to(layer, { x: nx * d, y: ny * d, duration: 0.65, ease: 'power2.out' });
      });
    };

    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1.1, ease: 'elastic.out(1, 0.45)' });
      layers.forEach((layer) =>
        gsap.to(layer, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.45)' })
      );
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <article
      className={`project-card project-card--${project.size}`}
      data-cursor="view"
      aria-label={`Projet ${project.title} — ${project.category}`}
    >
      <div className="project-card__tilt" ref={tiltRef}>
        <span className="project-card__num" data-depth="60" aria-hidden="true">
          {project.num}
        </span>

        <div className="project-card__frame" data-depth="34">
          <ProjectArt type={project.art} />
          <span className="project-card__scrim" />
          <span className="project-card__badge" data-depth="80">
            {project.badge}
          </span>
          <h3 className="project-card__title display" data-depth="52">
            {project.title}
          </h3>
          <span className="project-card__view" aria-hidden="true">
            Voir le projet <ArrowRight />
          </span>
        </div>

        <div className="project-card__meta" data-depth="22">
          <span className="project-card__cat">{project.category}</span>
          <span>{project.year}</span>
        </div>
        <p className="project-card__tagline serif-i" data-depth="14">
          {project.tagline}
        </p>
      </div>
    </article>
  );
}
