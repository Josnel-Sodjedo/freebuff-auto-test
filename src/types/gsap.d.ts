/**
 * Déclarations minimales pour gsap (le package npm 3.x ne contient pas ses types).
 * Couvre uniquement les API utilisées dans ce projet.
 */
declare module 'gsap' {
  export interface TweenVars {
    [key: string]: unknown;
    duration?: number;
    delay?: number;
    ease?: string | ((...args: number[]) => number);
    stagger?: number | Record<string, unknown>;
    scrollTrigger?: unknown;
    onUpdate?: () => void;
    onComplete?: () => void;
    onStart?: () => void;
  }

  export interface Tween {
    kill(): void;
  }

  export interface Timeline extends Tween {
    to(target: unknown, vars: TweenVars, position?: number | string): Timeline;
    fromTo(target: unknown, from: TweenVars, to: TweenVars, position?: number | string): Timeline;
    set(target: unknown, vars: TweenVars, position?: number | string): Timeline;
  }

  export interface Context {
    revert(): void;
  }

  export type QuickToFunc = (value: number) => void;

  interface Gsap {
    registerPlugin(...plugins: unknown[]): void;
    to(target: unknown, vars: TweenVars): Tween;
    fromTo(target: unknown, from: TweenVars, to: TweenVars): Tween;
    set(target: unknown, vars: TweenVars): Tween;
    quickTo(target: unknown, property: string, vars?: TweenVars): QuickToFunc;
    timeline(vars?: TweenVars): Timeline;
    context(func: () => void, scope?: unknown): Context;
    matchMedia(): { add(query: string, func: () => void): void };
    utils: {
      toArray<T = unknown>(selector: unknown): T[];
      random(min: number, max: number): number;
    };
    ticker: {
      add(callback: (time: number) => void): void;
      remove(callback: (time: number) => void): void;
      lagSmoothing(value: number): void;
    };
  }

  const gsap: Gsap;
  export default gsap;
}

declare module 'gsap/ScrollTrigger' {
  export class ScrollTrigger {
    static update(): void;
    static refresh(): void;
    static killAll(): void;
    static config(vars: Record<string, unknown>): void;
  }
  export default ScrollTrigger;
}
