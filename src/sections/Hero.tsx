import { motion } from 'framer-motion';
import Magnetic from '../components/Magnetic';
import { useLenis } from 'lenis/react';
import { useLang } from '../lib/lang';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const lenis = useLenis();
  const { t } = useLang();

  const handleExploreClick = () => {
    if (lenis) {
      lenis.scrollTo('#evolution', { offset: 0, duration: 1.2 });
    } else {
      document.getElementById('evolution')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-32 px-4 md:px-12 z-10 overflow-hidden bg-transparent pointer-events-none">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto lg:pl-24">

        {/* kicker — same voice as every section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease }}
          className="flex items-baseline gap-4 mb-8"
        >
          <span className="kicker">01</span>
          <span className="kicker text-slate-500">/</span>
          <span className="kicker">
            {t('YAPAY ZEKÂ VERİ MERKEZLERİ İÇİN DIELECTRIC IMMERSION SOĞUTMA PLATFORMU', 'DIELECTRIC IMMERSION COOLING PLATFORM FOR AI DATA CENTERS')}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease }}
          className="text-6xl md:text-8xl lg:text-[9rem] font-display font-bold text-white tracking-tighter leading-[0.9] mb-10"
        >
          PURLINA <br />
          MATRIX CORE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease }}
          className="text-xl md:text-2xl text-slate-300 font-light max-w-xl leading-relaxed mb-12"
        >
          {t('Geleceği İşleyen Termal Devrim!', 'The Thermal Revolution Shaping the Future!')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease }}
        >
          <Magnetic strength={0.4}>
            <button onClick={handleExploreClick} data-cursor="hover" className="group relative px-8 py-4 border border-white/20 rounded-full overflow-hidden transition-colors hover:border-brand-cyan/60">
              <div className="absolute inset-0 bg-brand-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 text-white font-mono tracking-widest text-xs uppercase flex items-center gap-4">
                {t('Dalışı Başlat', 'Begin the Dive')}
                <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse"></div>
              </span>
            </button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto"
      >
        <span className="text-[10px] text-white/50 font-mono tracking-[0.3em] uppercase">
          {t('KEŞFETMEK İÇİN KAYDIR', 'SCROLL TO EXPLORE')}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
      </motion.div>
    </section>
  );
}
