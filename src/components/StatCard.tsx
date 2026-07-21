import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

export default function StatCard({ icon, stat, label, suffix = "%" }: { icon: React.ReactNode, stat: number, label: React.ReactNode, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { bounce: 0, duration: 2500 });

  useEffect(() => {
    if (isInView) {
      spring.set(stat);
    }
  }, [isInView, stat, spring]);

  const displayValue = useTransform(spring, (current) => Math.round(current));

  return (
    <div
      ref={ref}
      className="group flex flex-col items-center text-center gap-4 panel p-8 hover:border-brand-cyan/40 hover:bg-white/[0.06] transition-colors duration-500 overflow-hidden relative cursor-default"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="w-20 h-20 bg-brand-cyan/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-brand-cyan/20 transition-colors duration-500 relative z-10">
         {icon}
      </div>

      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-3xl font-display font-bold text-white/50">{suffix}</span>
        <motion.span className="text-6xl font-display font-bold text-brand-cyan tabular-nums">{displayValue}</motion.span>
      </div>

      <h4 className="font-bold text-white text-lg relative z-10">{label}</h4>
    </div>
  );
}
