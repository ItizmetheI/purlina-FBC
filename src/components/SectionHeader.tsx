import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// The one section voice — scrubbed by scroll, not played by time.
// Words surface one by one as the film advances (and reverse when you
// scroll back); the kicker drifts at a different rate than the title,
// so the type has depth against the footage instead of sitting on it.

function Word({ word, index, total, progress }: {
  word: string; index: number; total: number; progress: MotionValue<number>;
}) {
  const start = 0.12 + (index / Math.max(1, total)) * 0.16;
  const end = start + 0.1;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [26, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.26em]">
      {word}
    </motion.span>
  );
}

export default function SectionHeader({ no, kicker, title, className = '' }: {
  no: string;
  kicker: string;
  title: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // differential parallax: kicker rides a faster lane than the title
  const kickerY = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -70]);
  const kickerOpacity = useTransform(scrollYProgress, [0.08, 0.18, 0.85, 0.97], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [36, 0, -36]);
  const ruleScale = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);

  const words = typeof title === 'string' ? title.split(' ') : null;

  return (
    <div ref={ref} className={`mb-14 ${className}`}>
      <motion.div style={{ y: kickerY, opacity: kickerOpacity }} className="flex items-baseline gap-4 mb-4">
        <span className="kicker">{no}</span>
        <span className="kicker text-slate-500">/</span>
        <span className="kicker">{kicker}</span>
      </motion.div>
      <motion.h2 style={{ y: titleY }} className="text-4xl md:text-6xl font-display font-bold text-white leading-[1.05] max-w-4xl">
        {words
          ? words.map((w, i) => (
              <Word key={`${w}-${i}`} word={w} index={i} total={words.length} progress={scrollYProgress} />
            ))
          : title}
      </motion.h2>
      <motion.div style={{ scaleX: ruleScale }} className="rule mt-8 origin-left" />
    </div>
  );
}
