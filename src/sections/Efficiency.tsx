import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import { useLang } from '../lib/lang';
import SectionHeader from '../components/SectionHeader';

export default function Efficiency() {
  const { t } = useLang();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section className="relative pointer-events-none min-h-screen py-32 flex items-center px-4 md:px-12 z-10">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto lg:pl-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col gap-16"
        >
          <SectionHeader
            no="09"
            kicker={t('KARARLI — FORMÜLASYON', 'STABLE — FORMULATIONS')}
            title={t('SAF ve AO Destekli Versiyonlar', 'PURE and AO Supported Versions')}
            className="mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <motion.div variants={itemVariants} className="flex flex-col gap-8 p-10 panel">
              <p className="text-slate-200 leading-relaxed text-lg font-light">
                {t(
                  <><strong className="text-brand-cyan font-bold">Saf Versiyon:</strong> Katkısız formülasyon. Moleküler şeffaflık prensibiyle geliştirilmiştir. Orta yük ve kısa süreli operasyonlar için idealdir.</>,
                  <><strong className="text-brand-cyan font-bold">Pure Version:</strong> Additive-free formulation. Developed based on the principle of molecular transparency. Ideal for medium loads and short-duration operations.</>
                )}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-8 p-10 bg-gradient-to-br from-cyan-950/40 to-transparent border border-brand-cyan/30 rounded-lg">
              <p className="text-slate-200 leading-relaxed text-lg font-light">
                {t(
                  <><strong className="text-brand-cyan font-bold">AO (Nörolojik Koruyucu Katman) Takviyeli Versiyon:</strong> Fenolik, aminik veya fosfit bazlı antioksidan sistemler içerir. Sürekli yüksek termal döngü altında oksidatif zincir reaksiyonlarını baskılar. Viskozite değişimini önler, tortu oluşumunu engeller ve sıvı ömrünü uzatır.</>,
                  <><strong className="text-brand-cyan font-bold">AO (Neurological Protective Layer) Enhanced Version:</strong> Contains phenolic, aminic, or phosphite-based antioxidant systems. Suppresses oxidative chain reactions under continuous high thermal cycling. Prevents viscosity changes, inhibits deposit formation, and extends the service life of the fluid.</>
                )}
              </p>
            </motion.div>
          </div>

          {/* Efficiency Stats */}
          <div className="mt-8 mb-8">
            <div className="kicker mb-4">{t('VERİMLİLİK', 'EFFICIENCY')}</div>
            <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-white font-display font-bold">
              {t('Enerji ve Su Verimliliği', 'Energy and Water Efficiency')}
            </motion.h3>
            <div className="rule mt-8" />
          </div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4 max-w-3xl">
            <p className="text-lg text-white font-light">
              {t(
                'Immersion cooling teknolojisi veri merkezlerinde önemli enerji avantajları sağlar.',
                'Immersion cooling technology provides significant energy advantages in data centers.'
              )}
            </p>
            <p className="text-lg text-slate-300 font-light">
              {t(
                "Evaporatif sistemlere kıyasla su tüketiminde %80'e varan azalma mümkündür.",
                'Compared to evaporative systems, water consumption can be reduced by up to 80%.'
              )}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              stat={48}
              suffix="%"
              label={t(<>Enerji tüketiminde <br/>azalma</>, <>reduction in energy consumption</>)}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-cyan"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
            />

            <StatCard
              stat={33}
              suffix="%"
              label={t(<>Toplam sahip olma maliyetinde <br/>düşüş</>, <>decrease in total cost of ownership (TCO)</>)}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-cyan"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>}
            />

            <StatCard
              stat={30}
              suffix="%"
              label={t(<>CO2 emisyonlarında <br/>azalma</>, <>reduction in CO2 emissions</>)}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-cyan"><path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 2v7"/><path d="m9 6 3-4 3 4"/></svg>}
            />

            <StatCard
              stat={80}
              suffix="%"
              label={t(<>Veri merkezi alan ihtiyacında <br/>düşüş</>, <>reduction in data center space requirements</>)}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-cyan"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
