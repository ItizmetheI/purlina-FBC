import { motion } from 'framer-motion';

import PuritySlider from '../components/PuritySlider';
import { useLang } from '../lib/lang';
import SectionHeader from '../components/SectionHeader';

export default function TechnicalSpecs() {
  const { t } = useLang();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

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
          <SectionHeader
            no="07"
            kicker={t('KANIT — MOLEKÜL', 'PROOF — THE MOLECULE')}
            title={t('Moleküler Yapı', 'Molecular Structure')}
            className="mb-2"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <p className="text-xl text-slate-300 font-light leading-relaxed">
                {t(
                  'PURLINA MATRIX CORE ultra rafine edilmiş, aromatik içermeyen, dar moleküler dağılıma sahip doymuş hidrokarbon bazlı dielectric akışkandır.',
                  'PURLINA MATRIX CORE is a dielectric fluid based on ultra-refined, aromatic-free, saturated hydrocarbons with a narrow molecular distribution.'
                )}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <div className="p-8 panel">
                <h3 className="text-white text-xl font-medium mb-6">
                  {t('Düz zincirli parafinik yapı sayesinde:', 'Thanks to its straight-chain paraffinic structure, it provides:')}
                </h3>
                <ul className="space-y-4">
                  {[
                    t('Yüksek elektriksel direnç', 'High electrical resistivity'),
                    t('Yüksek oksidasyon stabilitesi', 'High oxidation stability'),
                    t('Uzun servis ömrü', 'Long service life'),
                    t('Düşük uçuculuk', 'Low volatility'),
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-16">
            <div className="mb-12">
              <div className="kicker mb-4">{t('TİPİK DEĞERLER', 'TYPICAL VALUES')}</div>
              <h3 className="text-3xl md:text-5xl text-white font-display font-bold">
                {t('Teknik Özellikleri', 'Technical Specifications')}
              </h3>
              <div className="rule mt-8" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Electrical Properties */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-lg">
                <h3 className="text-2xl font-display font-semibold text-white mb-8 border-b border-white/10 pb-4">
                  {t('Elektriksel Özellikler', 'Electrical Properties')}
                </h3>

                <div className="space-y-2">
                  {[
                    { label: t('Dielectric breakdown voltajı', 'Dielectric breakdown voltage'), value: '>35 kV' },
                    { label: t('Elektriksel direnç', 'Electrical resistivity'), value: '>10¹² Ω·m' },
                    { label: t('Asit sayısı', 'Acid number'), value: '<0.01 mgKOH/g' },
                  ].map((row, i) => (
                    <div key={i} className={`flex flex-col md:flex-row justify-between md:items-center py-4 px-4 rounded-xl gap-2 ${i % 2 === 0 ? 'bg-black/20' : ''}`}>
                      <span className="text-slate-300 text-lg">{row.label}</span>
                      <span className="font-mono text-xl text-white font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thermal Properties */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-lg">
                <h3 className="text-2xl font-display font-semibold text-white mb-8 border-b border-white/10 pb-4">
                  {t('Termal Özellikler', 'Thermal Properties')}
                </h3>

                <div className="space-y-2">
                  {[
                    { label: t('Özgül ısı kapasitesi', 'Specific heat capacity'), value: '~2.0 kJ/kgK' },
                    { label: t('Termal iletkenlik', 'Thermal conductivity'), value: '~0.13 W/mK' },
                    { label: t('Parlama noktası', 'Flash point'), value: '240–265°C' },
                  ].map((row, i) => (
                    <div key={i} className={`flex flex-col md:flex-row justify-between md:items-center py-4 px-4 rounded-xl gap-2 ${i % 2 === 0 ? 'bg-black/20' : ''}`}>
                      <span className="text-slate-300 text-lg">{row.label}</span>
                      <span className="font-mono text-xl text-white font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Purity Comparison Visuals */}
          <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Bottle Comparison */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col items-center justify-center min-h-[400px]">
              <PuritySlider />
            </div>

            {/* Acid Number Chart */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-lg flex flex-col justify-center min-h-[400px]">
              <div className="text-center mb-12">
                <h4 className="text-2xl text-white font-medium mb-1">{t('Asit Sayısı', 'Acid Number')}</h4>
                <p className="text-slate-400 text-sm">{t('(En az en iyisidir)', '(Lower is better)')}</p>
              </div>

              <div className="flex items-end justify-center gap-16 h-48 px-4">

                {/* Synthetic Base Oil Bar */}
                <div className="flex flex-col items-center gap-4 w-24 h-full justify-end">
                  <motion.div
                    className="w-full bg-slate-500/60 border border-slate-400/40 rounded-t-md relative"
                    initial={{ height: 0 }}
                    whileInView={{ height: '78%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                  </motion.div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs leading-tight">{t('Sentetik Baz Yağ', 'Synthetic Base Oil')}</p>
                  </div>
                </div>

                {/* PURLINA MATRIX CORE Bar */}
                <div className="flex flex-col items-center gap-4 w-24 h-full justify-end">
                  <motion.div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-300 rounded-t-md relative drop-shadow-[0_0_10px_rgba(43,92,230,0.5)]"
                    initial={{ height: 0 }}
                    whileInView={{ height: '6%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-sm text-brand-cyan whitespace-nowrap">{'<'}0.01</span>
                  </motion.div>
                  <div className="text-center">
                    <p className="text-brand-cyan font-bold text-xs leading-tight tracking-wider">PURLINA<br/>MATRIX CORE</p>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
