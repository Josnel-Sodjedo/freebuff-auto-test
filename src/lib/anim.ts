/**
 * Utilitaires d'animation partagés.
 */

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches;

/**
 * Découpe le texte d'un élément en spans `.word` (en préservant les espaces).
 * Retourne la liste des spans créés.
 */
export function splitIntoWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  el.textContent = '';
  const words = text.split(/\s+/).filter(Boolean);
  const frag = document.createDocumentFragment();
  const spans: HTMLElement[] = [];
  words.forEach((word, i) => {
    if (i > 0) frag.appendChild(document.createTextNode(' '));
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = word;
    frag.appendChild(span);
    spans.push(span);
  });
  el.appendChild(frag);
  return spans;
}

/** Formate un nombre sur deux chiffres ("08"). */
export const pad2 = (n: number): string => String(n).padStart(2, '0');
