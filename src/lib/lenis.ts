import type Lenis from 'lenis';

/**
 * Registre global de l'instance Lenis, pour permettre un scroll fluide
 * depuis n'importe quel composant (navigation, ancres, retour en haut).
 */
let lenisInstance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  lenisInstance = lenis;
};

export const getLenis = () => lenisInstance;

export const scrollTo = (target: string | number, offset = 0) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset, duration: 1.5 });
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
};

export const stopScroll = () => lenisInstance?.stop();
export const startScroll = () => lenisInstance?.start();
