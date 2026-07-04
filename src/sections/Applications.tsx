import { motion } from 'framer-motion';
import { Cloud, Radio, Server, Building2, Microscope, Link } from 'lucide-react';

export default function Applications() {
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
          <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8 mb-16">
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic">
               PURLINA MATRIX CORE <br />
               Kullanım Alanları
             </motion.h3>
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-white font-display font-bold text-right">
               Applications of <br />
               PURLINA MATRIX CORE
             </motion.h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {applications.map((app, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="p-10 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col hover:bg-white/10 transition-colors group"
              >
                <div className="mb-8 w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-500">
                  {app.icon}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <p className="text-slate-300 text-base leading-relaxed italic font-light">
                      <strong className="text-blue-400 font-bold not-italic">{app.titleTr}</strong>, {app.descTr}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-300 text-base leading-relaxed font-light">
                      <strong className="text-white font-bold">{app.title}</strong> {app.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="bg-black/60 border border-white/10 p-10 md:p-16 rounded-[3rem] flex flex-col lg:flex-row gap-16 items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="w-full lg:w-1/2 relative z-10">
              <ul className="grid grid-cols-1 gap-4">
                {targets.map((target, i) => (
                  <li key={i} className="flex items-center gap-2 pb-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    <span className="text-base text-slate-300 italic font-light">• {target.tr}</span>
                    <span className="text-base text-white font-light ml-4">• {target.en}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2 p-10 bg-green-500/20 border border-green-500/30 rounded-[2rem] text-left relative z-10">
              <div className="flex flex-col gap-8">
                <p className="text-lg text-green-100 font-light italic leading-relaxed">
                  <strong className="font-bold text-white not-italic">PURLINA MATRIX CORE</strong> enerji kullanımını <strong className="font-semibold text-white not-italic">%48'e kadar azaltabilir</strong>, bilgi işlem performansını <strong className="font-semibold text-white not-italic">%40'a kadar artırabilir</strong> ve sermaye ve işletme giderlerini <strong className="font-semibold text-white not-italic">%40'a kadar düşürebilir</strong>.
                </p>

                <div className="w-16 h-[1px] bg-white/20"></div>
                
                <p className="text-lg text-white font-light leading-relaxed">
                  <strong className="font-bold text-white">PURLINA MATRIX CORE</strong> can reduce energy consumption by up to <strong className="font-bold text-white">48%</strong>, increase computing performance by up to <strong className="font-bold text-white">40%</strong>, and lower capital and operating expenses by up to <strong className="font-bold text-white">40%</strong>.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
