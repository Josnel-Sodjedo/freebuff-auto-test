import { useEffect, useRef, useState, type MouseEvent } from 'react';
import gsap from 'gsap';
import { scrollTo, stopScroll, startScroll } from '../lib/lenis';
import './nav.css';

const LINKS = [
  { id: 'projets', label: 'Projets' },
  { id: 'apropos', label: 'À propos' },
  { id: 'experimentations', label: 'Expérimentations' },
  { id: 'services', label: 'Services' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animation d'ouverture / fermeture du menu mobile
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const links = menu.querySelectorAll<HTMLElement>('.nav__menu-link');
    if (open) {
      stopScroll();
      gsap.fromTo(
        menu,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power4.inOut' }
      );
      gsap.fromTo(
        links,
        { y: 46, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power4.out', delay: 0.25 }
      );
      gsap.fromTo(
        '.nav__menu-foot',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.55 }
      );
    } else {
      startScroll();
      gsap.set(links, { clearProps: 'all' });
      gsap.set('.nav__menu-foot', { clearProps: 'all' });
    }
    return () => {
      startScroll();
    };
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a
          href="#accueil"
          className="nav__logo"
          onClick={(e) => go(e, 'accueil')}
          aria-label="Retour à l'accueil"
        >
          KAYO
        </a>

        <nav className="nav__links" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="nav__link" onClick={(e) => go(e, l.id)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <a href="#contact" className="nav__cta" onClick={(e) => go(e, 'contact')}>
            Démarrer un projet
          </a>
          <button
            type="button"
            className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__burger-bar" />
            <span className="nav__burger-bar" />
          </button>
        </div>
      </div>

      {/* Menu mobile plein écran */}
      <div ref={menuRef} className="nav__menu" id="menu-mobile" aria-hidden={!open}>
        <nav className="nav__menu-links" aria-label="Menu mobile">
          {LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="nav__menu-link display"
              style={{ transitionDelay: `${i * 40}ms` }}
              onClick={(e) => go(e, l.id)}
            >
              <span className="nav__menu-num">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__menu-foot">
          <a href="mailto:bonjour@kayo.studio" className="nav__menu-mail">
            bonjour@kayo.studio
          </a>
          <span>Paris — Nantes</span>
        </div>
      </div>
    </header>
  );
}
