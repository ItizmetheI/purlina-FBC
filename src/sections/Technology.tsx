import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Zap, VolumeX, Shield, Droplets, ThermometerSnowflake, Minimize2, Settings2, Activity, PowerOff, Snowflake, Fan, Factory } from 'lucide-react';
import { useLang } from '../lib/lang';
import SectionHeader from '../components/SectionHeader';

export default function Technology() {
  const { t } = useLang();
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
    <section ref={containerRef} className="relative h-[350vh] z-10 pointer-events-none">
      <div className="sticky top-0 h-screen flex flex-col justify-center gap-10 w-full pointer-events-auto overflow-hidden">

        {/* compact header — the whole beat must fit one pinned viewport */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-12 lg:pl-32">
          <div className="flex items-baseline gap-4 mb-3">
            <span className="kicker">05</span>
            <span className="kicker text-slate-500">/</span>
            <span className="kicker">{t('ÇÖZÜM — DALDIRMA', 'THE SOLUTION — IMMERSION')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <h3 className="text-3xl md:text-5xl text-white font-display font-bold">
              {t('Immersion Cooling Teknolojisi', 'Immersion Cooling Technology')}
            </h3>
            {/* the infrastructure this technology deletes */}
            <div className="flex flex-wrap gap-4 items-center">
              {[
                { icon: <Snowflake size={20} />, label: 'Chiller' },
                { icon: <Fan size={20} className="animate-[fanStop_3.5s_ease-out_forwards]" />, label: 'Fans' },
                { icon: <Factory size={20} />, label: 'Cooling Tower' },
              ].map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.25, duration: 0.6 }}
                  className="relative flex items-center gap-2.5 border border-white/10 rounded-full px-4 py-2 text-slate-400"
                >
                  {e.icon}
                  <span className="font-mono text-[10px] tracking-widest uppercase">{e.label}</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + i * 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-2 right-2 top-1/2 h-[2px] bg-red-500/80 origin-left -rotate-6 rounded-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rule mt-6" />
        </div>

        {/* the film strip: intro leads, benefits follow */}
        <motion.div style={{ x }} className="flex gap-8 w-max px-4 md:px-12 lg:pl-32">
          <div className="w-[80vw] md:w-[520px] flex-shrink-0 flex flex-col justify-center gap-5 pr-8">
            <p className="text-lg md:text-xl text-white font-light leading-relaxed">
              {t(
                'Immersion cooling mimarisinde elektronik bileşenler doğrudan dielectric sıvı içine daldırılarak çalıştırılır. Bu sıvı elektriksel olarak iletken değildir ve yüksek termal kapasiteye sahiptir.',
                'In immersion cooling architecture, electronic components operate while directly immersed in a dielectric fluid. This fluid is electrically non-conductive and has a high thermal capacity.'
              )}
            </p>
            <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed">
              {t(
                'Isı doğrudan sıvıya aktarılır ve doğal konveksiyon veya pompa sirkülasyonu ile sistemden uzaklaştırılır. Bu ısı geri kazanılıp bölgesel ısıtma projelerinde yeniden kullanılabilir.',
                'Heat is transferred directly to the fluid and removed through natural convection or pump-driven circulation — and can be recovered and reused in district heating projects.'
              )}
            </p>
            <div className="kicker mt-2">{t('KAYDIRMAYA DEVAM ET', 'KEEP SCROLLING')} →</div>
          </div>

          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="w-[70vw] md:w-[380px] h-[360px] flex-shrink-0 group relative p-8 panel overflow-hidden hover:border-brand-cyan/50 hover:bg-slate-900/60 transition-all duration-500 flex flex-col"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="p-4 bg-black/40 border border-white/10 rounded-lg inline-block text-brand-cyan self-start">
                    {benefit.icon}
                  </div>
                  <span className="font-mono text-xs text-slate-600">{String(i + 1).padStart(2, '0')} / {String(benefits.length).padStart(2, '0')}</span>
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-2 mt-auto">{t(benefit.titleTr, benefit.title)}</h3>
                {(benefit.desc || benefit.descTr) && (
                  <p className="text-slate-300 text-base leading-relaxed font-light">{t(benefit.descTr, benefit.desc)}</p>
                )}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
