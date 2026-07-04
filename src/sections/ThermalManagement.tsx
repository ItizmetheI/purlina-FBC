import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ThermalManagement() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.5], [0, 1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.4, 0.5, 0.7, 0.8], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.7, 0.8, 1, 1], [0, 1, 1, 1]);

  const y1 = useTransform(scrollYProgress, [0, 0.2], [50, 0]);
  const y2 = useTransform(scrollYProgress, [0.4, 0.5], [50, 0]);
  const y3 = useTransform(scrollYProgress, [0.7, 0.8], [50, 0]);

  return (
    <section ref={containerRef} className="relative h-[300vh] z-10 pointer-events-none">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 md:px-8 w-full pointer-events-auto overflow-hidden">
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Slide 1 */}
          <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute max-w-5xl w-full flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-blue-500 italic">
                Yeni Nesil Isı Yönetimi
              </h2>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
                Next-Generation Thermal Management
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed italic">
                Dijital dönüşümün ilk evresinde veri konuşuldu, ikinci evresinde hız ve işlem gücü. Bugün ise üçüncü evreye geçilmiş durumda: <strong className="text-white font-medium">ısı yönetimi</strong>.
              </p>
              <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
                In the first phase of digital transformation, data was the focus; in the second phase, speed and computing power. Today, we have entered the third phase: <strong className="text-white font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">thermal management</strong>.
              </p>
            </div>
          </motion.div>

          {/* Slide 2 */}
          <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute max-w-6xl w-full">
            <div className="glass-panel p-10 md:p-16 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div className="flex flex-col gap-8">
                  <p className="text-slate-300 text-lg font-light leading-relaxed italic border-l-2 border-blue-500 pl-6">
                    Megawatt seviyesinde enerji tüketen yapay zekâ kümeleri, büyük dil modeli (LLM) eğitim altyapıları, yüksek yoğunluklu GPU sistemleri ve HPC merkezleri artık yalnızca işlem kapasitesiyle değil, üretilen ısının nasıl yönetildiğiyle tanımlanmaktadır.
                  </p>
                  <p className="text-slate-400 text-base font-light leading-relaxed italic">
                    Klasik hava ve su bazlı soğutma sistemleri yüksek enerji tüketimi, evaporatif su kaybı ve karmaşık mekanik altyapı nedeniyle sürdürülebilirlik sınırına ulaşmıştır. Bu nedenle immersion cooling teknolojisi veri merkezi mimarisinin doğal evrimi olarak kabul edilmektedir.
                  </p>
                </div>
                
                <div className="flex flex-col gap-8">
                  <p className="text-slate-200 text-lg font-light leading-relaxed border-l-2 border-white pl-6">
                    Megawatt-level energy-consuming AI clusters, large language model (LLM) training infrastructures, high-density GPU systems, and HPC centers are now defined not only by their processing capacity but also by how the generated heat is managed.
                  </p>
                  <p className="text-slate-400 text-base font-light leading-relaxed">
                    Conventional air- and water-based cooling systems have reached the limits of sustainability due to high energy consumption, evaporative water loss, and complex mechanical infrastructure. For this reason, immersion cooling technology is considered the natural evolution of data center architecture.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Slide 3 */}
          <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute max-w-5xl w-full">
            <div className="relative z-10 p-12 bg-[#020617]/80 backdrop-blur-2xl border-l-4 border-l-blue-500 rounded-r-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <strong className="text-blue-500 font-display text-3xl md:text-4xl tracking-tight block mb-6 drop-shadow-lg italic">PURLINA MATRIX CORE</strong>
                  <p className="text-slate-300 text-xl leading-relaxed m-0 font-light italic">
                    bu yeni mimarinin merkezinde yer alan dielectric termal platformdur. <strong className="text-white font-medium">Bu bir soğutma sıvısı değildir; işlemcilerin çalıştığı kararlı ortamdır.</strong>
                  </p>
                </div>
                <div>
                  <strong className="text-white font-display text-3xl md:text-4xl tracking-tight block mb-6 drop-shadow-lg">PURLINA MATRIX CORE</strong>
                  <p className="text-slate-200 text-xl leading-relaxed m-0 font-light">
                    is the dielectric thermal platform at the center of this new architecture. <strong className="text-white font-medium">This is not a cooling fluid; it is the stable environment in which processors operate.</strong>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
