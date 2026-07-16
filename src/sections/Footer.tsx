import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { Wordmark } from '../components/Header';
import { useLang } from '../lib/lang';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative pt-[60vh] pb-12 px-4 md:px-8 z-10 bg-gradient-to-b from-transparent via-[#020617]/70 to-[#020617]">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-16">
          {t('Geleceği işleyen kararlı ortam.', 'The Stable Environment Processing the Future.')}
        </h2>

        <div className="mb-8">
          <Wordmark />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full mt-8 border-t border-white/10 pt-16 mb-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 text-slate-300 font-light">
            <MapPin className="w-6 h-6 text-brand-cyan" />
            <p className="max-w-xs">
              Kimya Sanayicileri OSB Melek Aras Bulvarı, Aromatik Cd. No:61, 34956 Aydınlı-KOSB/Tuzla/İstanbul
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 text-slate-300 font-light">
            <Phone className="w-6 h-6 text-brand-cyan" />
            <p>+90 (216) 593 24 61</p>
            <p>+90 (544) 395 91 66</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 text-slate-300 font-light">
            <Mail className="w-6 h-6 text-brand-cyan" />
            <p>info@alkimpetrokimya.com</p>
            <p>satis@alkimpetrokimya.com</p>
            
            <div className="flex items-center gap-2 mt-2">
              <Linkedin className="w-5 h-5 text-brand-cyan" />
              <a href="https://www.linkedin.com/company/alkim-petrokimya" target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan transition-colors">
                /alkim-petrokimya
              </a>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center text-center gap-6 border-t border-white/10 pt-16">
          <p className="text-lg text-white font-light">
            {t(
              'Ürünlerimiz ve hizmetlerimiz hakkında daha fazla bilgi için lütfen web sitemizi ziyaret edin:',
              'For more information about our products and services, please visit our website:'
            )}
          </p>
          
          <a 
            href="https://alkimpetrokimya.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-brand-cyan/50 hover:bg-brand-cyan/10 rounded-full transition-all group mt-4"
          >
            <Globe className="w-6 h-6 text-brand-cyan group-hover:scale-110 transition-transform" />
            <span className="text-xl font-display text-white tracking-wide">alkimpetrokimya.com</span>
          </a>
        </div>

        <div className="mt-24 w-full flex flex-col items-center text-center gap-2 border-t border-white/10 pt-8 text-slate-500 text-sm font-light">
          <p>{t(
            "Purlina, ALKİM PETROKİMYA SAN VE TİC. A.Ş'nin tescilli markasıdır.",
            'Purlina is a registered trademark of ALKIM PETROKIMYA SAN VE TIC. A.Ş.'
          )}</p>
        </div>
      </div>
    </footer>
  );
}
