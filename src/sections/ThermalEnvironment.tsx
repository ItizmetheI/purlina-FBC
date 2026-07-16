import { motion } from 'framer-motion';
import { useLang } from '../lib/lang';
import SectionHeader from '../components/SectionHeader';

export default function ThermalEnvironment() {
  const { t } = useLang();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const traits = [
    {
      title: t('Yüksek İzolasyon Gücü:', 'High Insulation Strength:'),
      body: t(
        '35 kV üzerindeki dielectric breakdown voltajı ve 10¹² Ω·m seviyesindeki elektriksel direnci ile güvenli bir operasyon sağlar.',
        'Provides safe operation with a dielectric breakdown voltage above 35 kV and an electrical resistivity at the level of 10¹² Ω·m.'
      ),
    },
    {
      title: t('Termal Kararlılık:', 'Thermal Stability:'),
      body: t(
        'Parlama noktası 240–265°C aralığındadır ve düşük uçuculuğu sayesinde sıvı kaybı minimize edilir.',
        'The flash point ranges between 240–265°C, and its low volatility minimizes fluid loss.'
      ),
    },
    {
      title: t('Saf Yapı:', 'Pure Structure:'),
      body: t(
        'Asit sayısı 0.01 mgKOH/g altındadır; kristal berraklığındaki yapısı optik sistemlerle tam uyum sağlar.',
        'The acid number is below 0.01 mgKOH/g, and its crystal-clear structure is fully compatible with optical systems.'
      ),
    },
  ];

  return (
    <section className="relative pointer-events-none h-[150vh] flex px-4 md:px-12 z-10">
      <div className="sticky top-0 h-screen w-full flex items-center">
        <div className="max-w-7xl mx-auto w-full pointer-events-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col gap-10 lg:w-1/2 lg:ml-auto"
          >
            {/* text lane right — the exploding blade owns the left */}
            <SectionHeader
              no="06"
              kicker={t('TEMAS — KARARLI ORTAM', 'CONTACT — THE STABLE ENVIRONMENT')}
              title="PURLINA MATRIX CORE"
              className="mb-0"
            />

            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <p className="text-xl text-white font-medium leading-relaxed">
                {t(
                  'PURLINA MATRIX CORE yüksek yoğunluklu bilgi işlem altyapıları için geliştirilmiş tek fazlı dielectric immersion soğutma akışkanıdır.',
                  'PURLINA MATRIX CORE is a single-phase dielectric immersion cooling fluid developed for high-density computing infrastructures.'
                )}
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                {t(
                  'GPU, CPU, VRM ve güç bileşenleri ile doğrudan temas edecek şekilde tasarlanmıştır. Sıvı yalnızca ısı transferi sağlamaz; aynı zamanda elektronik sistemlerin çalıştığı kararlı termal ortamı oluşturur.',
                  'It is designed to come into direct contact with GPUs, CPUs, VRMs, and power components. The fluid does not only provide heat transfer; it also establishes the stable thermal environment in which electronic systems operate.'
                )}
              </p>
            </motion.div>

            <motion.h3 variants={itemVariants} className="text-2xl md:text-3xl text-brand-cyan font-display font-bold border-b border-white/10 pb-4">
              {t('Termal Ortamın Yeniden Tasarlanması', 'Redesigning the Thermal Environment')}
            </motion.h3>

            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                {t(
                  'Fanları ortadan kaldırır, hava transfer kayıplarını sıfırlar, evaporatif su kaybını minimize eder. Isı doğrudan sıvıya aktarılır ve kontrollü biçimde sistemden uzaklaştırılır.',
                  'It eliminates fans, removes air-transfer losses, and minimizes evaporative water loss. Heat is transferred directly to the fluid and removed from the system in a controlled manner.'
                )}
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                {t(
                  'Bu mimaride sıvı yalnızca ısı taşımaz; işlem ortamını stabilize eder. Elektronik bileşenlerle elektriksel ve kimyasal olarak pasif bir ilişki kurar. Reaksiyona girmez, iletkenlik oluşturmaz, tortu bırakmaz.',
                  'In this architecture, the fluid does not merely carry heat; it stabilizes the processing environment. It forms an electrically and chemically passive relationship with electronic components. It does not react, does not create conductivity, and leaves no residue.'
                )}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              {traits.map((tr, i) => (
                <div key={i} className="border-l-2 border-brand-cyan/50 pl-5">
                  <h4 className="text-lg font-bold text-white mb-1">{tr.title}</h4>
                  <p className="text-slate-300 font-light">{tr.body}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
