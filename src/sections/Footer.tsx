import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-12 px-4 md:px-8 z-10 bg-[#020617]">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-display font-light text-blue-500 italic mb-2">
          Geleceği işleyen kararlı ortam.
        </h2>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-16">
          The Stable Environment Processing the Future.
        </h2>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/20 rotate-45 transform border border-blue-500/50"></div>
            <span className="font-display font-bold text-white relative z-10 text-xl">A</span>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-display font-bold text-white tracking-wider">ALKİM</h2>
            <p className="text-xs text-blue-500 tracking-[0.2em] uppercase">Petrokimya San. ve Tic. A.Ş.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full mt-8 border-t border-white/10 pt-16 mb-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 text-slate-300 font-light">
            <MapPin className="w-6 h-6 text-blue-500" />
            <p className="max-w-xs">
              Kimya Sanayicileri OSB Melek Aras Bulvarı, Aromatik Cd. No:61, 34956 Aydınlı-KOSB/Tuzla/İstanbul
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 text-slate-300 font-light">
            <Phone className="w-6 h-6 text-blue-500" />
            <p>+90 (216) 593 24 61</p>
            <p>+90 (544) 395 91 66</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 text-slate-300 font-light">
            <Mail className="w-6 h-6 text-blue-500" />
            <p>info@alkimpetrokimya.com</p>
            <p>satis@alkimpetrokimya.com</p>
            
            <div className="flex items-center gap-2 mt-2">
              <Linkedin className="w-5 h-5 text-blue-500" />
              <a href="https://www.linkedin.com/company/alkim-petrokimya" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                /alkim-petrokimya
              </a>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center text-center gap-6 border-t border-white/10 pt-16">
          <div className="flex flex-col gap-2">
            <p className="text-lg text-blue-500 italic font-light">
              Ürünlerimiz ve hizmetlerimiz hakkında daha fazla bilgi için lütfen web sitemizi ziyaret edin:
            </p>
            <p className="text-lg text-white font-light">
              For more information about our products and services, please visit our website:
            </p>
          </div>
          
          <a 
            href="https://alkimpetrokimya.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 rounded-full transition-all group mt-4"
          >
            <Globe className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-display text-white tracking-wide">alkimpetrokimya.com</span>
          </a>
        </div>

        <div className="mt-24 w-full flex flex-col items-center text-center gap-2 border-t border-white/10 pt-8 text-slate-500 text-sm font-light italic">
          <p>Purlina, ALKİM PETROKİMYA SAN VE TİC. A.Ş'nin tescilli markasıdır.</p>
          <p>Purlina is a registered trademark of ALKIM PETROKIMYA SAN VE TIC. A.Ş.</p>
        </div>
      </div>
    </footer>
  );
}
