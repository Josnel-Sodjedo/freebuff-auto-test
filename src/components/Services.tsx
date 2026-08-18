import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { prefersReducedMotion } from '../lib/anim';
import Eyebrow from './Eyebrow';
import './services.css';

const SERVICES = [
  { num: '01', title: 'Direction artistique', desc: 'Un univers visuel cohérent, du concept à la déclinaison.' },
  { num: '02', title: 'Identité visuelle', desc: 'Logo, typographie, couleur — une personnalité qui marque.' },
  { num: '03', title: 'Design digital', desc: 'Sites, interfaces et expériences conçus avec précision.' },
  { num: '04', title: 'Expérience utilisateur', desc: 'Des parcours fluides, intuitifs et mémorables.' },
  { num: '05', title: 'Code créatif', desc: 'Animations et interactions qui donnent vie au design.' },
];

export default function Services() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.services__head > *',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.services__head', start: 'top 85%', once: true },
        }
      );
      gsap.fromTo(
        '.svc__row',
        { y: 46, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.services__list', start: 'top 84%', once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section services" id="services" ref={rootRef} aria-label="Services">
      <div className="container">
        <div className="services__head">
          <Eyebrow index="06" label="Services" />
          <h2 className="display services__title">
            SERV<span className="text-outline">ICES</span>
          </h2>
        </div>

        <ul className="services__list">
          {SERVICES.map((s) => (
            <li key={s.num} className="svc__row">
              <span className="svc__num">( {s.num} )</span>
              <h3 className="svc__title display">{s.title}</h3>
              <p className="svc__desc">{s.desc}</p>
              <span className="svc__arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
