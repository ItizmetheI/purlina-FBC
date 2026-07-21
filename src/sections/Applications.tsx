import { motion } from 'framer-motion';
import { Cloud, Radio, Server, Building2, Microscope, Link } from 'lucide-react';
import { useLang } from '../lib/lang';
import SectionHeader from '../components/SectionHeader';
import { Separator } from '../components/ui/separator';

export default function Applications() {
  const { t } = useLang();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } }
  };

  const applications = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud providers and hyperscale data centers",
      titleTr: "Bulut sağlayıcıları ve hiper ölçekli veri merkezleri",
      desc: "can optimize efficiency and achieve sustainability goals while standardizing their facilities for diverse hardware requirements.",
      descTr: "çeşitli donanım gereksinimleri için tesisleri standartlaştırırken verimliliklerini optimize edebilir ve sürdürülebilirlik hedeflerine ulaşabilirler."
    },
    {
      icon: <Radio className="w-8 h-8" />,
      title: "Telecom providers",
      titleTr: "Telekom sağlayıcıları",
      desc: "can operate edge data centers virtually anywhere. They can also utilize existing buildings within the constraints of power and cooling availability.",
      descTr: "uç veri merkezlerini her yerde işletebilirler. Ayrıca, güç ve soğutma kullanılabilirliği kısıtlamaları dahilinde mevcut binaları da kullanabilirler."
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "Colocation providers",
      titleTr: "Ortak yerleşim sağlayıcıları",
      desc: "can support high-density and high-performance computing users in a simple and scalable way.",
      descTr: "yüksek yoğunluklu ve yüksek performanslı bilgisayar kullanıcılarını basit ve ölçeklenebilir bir şekilde destekleyebilirler."
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Enterprises",
      titleTr: "İşletmeler",
      desc: "can simplify on-premise data centers by adopting next-generation hardware locally, increasing efficiency and reducing dependence on public cloud infrastructure.",
      descTr: "yerinde yeni nesil donanım benimseyerek yüksek verimlilik ve kamu bulutuna olan bağımlılığı azaltmak için yerinde veri merkezlerini basitleştirebilirler."
    },
    {
      icon: <Microscope className="w-8 h-8" />,
      title: "Research institutes",
      titleTr: "Araştırma enstitüleri",
      desc: "can support on-campus high-performance computing environments without requiring advanced data centers associated with high energy and cost demands.",
      descTr: "enerji ve maliyet talepleriyle ilişkili gelişmiş veri merkezlerine ihtiyaç duymadan kampüs içi yüksek performanslı bilgi işlem ortamlarını destekleyebilirler."
    },
    {
      icon: <Link className="w-8 h-8" />,
      title: "Blockchain operators",
      titleTr: "Blockchain operatörleri",
      desc: "can deploy their networks anywhere without concerns about hardware interaction with the environment. PURLINA MATRIX CORE Immersion Cooling Fluids provide a cost-effective way to maximize the hash rates of ASIC- or GPU-based miners.",
      descTr: "donanımın çevreyle etkileşiminden endişe duymadan ağlarını her yerde kurabilirler. Purlina Matrix Core Daldırma Soğutma Sıvıları, ASIC veya GPU tabanlı madencilerin hash oranlarını en üst düzeye çıkarmak için uygun maliyetli bir yol sağlar."
    }
  ];

  const targets = [
    { en: "AI data centers", tr: "Yapay zekâ veri merkezleri" },
    { en: "HPC centers", tr: "HPC merkezleri" },
    { en: "GPU training clusters", tr: "GPU eğitim kümeleri" },
    { en: "Edge AI data centers", tr: "Edge AI veri merkezleri" },
    { en: "Modular data centers", tr: "Modüler veri merkezleri" },
    { en: "Blockchain and crypto mining systems", tr: "Blockchain ve kripto madencilik sistemleri" }
  ];

  return (
    <section className="relative pointer-events-none min-h-screen py-32 flex items-center px-4 md:px-12 z-10">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <SectionHeader
            no="09"
            kicker={t('KARARLI — KULLANIM', 'STABLE — DEPLOYMENT')}
            title={t('PURLINA MATRIX CORE Kullanım Alanları', 'Applications of PURLINA MATRIX CORE')}
            className="mb-16"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {applications.map((app, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="p-10 panel flex flex-col hover:bg-white/10 hover:border-brand-cyan/40 transition-colors group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-brand-cyan shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-500">
                    {app.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg leading-snug">{t(app.titleTr, app.title)}</h3>
                </div>

                <Separator className="bg-white/10 my-6" />

                <p className="text-slate-300 text-base leading-relaxed font-light">
                  {t(app.descTr, app.desc)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="panel p-10 md:p-16 flex flex-col lg:flex-row gap-16 items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="w-full lg:w-1/2 relative z-10">
              <ul className="grid grid-cols-1 gap-4">
                {targets.map((target, i) => (
                  <li key={i} className="flex items-center gap-3 pb-2">
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-[0_0_8px_rgba(59,109,246,0.8)]"></span>
                    <span className="text-base text-white font-light">{t(target.tr, target.en)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full lg:w-1/2 p-10 bg-black/60 border border-brand-cyan/30 rounded-lg text-left relative z-10">
              <p className="text-lg text-slate-200 font-light leading-relaxed">
                {t(
                  <><strong className="font-bold text-white">PURLINA MATRIX CORE</strong> enerji kullanımını <strong className="font-semibold text-brand-cyan">%48'e kadar azaltabilir</strong>, bilgi işlem performansını <strong className="font-semibold text-brand-cyan">%40'a kadar artırabilir</strong> ve sermaye ve işletme giderlerini <strong className="font-semibold text-brand-cyan">%40'a kadar düşürebilir</strong>.</>,
                  <><strong className="font-bold text-white">PURLINA MATRIX CORE</strong> can reduce energy consumption by up to <strong className="font-bold text-brand-cyan">48%</strong>, increase computing performance by up to <strong className="font-bold text-brand-cyan">40%</strong>, and lower capital and operating expenses by up to <strong className="font-bold text-brand-cyan">40%</strong>.</>
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
