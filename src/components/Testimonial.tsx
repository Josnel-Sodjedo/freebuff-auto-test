import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion, splitIntoWords } from '../lib/anim';
import './testimonial.css';

export default function Testimonial() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const quote = rootRef.current?.querySelector<HTMLElement>('.testi__quote');
      if (!quote) return;
      const words = splitIntoWords(quote);
      gsap.fromTo(
        words,
        { yPercent: 70, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.035,
          ease: 'power3.out',
          scrollTrigger: { trigger: quote, start: 'top 80%', once: true },
        }
      );
      gsap.fromTo(
        '.testi__who, .testi__mark',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.testi__quote', start: 'top 70%', once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section testi" ref={rootRef} aria-label="Témoignage">
      <div className="container">
        <span className="testi__mark" aria-hidden="true">
          «
        </span>
        <blockquote>
          <p className="testi__quote">
            KAYO ne se contente pas de créer de belles interfaces. Il donne une
            véritable personnalité aux idées.
          </p>
        </blockquote>
        <div className="testi__who">
          <span className="testi__avatar" aria-hidden="true">
            ML
          </span>
          <div>
            <p className="testi__name">Maya Laurent</p>
            <p className="testi__role">Directrice de création</p>
          </div>
        </div>
      </div>
    </section>
  );
}
