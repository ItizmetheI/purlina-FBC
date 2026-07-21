import { useEffect, useRef } from 'react';
import { usePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { prefersReducedMotion } from '../lib/interaction';

const LETTERS = 'PURLINA'.split('');

// Immersion loader: an outlined server blade fills with dielectric fluid
// from the bottom while the wordmark staggers in. animejs drives everything;
// exit (fluid drains, frame lifts) is coordinated with AnimatePresence via usePresence.
export default function Loader() {
  const [isPresent, safeToRemove] = usePresence();
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  // intro
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const fluid = root.querySelector('[data-fluid]');
    const letters = root.querySelectorAll('[data-letter]');
    const bar = root.querySelector('[data-bar]');

    if (fluid) animate(fluid, { translateY: [148, 22], duration: 2400, ease: 'inOutQuad' });
    if (bar) animate(bar, { width: ['0%', '100%'], duration: 2400, ease: 'inOutQuad' });
    animate(letters, {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: stagger(60, { start: 300 }),
      duration: 700,
      ease: 'outExpo',
    });
    root.querySelectorAll('[data-bubble]').forEach((b, i) => {
      animate(b, {
        translateY: [0, -95],
        opacity: [0.65, 0],
        duration: 1600,
        delay: 500 + i * 750,
        loop: true,
        ease: 'outSine',
      });
    });
  }, [reduced]);

  // exit: drain the fluid down while the whole frame lifts and blurs out
  useEffect(() => {
    if (isPresent) return;
    const root = rootRef.current;
    const done = () => safeToRemove && safeToRemove();
    if (!root || reduced) {
      done();
      return;
    }
    const fluid = root.querySelector('[data-fluid]');
    if (fluid) animate(fluid, { translateY: 170, duration: 550, ease: 'inQuad' });
    animate(root, {
      opacity: [1, 0],
      translateY: [0, -24],
      filter: ['blur(0px)', 'blur(10px)'],
      duration: 700,
      ease: 'outQuad',
      onComplete: done,
    });
  }, [isPresent, reduced, safeToRemove]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617] bg-grid"
    >
      {/* Server-blade tank filling with fluid */}
      <svg width="96" height="128" viewBox="0 0 120 160" fill="none" aria-hidden className="mb-8">
        <defs>
          <clipPath id="blade-clip">
            <rect x="31" y="9" width="58" height="142" rx="4" />
          </clipPath>
          <linearGradient id="fluid-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B6DF6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3B6DF6" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <g clipPath="url(#blade-clip)">
          <rect
            data-fluid
            x="31"
            y="9"
            width="58"
            height="142"
            fill="url(#fluid-grad)"
            style={{ transform: reduced ? 'translateY(36px)' : 'translateY(148px)' }}
          />
          <circle data-bubble cx="50" cy="145" r="2.5" fill="#3B6DF6" opacity={reduced ? 0 : 0.65} />
          <circle data-bubble cx="70" cy="148" r="1.8" fill="#3B6DF6" opacity={reduced ? 0 : 0.65} />
        </g>
        {/* blade outline + slot detail */}
        <rect x="28" y="6" width="64" height="148" rx="6" stroke="rgba(148,163,184,0.6)" strokeWidth="1.5" />
        {[40, 70, 100, 130].map((y) => (
          <line key={y} x1="36" y1={y} x2="84" y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        ))}
        <line x1="36" y1="20" x2="60" y2="20" stroke="#3B6DF6" strokeWidth="1.5" opacity="0.8" />
      </svg>

      {/* Wordmark */}
      <div className="flex gap-[0.35em] text-white font-sans font-semibold text-2xl tracking-[0.3em]" aria-label="PURLINA">
        {LETTERS.map((l, i) => (
          <span key={i} data-letter style={{ opacity: reduced ? 1 : 0 }} className="inline-block">
            {l}
          </span>
        ))}
      </div>
      <div
        data-letter
        style={{ opacity: reduced ? 1 : 0 }}
        className="mt-3 text-brand-cyan font-mono text-[10px] tracking-[0.5em] uppercase"
      >
        Initializing Matrix Core
      </div>

      {/* Progress line */}
      <div className="mt-6 w-[200px] h-[1px] bg-white/10 overflow-hidden">
        <div
          data-bar
          className="h-full bg-gradient-to-r from-transparent via-brand-cyan to-brand-cyan"
          style={{ width: reduced ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}
