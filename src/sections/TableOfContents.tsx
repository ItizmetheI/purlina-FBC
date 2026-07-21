import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { useLang } from '../lib/lang';

export default function TableOfContents() {
  const lenis = useLenis();
  const { t } = useLang();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  // dive itinerary — page numbers replaced with target depths
  const items = [
    { tr: 'Kurumsal Vizyon & Alkim Petrokimya', en: 'Corporate Vision & Alkim Petrokimya', depth: '-05 M', target: '#toc-vision' },
    { tr: 'Yeni Nesil Isı Yönetimi', en: 'Next-Generation Thermal Management', depth: '-10 M', target: '#toc-thermal' },
    { tr: 'Immersion Cooling Teknolojisi', en: 'Immersion Cooling Technology', depth: '-16 M', target: '#toc-technology' },
    { tr: 'PURLINA MATRIX CORE', en: 'PURLINA MATRIX CORE', depth: '-24 M', target: '#toc-core' },
    { tr: 'PURLINA MATRIX CORE X Serisi', en: 'PURLINA MATRIX CORE X Series', depth: '-30 M', target: '#toc-series' },
    { tr: 'PURLINA MATRIX CORE Avantajları', en: 'Advantages of PURLINA MATRIX CORE', depth: '-36 M', target: '#toc-advantages' },
    { tr: 'PURLINA MATRIX CORE Kullanım Alanları', en: 'Applications of PURLINA MATRIX CORE', depth: '-38 M', target: '#toc-applications' },
  ];

  return (
    <section className="relative min-h-screen py-32 flex items-center px-4 md:px-12 z-10 pointer-events-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto lg:pl-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="flex flex-col gap-12"
        >
          <div>
            <motion.div variants={itemVariants} className="flex items-baseline gap-4 mb-4">
              <span className="kicker">02</span>
              <span className="kicker text-slate-500">/</span>
              <span className="kicker">{t('DALIŞ PLANI', 'DIVE ITINERARY')}</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight">
              {t('İçindekiler', 'Table of Contents')}
            </motion.h2>
            <motion.div variants={itemVariants} className="rule mt-8"></motion.div>
          </div>

          <div className="flex flex-col gap-8">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                role="button"
                tabIndex={0}
                onClick={() => lenis?.scrollTo(item.target, { duration: 2.2, easing: (x: number) => 1 - Math.pow(1 - x, 4) })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    lenis?.scrollTo(item.target, { duration: 2.2, easing: (x: number) => 1 - Math.pow(1 - x, 4) });
                  }
                }}
                className="flex justify-between items-end border-b border-white/10 pb-4 group gap-2 cursor-pointer transition-transform duration-300 hover:translate-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60 rounded-sm"
                data-cursor="hover"
              >
                <h4 className="text-xl md:text-2xl text-white font-medium group-hover:text-brand-cyan transition-colors max-w-[85%]">
                  {t(item.tr, item.en)}
                </h4>
                <div className="text-lg md:text-xl text-slate-500 font-mono font-light group-hover:text-brand-cyan transition-colors whitespace-nowrap">
                  {item.depth}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
