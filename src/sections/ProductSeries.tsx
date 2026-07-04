import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProductSeries() {
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const series = [
    {
      name: "X1",
      desc: "Optimized for GPU-dense systems that require high fluidity and maximum heat transfer.",
      descTr: "Yüksek akışkanlık ve maksimum ısı transferi gerektiren GPU yoğun sistemler için optimize edilmiştir.",
    },
    {
      name: "X2",
      desc: "Provides balanced performance between heat transfer and service life.",
      descTr: "Isı transferi ve servis ömrü arasında dengeli performans sunar.",
    },
    {
      name: "X3",
      desc: "Developed for 24/7 AI infrastructures operating under high thermal stress.",
      descTr: "Yüksek termal stres altında çalışan 7/24 AI altyapıları için geliştirilmiştir.",
    }
  ];

  const tableData = [
    { label: "Renk / Color (ASTM)", x1: "L0.5", x2: "L0.5", x3: "L0.5", unit: "" },
    { label: "Yoğunluk / Density (15oC)", x1: "0.837", x2: "0.809", x3: "0.819", unit: "g/cm³" },
    { label: "Kinematik Vizkozite/Kinematic Viscosity 40oC)", x1: "34.8", x2: "9.19", x3: "19.7", unit: "mm²/s" },
    { label: "Alevlenme Noktası / Flash Point (COC)", x1: "254", x2: "196", x3: "248", unit: "°C" },
    { label: "Otomatik Ateşleme Noktası / Auto-Ignition Point", x1: "402", x2: "336", x3: "387", unit: "°C" },
    { label: "Asit Sayısı / Acid Number", x1: "0.01", x2: "0.01", x3: "0.01", unit: "mgKOH/g" },
    { label: "Hacim Direnci / Volume Resistivity (25oC)", x1: ">1", x2: ">1", x3: ">1", unit: "TΩ . m" },
  ];

  return (
    <section className="relative pointer-events-none min-h-screen py-32 flex items-center px-4 md:px-12 z-10">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-8 gap-8 mb-12">
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-blue-500 font-display font-bold italic">
               PURLINA MATRIX CORE <span className="text-blue-400">X SERİSİ</span>
             </motion.h3>
             <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl text-white font-display font-bold">
               PURLINA MATRIX CORE <span className="text-blue-500">X SERIES</span>
             </motion.h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-16">
            <motion.p variants={itemVariants} className="text-xl text-slate-300 font-medium leading-relaxed italic text-blue-400">
              Farklı termal yük profilleri için üç ayrı viskozite segmenti geliştirilmiştir.
            </motion.p>
            <motion.p variants={itemVariants} className="text-xl text-slate-300 font-medium leading-relaxed text-white">
              Three separate viscosity segments have been developed for different thermal load profiles.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {series.map((item, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                data-cursor="hover"
                onMouseEnter={() => setHoveredSeries(item.name)}
                onMouseLeave={() => setHoveredSeries(null)}
                className="group relative rounded-[2rem] overflow-hidden bg-[#0f172a] border border-white/5 p-8 flex flex-col items-center text-center transition-all duration-500 hover:border-brand-cyan/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-2"
              >
                {/* Hover gradient reveal */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out mix-blend-overlay"></div>
                
                {/* Vial Graphic */}
                <div className="w-16 h-32 rounded-full border-2 border-white/10 mb-6 relative overflow-hidden flex flex-col justify-end p-[3px] transition-colors duration-500 group-hover:border-brand-cyan/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] z-10">
                  <div className="w-full bg-gradient-to-t from-blue-700 to-brand-cyan rounded-full transition-all duration-1000 ease-out opacity-60 group-hover:opacity-100" style={{ height: `${60 + i * 15}%` }} />
                </div>
                
                <h3 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-500 group-hover:from-cyan-400 group-hover:to-blue-600 mb-6 relative z-10 transition-all duration-500">
                  {item.name}
                </h3>
                <div className="flex flex-col gap-6 flex-grow relative z-10">
                  <p className="text-slate-400 group-hover:text-cyan-200 text-sm font-light italic transition-colors duration-500">
                    {item.descTr}
                  </p>
                  <p className="text-slate-500 group-hover:text-white text-xs font-light transition-colors duration-500">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-16 w-full">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-4xl text-blue-500 font-display font-bold italic mb-2">
                PURLINA MATRIX CORE Serisinin Tipik Özellikleri
              </h3>
              <h3 className="text-2xl md:text-4xl text-white font-display font-bold uppercase">
                TYPICAL PROPERTIES OF PURLINA MATRIX CORE Series
              </h3>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-4 px-4 text-white font-medium text-lg">Türü / Type</th>
                    <th className={`py-4 px-4 text-center font-bold text-xl transition-colors duration-300 ${hoveredSeries === "X1" ? "text-brand-cyan bg-brand-cyan/10 rounded-t-xl" : "text-blue-500"}`}>X1</th>
                    <th className={`py-4 px-4 text-center font-bold text-xl transition-colors duration-300 ${hoveredSeries === "X2" ? "text-brand-cyan bg-brand-cyan/10 rounded-t-xl" : "text-blue-500"}`}>X2</th>
                    <th className={`py-4 px-4 text-center font-bold text-xl transition-colors duration-300 ${hoveredSeries === "X3" ? "text-brand-cyan bg-brand-cyan/10 rounded-t-xl" : "text-blue-500"}`}>X3</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-slate-300 font-light flex justify-between">
                        <span>{row.label}</span>
                        <span className="text-slate-500 ml-4">{row.unit}</span>
                      </td>
                      <td className={`py-4 px-4 text-center font-mono transition-colors duration-300 ${hoveredSeries === "X1" ? "text-brand-cyan bg-brand-cyan/10" : "text-white"}`}>{row.x1}</td>
                      <td className={`py-4 px-4 text-center font-mono transition-colors duration-300 ${hoveredSeries === "X2" ? "text-brand-cyan bg-brand-cyan/10" : "text-white"}`}>{row.x2}</td>
                      <td className={`py-4 px-4 text-center font-mono transition-colors duration-300 ${hoveredSeries === "X3" ? "text-brand-cyan bg-brand-cyan/10" : "text-white"}`}>{row.x3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-col gap-1 text-slate-500 text-sm italic font-light">
              <p>Not: Tipik özellikler önceden haber verilmeksizin değiştirilebilir. (Mart 2026)</p>
              <p>Note: The typical properties may be changed without notice. (March 2026)</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
