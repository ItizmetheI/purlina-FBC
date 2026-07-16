import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '../lib/lang';

export default function ThermalManagement() {
  const { t } = useLang();
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
          <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute max-w-4xl w-full flex flex-col gap-12 px-4">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white text-center">
              {t('Yeni Nesil Isı Yönetimi', 'Next-Generation Thermal Management')}
            </h2>

            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed text-center">
              {t(
                <>Dijital dönüşümün ilk evresinde veri konuşuldu, ikinci evresinde hız ve işlem gücü. Bugün ise üçüncü evreye geçilmiş durumda: <strong className="text-white font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">ısı yönetimi</strong>.</>,
                <>In the first phase of digital transformation, data was the focus; in the second phase, speed and computing power. Today, we have entered the third phase: <strong className="text-white font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">thermal management</strong>.</>
              )}
            </p>
          </motion.div>

          {/* Slide 2 */}
          <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute max-w-3xl w-full px-4">
            <div className="panel bg-[#020617]/80 backdrop-blur-md p-10 md:p-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-[80px]"></div>

              <div className="flex flex-col gap-8 relative z-10">
                <p className="text-slate-200 text-lg font-light leading-relaxed border-l-2 border-brand-cyan pl-6">
                  {t(
                    'Megawatt seviyesinde enerji tüketen yapay zekâ kümeleri, büyük dil modeli (LLM) eğitim altyapıları, yüksek yoğunluklu GPU sistemleri ve HPC merkezleri artık yalnızca işlem kapasitesiyle değil, üretilen ısının nasıl yönetildiğiyle tanımlanmaktadır.',
                    'Megawatt-level energy-consuming AI clusters, large language model (LLM) training infrastructures, high-density GPU systems, and HPC centers are now defined not only by their processing capacity but also by how the generated heat is managed.'
                  )}
                </p>
                <p className="text-slate-400 text-base font-light leading-relaxed">
                  {t(
                    'Klasik hava ve su bazlı soğutma sistemleri yüksek enerji tüketimi, evaporatif su kaybı ve karmaşık mekanik altyapı nedeniyle sürdürülebilirlik sınırına ulaşmıştır. Bu nedenle immersion cooling teknolojisi veri merkezi mimarisinin doğal evrimi olarak kabul edilmektedir.',
                    'Conventional air- and water-based cooling systems have reached the limits of sustainability due to high energy consumption, evaporative water loss, and complex mechanical infrastructure. For this reason, immersion cooling technology is considered the natural evolution of data center architecture.'
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Slide 3 */}
          <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute max-w-3xl w-full px-4">
            <div className="relative z-10 p-12 bg-[#020617]/85 backdrop-blur-md border-l-2 border-l-brand-cyan shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-brand-cyan to-transparent"></div>

              <strong className="text-white font-display text-3xl md:text-4xl tracking-tight block mb-6 drop-shadow-lg">PURLINA MATRIX CORE</strong>
              <p className="text-slate-200 text-xl leading-relaxed m-0 font-light">
                {t(
                  <>bu yeni mimarinin merkezinde yer alan dielectric termal platformdur. <strong className="text-white font-medium">Bu bir soğutma sıvısı değildir; işlemcilerin çalıştığı kararlı ortamdır.</strong></>,
                  <>is the dielectric thermal platform at the center of this new architecture. <strong className="text-white font-medium">This is not a cooling fluid; it is the stable environment in which processors operate.</strong></>
                )}
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
