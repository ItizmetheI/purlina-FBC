import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function StatCard({ icon, stat, label, suffix = "%" }: { icon: React.ReactNode, stat: number, label: React.ReactNode, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { bounce: 0, duration: 2500 });
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      spring.set(stat);
    }
  }, [isInView, stat, spring]);

  const displayValue = useTransform(spring, (current) => Math.round(current));

  return (
    <div 
      ref={ref} 
      className="group flex flex-col items-center text-center gap-4 panel p-8 hover:border-brand-cyan/40 hover:bg-white/10 transition-all duration-500 overflow-hidden relative cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={`w-20 h-20 bg-brand-cyan/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-brand-cyan/20 transition-all duration-500 relative z-10 ${!isHovered && isInView ? 'blur-[1px]' : 'blur-0'}`}>
         {icon}
      </div>
      
      <div className={`flex items-baseline gap-1 relative z-10 transition-[filter] duration-500 ${!isHovered && isInView ? 'blur-[1px]' : 'blur-0'}`}>
        <span className="text-3xl font-display font-bold text-white/50">{suffix}</span>
        <motion.span className="text-6xl font-display font-bold text-brand-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{displayValue}</motion.span>
      </div>
      
      <h4 className={`font-bold text-white text-lg relative z-10 transition-[filter] duration-500 ${!isHovered && isInView ? 'blur-[0.5px]' : 'blur-0'}`}>{label}</h4>
    </div>
  );
}
