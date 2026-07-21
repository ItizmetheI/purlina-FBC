import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Cinematic presence for a content block: it doesn't just scroll past —
// it surfaces out of the world as it approaches mid-viewport, holds, and
// dissolves back as the dive continues. Applied to every DOM section so
// text lives on the film's timeline instead of on a document.
export default function Cine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0.02, 0.22, 0.78, 0.98], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.02, 0.22, 0.78, 0.98], [80, 0, 0, -80]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="relative isolate cine-ink">
      {/* soft local backing so copy wins over live footage — no hard card edge */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.75)_0%,rgba(2,6,23,0.45)_55%,transparent_80%)]"
      />
      {children}
    </motion.div>
  );
}
