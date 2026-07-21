import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { animate, stagger } from 'animejs';
import { Menu, X } from 'lucide-react';
import { useLang } from '../lib/lang';
import { dive } from '../utils/dive';
import ScrollHint from './ScrollHint';

// Typographic wordmark — single swap point for the real ALKİM logo later.
export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${compact ? 'w-7 h-7' : 'w-10 h-10'} relative flex items-center justify-center`}>
        <div className="absolute inset-0 border border-brand-cyan/60 rotate-45" />
        <div className="absolute inset-[3px] border border-white/20 rotate-45" />
        <span className="font-display font-bold text-white relative z-10 text-sm">A</span>
      </div>
      <div className="text-left leading-tight">
        <span className="block font-display font-bold text-white tracking-[0.25em] text-sm">ALKİM</span>
        {!compact && (
          <span className="block text-[8px] text-brand-cyan tracking-[0.3em] uppercase">Petrokimya San. ve Tic. A.Ş.</span>
        )}
      </div>
    </div>
  );
}

// Brochure TOC — the 7 anchored sections. Shared with Footer's site map.
export const NAV = [
  { id: 'toc-vision', act: 2, tr: 'Kurumsal Vizyon', en: 'Corporate Vision' },
  { id: 'toc-thermal', act: 3, tr: 'Isı Yönetimi', en: 'Thermal' },
  { id: 'toc-technology', act: 4, tr: 'Immersion Cooling', en: 'Immersion Cooling' },
  { id: 'toc-core', act: 5, tr: 'MATRIX CORE', en: 'MATRIX CORE' },
  { id: 'toc-series', act: 6, tr: 'X Serisi', en: 'X Series' },
  { id: 'toc-advantages', act: 8, tr: 'Avantajlar', en: 'Advantages' },
  { id: 'toc-applications', act: 8, tr: 'Kullanım Alanları', en: 'Applications' },
] as const;

const EASE = (x: number) => 1 - Math.pow(1 - x, 4);

// dive is a plain object, not reactive — poll for the active anchor.
function useActiveAnchor() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const id = setInterval(() => {
      setActive(
        dive.act === 8
          ? dive.actProgress > 0.55
            ? 'toc-applications'
            : 'toc-advantages'
          : NAV.find((n) => n.act === dive.act)?.id ?? ''
      );
    }, 300);
    return () => clearInterval(id);
  }, []);
  return active;
}

export default function Header() {
  const { lang, setLang, t } = useLang();
  const lenis = useLenis();
  const active = useActiveAnchor();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const goTo = (id: string) => {
    setOpen(false);
    lenis?.scrollTo(`#${id}`, { duration: 2, easing: EASE });
  };

  // stagger-in of nav items on load
  useEffect(() => {
    animate('[data-nav-item]', {
      opacity: [0, 1],
      translateY: [-10, 0],
      delay: stagger(60, { start: 300 }),
      duration: 600,
      ease: 'outCubic',
    });
  }, []);

  // hover micro-motion
  const nudge = (e: React.MouseEvent<HTMLElement>) => {
    animate(e.currentTarget, { translateY: [0, -2, 0], duration: 350, ease: 'outQuad' });
  };

  // close compact menu on outside click
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 md:px-10 py-4 pointer-events-auto bg-gradient-to-b from-[#020617]/90 via-[#020617]/40 to-transparent">
        <Wordmark compact />

        {/* desktop nav — the 7 brochure sections */}
        <nav className="hidden xl:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {NAV.map((n) => (
            <button
              key={n.id}
              data-nav-item
              data-cursor="hover"
              onClick={() => goTo(n.id)}
              onMouseEnter={nudge}
              className={`relative font-mono text-[10px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 pb-1 ${
                active === n.id ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(n.tr, n.en)}
              <span
                className={`absolute left-0 -bottom-0.5 h-px bg-brand-cyan transition-all duration-500 ${
                  active === n.id ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* TR / EN toggle */}
          <div className="flex items-center font-mono text-[11px] tracking-widest border border-white/15 rounded-full overflow-hidden backdrop-blur-md bg-[#020617]/50">
            {(['tr', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                data-cursor="hover"
                className={`px-3.5 py-1.5 uppercase transition-colors ${
                  lang === l ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={() => lenis?.scrollTo(document.body.scrollHeight, { duration: 2 })}
            data-cursor="hover"
            className="hidden md:block font-mono text-[11px] tracking-widest uppercase px-4 py-1.5 border border-white/15 rounded-full text-slate-300 hover:text-white hover:border-brand-cyan/50 transition-colors backdrop-blur-md bg-[#020617]/50"
          >
            {t('İletişim', 'Contact')}
          </button>

          {/* compact menu below xl */}
          <div className="relative xl:hidden" ref={menuRef}>
            <button
              onClick={() => setOpen((o) => !o)}
              data-cursor="hover"
              className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase px-4 py-1.5 border border-white/15 rounded-full text-slate-300 hover:text-white hover:border-brand-cyan/50 transition-colors backdrop-blur-md bg-[#020617]/50"
            >
              {open ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              {t('Menü', 'Menu')}
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 min-w-56 flex flex-col py-2 rounded-xl border border-white/10 bg-[#020617]/95 backdrop-blur-md shadow-2xl">
                {NAV.map((n) => (
                  <button
                    key={n.id}
                    data-cursor="hover"
                    onClick={() => goTo(n.id)}
                    className={`px-5 py-2.5 text-left font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                      active === n.id ? 'text-brand-cyan' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t(n.tr, n.en)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <ScrollHint />
    </>
  );
}
