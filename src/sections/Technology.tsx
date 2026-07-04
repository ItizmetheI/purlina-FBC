import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Zap, VolumeX, Shield, Droplets, ThermometerSnowflake, Minimize2, Settings2, Activity, PowerOff } from 'lucide-react';

export default function Technology() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "calc(-100% + 100vw)"]);

  const benefits = [
    { icon: <VolumeX size={40} />, title: "Lower noise", titleTr: "Daha az gürültü" },
    { icon: <Minimize2 size={40} />, title: "Smaller footprint", titleTr: "Daha küçük alan kaplama" },
    { icon: <Settings2 size={40} />, title: "Lower system complexity", titleTr: "Daha düşük karmaşıklık" },
    { icon: <Zap size={40} />, title: "Reduced energy consumption", titleTr: "Daha düşük enerji tüketimi" },
    { icon: <ThermometerSnowflake size={40} />, title: "Enhanced cooling", titleTr: "Gelişmiş soğutma", desc: "the fluid has more than 1,000× the volumetric thermal capacity of air", descTr: "sıvının havanın termal kapasitesinin bin katından fazla termal kapasitesi vardır (hacimce)" },
    { icon: <Activity size={40} />, title: "Lower PUE", titleTr: "Daha düşük PUE" },
    { icon: <Shield size={40} />, title: "Lower risk of hardware hot spots", titleTr: "Donanımda sıcak nokta oluşma riskinin daha düşük olması" },
    { icon: <Cpu size={40} />, title: "Higher hash rates", titleTr: "Daha yüksek hash oranları" },
    { icon: <Droplets size={40} />, title: "Near-zero water loss", titleTr: "Neredeyse sıfır su kaybı" },
    { icon: <PowerOff size={40} />, title: "Cooling without electricity", titleTr: "Elektriğe ihtiyaç duymadan soğutma", desc: "(if the system is designed without pumps)", descTr: "(sistem pompalar olmadan tasarlanmışsa)" },
  ];

  return (
    <section ref={containerRef} className="relative h-[600vh] z-10 pointer-events-none">
      <div className="sticky top-0 h-screen flex flex-col justify-center w-full pointer-events-auto overflow-hidden" data-cursor="drag">
        
        <div className="max-w-7xl mx-auto w-full mb-16 flex flex-col gap-12 px-4 md:px-12">
          
          <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8">
             <motion.h3 className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic">
               Immersion Cooling Teknolojisi
             </motion.h3>
             <motion.h3 className="text-3xl md:text-5xl text-white font-display font-bold md:text-right">
               Immersion Cooling Technology
             </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <div className="flex flex-col gap-6">
              <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                Immersion cooling mimarisinde elektronik bileşenler doğrudan dielectric sıvı içine daldırılarak çalıştırılır. Bu sıvı elektriksel olarak iletken değildir ve yüksek termal kapasiteye sahiptir.
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                Isı doğrudan sıvıya aktarılır ve doğal konveksiyon veya pompa sirkülasyonu ile sistemden uzaklaştırılır. Ek bir avantajı da, bu ısının su soğutmalı ısı eşanjörleri tarafından geri kazanılıp bölgesel ısıtma projelerinde yeniden kullanılabilmesidir.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <p className="text-lg text-white font-light leading-relaxed">
                In immersion cooling architecture, electronic components operate while directly immersed in a dielectric fluid. This fluid is electrically non-conductive and has a high thermal capacity.
              </p>
              <p className="text-lg text-white font-light leading-relaxed">
                Heat is transferred directly to the fluid and removed from the system through natural convection or pump-driven circulation. An additional advantage is that this heat can be recovered by water-cooled heat exchangers and reused in district heating projects.
              </p>
            </div>
          </div>
        </div>

        <motion.div style={{ x }} className="flex gap-8 cursor-grab active:cursor-grabbing w-max pb-8 px-4 md:px-12 lg:pl-[max(3rem,calc((100vw-80rem)/2))] lg:pr-[max(3rem,calc((100vw-80rem)/2))]">
          {benefits.map((benefit, i) => (
            <div 
              key={i} 
              className="w-[80vw] md:w-[450px] flex-shrink-0 group relative p-10 bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-500 flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8 p-5 bg-black/40 border border-white/10 rounded-2xl inline-block text-blue-400 self-start shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  {benefit.icon}
                </div>
                
                <h4 className="text-2xl font-display font-light text-blue-500 italic mb-2">{benefit.titleTr}</h4>
                {benefit.descTr && <p className="text-slate-400 text-base leading-relaxed italic mb-6 font-light">{benefit.descTr}</p>}

                <div className="w-12 h-[1px] bg-white/20 mb-6 mt-auto"></div>

                <h3 className="text-2xl font-display font-bold text-white mb-2">{benefit.title}</h3>
                {benefit.desc && <p className="text-slate-300 text-base leading-relaxed font-light">{benefit.desc}</p>}
              </div>
            </div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}
