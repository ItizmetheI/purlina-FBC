import { motion } from 'framer-motion';
import { Droplet, Truck, Warehouse, TrendingUp } from 'lucide-react';
import { useLang } from '../lib/lang';
import SectionHeader from '../components/SectionHeader';
import { Badge } from '../components/ui/badge';

export default function Vision() {
  const { t } = useLang();
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
    { icon: <Droplet className="w-8 h-8 text-brand-cyan" />, value: t('52.000 Ton', '52.000 Tons'), label: t('Aktif Stok Kapasitesi', 'Active Stock Capacity') },
    { icon: <TrendingUp className="w-8 h-8 text-brand-cyan" />, value: t('270.000 Ton/Yıl', '270.000 Tons/Year'), label: t('Ticaret Hacmi', 'Trade Volume') },
    { icon: <Truck className="w-8 h-8 text-brand-cyan" />, value: t('60+ Tanker', '60+ Tankers'), label: t('Özel Dağıtım Filosu', 'Special Distribution Fleet') },
    { icon: <Warehouse className="w-8 h-8 text-brand-cyan" />, value: t('6 Antrepo', '6 Warehouses'), label: t('6 Ayrı Antrepo ile Kesintisiz Lojistik', 'Uninterrupted Logistics via 6 Separate Bonded Warehouses') },
  ];

  return (
    <section className="relative min-h-screen py-24 flex items-center px-4 md:px-12 z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto lg:pl-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="flex flex-col gap-16"
        >
          <SectionHeader
            no="03"
            kicker={t('İNİŞ — KURUMSAL VİZYON', 'DESCENT — CORPORATE VISION')}
            title={t('Kurumsal Vizyon & Alkim Petrokimya', 'Corporate Vision & Alkim Petrokimya')}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-white">
                {t(
                  <>Yarının <br/> Kusursuz Formüllerine <br/> Temel Oluşturan <br/> Görünmez Güç</>,
                  <>The Invisible Strength <br/> Behind Tomorrow's <br/> Flawless <br/> Formulations</>
                )}
              </h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                {t(
                  "Alkim Petrokimya, çeyrek asrı aşan tecrübesi ve modern üretim altyapısıyla kimya sektörünün öncü aktörlerinden biridir. İstanbul Tuzla'daki 14.500 m²'lik modern tesislerimizde, inovasyonu ve sürdürülebilirliği merkeze alarak sadece ürün değil, stratejik çözümler üretiyoruz.",
                  'Alkim Petrokimya is one of the leading actors in the chemical industry with over a quarter-century of experience and modern production infrastructure. In our 14,500 m² state-of-the-art facilities in Istanbul Tuzla, we produce not just products but strategic solutions by placing innovation and sustainability at our core.'
                )}
              </p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-3xl font-display font-bold text-white mb-12">
              {t('Operasyonel Gücümüz', 'Our Operational Power')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => {
                // split "52.000 Ton" → number + unit badge; the ' ' text node keeps
                // the verbatim string intact in textContent for spec-check.mjs
                const [num, ...rest] = stat.value.split(' ');
                const unit = rest.join(' ');
                return (
                  <div key={i} className="flex flex-col gap-4 group panel p-6 hover:bg-white/[0.06] hover:border-brand-cyan/40 transition-colors">
                    <div className="mb-2 transition-transform duration-500 group-hover:-translate-y-2">
                      {stat.icon}
                    </div>
                    <h4 className="text-3xl font-display font-bold text-white tracking-tight tabular-nums flex items-baseline flex-wrap gap-2">
                      {num}{unit && ' '}
                      {unit && <Badge variant="outline" className="font-mono text-sm border-white/15 bg-white/5 text-slate-300">{unit}</Badge>}
                    </h4>
                    <p className="text-sm text-slate-300 font-medium mt-auto">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
