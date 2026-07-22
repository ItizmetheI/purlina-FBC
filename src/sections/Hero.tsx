import { motion } from 'framer-motion';
import Magnetic from '../components/Magnetic';
import { useLenis } from 'lenis/react';
import { useLang } from '../lib/lang';

const ease = [0.16, 1, 0.3, 1] as const;

// the hero headline is the first three seconds of the entire site — it
// deserves more craft than the section headers that follow it, not less.
// each word resolves in from a blur/scale independently, staggered, instead
// of the whole line moving as one flat block.
const HERO_WORDS = ['PURLINA', 'MATRIX', 'CORE'];

function HeroWord({ word, i }: { word: string; i: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 50, scale: 1.08, filter: 'blur(14px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.1, delay: 0.35 + i * 0.14, ease }}
      className="inline-block mr-[0.22em]"
    >
      {word}
    </motion.span>
  );
}

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
          <span className="kicker kicker-glow">01</span>
          <span className="kicker text-slate-400">/</span>
          <span className="kicker kicker-glow">
            {t('YAPAY ZEKÂ VERİ MERKEZLERİ İÇİN DIELECTRIC IMMERSION SOĞUTMA PLATFORMU', 'DIELECTRIC IMMERSION COOLING PLATFORM FOR AI DATA CENTERS')}
          </span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-display font-bold text-white tracking-tighter leading-[0.9] mb-10">
          <span className="block"><HeroWord word={HERO_WORDS[0]} i={0} /></span>
          <span className="block">
            <HeroWord word={HERO_WORDS[1]} i={1} />
            <HeroWord word={HERO_WORDS[2]} i={2} />
          </span>
        </h1>

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
            <button onClick={handleExploreClick} data-cursor="primary" className="group relative px-8 py-4 border border-brand-ember/50 rounded-full overflow-hidden transition-colors hover:border-brand-ember shadow-[0_0_30px_rgba(246,162,59,0.15)] hover:shadow-[0_0_40px_rgba(246,162,59,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]">
              <div className="absolute inset-0 bg-brand-ember/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 text-white font-mono tracking-widest text-xs uppercase flex items-center gap-4">
                {t('Dalışı Başlat', 'Begin the Dive')}
                <div className="w-1.5 h-1.5 bg-brand-ember rounded-full animate-pulse"></div>
              </span>
            </button>
          </Magnetic>
        </motion.div>
      </div>
      {/* scroll cue lives in the shared ScrollHint component (mounted via Header) */}
    </section>
  );
}
