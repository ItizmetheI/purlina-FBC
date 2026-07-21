import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { dive, ACTS } from '../utils/dive';
import { useLang } from '../lib/lang';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const RAIL = [
  { en: 'SURFACE', tr: 'YÜZEY' },
  { en: 'BREACH', tr: 'DALIŞ' },
  { en: 'DESCENT', tr: 'İNİŞ' },
  { en: 'THE PROBLEM', tr: 'SORUN' },
  { en: 'THE SOLUTION', tr: 'ÇÖZÜM' },
  { en: 'CONTACT', tr: 'TEMAS' },
  { en: 'PROOF', tr: 'KANIT' },
  { en: 'PROTOCOL', tr: 'PROTOKOL' },
  { en: 'STABLE', tr: 'KARARLI' },
  { en: 'SEALED', tr: 'MÜHÜR' },
];

export default function ActRail() {
  const [act, setAct] = useState(0);
  const { t } = useLang();
  const lenis = useLenis();

  useEffect(() => {
    let raf: number;
    const tick = () => {
      setAct((a) => (a !== dive.act ? dive.act : a));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <TooltipProvider delayDuration={150}>
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2.5 pointer-events-auto select-none">
        {RAIL.map((item, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <button
                data-cursor="hover"
                onClick={() => {
                  const el = document.querySelector(`[data-act="${i}"]`) as HTMLElement | null;
                  if (el && lenis) lenis.scrollTo(el, { duration: 2, easing: (x: number) => 1 - Math.pow(1 - x, 4) });
                }}
                className={`flex items-center gap-2.5 font-mono text-[10px] tracking-[0.25em] uppercase text-left transition-colors duration-500 ${
                  act === i ? 'text-white' : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 transition-all duration-500 ${
                    act === i ? 'bg-brand-cyan scale-125 shadow-[0_0_8px_rgba(59,109,246,0.8)]' : 'bg-slate-700'
                  }`}
                />
                {t(item.tr, item.en)}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={10}
              className="font-mono tracking-[0.15em] uppercase border border-white/10 bg-[#020617]/95 text-white"
            >
              <span className="text-brand-cyan">{t(item.tr, item.en)}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">
                {ACTS[i].d0}–{ACTS[i].d1} m
              </span>
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  );
}
