import { motion } from 'framer-motion';
import { Database, TrendingUp, Zap } from 'lucide-react';

export default function DataCenterGrowth() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  // 2010 to 2029 data
  const chartData = [2, 5, 6.5, 9, 12, 15.5, 26, 33, 41, 64.2, 79, 97, 120, 147, 181, 215, 253, 297, 348, 405];

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
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic">
               Veri Merkezlerinin Büyümesi
             </motion.h3>
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-white font-display font-bold md:text-right">
               The Growth of Data Centers
             </motion.h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div variants={itemVariants} className="flex flex-col gap-8">
              <p className="text-xl text-slate-300 font-light leading-relaxed italic">
                Bulut bilişim, yapay zekâ, büyük veri analitiği ve IoT teknolojilerinin hızlı gelişimi veri merkezlerine olan talebi dramatik şekilde artırmaktadır.
              </p>
              
              <div className="space-y-6">
                <p className="text-blue-400 text-xl font-medium italic">Bugün:</p>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <p className="text-slate-300 text-lg italic">Veri merkezi altyapısı her yıl yaklaşık <strong className="text-white not-italic">%20 oranında büyümektedir</strong>.</p>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-slate-300 text-lg italic">Veri merkezleri küresel elektrik tüketiminin yaklaşık <strong className="text-white not-italic">%1'ini oluşturmaktadır</strong>.</p>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <p className="text-slate-300 text-lg italic">Dünya genelinde veri hacmi <strong className="text-white not-italic">2010 yılında 5 zettabyte seviyesinden 2025 yılında 180 zettabyte seviyesine ulaşmıştır</strong>.</p>
                </div>
              </div>

              <div className="mt-4 p-6 border-l-4 border-l-red-500 bg-red-500/5">
                <p className="text-red-300 text-lg italic font-light">
                  Bu büyüme enerji tüketimi, karbon emisyonları ve su kullanımı üzerinde önemli baskılar yaratmaktadır.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col gap-8">
              <p className="text-xl text-slate-300 font-light leading-relaxed">
                The rapid development of cloud computing, artificial intelligence, big data analytics, and IoT technologies is dramatically increasing the demand for data centers.
              </p>
              
              <div className="space-y-6">
                <p className="text-white text-xl font-medium">Today:</p>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <p className="text-slate-300 text-lg">Data center infrastructure is growing at approximately <strong className="text-white">20% annually</strong>.</p>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-slate-300 text-lg">Data centers account for roughly <strong className="text-white">1% of global electricity consumption</strong>.</p>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <p className="text-slate-300 text-lg">The global volume of data has increased from <strong className="text-white">5 zettabytes in 2010 to 180 zettabytes in 2025</strong>.</p>
                </div>
              </div>

              <div className="mt-4 p-6 border-l-4 border-l-red-500 bg-red-500/5">
                <p className="text-red-300 text-lg font-light">
                  This growth is creating significant pressure on energy consumption, carbon emissions, and water usage.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-12 flex flex-col items-center">
            <h4 className="text-center text-blue-400 text-lg font-light mb-2 italic">
              2010'dan 2029'a kadar dünya çapında oluşturulan, yakalanan, kopyalanan ve tüketilen veri veya bilgi hacmi (zettabayt cinsinden)
            </h4>
            <h4 className="text-center text-white text-lg font-light mb-8">
              Volume of data/information created, captured, copied, and consumed worldwide from 2010 to 2029 (in zettabytes)
            </h4>
            <div className="relative h-80 md:h-[400px] w-full flex items-end justify-between gap-1 md:gap-2 p-6 bg-white/5 border border-white/10 rounded-2xl">
              {chartData.map((val, idx) => (
                <motion.div
                  key={idx}
                  className="w-full bg-blue-600 rounded-t-sm opacity-90 hover:opacity-100 hover:bg-blue-400 transition-colors relative group"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(val / 405) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: idx * 0.05 }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white bg-slate-800 px-2 py-1 rounded transition-opacity hidden md:block whitespace-nowrap">
                    {val} ZB
                  </div>
                </motion.div>
              ))}
              <div className="absolute bottom-2 left-6 right-6 flex justify-between text-xs text-slate-400 font-mono">
                <span>2010</span>
                <span>2029</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 self-end">Kaynak / Source: https://www.statista.com/statistics/871513/worldwide-data-created/</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
