import { motion } from 'framer-motion';
import { Droplet, Truck, Warehouse, TrendingUp } from 'lucide-react';

export default function Vision() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const stats = [
    { icon: <Droplet className="w-8 h-8 text-blue-500" />, value: "52.000 Tons", label: "Active Stock Capacity", subLabel: "52.000 Ton Aktif Stok Kapasitesi" },
    { icon: <TrendingUp className="w-8 h-8 text-blue-500" />, value: "270.000 Tons/Year", label: "Trade Volume", subLabel: "270.000 Ton/Yıl Ticaret Hacmi" },
    { icon: <Truck className="w-8 h-8 text-blue-500" />, value: "60+ Tankers", label: "Special Distribution Fleet", subLabel: "60+ Tanker Özel Dağıtım Filosu" },
    { icon: <Warehouse className="w-8 h-8 text-blue-500" />, value: "6 Warehouses", label: "Uninterrupted Logistics via 6 Separate Bonded Warehouses", subLabel: "6 Ayrı Antrepo ile Kesintisiz Lojistik" },
  ];

  return (
    <section className="relative min-h-screen py-24 flex items-center px-4 md:px-12 z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="flex flex-col gap-16"
        >
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8">
             <motion.h3 variants={itemVariants} className="text-2xl md:text-4xl text-white font-display font-light">
               Corporate Vision & <br />
               Alkim Petrokimya
             </motion.h3>
             <motion.h3 variants={itemVariants} className="text-2xl md:text-4xl text-blue-500 font-display font-light italic">
               Kurumsal Vizyon & <br />
               Alkim Petrokimya
             </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {/* English Column */}
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-white">
                The Invisible Strength <br/>
                Behind Tomorrow's <br/>
                Flawless <br/>
                Formulations
              </h2>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                Alkim Petrokimya is one of the leading actors in the chemical industry with over a quarter-century of experience and modern production infrastructure. In our 14,500 m² state-of-the-art facilities in Istanbul Tuzla, we produce not just products but strategic solutions by placing innovation and sustainability at our core.
              </p>
            </motion.div>

            {/* Turkish Column */}
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-blue-500 italic">
                Yarının <br/>
                Kusursuz Formüllerine <br/>
                Temel Oluşturan <br/>
                Görünmez Güç
              </h2>
              <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                Alkim Petrokimya, çeyrek asrı aşan tecrübesi ve modern üretim altyapısıyla kimya sektörünün öncü aktörlerinden biridir. İstanbul Tuzla'daki 14.500 m²'lik modern tesislerimizde, inovasyonu ve sürdürülebilirliği merkeze alarak sadece ürün değil, stratejik çözümler üretiyoruz.
              </p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-3xl font-display font-bold text-white mb-12 flex items-center gap-4">
              Our Operational Power <span className="text-blue-500 italic">/ Operasyonel Gücümüz</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-4 group">
                  <div className="mb-2 transition-transform duration-500 group-hover:-translate-y-2">
                    {stat.icon}
                  </div>
                  <h4 className="text-3xl font-display font-bold text-white tracking-tight">{stat.value}</h4>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-white font-medium">{stat.label}</p>
                    <p className="text-sm text-blue-400 italic">{stat.subLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
