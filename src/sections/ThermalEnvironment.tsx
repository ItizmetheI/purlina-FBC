import { motion } from 'framer-motion';

export default function ThermalEnvironment() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section className="relative pointer-events-none h-[150vh] flex px-4 md:px-12 z-10">
      <div className="sticky top-0 h-screen w-full flex items-center">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col gap-16"
        >
          {/* Main Title Section */}
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl text-white font-display font-bold">
              PURLINA MATRIX CORE
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <p className="text-xl text-slate-300 font-medium leading-relaxed italic text-blue-400 not-italic">
                PURLINA MATRIX CORE yüksek yoğunluklu bilgi 
                işlem altyapıları için geliştirilmiş tek fazlı 
                dielectric immersion soğutma akışkanıdır.
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                GPU, CPU, VRM ve güç bileşenleri ile doğrudan 
                temas edecek şekilde tasarlanmıştır. Sıvı 
                yalnızca ısı transferi sağlamaz; aynı zamanda elektronik sistemlerin çalıştığı kararlı termal 
                ortamı oluşturur.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <p className="text-xl text-white font-medium leading-relaxed">
                PURLINA MATRIX CORE is a single-phase 
                dielectric immersion cooling fluid developed 
                for high-density computing infrastructures.
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                It is designed to come into direct contact 
                with GPUs, CPUs, VRMs, and power components. The fluid does not only provide heat 
                transfer; it also establishes the stable thermal environment in which electronic systems 
                operate.
              </p>
            </motion.div>
          </div>

          {/* Sub Header section */}
          <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8 mt-12">
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic">
               Termal Ortamın Yeniden Tasarlanması
             </motion.h3>
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-white font-display font-bold">
               Redesigning the Thermal Environment
             </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <p className="text-xl text-slate-300 font-medium leading-relaxed italic text-blue-400 not-italic">
                PURLINA MATRIX CORE, donanımın doğrudan 
                tek fazlı dielectric sıvı içine daldırıldığı 
                immersion sistemler için geliştirilmiştir. 
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                Fanları ortadan kaldırır, hava transfer kayıplarını 
                sıfırlar, evaporatif su kaybını minimize eder. Isı 
                doğrudan sıvıya aktarılır ve kontrollü biçimde 
                sistemden uzaklaştırılır.
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed italic">
                Bu mimaride sıvı yalnızca ısı taşımaz; işlem ortamını stabilize eder. Elektronik bileşenlerle 
                elektriksel ve kimyasal olarak pasif bir ilişki kurar. 
                Reaksiyona girmez, iletkenlik oluşturmaz, tortu 
                bırakmaz.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <p className="text-xl text-white font-medium leading-relaxed">
                PURLINA MATRIX CORE has been developed 
                for immersion systems in which hardware 
                is directly submerged in a single-phase 
                dielectric fluid.
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                It eliminates fans, removes air-transfer 
                losses, and minimizes evaporative water 
                loss. Heat is transferred directly to the fluid 
                and removed from the system in a 
                controlled manner.
              </p>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                In this architecture, the fluid does not merely 
                carry heat; it stabilizes the processing environment. It forms an electrically and chemically passive relationship with electronic 
                components. It does not react, does not 
                create conductivity, and leaves no residue.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-12 mt-8">
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-blue-400 mb-2 italic">Yüksek İzolasyon Gücü:</h4>
                  <p className="text-slate-300 italic font-light">35 kV üzerindeki dielectric breakdown voltajı ve 10¹² Ω·m seviyesindeki elektriksel direnci ile güvenli bir operasyon sağlar.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">High Insulation Strength:</h4>
                  <p className="text-slate-300 font-light">Provides safe operation with a dielectric breakdown voltage above 35 kV and an electrical resistivity at the level of 10¹² Ω·m.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-blue-400 mb-2 italic">Termal Kararlılık:</h4>
                  <p className="text-slate-300 italic font-light">Parlama noktası 240–265°C aralığındadır ve düşük uçuculuğu sayesinde sıvı kaybı minimize edilir.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Thermal Stability:</h4>
                  <p className="text-slate-300 font-light">The flash point ranges between 240–265°C, and its low volatility minimizes fluid loss.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-blue-400 mb-2 italic">Saf Yapı:</h4>
                  <p className="text-slate-300 italic font-light">Asit sayısı 0.01 mgKOH/g altındadır; kristal berraklığındaki yapısı optik sistemlerle tam uyum sağlar.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Pure Structure:</h4>
                  <p className="text-slate-300 font-light">The acid number is below 0.01 mgKOH/g, and its crystal-clear structure is fully compatible with optical systems.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
          </div>
    </section>
  );
}
