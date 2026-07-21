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

// Smooth blue → amber → red ramp so the readout never hard-flips color.
const STOPS: [number, [number, number, number]][] = [
  [48, [59, 109, 246]],  // #3b6df6
  [62, [245, 158, 11]],  // #f59e0b
  [82, [239, 68, 68]],   // #ef4444
];
function tempColor(temp: number): string {
  let [r, g, b] = STOPS[0][1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [t0, c0] = STOPS[i];
    const [t1, c1] = STOPS[i + 1];
    if (temp >= t1) { [r, g, b] = c1; continue; }
    if (temp > t0) {
      const k = (temp - t0) / (t1 - t0);
      r = c0[0] + (c1[0] - c0[0]) * k;
      g = c0[1] + (c1[1] - c0[1]) * k;
      b = c0[2] + (c1[2] - c0[2]) * k;
    }
  }
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export default function SystemHUD() {
  const tempRef = useRef<HTMLSpanElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const smoothTemp = useRef(42);
  const lastNow = useRef(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const now = performance.now();
      const dt = lastNow.current ? Math.min(0.1, (now - lastNow.current) / 1000) : 1 / 60;
      lastNow.current = now;
      const t = dive.act + dive.actProgress;
      const target = tempFor(t);
      // frame-rate-independent damping — a fixed per-frame factor would
      // approach target at different wall-clock speeds on 30/60/144Hz screens
      smoothTemp.current += (target - smoothTemp.current) * (1 - Math.exp(-dt * 4));
      const temp = smoothTemp.current;

      const color = tempColor(temp);
      if (tempRef.current) {
        tempRef.current.textContent = `${temp.toFixed(1)}°C`;
        tempRef.current.style.color = color;
      }
      if (depthRef.current) {
        depthRef.current.textContent = `-${String(Math.round(dive.depth)).padStart(2, '0')} M`;
      }
      if (barRef.current) {
        const pct = Math.min(100, Math.max(4, ((temp - 30) / 65) * 100));
        barRef.current.style.width = `${pct}%`;
        barRef.current.style.background = color;
      }
      setAct((c) => (c !== dive.act ? dive.act : c));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* Dive computer — desktop only; bows out before the footer contact block */}
      <div className={`fixed bottom-6 right-6 z-40 hidden md:flex flex-col gap-2 pointer-events-none select-none font-mono text-[10px] tracking-[0.2em] uppercase transition-opacity duration-700 ${act >= 9 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="border border-white/10 bg-[#020617]/70 backdrop-blur-md px-4 py-3 rounded-lg min-w-[190px]">
          <div className="flex justify-between items-baseline gap-4 mb-1">
            <span className="text-slate-500">Coolant</span>
            <span ref={tempRef} className="text-sm font-bold tabular-nums text-right" style={{ color: '#3b6df6' }}>42.0°C</span>
          </div>
          <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden mb-3">
            <div ref={barRef} className="h-full rounded-full transition-none" style={{ width: '20%', background: '#3b6df6' }} />
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
        className={`fixed bottom-4 left-6 z-[5] pointer-events-none select-none hidden md:block font-display font-bold leading-none animate-[hudFade_1.2s_ease-out] transition-opacity duration-700 ${act >= 9 ? 'opacity-0' : 'opacity-100'}`}
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
