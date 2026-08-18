import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Plus } from 'lucide-react';
import { prefersReducedMotion } from '../lib/anim';
import Eyebrow from './Eyebrow';
import './faq.css';

const FAQS = [
  {
    q: 'Quels types de projets acceptez-vous ?',
    a: 'Identités visuelles, sites et expériences digitales, direction artistique. Je privilégie les marques ambitieuses en quête d’un univers singulier.',
  },
  {
    q: 'Comment se déroule la collaboration ?',
    a: 'Un premier échange pour comprendre vos enjeux, puis une proposition cadrée. Design, allers-retours structurés et livraison accompagnée.',
  },
  {
    q: 'Quels sont vos délais ?',
    a: 'Comptez 3 à 4 semaines pour une identité visuelle, 4 à 8 semaines pour un site selon le périmètre. Le calendrier est fixé ensemble dès le départ.',
  },
  {
    q: 'Travaillez-vous à distance ?',
    a: 'Oui. Basé entre Paris et Nantes, je collabore partout en France et à l’international, avec des points réguliers et un suivi en ligne.',
  },
  {
    q: 'Quel budget prévoir ?',
    a: 'Chaque projet est unique : après un premier échange, vous recevez un devis clair et détaillé, sans surprise.',
  },
  {
    q: 'Et après la livraison ?',
    a: 'L’accompagnement continue : évolutions, suivi et conseils pour que l’expérience grandisse avec votre marque.',
  },
];

export default function Faq() {
  const rootRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq__head > *',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.faq__head', start: 'top 85%', once: true },
        }
      );
      gsap.fromTo(
        '.faq__item',
        { y: 46, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.faq__list', start: 'top 84%', once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section faq" id="faq" ref={rootRef} aria-label="Questions fréquentes">
      <div className="container">
        <div className="faq__head">
          <Eyebrow index="09" label="FAQ" />
          <h2 className="display faq__title">
            QUES<span className="text-outline">TIONS</span>
          </h2>
        </div>

        <ul className="faq__list">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={`faq__item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq__q"
                  id={`faq-btn-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="faq__num">( 0{i + 1} )</span>
                  <span className="faq__question">{f.q}</span>
                  <Plus className="faq__icon" aria-hidden="true" />
                </button>
                <div
                  className="faq__panel"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                >
                  <p className="faq__a">{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
