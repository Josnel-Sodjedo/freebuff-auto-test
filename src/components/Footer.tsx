import { ArrowUp } from 'lucide-react';
import { scrollTo } from '../lib/lenis';
import './footer.css';

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/', external: true },
  { label: 'Behance', href: 'https://www.behance.net/', external: true },
  { label: 'Dribbble', href: 'https://dribbble.com/', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', external: true },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <p className="footer__logo display">
            KAYO<span className="nav__reg">®</span>
          </p>
          <p className="footer__tag">
            Designer digital
            <br />
            & directeur artistique
          </p>
          <nav aria-label="Réseaux sociaux">
            <ul className="footer__socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="footer__social"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <span>© 2026 KAYO Studio</span>
          <span>Paris — Nantes</span>
          <button type="button" className="footer__top-btn" onClick={() => scrollTo(0)}>
            Retour en haut <ArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="footer__giant display text-outline--soft" aria-hidden="true">
        KAYO®
      </p>
    </footer>
  );
}
