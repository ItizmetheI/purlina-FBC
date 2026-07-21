import { animate } from 'animejs';

// Motion Bible for Purlina Story World
export const MotionBible = {
  duration: {
    base: 0.8,
    slow: 1.5,
    fast: 0.4,
    cinematic: 2.0
  },
  easing: {
    // Custom easing curves for premium feel
    cinematic: [0.16, 1, 0.3, 1] as const,
    elastic: [0.34, 1.56, 0.64, 1] as const,
    smooth: [0.25, 1, 0.5, 1] as const,
  }
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Small reusable animejs helpers — safe no-ops under reduced motion.

/** Quick tactile press: subtle scale dip and settle. Call on pointerdown/click. */
export function pressFeedback(el: Element) {
  if (prefersReducedMotion()) return;
  animate(el, {
    scale: [
      { to: 0.96, duration: 90, ease: 'outQuad' },
      { to: 1, duration: 220, ease: 'outElastic(1, .6)' },
    ],
  });
}

/** Fade-and-rise entrance for any element. */
export function floatIn(el: Element, delay = 0) {
  if (prefersReducedMotion()) return;
  animate(el, {
    opacity: [0, 1],
    translateY: [16, 0],
    duration: MotionBible.duration.base * 1000,
    delay,
    ease: 'outExpo',
  });
}
