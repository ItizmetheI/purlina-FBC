import { motion } from 'framer-motion';
import { Database, TrendingUp, Zap } from 'lucide-react';
import { useLang } from '../lib/lang';
import SectionHeader from '../components/SectionHeader';

export default function DataCenterGrowth() {
  const { t } = useLang();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  // 2010 to 2029 data
  const chartData = [2, 5, 6.5, 9, 12, 15.5, 26, 33, 41, 64.2, 79, 97, 120, 147, 181, 215, 253, 297, 348, 405];

  const stats = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: t(
        <>Veri merkezi altyapısı her yıl yaklaşık <strong className="text-white">%20 oranında büyümektedir</strong>.</>,
        <>Data center infrastructure is growing at approximately <strong className="text-white">20% annually</strong>.</>
      ),
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: t(
        <>Veri merkezleri küresel elektrik tüketiminin yaklaşık <strong className="text-white">%1'ini oluşturmaktadır</strong>.</>,
        <>Data centers account for roughly <strong className="text-white">1% of global electricity consumption</strong>.</>
      ),
    },
    {
      icon: <Database className="w-5 h-5" />,
      text: t(
        <>Dünya genelinde veri hacmi <strong className="text-white">2010 yılında 5 zettabyte seviyesinden 2025 yılında 180 zettabyte seviyesine ulaşmıştır</strong>.</>,
        <>The global volume of data has increased from <strong className="text-white">5 zettabytes in 2010 to 180 zettabytes in 2025</strong>.</>
      ),
    },
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
          {/* Header — text lane right, racks burn on the left */}
          <div className="lg:w-1/2 lg:ml-auto">
            <SectionHeader
              no="04"
              kicker={t('SORUN — TERMAL YÜK', 'THE PROBLEM — THERMAL LOAD')}
              title={t('Veri Merkezlerinin Büyümesi', 'The Growth of Data Centers')}
            />
          </div>

          <motion.div variants={itemVariants} className="flex flex-col gap-8 lg:w-1/2 lg:ml-auto">
            <p className="text-xl text-slate-300 font-light leading-relaxed">
              {t(
                'Bulut bilişim, yapay zekâ, büyük veri analitiği ve IoT teknolojilerinin hızlı gelişimi veri merkezlerine olan talebi dramatik şekilde artırmaktadır.',
                'The rapid development of cloud computing, artificial intelligence, big data analytics, and IoT technologies is dramatically increasing the demand for data centers.'
              )}
            </p>

            <div className="space-y-6">
              <p className="text-white text-xl font-medium">{t('Bugün:', 'Today:')}</p>
              {stats.map((s, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-brand-cyan/10 text-brand-cyan">{s.icon}</div>
                  <p className="text-slate-300 text-lg">{s.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-6 border-l-4 border-l-red-500 bg-red-500/5">
              <p className="text-red-300 text-lg font-light">
                {t(
                  'Bu büyüme enerji tüketimi, karbon emisyonları ve su kullanımı üzerinde önemli baskılar yaratmaktadır.',
                  'This growth is creating significant pressure on energy consumption, carbon emissions, and water usage.'
                )}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 flex flex-col items-center">
            <h4 className="text-center text-white text-lg font-light mb-8 max-w-3xl">
              {t(
                "2010'dan 2029'a kadar dünya çapında oluşturulan, yakalanan, kopyalanan ve tüketilen veri veya bilgi hacmi (zettabayt cinsinden)",
                'Volume of data/information created, captured, copied, and consumed worldwide from 2010 to 2029 (in zettabytes)'
              )}
            </h4>
            <div className="relative h-80 md:h-[400px] w-full flex items-end justify-between gap-1 md:gap-2 p-6 panel">
              {chartData.map((val, idx) => (
                <motion.div
                  key={idx}
                  className="w-full bg-blue-600 rounded-t-sm opacity-90 hover:opacity-100 hover:bg-blue-400 transition-colors relative group"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(val / 405) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white bg-slate-800 px-2 py-1 rounded transition-opacity hidden md:block whitespace-nowrap">
                    {val} ZB
                  </div>
                </motion.div>
              ))}
              <div className="absolute bottom-2 left-6 right-6 flex justify-between text-xs text-slate-400 font-mono">
                <span>2010</span>
                <span>2029</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 self-end">{t('Kaynak', 'Source')}: https://www.statista.com/statistics/871513/worldwide-data-created/</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
