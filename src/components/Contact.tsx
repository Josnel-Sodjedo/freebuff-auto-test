import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { prefersReducedMotion, splitIntoWords } from '../lib/anim';
import Eyebrow from './Eyebrow';
import Magnetic from './Magnetic';
import './contact.css';

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Titre — révélation mot à mot
      rootRef.current?.querySelectorAll<HTMLElement>('.contact__title-line').forEach((line) => {
        const words = splitIntoWords(line);
        gsap.fromTo(
          words,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.04,
            ease: 'power4.out',
            scrollTrigger: { trigger: line, start: 'top 84%', once: true },
          }
        );
      });

      // CTA
      gsap.fromTo(
        '.contact__fade',
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.contact__mail', start: 'top 90%', once: true },
        }
      );

    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="contact" id="contact" ref={rootRef} aria-label="Contact">
      <div className="container contact__inner">
        <Eyebrow index="08" label="Contact" />

        <h2 className="display contact__title">
          <span className="contact__title-line">UNE IDÉE EN TÊTE ?</span>
          <span className="contact__title-line contact__title-line--2">
            DONNONS-LUI UNE FORME<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </h2>

        <a
          href="mailto:bonjour@kayo.studio"
          className="contact__mail contact__fade"
          data-magnetic
        >
          bonjour@kayo.studio
        </a>

        <div className="contact__cta">
          <Magnetic strength={0.4}>
            <a
              href="mailto:bonjour@kayo.studio?subject=Nouveau%20projet"
              className="btn btn--accent contact__fade"
              data-cursor="view"
            >
              Démarrer un projet
              <span className="btn__arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
          </Magnetic>
          <p className="contact__note contact__fade">
            Réponse sous 48 h — Paris / Nantes / Remote
          </p>
        </div>
      </div>
    </section>
  );
}
