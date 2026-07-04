import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function HandlingPrecautions() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="relative pointer-events-none py-32 px-4 md:px-12 z-10">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto flex flex-col gap-32">
        {/* Page 13 equivalent (X1) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 border-b border-white/10 pb-8">
            <div className="flex-1 w-full flex flex-col md:flex-row justify-between gap-8">
              <div className="flex flex-col">
                <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-display font-light italic mb-2 text-blue-500">
                  Kullanım Talimatları Önlemler
                </motion.h2>
                <motion.p variants={itemVariants} className="text-lg text-slate-300 italic">
                  Bu ürünü kullanırken lütfen aşağıdaki önlemlere uyunuz.
                </motion.p>
              </div>
              
              <div className="flex flex-col md:text-right">
                <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-display font-bold mb-2 text-white">
                  Handling Precautions
                </motion.h2>
                <motion.p variants={itemVariants} className="text-lg text-slate-300">
                  Follow these precautions when handling this product.
                </motion.p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Turkish Column (Left) */}
            <motion.div variants={itemVariants} className="flex flex-col gap-10">
              <h3 className="text-4xl font-display font-bold text-blue-500">X1</h3>
              
              <div className="space-y-6 text-slate-300 italic font-light">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 not-italic">Bileşim</h4>
                  <p>Baz Yağ(lar), Katkı Maddeleri</p>
                </div>
                
                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 not-italic">Tehlike Piktogramları</h4>
                  <p>-</p>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 not-italic">Sinyal Kelimesi</h4>
                  <p>-</p>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 not-italic">Tehlike Bildirimi</h4>
                  <p>-</p>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-300 italic font-light">
                <h4 className="text-xl font-bold text-white mb-4 not-italic">Önlem Bildirimleri</h4>
                <ul className="space-y-2">
                  <li>• Tüm güvenlik önlemlerini okuyup anlamadan ürünü kullanmayın.</li>
                  <li>• Koruyucu eldiven/koruyucu giysi/göz koruyucu/yüz koruyucu kullanın.</li>
                  <li>• Ürünle göz temasına izin vermeyin. Ürünü yutmayın.</li>
                  <li>• Kullandıktan sonra ellerinizi iyice yıkayın.</li>
                  <li>• Bu ürünü kullanırken yemek yemeyin, içecek içmeyin veya sigara içmeyin.</li>
                </ul>
              </div>
              
              <div className="space-y-4 text-slate-300 italic font-light">
                <h4 className="text-xl font-bold text-white mb-4 not-italic">Önlemler</h4>
                <ul className="space-y-2">
                  <li>• YUTULMASI HALİNDE: Derhal bir ZEHİR DANIŞMA MERKEZİ/doktoru arayın.</li>
                  <li>• YUTULMASI HALİNDE: Ağzı çalkalayın. KUSMAYA ZORLAMAYIN.</li>
                  <li>• Ürün gözünüze temas etmesi halinde: Gözlerinizi bol su ile yıkayın ve derhal bir doktora başvurun.</li>
                  <li>• CİLDE TEMAS ETMESİ HALİNDE: Bol sabun ve su ile yıkayın.</li>
                </ul>
              </div>

              <div className="space-y-4 text-slate-300 italic font-light">
                <h4 className="text-xl font-bold text-white mb-4 not-italic">Saklama Koşulları</h4>
                <ul className="space-y-2">
                  <li>• Ürün, doğrudan güneş ışığına maruz kalmayacak şekilde serin ve iyi havalandırılan bir yerde saklanmalıdır.</li>
                  <li>• Açılmış kaplar sıkıca kapatılmalıdır.</li>
                </ul>
              </div>

              <div className="space-y-4 text-slate-300 italic font-light">
                <h4 className="text-xl font-bold text-white mb-4 not-italic">İmha Koşulları</h4>
                <ul className="space-y-2">
                  <li>• İçeriği/kabı yerel/bölgesel/ulusal/uluslararası düzenlemelere uygun olarak imha edin.</li>
                  <li>• Ürünün doğru kullanım yöntemleri konusunda herhangi bir şüpheniz varsa, kullanıma başlamadan önce satın aldığınız yere başvurun.</li>
                </ul>
              </div>
            </motion.div>
            
            {/* English Column (Right) */}
            <motion.div variants={itemVariants} className="flex flex-col gap-10">
              <h3 className="text-4xl font-display font-bold text-blue-500">X1</h3>
              
              <div className="space-y-6 text-slate-300 font-light">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 italic">Composition</h4>
                  <p>Base Oil(s), Additives</p>
                </div>
                
                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 italic">Hazard pictograms</h4>
                  <p>-</p>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 italic">Signal Word</h4>
                  <p>-</p>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 italic">Hazard Statement</h4>
                  <p>-</p>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-300 font-light">
                <h4 className="text-xl font-bold text-white mb-4 italic">Precautionary Statements</h4>
                <ul className="space-y-2">
                  <li>• Do not handle until all safety precautions have been read and understood.</li>
                  <li>• Wear protective gloves/protective clothing/eye protection/face protection.</li>
                  <li>• Do not allow the eyes to become exposed to the product. Do not swallow the product.</li>
                  <li>• Wash hands thoroughly after handling.</li>
                  <li>• Do not eat, drink or smoke when using this product.</li>
                </ul>
              </div>
              
              <div className="space-y-4 text-slate-300 font-light">
                <h4 className="text-xl font-bold text-white mb-4 italic">Response</h4>
                <ul className="space-y-2">
                  <li>• IF SWALLOWED: Immediately call a POISON CENTER/doctor.</li>
                  <li>• IF SWALLOWED: Rinse mouth. Do NOT induce vomiting.</li>
                  <li>• If the eyes are exposed to the product: Rinse the eyes with plenty of running water and immediately contact a physician.</li>
                  <li>• IF ON SKIN: Wash with plenty of soap and water.</li>
                </ul>
              </div>

              <div className="space-y-4 text-slate-300 font-light">
                <h4 className="text-xl font-bold text-white mb-4 italic">Storage</h4>
                <ul className="space-y-2">
                  <li>• The product must be stored in a cool, well-ventilated location where it will not be exposed to direct sunlight.</li>
                  <li>• Containers that have been opened must be tightly sealed.</li>
                </ul>
              </div>

              <div className="space-y-4 text-slate-300 font-light">
                <h4 className="text-xl font-bold text-white mb-4 italic">Disposal</h4>
                <ul className="space-y-2">
                  <li>• Dispose of contents/container in accordance with local/regional/national/international regulations.</li>
                  <li>• If there are any doubts about proper methods of handling the product, contact the point of purchase before proceeding with usage.</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>


        {/* Page 14 equivalent (X1, X2) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 border-b border-white/10 pb-8 mt-16 text-red-500">
            <div className="flex-1 w-full flex flex-col md:flex-row justify-between gap-8">
              <div className="flex flex-col">
                <motion.h2 variants={itemVariants} className="flex items-center gap-2 text-3xl md:text-5xl font-display font-light italic mb-2">
                  <AlertTriangle className="w-8 h-8" /> Kullanım Talimatları Önlemler
                </motion.h2>
                <motion.p variants={itemVariants} className="text-lg text-slate-300 italic">
                  Bu ürünü kullanırken lütfen aşağıdaki önlemlere uyunuz.
                </motion.p>
              </div>
              
              <div className="flex flex-col md:text-right">
                <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-display font-bold mb-2">
                  Handling Precautions
                </motion.h2>
                <motion.p variants={itemVariants} className="text-lg text-slate-300">
                  Follow these precautions when handling this product.
                </motion.p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Turkish Column (Left) */}
            <motion.div variants={itemVariants} className="flex flex-col gap-10">
              <h3 className="text-4xl font-display font-bold text-blue-500">X1, X2</h3>
              
              <div className="space-y-6 text-slate-300 italic font-light">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 not-italic">Bileşim</h4>
                  <p>Baz Yağ(lar), Katkı Maddeleri</p>
                </div>
                
                <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                  <h4 className="font-bold text-white mb-1 not-italic">Tehlike Piktogramları</h4>
                  <div className="w-12 h-12 bg-white flex items-center justify-center border-4 border-red-600 rotate-45 transform p-2">
                    <div className="w-full h-full border-2 border-black -rotate-45 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap overflow-hidden">
                         {/* Fake Health hazard icon */}<div className="w-4 h-4 rounded-full border-2 border-black"></div><div className="w-2 h-4 border-r-2 border-black rotate-12 absolute left-2 top-2"></div><div className="w-2 h-4 border-l-2 border-black -rotate-12 absolute right-2 top-2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 not-italic">Sinyal Kelimesi</h4>
                  <p className="not-italic text-red-500 font-bold">TEHLİKELİ MADDE</p>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 not-italic">Tehlike Bildirimi</h4>
                  <p>Yutulması ve solunum yollarına kaçması halinde ölümcül olabilir.</p>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-300 italic font-light">
                <h4 className="text-xl font-bold text-white mb-4 not-italic">Önlem Bildirimleri</h4>
                <ul className="space-y-2">
                  <li>• Tüm güvenlik önlemlerini okuyup anlamadan ürünü kullanmayın.</li>
                  <li>• Koruyucu eldiven/koruyucu giysi/göz koruyucu/yüz koruyucu kullanın.</li>
                  <li>• Ürünle göz temasına izin vermeyin. Ürünü yutmayın.</li>
                  <li>• Kullandıktan sonra ellerinizi iyice yıkayın.</li>
                  <li>• Bu ürünü kullanırken yemek yemeyin, içecek içmeyin veya sigara içmeyin.</li>
                </ul>
              </div>
              
              <div className="space-y-4 text-slate-300 italic font-light">
                <h4 className="text-xl font-bold text-white mb-4 not-italic">Önlemler</h4>
                <ul className="space-y-2">
                  <li>• YUTULMASI HALİNDE: Derhal bir ZEHİR DANIŞMA MERKEZİ/doktoru arayın.</li>
                  <li>• YUTULMASI HALİNDE: Ağzı çalkalayın. KUSMAYA ZORLAMAYIN.</li>
                  <li>• Ürün gözünüze temas etmesi halinde: Gözlerinizi bol su ile yıkayın ve derhal bir doktora başvurun.</li>
                  <li>• CİLDE TEMAS ETMESİ HALİNDE: Bol sabun ve su ile yıkayın.</li>
                </ul>
              </div>

              <div className="space-y-4 text-slate-300 italic font-light">
                <h4 className="text-xl font-bold text-white mb-4 not-italic">Saklama Koşulları</h4>
                <ul className="space-y-2">
                  <li>• Ürün, doğrudan güneş ışığına maruz kalmayacak şekilde serin ve iyi havalandırılan bir yerde saklanmalıdır.</li>
                  <li>• Açılmış kaplar sıkıca kapatılmalıdır.</li>
                </ul>
              </div>

              <div className="space-y-4 text-slate-300 italic font-light">
                <h4 className="text-xl font-bold text-white mb-4 not-italic">İmha Koşulları</h4>
                <ul className="space-y-2">
                  <li>• İçeriği/kabı yerel/bölgesel/ulusal/uluslararası düzenlemelere uygun olarak imha edin.</li>
                  <li>• Ürünün doğru kullanım yöntemleri konusunda herhangi bir şüpheniz varsa, kullanıma başlamadan önce satın aldığınız yere başvurun.</li>
                </ul>
              </div>
            </motion.div>
            
            {/* English Column (Right) */}
            <motion.div variants={itemVariants} className="flex flex-col gap-10">
              <h3 className="text-4xl font-display font-bold text-blue-500">X1, X2</h3>
              
              <div className="space-y-6 text-slate-300 font-light">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 italic">Composition</h4>
                  <p>Base Oil(s), Additives</p>
                </div>
                
                <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                  <h4 className="font-bold text-white mb-1 italic">Hazard pictograms</h4>
                  <div className="w-12 h-12 bg-white flex items-center justify-center border-4 border-red-600 rotate-45 transform p-2">
                    <div className="w-full h-full border-2 border-black -rotate-45 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap overflow-hidden">
                         {/* Fake Health hazard icon */}<div className="w-4 h-4 rounded-full border-2 border-black"></div><div className="w-2 h-4 border-r-2 border-black rotate-12 absolute left-2 top-2"></div><div className="w-2 h-4 border-l-2 border-black -rotate-12 absolute right-2 top-2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 italic">Signal Word</h4>
                  <p className="text-red-500 font-bold">DANGER</p>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <h4 className="font-bold text-white mb-1 italic">Hazard Statement</h4>
                  <p>May be fatal if swallowed and enters airways</p>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-300 font-light">
                <h4 className="text-xl font-bold text-white mb-4 italic">Precautionary Statements</h4>
                <ul className="space-y-2">
                  <li>• Do not handle until all safety precautions have been read and understood.</li>
                  <li>• Wear protective gloves/protective clothing/eye protection/face protection.</li>
                  <li>• Do not allow the eyes to become exposed to the product. Do not swallow the product.</li>
                  <li>• Wash hands thoroughly after handling.</li>
                  <li>• Do not eat, drink or smoke when using this product.</li>
                </ul>
              </div>
              
              <div className="space-y-4 text-slate-300 font-light">
                <h4 className="text-xl font-bold text-white mb-4 italic">Response</h4>
                <ul className="space-y-2">
                  <li>• IF SWALLOWED: Immediately call a POISON CENTER/doctor.</li>
                  <li>• IF SWALLOWED: Rinse mouth. Do NOT induce vomiting.</li>
                  <li>• If the eyes are exposed to the product: Rinse the eyes with plenty of running water and immediately contact a physician.</li>
                  <li>• IF ON SKIN: Wash with plenty of soap and water.</li>
                </ul>
              </div>

              <div className="space-y-4 text-slate-300 font-light">
                <h4 className="text-xl font-bold text-white mb-4 italic">Storage</h4>
                <ul className="space-y-2">
                  <li>• The product must be stored in a cool, well-ventilated location where it will not be exposed to direct sunlight.</li>
                  <li>• Containers that have been opened must be tightly sealed.</li>
                </ul>
              </div>

              <div className="space-y-4 text-slate-300 font-light">
                <h4 className="text-xl font-bold text-white mb-4 italic">Disposal</h4>
                <ul className="space-y-2">
                  <li>• Dispose of contents/container in accordance with local/regional/national/international regulations.</li>
                  <li>• If there are any doubts about proper methods of handling the product, contact the point of purchase before proceeding with usage.</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
