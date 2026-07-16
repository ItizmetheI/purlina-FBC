import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../lib/lang';

export default function EvolutionQuote() {
  const [scanMode, setScanMode] = useState(false);
  const { t } = useLang();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" as const } }
  };
  
  const labelVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="evolution" className="relative min-h-screen py-32 flex flex-col items-center justify-center px-4 md:px-12 z-10 pointer-events-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto text-center flex flex-col items-center gap-12">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-display font-medium text-white mb-2 leading-tight">{t('Soğutmanın Değil,', 'Not Just Cooling,')}</h2>
          <h2 className="text-4xl md:text-6xl font-display font-medium text-white leading-tight">{t('Evrimin Kararlı Ortamı', 'But a Stable Environment for Evolution')}</h2>
        </motion.div>

        {/* Annotated Pod Diagram */}
        <motion.div 
          className="relative w-full max-w-2xl mt-16 mx-auto h-[400px] flex justify-center items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Isometric Pod SVG */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0 z-10" data-cursor="scan" onMouseEnter={() => setScanMode(true)} onMouseLeave={() => setScanMode(false)}>
          {scanMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 border border-brand-cyan/50 bg-brand-cyan/5 pointer-events-none rounded-xl z-20 overflow-hidden"
            >
              <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,1)]"
              />
            </motion.div>
          )}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <defs>
                <linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="fluidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(6,182,212,0.8)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.5)" />
                </linearGradient>
                <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>
              
              {/* Back walls of tank */}
              <polygon points="100,20 160,50 160,130 100,100" fill="url(#tankGrad)" opacity="0.8" stroke="#1e293b" strokeWidth="1" />
              <polygon points="100,20 40,50 40,130 100,100" fill="url(#tankGrad)" opacity="0.5" stroke="#1e293b" strokeWidth="1" />
              
              {/* Fluid inside */}
              <polygon points="100,50 150,75 100,100 50,75" fill="url(#fluidGrad)" className="transition-opacity duration-700" style={{ opacity: scanMode ? 0.3 : 1 }} />
              <polygon points="50,75 100,100 100,160 50,135" fill="url(#fluidGrad)" className="transition-opacity duration-700" style={{ opacity: scanMode ? 0.2 : 0.7 }} />
              <polygon points="150,75 100,100 100,160 150,135" fill="url(#fluidGrad)" className="transition-opacity duration-700" style={{ opacity: scanMode ? 0.1 : 0.4 }} />
              
              {/* Server blades */}
              {[1, 2, 3, 4, 5].map((i) => (
                <g key={i} transform={`translate(${i * 6 - 15}, ${i * 3 - 5})`}>
                  <polygon points="100,40 105,42.5 105,82.5 100,80" fill="url(#serverGrad)" stroke="#475569" strokeWidth="0.5" />
                  <polygon points="95,42.5 100,40 100,80 95,82.5" fill={scanMode ? "#0ea5e9" : "#0f172a"} stroke="#475569" strokeWidth="0.5" className="transition-colors duration-500 delay-100" />
                  <polygon points="100,40 105,42.5 95,47.5 90,45" fill="#1e293b" />
                  {/* Server lights */}
                  <circle cx="102" cy="45" r="0.8" fill="#06B6D4" />
                  <circle cx="102" cy="48" r="0.8" fill="#3b82f6" />
                </g>
              ))}

              {/* CDU attached to side */}
              <polygon points="160,60 180,70 180,120 160,110" fill="url(#tankGrad)" stroke="#334155" strokeWidth="1" />
              <polygon points="160,60 150,55 170,65 180,70" fill="#1e293b" />
              
              {/* Front glass of tank */}
              <polygon points="40,50 100,80 160,50 100,20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <polygon points="40,50 100,80 100,160 40,130" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <polygon points="160,50 100,80 100,160 160,130" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

              {/* Bottom edge */}
              <polyline points="40,130 100,160 160,130" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="40,50 100,80 160,50" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
              <line x1="100" y1="80" x2="100" y2="160" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
              
              {/* Pipes */}
              {/* Hot Water Outlet */}
              <polyline points="180,80 195,72" fill="none" stroke="#ef4444" strokeWidth="2" />
              <polygon points="195,72 192,70 196,68 198,73" fill="#ef4444" />
              {/* Cold Water Inlet */}
              <polyline points="180,110 195,102" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <polygon points="195,102 192,100 196,98 198,103" fill="#3b82f6" />
            </svg>
          </div>

          {/* SVG Callout Lines - Overlay */}
          <svg viewBox="0 0 700 400" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Server Callout */}
            <motion.path 
              d="M 280 180 L 150 180 L 100 140" 
              fill="none" 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="1" 
              variants={pathVariants} 
              className="hidden md:block"
            />
            {/* Pod Callout */}
            <motion.path 
              d="M 280 280 L 150 280 L 100 240" 
              fill="none" 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="1" 
              variants={pathVariants} 
              className="hidden md:block"
            />
            {/* CDU Callout */}
            <motion.path 
              d="M 420 180 L 550 180 L 600 140" 
              fill="none" 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="1" 
              variants={pathVariants} 
              className="hidden md:block"
            />
             {/* Hot Water Callout */}
             <motion.path 
              d="M 450 230 L 550 230 L 600 200" 
              fill="none" 
              stroke="rgba(239, 68, 68, 0.4)" 
              strokeWidth="1" 
              variants={pathVariants} 
              className="hidden md:block"
            />
            {/* Cold Water Callout */}
             <motion.path 
              d="M 450 280 L 550 280 L 600 250" 
              fill="none" 
              stroke="rgba(59, 130, 246, 0.4)" 
              strokeWidth="1" 
              variants={pathVariants} 
              className="hidden md:block"
            />
          </svg>

          {/* HTML Labels */}
          {/* Servers */}
          <motion.div variants={labelVariants} className="absolute left-[14.28%] top-[35%] -translate-y-1/2 -translate-x-[110%] text-right hidden md:block">
            <span className="font-mono text-white text-sm md:text-base tracking-widest uppercase">Servers</span>
          </motion.div>
          {/* Pod */}
          <motion.div variants={labelVariants} className="absolute left-[14.28%] top-[60%] -translate-y-1/2 -translate-x-[110%] text-right hidden md:block">
            <span className="font-mono text-white text-sm md:text-base tracking-widest uppercase">Pod</span>
          </motion.div>
          {/* CDU */}
          <motion.div variants={labelVariants} className="absolute left-[85.7%] top-[35%] -translate-y-1/2 translate-x-[10%] text-left hidden md:block">
            <span className="font-mono text-white text-sm md:text-base tracking-widest uppercase">CDU</span>
          </motion.div>
          {/* Hot Water */}
          <motion.div variants={labelVariants} className="absolute left-[85.7%] top-[50%] -translate-y-1/2 translate-x-[10%] text-left hidden md:block">
            <span className="font-mono text-red-400 text-xs md:text-sm tracking-widest uppercase whitespace-nowrap">Hot Water Outlet</span>
          </motion.div>
          {/* Cold Water */}
          <motion.div variants={labelVariants} className="absolute left-[85.7%] top-[62.5%] -translate-y-1/2 translate-x-[10%] text-left hidden md:block">
            <span className="font-mono text-brand-cyan text-xs md:text-sm tracking-widest uppercase whitespace-nowrap">Cold Water Inlet</span>
          </motion.div>

          {/* Floating Tag */}
          <motion.div variants={labelVariants} className="absolute bottom-4 right-1/2 translate-x-1/2 md:translate-x-0 md:bottom-12 md:right-1/4 px-4 py-1.5 bg-brand-cyan/10 border border-brand-cyan/30 rounded-full backdrop-blur-md">
            <span className="font-display font-bold text-brand-cyan text-xs tracking-widest">PURLINA MATRIX CORE</span>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
