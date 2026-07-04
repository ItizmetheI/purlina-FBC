import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from '../components/Magnetic';
import { useLenis } from 'lenis/react';

export default function Hero() {
  const { scrollY } = useScroll();
  const lenis = useLenis();

  const handleExploreClick = () => {
    if (lenis) {
      lenis.scrollTo('#evolution', { offset: 0, duration: 1.2 });
    } else {
      document.getElementById('evolution')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.9]);

  return (
    <motion.section 
      style={{ opacity, y, scale }}
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 md:px-8 z-10 overflow-hidden bg-transparent pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col items-start md:items-start text-left pointer-events-auto md:ml-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-6 mb-8 px-6 py-2 glass-panel rounded-full relative" data-cursor="hover">
            <div className="w-6 h-6 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-red-500/20 rotate-45 transform border border-red-500/50 backdrop-blur-sm"></div>
              <div className="absolute inset-1.5 bg-white/50 rotate-45 transform border border-white/20 backdrop-blur-sm"></div>
            </div>
            <div className="text-left leading-tight z-10">
              <h2 className="text-sm font-display font-bold text-white tracking-[0.2em] uppercase">ALKIM</h2>
              <p className="text-[8px] text-brand-cyan tracking-[0.3em] uppercase">Petrokimya San. ve Tic. A.Ş.</p>
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-display font-normal text-white tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl"
        >
          PURLINA <br />
          <span className="font-bold text-white">MATRIX CORE</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 drop-shadow-lg max-w-xl"
        >
          <p className="text-lg md:text-2xl text-white font-medium mb-1 drop-shadow-md">
            Yapay Zekâ Veri Merkezleri İçin
          </p>
          <p className="text-lg md:text-2xl text-white font-medium mb-4 drop-shadow-md">
            Dielectric Immersion Soğutma Platformu
          </p>
          <p className="text-sm md:text-base text-slate-300 font-light mb-1 drop-shadow-md italic">
            Dielectric Immersion Cooling Platform for Artificial Intelligence Data Centers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto"
        >
          <Magnetic strength={0.4}>
            <button onClick={handleExploreClick} data-cursor="hover" className="group relative px-8 py-4 bg-white/5 border border-white/20 rounded-full overflow-hidden transition-colors hover:bg-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/20 to-blue-500/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]"></div>
              <span className="relative z-10 text-white font-mono tracking-widest text-xs uppercase flex items-center gap-4">
                Explore the Evolution
                <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse"></div>
              </span>
            </button>
          </Magnetic>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="border-l-4 border-white pl-6 mt-16"
        >
          <h2 className="text-4xl md:text-5xl text-white font-display font-medium mb-2">Geleceği İşleyen</h2>
          <h2 className="text-4xl md:text-5xl text-white font-display font-medium mb-4">Termal Devrim!</h2>
          <p className="text-lg text-slate-300 font-light italic">The Thermal Revolution Shaping the Future!</p>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-auto"
      >
        <span className="text-[10px] text-white/50 font-mono tracking-[0.3em] uppercase drop-shadow-md">Scroll to explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent"></div>
      </motion.div>
    </motion.section>
  );
}
