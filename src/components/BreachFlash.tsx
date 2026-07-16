import { useEffect, useRef } from 'react';
import { dive } from '../utils/dive';

// The signature beat: a soft light bloom as the camera pierces the
// meniscus. Pure DOM overlay — peaks at 0.8 m and is gone by 2 m.
export default function BreachFlash() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const d = dive.depth;
      const g = Math.exp(-((d - 0.8) * (d - 0.8)) / 0.18);
      if (ref.current) ref.current.style.opacity = (g * 0.45).toFixed(3);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[45] pointer-events-none opacity-0"
      style={{
        background:
          'radial-gradient(ellipse at 50% 42%, rgba(186,246,255,0.6), rgba(34,211,238,0.18) 45%, transparent 72%)',
      }}
    />
  );
}
