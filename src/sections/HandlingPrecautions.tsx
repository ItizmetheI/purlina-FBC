import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useLang } from '../lib/lang';
import SectionHeader from '../components/SectionHeader';

// Safety copy mirrors brochure pages 13–14 verbatim — do not edit without
// confirmation from ALKİM (incl. the X1 grade appearing in both blocks).
const SHARED = {
  tr: {
    precautionary: [
      'Tüm güvenlik önlemlerini okuyup anlamadan ürünü kullanmayın.',
      'Koruyucu eldiven/koruyucu giysi/göz koruyucu/yüz koruyucu kullanın.',
      'Ürünle göz temasına izin vermeyin. Ürünü yutmayın.',
      'Kullandıktan sonra ellerinizi iyice yıkayın.',
      'Bu ürünü kullanırken yemek yemeyin, içecek içmeyin veya sigara içmeyin.',
    ],
    response: [
      'YUTULMASI HALİNDE: Derhal bir ZEHİR DANIŞMA MERKEZİ/doktoru arayın.',
      'YUTULMASI HALİNDE: Ağzı çalkalayın. KUSMAYA ZORLAMAYIN.',
      'Ürün gözünüze temas etmesi halinde: Gözlerinizi bol su ile yıkayın ve derhal bir doktora başvurun.',
      'CİLDE TEMAS ETMESİ HALİNDE: Bol sabun ve su ile yıkayın.',
    ],
    storage: [
      'Ürün, doğrudan güneş ışığına maruz kalmayacak şekilde serin ve iyi havalandırılan bir yerde saklanmalıdır.',
      'Açılmış kaplar sıkıca kapatılmalıdır.',
    ],
    disposal: [
      'İçeriği/kabı yerel/bölgesel/ulusal/uluslararası düzenlemelere uygun olarak imha edin.',
      'Ürünün doğru kullanım yöntemleri konusunda herhangi bir şüpheniz varsa, kullanıma başlamadan önce satın aldığınız yere başvurun.',
    ],
  },
  en: {
    precautionary: [
      'Do not handle until all safety precautions have been read and understood.',
      'Wear protective gloves/protective clothing/eye protection/face protection.',
      'Do not allow the eyes to become exposed to the product. Do not swallow the product.',
      'Wash hands thoroughly after handling.',
      'Do not eat, drink or smoke when using this product.',
    ],
    response: [
      'IF SWALLOWED: Immediately call a POISON CENTER/doctor.',
      'IF SWALLOWED: Rinse mouth. Do NOT induce vomiting.',
      'If the eyes are exposed to the product: Rinse the eyes with plenty of running water and immediately contact a physician.',
      'IF ON SKIN: Wash with plenty of soap and water.',
    ],
    storage: [
      'The product must be stored in a cool, well-ventilated location where it will not be exposed to direct sunlight.',
      'Containers that have been opened must be tightly sealed.',
    ],
    disposal: [
      'Dispose of contents/container in accordance with local/regional/national/international regulations.',
      'If there are any doubts about proper methods of handling the product, contact the point of purchase before proceeding with usage.',
    ],
  },
};

function HazardPictogram() {
  return (
    <div className="w-12 h-12 bg-white flex items-center justify-center border-4 border-red-600 rotate-45 transform p-2">
      <div className="w-full h-full border-2 border-black -rotate-45 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap overflow-hidden">
          <div className="w-4 h-4 rounded-full border-2 border-black"></div>
          <div className="w-2 h-4 border-r-2 border-black rotate-12 absolute left-2 top-2"></div>
          <div className="w-2 h-4 border-l-2 border-black -rotate-12 absolute right-2 top-2"></div>
        </div>
      </div>
    </div>
  );
}

export default function HandlingPrecautions() {
  const { t, lang } = useLang();
  const shared = SHARED[lang];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const blocks = [
    {
      grade: 'X1',
      danger: false,
      signal: '-',
      hazard: '-',
    },
    {
      grade: 'X1, X2',
      danger: true,
      signal: t('TEHLİKELİ MADDE', 'DANGER'),
      hazard: t(
        'Yutulması ve solunum yollarına kaçması halinde ölümcül olabilir.',
        'May be fatal if swallowed and enters airways'
      ),
    },
  ];

  const lists: { title: string; items: string[] }[] = [
    { title: t('Önlem Bildirimleri', 'Precautionary Statements'), items: shared.precautionary },
    { title: t('Önlemler', 'Response'), items: shared.response },
    { title: t('Saklama Koşulları', 'Storage'), items: shared.storage },
    { title: t('İmha Koşulları', 'Disposal'), items: shared.disposal },
  ];

  return (
    <section className="relative pointer-events-none py-32 px-4 md:px-12 z-10">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto flex flex-col gap-32 lg:pl-24">
        {blocks.map((block, bi) => (
          <motion.div
            key={bi}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <SectionHeader
              no="08"
              kicker={t('PROTOKOL — GÜVENLİK', 'PROTOCOL — SAFETY')}
              title={
                <span className={`inline-flex items-center gap-4 ${block.danger ? 'text-red-500' : ''}`}>
                  {block.danger && <AlertTriangle className="w-10 h-10 shrink-0" />}
                  {t('Kullanım Talimatları — Önlemler', 'Handling Precautions')}
                </span>
              }
              className="mb-6"
            />
            <motion.p variants={itemVariants} className="text-lg text-slate-300 mb-12">
              {t('Bu ürünü kullanırken lütfen aşağıdaki önlemlere uyunuz.', 'Follow these precautions when handling this product.')}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col gap-10">
              <h3 className="text-4xl font-display font-bold text-brand-cyan">{block.grade}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                <div className="space-y-6 text-slate-300 font-light">
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="font-bold text-white mb-1">{t('Bileşim', 'Composition')}</h4>
                    <p>{t('Baz Yağ(lar), Katkı Maddeleri', 'Base Oil(s), Additives')}</p>
                  </div>

                  <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                    <h4 className="font-bold text-white mb-1">{t('Tehlike Piktogramları', 'Hazard pictograms')}</h4>
                    {block.danger ? <HazardPictogram /> : <p>-</p>}
                  </div>

                  <div className="border-b border-white/10 pb-4">
                    <h4 className="font-bold text-white mb-1">{t('Sinyal Kelimesi', 'Signal Word')}</h4>
                    <p className={block.danger ? 'text-red-500 font-bold' : ''}>{block.signal}</p>
                  </div>

                  <div className="border-b border-white/10 pb-4">
                    <h4 className="font-bold text-white mb-1">{t('Tehlike Bildirimi', 'Hazard Statement')}</h4>
                    <p>{block.hazard}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  {lists.map((list, li) => (
                    <div key={li} className="space-y-3 text-slate-300 font-light">
                      <h4 className="text-xl font-bold text-white">{list.title}</h4>
                      <ul className="space-y-2">
                        {list.items.map((item, ii) => (
                          <li key={ii}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
