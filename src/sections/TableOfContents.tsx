import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';

export default function TableOfContents() {
  const lenis = useLenis();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const items = [
    { text: "Kurumsal Vizyon & Alkim Petrokimya / Corporate Vision & Alkim Petrokimya", page: "04", target: "#toc-vision" },
    { text: "Yeni Nesil Isı Yönetimi / Next-Generation Thermal Management", page: "06", target: "#toc-thermal" },
    { text: "Immersion Cooling Teknolojisi / Immersion Cooling Technology", page: "09", target: "#toc-technology" },
    { text: "PURLINA MATRIX CORE / PURLINA MATRIX CORE", page: "10", target: "#toc-core" },
    { text: "PURLINA MATRIX CORE X Serisi / PURLINA MATRIX CORE X Series", page: "12", target: "#toc-series" },
    { text: "PURLINA MATRIX CORE Avantajları / Advantages of PURLINA MATRIX CORE", page: "16", target: "#toc-advantages" },
    { text: "PURLINA MATRIX CORE Kullanım Alanları / Applications of PURLINA MATRIX CORE", page: "17", target: "#toc-advantages" }
  ];

  return (
    <section className="relative min-h-screen py-32 flex items-center px-4 md:px-12 z-10 pointer-events-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="flex flex-col gap-12"
        >
          <div className="mb-8">
            <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight mb-2">
              İçindekiler
            </motion.h2>
            <motion.h3 variants={itemVariants} className="text-2xl md:text-4xl text-blue-500 font-display font-light">
              Table of Contents
            </motion.h3>
            <motion.div variants={itemVariants} className="h-1 w-full bg-blue-600 mt-6"></motion.div>
          </div>
          
          <div className="flex flex-col gap-8">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                onClick={() => lenis?.scrollTo(item.target, { duration: 2.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) })}
                className="flex justify-between items-end border-b border-white/10 pb-4 group gap-2 cursor-pointer transition-transform duration-300 hover:translate-x-2"
                data-cursor="link"
              >
                <h4 className="text-xl md:text-2xl text-white font-medium group-hover:text-blue-400 transition-colors max-w-[85%]">{item.text}</h4>
                <div className="text-2xl md:text-3xl text-slate-500 font-mono font-light group-hover:text-brand-cyan transition-colors">{item.page}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
