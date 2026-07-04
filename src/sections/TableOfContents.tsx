import { motion } from 'framer-motion';

export default function TableOfContents() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const items = [
    { text: "Kurumsal Vizyon & Alkim Petrokimya / Corporate Vision & Alkim Petrokimya", page: "04" },
    { text: "Yeni Nesil Isı Yönetimi / Next-Generation Thermal Management", page: "06" },
    { text: "Immersion Cooling Teknolojisi / Immersion Cooling Technology", page: "09" },
    { text: "PURLINA MATRIX CORE / PURLINA MATRIX CORE", page: "10" },
    { text: "PURLINA MATRIX CORE X Serisi / PURLINA MATRIX CORE X Series", page: "12" },
    { text: "PURLINA MATRIX CORE Avantajları / Advantages of PURLINA MATRIX CORE", page: "16" },
    { text: "PURLINA MATRIX CORE Kullanım Alanları / Applications of PURLINA MATRIX CORE", page: "17" }
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
              <motion.div key={idx} variants={itemVariants} className="flex justify-between items-end border-b border-white/10 pb-4 group gap-2">
                <h4 className="text-xl md:text-2xl text-white font-medium group-hover:text-blue-400 transition-colors max-w-[85%]">{item.text}</h4>
                <div className="text-2xl md:text-3xl text-white font-mono font-light">{item.page}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
