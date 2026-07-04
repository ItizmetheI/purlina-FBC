import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';

export default function Efficiency() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
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
          {/* Versions Split */}
          <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8 mb-4">
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic">
               SAF ve AO Destekli <br />
               Versiyonlar
             </motion.h3>
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-white font-display font-bold text-right">
               With PURE and AO <br />
               Supported Versions
             </motion.h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <motion.div variants={itemVariants} className="flex flex-col gap-8 p-10 bg-white/5 border border-white/10 rounded-[2rem]">
              <div className="flex flex-col gap-6">
                <p className="text-slate-300 leading-relaxed text-lg italic font-light">
                  <strong className="text-blue-400 not-italic">Saf Versiyon:</strong> Katkısız formülasyon. Moleküler şeffaflık prensibiyle geliştirilmiştir. Orta yük ve kısa süreli operasyonlar için idealdir.
                </p>
                <p className="text-white leading-relaxed text-lg">
                  <strong className="text-white font-bold">Pure Version:</strong> Additive-free formulation. Developed based on the principle of molecular transparency. Ideal for medium loads and short-duration operations.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col gap-8 p-10 bg-gradient-to-br from-blue-900/40 to-transparent border border-blue-500/30 rounded-[2rem]">
              <div className="flex flex-col gap-6">
                <p className="text-slate-300 leading-relaxed text-lg italic font-light">
                  <strong className="text-blue-400 not-italic">AO (Nörolojik Koruyucu Katman) Takviyeli Versiyon:</strong> Fenolik, aminik veya fosfit bazlı antioksidan sistemler içerir. Sürekli yüksek termal döngü altında oksidatif zincir reaksiyonlarını baskılar. Viskozite değişimini önler, tortu oluşumunu engeller ve sıvı ömrünü uzatır.
                </p>
                <p className="text-white leading-relaxed text-lg">
                  <strong className="text-white font-bold">AO (Neurological Protective Layer) Enhanced Version:</strong> Contains phenolic, aminic, or phosphite-based antioxidant systems. Suppresses oxidative chain reactions under continuous high thermal cycling. Prevents viscosity changes, inhibits deposit formation, and extends the service life of the fluid.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Efficiency Stats */}
          <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8 mt-8 mb-8">
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic">
               Enerji ve <br />
               Su Verimliliği
             </motion.h3>
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-white font-display font-bold text-right">
               Energy and <br />
               Water Efficiency
             </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <p className="text-lg text-slate-300 font-light italic">Immersion cooling teknolojisi veri merkezlerinde önemli enerji avantajları sağlar.</p>
              <ul className="text-lg text-slate-300 font-light italic space-y-2">
                <li>• Enerji tüketiminde <strong className="not-italic text-blue-400">%48'e kadar azalma</strong></li>
                <li>• Toplam sahip olma maliyetinde <strong className="not-italic text-blue-400">%33'e kadar düşüş</strong></li>
                <li>• CO2 emisyonlarında <strong className="not-italic text-blue-400">%30'a kadar azalma</strong></li>
                <li>• Veri merkezi alan ihtiyacında <strong className="not-italic text-blue-400">%80'e kadar düşüş</strong></li>
              </ul>
              <p className="text-lg text-slate-300 font-light italic mt-4">Evaporatif sistemlere kıyasla su tüketiminde %80'e varan azalma mümkündür.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <p className="text-lg text-white">Immersion cooling technology provides significant energy advantages in data centers.</p>
              <ul className="text-lg text-white space-y-2">
                <li>• Up to <strong className="text-white font-bold">48% reduction</strong> in energy consumption</li>
                <li>• Up to <strong className="text-white font-bold">33% decrease</strong> in total cost of ownership (TCO)</li>
                <li>• Up to <strong className="text-white font-bold">30% reduction</strong> in CO2 emissions</li>
                <li>• Up to <strong className="text-white font-bold">80% reduction</strong> in data center space requirements</li>
              </ul>
              <p className="text-lg text-white mt-4">Compared to evaporative systems, water consumption can be reduced by up to 80%.</p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard 
              stat={48} 
              suffix="%" 
              labelTr={<>Enerji tüketiminde <br/>azalma</>} 
              labelEn={<>reduction in energy consumption</>}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
            />
            
            <StatCard 
              stat={33} 
              suffix="%" 
              labelTr={<>Toplam sahip olma maliyetinde <br/>düşüş</>} 
              labelEn={<>decrease in total cost of ownership (TCO)</>}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>}
            />
            
            <StatCard 
              stat={30} 
              suffix="%" 
              labelTr={<>CO2 emisyonlarında <br/>azalma</>} 
              labelEn={<>reduction in CO2 emissions</>}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 2v7"/><path d="m9 6 3-4 3 4"/></svg>}
            />
            
            <StatCard 
              stat={80} 
              suffix="%" 
              labelTr={<>Veri merkezi alan ihtiyacında <br/>düşüş</>} 
              labelEn={<>reduction in data center space requirements</>}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
