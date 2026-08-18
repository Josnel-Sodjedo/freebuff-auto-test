import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkle } from 'lucide-react';
import { isFinePointer, prefersReducedMotion, splitIntoWords } from '../lib/anim';
import Eyebrow from './Eyebrow';
import './experiments.css';

type QuickFn = ReturnType<typeof gsap.quickTo>;

/* ---------- Exp 01 : typographie vivante ---------- */
function ExpTypo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;
    const el = ref.current;
    if (!el) return;
    const letters = Array.from(el.querySelectorAll<HTMLElement>('.exp-typo__letter'));
    const quicks: QuickFn[] = [];
    letters.forEach((l) => {
      quicks.push(
        gsap.quickTo(l, 'x', { duration: 0.55, ease: 'power3.out' }),
        gsap.quickTo(l, 'y', { duration: 0.55, ease: 'power3.out' }),
        gsap.quickTo(l, 'rotation', { duration: 0.55, ease: 'power3.out' })
      );
    });

    const onMove = (e: MouseEvent) => {
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / 280);
        quicks[i * 3](dx * 0.18 * f);
        quicks[i * 3 + 1](dy * 0.18 * f);
        quicks[i * 3 + 2](dx * 0.07 * f);
      });
    };
    const onLeave = () => {
      letters.forEach((_, i) => {
        quicks[i * 3](0);
        quicks[i * 3 + 1](0);
        quicks[i * 3 + 2](0);
      });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="exp-typo" ref={ref}>
      {'FLUIDE'.split('').map((ch, i) => (
        <span key={i} className="exp-typo__letter" aria-hidden="true">
          {ch}
        </span>
      ))}
      <span className="sr-only">FLUIDE</span>
    </div>
  );
}

/* ---------- Exp 02 : grille élastique ---------- */
function ExpGrid() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const svg = svgRef.current;
    if (!svg) return;

    const W = 600;
    const H = 300;
    const STEP = 42;
    const NS = 'http://www.w3.org/2000/svg';

    const lines: { kind: 'v' | 'h'; pos: number }[] = [];
    for (let x = STEP; x < W; x += STEP) lines.push({ kind: 'v', pos: x });
    for (let y = STEP; y < H; y += STEP) lines.push({ kind: 'h', pos: y });

    const els = lines.map((l) => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(233,228,218,0.26)');
      path.setAttribute('stroke-width', '1');
      svg.appendChild(path);
      return { ...l, el: path };
    });

    const cur = new Float32Array(lines.length);
    const tgt = new Float32Array(lines.length);
    let raf = 0;

    const render = () => {
      els.forEach((e, i) => {
        cur[i] += (tgt[i] - cur[i]) * 0.14;
        const off = cur[i];
        const d =
          e.kind === 'v'
            ? `M ${e.pos} 0 Q ${e.pos + off} ${H / 2} ${e.pos} ${H}`
            : `M 0 ${e.pos} Q ${W / 2} ${e.pos + off} ${W} ${e.pos}`;
        e.el.setAttribute('d', d);
      });
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * W;
      const my = ((e.clientY - rect.top) / rect.height) * H;
      els.forEach((e2, i) => {
        if (e2.kind === 'v') {
          const fall = Math.max(0, 1 - Math.hypot(mx - e2.pos, my - H / 2) / 190);
          tgt[i] = (mx - e2.pos) * 0.3 * fall;
        } else {
          const fall = Math.max(0, 1 - Math.hypot(mx - W / 2, my - e2.pos) / 190);
          tgt[i] = (my - e2.pos) * 0.3 * fall;
        }
      });
    };
    const onLeave = () => tgt.fill(0);

    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      svg.removeEventListener('mousemove', onMove);
      svg.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="exp-grid-2"
      viewBox="0 0 600 300"
      preserveAspectRatio="none"
      aria-hidden="true"
    />
  );
}

/* ---------- Exp 03 : formes en apesanteur ---------- */
function ExpOrbs() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-chase]'));
    const quicks = items.map((it) => {
      const d = parseFloat(it.dataset.chase ?? '0.6');
      return {
        x: gsap.quickTo(it, 'x', { duration: d, ease: 'power3.out' }),
        y: gsap.quickTo(it, 'y', { duration: d, ease: 'power3.out' }),
      };
    });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      items.forEach((it, i) => {
        const s = parseFloat(it.dataset.strength ?? '0.2');
        quicks[i].x(x * s);
        quicks[i].y(y * s);
      });
    };
    const onLeave = () => items.forEach((_, i) => {
      quicks[i].x(0);
      quicks[i].y(0);
    });

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="exp-orbs" ref={ref} aria-hidden="true">
      <span className="exp-orbs__orb exp-orbs__orb--1" data-chase="0.4" data-strength="0.34" />
      <span className="exp-orbs__orb exp-orbs__orb--2" data-chase="0.8" data-strength="0.22" />
      <span className="exp-orbs__ring" data-chase="1.2" data-strength="0.13" />
      <span className="exp-orbs__dot" data-chase="0.55" data-strength="0.44" />
    </div>
  );
}

/* ---------- Exp 04 : texte progressif ---------- */
function ExpText() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const words = splitIntoWords(el);
    gsap.fromTo(
      words,
      { opacity: 0.08 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'bottom 30%', scrub: 0.5 },
      }
    );
  }, []);

  return (
    <p className="exp-text" ref={ref}>
      Les mots apparaissent un à un, au rythme de votre lecture — comme une idée qui
      prend forme progressivement.
    </p>
  );
}

/* ---------- Exp 05 : composition générative ---------- */
const PALETTES = [
  ['#ff4d00', '#e9e4da', 'rgba(139,133,119,0.6)'],
  ['#ff4d00', '#ffb38a', 'rgba(59,59,64,0.7)'],
  ['#e9e4da', '#ff4d00', 'rgba(233,228,218,0.25)'],
  ['#ff7a3e', '#e9e4da', 'rgba(255,77,0,0.45)'],
];

function ExpGenerative() {
  const groupRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const randomize = () => {
    const g = groupRef.current;
    if (!g) return;
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    if (rootRef.current) {
      rootRef.current.style.setProperty('--c1', palette[0]);
      rootRef.current.style.setProperty('--c2', palette[1]);
      rootRef.current.style.setProperty('--c3', palette[2]);
    }
    gsap.to(g, {
      rotation: gsap.utils.random(-50, 50),
      scale: gsap.utils.random(0.82, 1.2),
      duration: 1.3,
      ease: 'power3.out',
      transformOrigin: '50% 50%',
    });
  };

  const petals = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    return {
      cx: 240 + Math.cos(angle) * 120,
      cy: 150 + Math.sin(angle) * 120,
      r: 12 + ((i * 7) % 16),
      i,
    };
  });

  return (
    <div className="exp-gen" ref={rootRef} onClick={randomize} data-cursor="explore">
      <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g ref={groupRef} style={{ transformOrigin: '50% 50%' }}>
          {petals.map((p) => (
            <circle
              key={p.i}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill="none"
              stroke="var(--c1)"
              strokeWidth="1.2"
              opacity={0.35 + ((p.i * 3) % 40) / 100}
            />
          ))}
          <circle cx="240" cy="150" r="46" fill="none" stroke="var(--c2)" strokeWidth="1" />
          <circle cx="240" cy="150" r="22" fill="var(--c1)" />
          <circle
            cx="240"
            cy="150"
            r="86"
            fill="none"
            stroke="var(--c3)"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
        </g>
      </svg>
      <span className="exp-gen__hint">
        Cliquez pour régénérer <Sparkle aria-hidden="true" />
      </span>
    </div>
  );
}

/* ---------- Section ---------- */
export default function Experiments() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.exp-head > *',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.exp-head', start: 'top 85%', once: true },
        }
      );
      gsap.fromTo(
        '.exp',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.exp-grid', start: 'top 82%', once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section exp-sec" id="experimentations" ref={rootRef} aria-label="Expérimentations">
      <div className="container">
        <div className="exp-head">
          <Eyebrow index="04" label="Expérimentations" />
          <div className="exp-head__row">
            <h2 className="display exp-head__title">
              EXPÉRI-
              <br />
              MENTA<span className="text-outline">TIONS</span>
            </h2>
            <p className="exp-head__sub serif-i">Je teste, je détourne, je recommence.</p>
          </div>
        </div>

        <div className="exp-grid">
          <article className="exp exp--a">
            <header className="exp__head">
              <span>Expérience 01 — Typographie vivante</span>
              <span className="exp__num">/01</span>
            </header>
            <div className="exp__body">
              <ExpTypo />
            </div>
          </article>

          <article className="exp exp--b">
            <header className="exp__head">
              <span>Expérience 02 — Grille élastique</span>
              <span className="exp__num">/02</span>
            </header>
            <div className="exp__body">
              <ExpGrid />
            </div>
          </article>

          <article className="exp exp--c">
            <header className="exp__head">
              <span>Expérience 03 — Formes en apesanteur</span>
              <span className="exp__num">/03</span>
            </header>
            <div className="exp__body">
              <ExpOrbs />
            </div>
          </article>

          <article className="exp exp--d">
            <header className="exp__head">
              <span>Expérience 04 — Texte progressif</span>
              <span className="exp__num">/04</span>
            </header>
            <div className="exp__body">
              <ExpText />
            </div>
          </article>

          <article className="exp exp--e">
            <header className="exp__head">
              <span>Expérience 05 — Composition générative</span>
              <span className="exp__num">/05</span>
            </header>
            <div className="exp__body">
              <ExpGenerative />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
