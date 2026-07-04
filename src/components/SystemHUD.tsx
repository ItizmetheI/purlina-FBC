import { useEffect, useRef, useState } from 'react';
import { chapterState } from '../utils/chapterEngine';

// Status line per chapter — the story told as telemetry
const STATUS = [
  'SURFACE CONTACT', 'POD PROXIMITY', 'SUBMERGING', 'THERMAL LOAD CRITICAL',
  'HEAT TRANSFER ACTIVE', 'DIRECT CONTACT', 'ENVIRONMENT STABLE',
  'HANDLING PROTOCOL', 'SYSTEM OPTIMAL', 'SEALED',
];

// Coolant temperature narrative: hot at the surface, spiking in the
// problem chapter, cooling through the solution, stable thereafter.
function tempFor(t: number): number {
  if (t <= 2) return 88 - (t / 2) * 10;            // 88 → 78 approaching the water
  if (t <= 3) return 78 + (t - 2) * 16;            // spike to 94 — the problem
  if (t <= 5) return 94 - ((t - 3) / 2) * 58;      // 94 → 36 — the product works
  return 34;                                        // stable environment
}

function depthFor(t: number): number {
  return Math.min(14, Math.max(0, (t / 3) * 14));
}

export default function SystemHUD() {
  const tempRef = useRef<HTMLSpanElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const smoothTemp = useRef(88);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const t = chapterState.chapter + chapterState.chapterProgress;
      const target = tempFor(t);
      smoothTemp.current += (target - smoothTemp.current) * 0.06;
      const temp = smoothTemp.current;

      if (tempRef.current) {
        tempRef.current.textContent = `${temp.toFixed(1)}°C`;
        tempRef.current.style.color =
          temp > 80 ? '#ef4444' : temp > 50 ? '#f59e0b' : '#06B6D4';
      }
      if (depthRef.current) {
        depthRef.current.textContent = `-${String(Math.round(depthFor(t))).padStart(2, '0')} M`;
      }
      if (barRef.current) {
        const pct = Math.min(100, Math.max(4, ((temp - 30) / 65) * 100));
        barRef.current.style.width = `${pct}%`;
        barRef.current.style.background =
          temp > 80 ? '#ef4444' : temp > 50 ? '#f59e0b' : '#06B6D4';
      }
      setChapter((c) => (c !== chapterState.chapter ? chapterState.chapter : c));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* Telemetry HUD — desktop only */}
      <div className="fixed bottom-8 right-8 z-40 hidden md:flex flex-col gap-2 pointer-events-none select-none font-mono text-[10px] tracking-[0.2em] uppercase">
        <div className="border border-white/10 bg-[#020617]/70 backdrop-blur-md px-4 py-3 rounded-lg min-w-[190px]">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-slate-500">Coolant</span>
            <span ref={tempRef} className="text-sm font-bold tabular-nums" style={{ color: '#ef4444' }}>88.0°C</span>
          </div>
          <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden mb-3">
            <div ref={barRef} className="h-full rounded-full transition-none" style={{ width: '90%', background: '#ef4444' }} />
          </div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-slate-500">Depth</span>
            <span ref={depthRef} className="text-white tabular-nums">-00 M</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-slate-500">Status</span>
            <span className="text-brand-cyan">{STATUS[chapter] ?? STATUS[0]}</span>
          </div>
        </div>
      </div>

      {/* Ghost chapter numeral — the film's chapter card */}
      <div
        key={chapter}
        className="fixed bottom-4 left-6 z-[5] pointer-events-none select-none hidden md:block font-display font-bold leading-none animate-[hudFade_1.2s_ease-out]"
        style={{
          fontSize: '16vh',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(148, 163, 184, 0.12)',
        }}
      >
        {String(chapter + 1).padStart(2, '0')}
      </div>
    </>
  );
}
