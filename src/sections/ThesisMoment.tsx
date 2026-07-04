import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// The brochure's thesis (p6), verbatim, as the film's moment of silence.
const TR_WORDS = 'Bu bir soğutma sıvısı değildir; işlemcilerin çalıştığı kararlı ortamdır.'.split(' ');
const EN_LINE = 'This is not a cooling fluid; it is the stable environment in which processors operate.';

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: any }) {
  const start = 0.1 + (index / total) * 0.45;
  const end = start + 0.08;
  const opacity = useTransform(progress, [start, end], [0.10, 1]);
  const y = useTransform(progress, [start, end], [12, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.28em]">
      {word}
    </motion.span>
  );
}

export default function ThesisMoment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const bgOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 0.92, 0.92, 0]);
  const enOpacity = useTransform(scrollYProgress, [0.62, 0.74], [0, 1]);
  const ruleWidth = useTransform(scrollYProgress, [0.55, 0.7], ['0%', '100%']);

  return (
    <section ref={containerRef} className="relative h-[300vh] z-10 pointer-events-none">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* dim the world — the moment of silence */}
        <motion.div className="absolute inset-0 bg-[#020617]" style={{ opacity: bgOpacity }} />
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: bgOpacity,
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,6,23,0.9) 100%)',
          }}
        />

        <div className="relative max-w-5xl px-6 md:px-12 text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl leading-[1.15] text-white">
            {TR_WORDS.map((w, i) => (
              <Word key={i} word={w} index={i} total={TR_WORDS.length} progress={scrollYProgress} />
            ))}
          </h2>

          <motion.div className="h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/60 to-transparent mx-auto mt-10 mb-8" style={{ width: ruleWidth }} />

          <motion.p style={{ opacity: enOpacity }} className="text-lg md:text-2xl text-brand-cyan/90 font-light italic leading-relaxed">
            {EN_LINE}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
