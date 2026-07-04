import { motion } from 'framer-motion';
import { PiggyBank, Cpu, ShieldCheck, LeafyGreen } from 'lucide-react';

export default function Advantages() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const advantages = [
    {
      icon: <LeafyGreen className="w-10 h-10" />,
      title: "Reduced energy costs and emissions",
      titleTr: "Azaltılmış enerji maliyetleri ve emisyonlar",
      desc: "High cooling efficiency, excellent flow behavior, and superior thermodynamic properties mean less energy is required to operate your infrastructure.",
      descTr: "Yüksek soğutma verimliliği, mükemmel akış davranışı ve üstün termodinamik özellikler, ağınızı çalıştırmak için daha az enerjiye ihtiyaç duymanız anlamına gelir."
    },
    {
      icon: <PiggyBank className="w-10 h-10" />,
      title: "Cost advantage",
      titleTr: "Maliyet avantajı",
      desc: "More economical to produce compared to alternatives such as fluorocarbons and engineered fluids.",
      descTr: "Florokarbonlar ve mühendislik sıvıları gibi alternatif ürünlere göre üretimi daha ucuzdur."
    },
    {
      icon: <Cpu className="w-10 h-10" />,
      title: "High compatibility",
      titleTr: "Yüksek uyumluluk",
      desc: "Suitable for use with nearly all computer components.",
      descTr: "Neredeyse tüm bilgisayar bileşenleriyle kullanıma uygundur."
    },
    {
      icon: <ShieldCheck className="w-10 h-10" />,
      title: "Safe and easy to use",
      titleTr: "Güvenli ve kullanımı kolay",
      desc: "Can contribute to a safer working environment for personnel.",
      descTr: "Personeliniz için daha güvenli bir çalışma ortamına katkıda bulunabilir."
    }
  ];

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
          <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8 mb-4">
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-white font-display font-bold">
               Advantages of <br />
               PURLINA MATRIX CORE
             </motion.h3>
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic text-right">
               PURLINA MATRIX CORE <br />
               Avantajları
             </motion.h3>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {advantages.map((adv, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="flex flex-col lg:flex-row gap-8 p-10 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-slate-900/60 transition-colors group"
              >
                <div className="shrink-0 text-blue-500 group-hover:text-blue-400 transition-colors bg-black/40 p-6 rounded-2xl border border-white/5 self-start">
                  {adv.icon}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                  {/* English text */}
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-display font-bold text-white mb-4">{adv.title}</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">{adv.desc}</p>
                  </div>
                  
                  {/* Turkish text */}
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-display font-light text-blue-500 italic mb-4">{adv.titleTr}</h3>
                    <p className="text-slate-300 text-lg leading-relaxed italic">{adv.descTr}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
