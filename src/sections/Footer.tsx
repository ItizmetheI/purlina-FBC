import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { useLenis } from 'lenis/react';
import { Wordmark, NAV } from '../components/Header';
import { useLang } from '../lib/lang';

export default function Footer() {
  const { t } = useLang();
  const lenis = useLenis();
  return (
    <footer className="relative pt-[calc(60vh+6rem)] pb-12 px-4 md:px-8 z-10 bg-gradient-to-b from-transparent via-[#020617]/70 to-[#020617]">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        {/* asymmetric lead: big statement left, contact block right —
            same text-lane/stage-lane logic the rest of the dive uses,
            instead of everything stacked dead-center */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-20">
          <div className="lg:max-w-xl">
            <Wordmark />
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-[1.05] mt-8">
              {t('Geleceği işleyen kararlı ortam.', 'The Stable Environment Processing the Future.')}
            </h2>
          </div>

          <a
            href="https://alkimpetrokimya.com"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-brand-cyan/50 hover:bg-brand-cyan/10 rounded-full transition-all group shrink-0"
          >
            <Globe className="w-5 h-5 text-brand-cyan group-hover:scale-110 transition-transform" />
            <span className="text-lg font-display text-white tracking-wide">alkimpetrokimya.com</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 w-full border-t border-white/10 pt-12 mb-16 text-left">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-brand-cyan mb-2">
              {t('Site Haritası', 'Site Map')}
            </span>
            {NAV.map((n) => (
              <button
                key={n.id}
                data-cursor="hover"
                onClick={() =>
                  lenis?.scrollTo(`#${n.id}`, { duration: 2, easing: (x: number) => 1 - Math.pow(1 - x, 4) })
                }
                className="text-slate-300 font-light hover:text-brand-cyan transition-colors text-left"
              >
                {t(n.tr, n.en)}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-slate-300 font-light">
            <MapPin className="w-5 h-5 text-brand-cyan mb-1" />
            <p className="max-w-xs">
              Kimya Sanayicileri OSB Melek Aras Bulvarı, Aromatik Cd. No:61, 34956 Aydınlı-KOSB/Tuzla/İstanbul
            </p>
          </div>

          <div className="flex flex-col gap-2 text-slate-300 font-light">
            <Phone className="w-5 h-5 text-brand-cyan mb-1" />
            <p>+90 (216) 593 24 61</p>
            <p>+90 (544) 395 91 66</p>
          </div>

          <div className="flex flex-col gap-2 text-slate-300 font-light">
            <Mail className="w-5 h-5 text-brand-cyan mb-1" />
            <p>info@alkimpetrokimya.com</p>
            <p>satis@alkimpetrokimya.com</p>

            <div className="flex items-center gap-2 mt-2">
              <Linkedin className="w-4 h-4 text-brand-cyan shrink-0" />
              <a href="https://www.linkedin.com/company/alkim-petrokimya" target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan transition-colors">
                /alkim-petrokimya
              </a>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-t border-white/10 pt-8 text-slate-500 text-sm font-light">
          <p>{t(
            "Purlina, ALKİM PETROKİMYA SAN VE TİC. A.Ş'nin tescilli markasıdır.",
            'Purlina is a registered trademark of ALKIM PETROKIMYA SAN VE TIC. A.Ş.'
          )}</p>
        </div>
      </div>
    </footer>
  );
}
