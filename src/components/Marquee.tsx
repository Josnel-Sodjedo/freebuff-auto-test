import type { CSSProperties } from 'react';
import { Sparkle } from 'lucide-react';

interface MarqueeProps {
  items: string[];
  duration?: number;
  reverse?: boolean;
}

/** Bande défilante infinie (aria-hidden, purement décorative). */
export default function Marquee({ items, duration = 28, reverse = false }: MarqueeProps) {
  const content = [...items, ...items];
  return (
    <div
      className={`marquee marquee--pause ${reverse ? 'marquee--reverse' : ''}`}
      style={{ '--marquee-dur': `${duration}s` } as CSSProperties}
      aria-hidden="true"
    >
      <div className="marquee__track">
        {content.map((item, i) => (
          <span key={i} className="marquee__item">
            {item}
            <span className="marquee__star">
              <Sparkle aria-hidden="true" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
