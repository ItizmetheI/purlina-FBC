import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { dive } from '../utils/dive';
import { useLang } from '../lib/lang';

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
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2.5 pointer-events-auto select-none">
      {RAIL.map((item, i) => (
        <button
          key={i}
          data-cursor="hover"
          onClick={() => {
            const el = document.querySelector(`[data-act="${i}"]`) as HTMLElement | null;
            if (el && lenis) lenis.scrollTo(el, { duration: 2, easing: (x: number) => 1 - Math.pow(1 - x, 4) });
          }}
          className={`flex items-center gap-2.5 font-mono text-[10px] tracking-[0.25em] uppercase text-left transition-colors duration-500 ${
            act === i ? 'text-white' : 'text-slate-600 hover:text-slate-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 transition-all duration-500 ${act === i ? 'bg-brand-cyan' : 'bg-slate-700'}`} />
          {t(item.tr, item.en)}
        </button>
      ))}
    </nav>
  );
}
