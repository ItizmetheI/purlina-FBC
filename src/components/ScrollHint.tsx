import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { ChevronDown } from 'lucide-react';
import { useLang } from '../lib/lang';

// First-load orientation cue — fades out permanently after the first scroll.
export default function ScrollHint() {
  const { t } = useLang();
  const [phase, setPhase] = useState<'visible' | 'leaving' | 'gone'>('visible');
  const chevRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chevRef.current) return;
    const anim = animate(chevRef.current, {
      translateY: [0, 10],
      opacity: [1, 0.25],
      duration: 1000,
      loop: true,
      alternate: true,
      ease: 'inOutQuad',
    });
    return () => {
      anim.pause();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setPhase('leaving');
    window.addEventListener('scroll', onScroll, { once: true, passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (phase !== 'leaving') return;
    const timer = setTimeout(() => setPhase('gone'), 700);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`fixed bottom-8 inset-x-0 z-40 flex flex-col items-center gap-2.5 pointer-events-none select-none transition-opacity duration-700 ${
        phase === 'leaving' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden
    >
      <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-slate-400">
        {t('Keşfetmek için kaydırın', 'Scroll to explore')}
      </span>
      <div ref={chevRef} className="flex flex-col items-center">
        <span className="block w-px h-7 bg-gradient-to-b from-transparent to-brand-cyan/70" />
        <ChevronDown className="w-4 h-4 text-brand-cyan -mt-1.5" />
      </div>
    </div>
  );
}
