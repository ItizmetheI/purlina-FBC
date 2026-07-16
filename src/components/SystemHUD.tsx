import { useEffect, useRef, useState } from 'react';
import { dive, ACTS } from '../utils/dive';

// Coolant temperature narrative: calm at the surface, spiking through
// the problem act, cooled by the product, stable thereafter.
function tempFor(t: number): number {
  if (t <= 3) return 42 + t * 1.3;               // calm descent, 42 → 46
  if (t <= 4) return 46 + (t - 3) * 48;          // spike to 94 — the problem act
  if (t <= 6) return 94 - ((t - 4) / 2) * 60;    // 94 → 34 — the product works
  return 34;                                      // stable environment
}

export default function SystemHUD() {
  const tempRef = useRef<HTMLSpanElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const smoothTemp = useRef(42);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const t = dive.act + dive.actProgress;
      const target = tempFor(t);
      smoothTemp.current += (target - smoothTemp.current) * 0.06;
      const temp = smoothTemp.current;

      if (tempRef.current) {
        tempRef.current.textContent = `${temp.toFixed(1)}°C`;
        tempRef.current.style.color =
          temp > 80 ? '#ef4444' : temp > 50 ? '#f59e0b' : '#22d3ee';
      }
      if (depthRef.current) {
        depthRef.current.textContent = `-${String(Math.round(dive.depth)).padStart(2, '0')} M`;
      }
      if (barRef.current) {
        const pct = Math.min(100, Math.max(4, ((temp - 30) / 65) * 100));
        barRef.current.style.width = `${pct}%`;
        barRef.current.style.background =
          temp > 80 ? '#ef4444' : temp > 50 ? '#f59e0b' : '#22d3ee';
      }
      setAct((c) => (c !== dive.act ? dive.act : c));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* Dive computer — desktop only */}
      <div className="fixed bottom-8 right-8 z-40 hidden md:flex flex-col gap-2 pointer-events-none select-none font-mono text-[10px] tracking-[0.2em] uppercase">
        <div className="border border-white/10 bg-[#020617]/70 backdrop-blur-md px-4 py-3 rounded-lg min-w-[190px]">
          <div className="flex justify-between items-baseline gap-4 mb-1">
            <span className="text-slate-500">Coolant</span>
            <span ref={tempRef} className="text-sm font-bold tabular-nums text-right" style={{ color: '#22d3ee' }}>42.0°C</span>
          </div>
          <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden mb-3">
            <div ref={barRef} className="h-full rounded-full transition-none" style={{ width: '20%', background: '#22d3ee' }} />
          </div>
          <div className="flex justify-between items-baseline gap-4 mb-2">
            <span className="text-slate-500">Depth</span>
            <span ref={depthRef} className="text-white tabular-nums text-right">-00 M</span>
          </div>
          <div className="flex justify-between items-baseline gap-4">
            <span className="text-slate-500 shrink-0">Status</span>
            <span className="text-brand-cyan text-right">{ACTS[act]?.status ?? ACTS[0].status}</span>
          </div>
        </div>
      </div>

      {/* Ghost act numeral — the film's chapter card */}
      <div
        key={act}
        className="fixed bottom-4 left-6 z-[5] pointer-events-none select-none hidden md:block font-display font-bold leading-none animate-[hudFade_1.2s_ease-out]"
        style={{
          fontSize: '16vh',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(148, 163, 184, 0.12)',
        }}
      >
        {String(act + 1).padStart(2, '0')}
      </div>
    </>
  );
}
