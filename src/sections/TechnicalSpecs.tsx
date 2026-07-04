import { motion } from 'framer-motion';

import PuritySlider from '../components/PuritySlider';

export default function TechnicalSpecs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="relative pointer-events-none min-h-screen py-32 flex items-center px-4 md:px-12 z-10">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col gap-16"
        >
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8">
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-white font-display font-bold">
               Molecular Structure
             </motion.h3>
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic md:text-right">
               Moleküler Yapı
             </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <p className="text-xl text-slate-300 font-light leading-relaxed">
                PURLINA MATRIX CORE is a dielectric fluid based on ultra-refined, aromatic-free, saturated hydrocarbons with a narrow molecular distribution.
              </p>
              
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] mt-4">
                <h3 className="text-white text-xl font-medium mb-6">Thanks to its straight-chain paraffinic structure, it provides:</h3>
                <ul className="space-y-4">
                  {['High electrical resistivity', 'High oxidation stability', 'Long service life', 'Low volatility'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <p className="text-xl text-slate-300 font-light leading-relaxed italic">
                PURLINA MATRIX CORE ultra rafine edilmiş, aromatik içermeyen, dar moleküler dağılıma sahip doymuş hidrokarbon bazlı dielectric akışkandır.
              </p>
              
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] mt-4">
                <h3 className="text-blue-500 text-xl font-medium mb-6 italic">Düz zincirli parafinik yapı sayesinde:</h3>
                <ul className="space-y-4">
                  {['yüksek elektriksel direnç', 'yüksek oksidasyon stabilitesi', 'uzun servis ömrü', 'düşük uçuculuk'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                      <span className="text-lg italic">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-slate-300 mt-6 italic">özellikleri sağlanır.</p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-16">
            <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8 mb-12">
               <h3 className="text-3xl md:text-5xl text-white font-display font-bold">
                 Technical Specifications
               </h3>
               <h3 className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic md:text-right">
                 Teknik Özellikleri
               </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Electrical Properties */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                <h3 className="text-2xl font-display font-semibold text-white mb-2">Electrical Properties</h3>
                <h4 className="text-xl font-display font-light text-blue-500 italic mb-8 border-b border-white/10 pb-4">Elektriksel Özellikler</h4>
                
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row justify-between md:items-center py-4 px-4 bg-black/20 rounded-xl gap-2">
                    <div className="flex flex-col">
                      <span className="text-slate-300 text-lg">Dielectric breakdown voltage</span>
                      <span className="text-blue-400 text-sm italic">Dielectric breakdown voltajı</span>
                    </div>
                    <span className="font-mono text-xl text-white font-semibold">{'>'}35 kV</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between md:items-center py-4 px-4 rounded-xl gap-2">
                    <div className="flex flex-col">
                      <span className="text-slate-300 text-lg">Electrical resistivity</span>
                      <span className="text-blue-400 text-sm italic">Elektriksel direnç</span>
                    </div>
                    <span className="font-mono text-xl text-white font-semibold">{'>'}10¹² Ω·m</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between md:items-center py-4 px-4 bg-black/20 rounded-xl gap-2">
                    <div className="flex flex-col">
                      <span className="text-slate-300 text-lg">Acid number</span>
                      <span className="text-blue-400 text-sm italic">Asit sayısı</span>
                    </div>
                    <span className="font-mono text-xl text-white font-semibold">{'<'}0.01 mgKOH/g</span>
                  </div>
                </div>
              </div>
              
              {/* Thermal Properties */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                <h3 className="text-2xl font-display font-semibold text-white mb-2">Thermal Properties</h3>
                <h4 className="text-xl font-display font-light text-blue-500 italic mb-8 border-b border-white/10 pb-4">Termal Özellikler</h4>
                
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row justify-between md:items-center py-4 px-4 bg-black/20 rounded-xl gap-2">
                    <div className="flex flex-col">
                      <span className="text-slate-300 text-lg">Specific heat capacity</span>
                      <span className="text-blue-400 text-sm italic">Özgül ısı kapasitesi</span>
                    </div>
                    <span className="font-mono text-xl text-white font-semibold">~2.0 kJ/kgK</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between md:items-center py-4 px-4 rounded-xl gap-2">
                    <div className="flex flex-col">
                      <span className="text-slate-300 text-lg">Thermal conductivity</span>
                      <span className="text-blue-400 text-sm italic">Termal iletkenlik</span>
                    </div>
                    <span className="font-mono text-xl text-white font-semibold">~0.13 W/mK</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between md:items-center py-4 px-4 bg-black/20 rounded-xl gap-2">
                    <div className="flex flex-col">
                      <span className="text-slate-300 text-lg">Flash point</span>
                      <span className="text-blue-400 text-sm italic">Parlama noktası</span>
                    </div>
                    <span className="font-mono text-xl text-white font-semibold">240–265°C</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Purity Comparison Visuals */}
          <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Bottle Comparison */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col items-center justify-center min-h-[400px]">
              <PuritySlider />
            </div>

            {/* Acid Number Chart */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col justify-center min-h-[400px]">
              <div className="text-center mb-12">
                <h4 className="text-2xl text-white font-medium mb-1">Asit Sayısı / Acid Number</h4>
                <p className="text-slate-400 text-sm italic">(En az en iyisidir / Lower is better)</p>
              </div>

              <div className="flex items-end justify-center gap-16 h-48 px-4">
                
                {/* Synthetic Base Oil Bar */}
                <div className="flex flex-col items-center gap-4 w-24">
                  <motion.div 
                    className="w-full bg-slate-700 rounded-t-md relative"
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                  </motion.div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs leading-tight">Sentetik Baz Yağ</p>
                  </div>
                </div>

                {/* PURLINA MATRIX CORE Bar */}
                <div className="flex flex-col items-center gap-4 w-24">
                  <motion.div 
                    className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md relative drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    initial={{ height: 0 }}
                    whileInView={{ height: '5%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  >
                  </motion.div>
                  <div className="text-center">
                    <p className="text-blue-400 font-bold text-xs leading-tight tracking-wider">PURLINA<br/>MATRIX CORE</p>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
