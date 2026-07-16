import { useLenis } from 'lenis/react';
import { useLang } from '../lib/lang';

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

export default function Header() {
  const { lang, setLang, t } = useLang();
  const lenis = useLenis();

  return (
    <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 md:px-10 py-4 pointer-events-auto bg-gradient-to-b from-[#020617]/90 via-[#020617]/40 to-transparent">
      <Wordmark compact />

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
      </div>
    </header>
  );
}
