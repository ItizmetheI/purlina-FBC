import { useEffect, useRef, useState } from 'react';
import { dive } from '../utils/dive';

// The pre-rendered world: one continuous forward camera flight (6 legs,
// frame-locked seams) scrubbed by the dive's scroll position. Adapted from
// the scroll-world scrub engine: blob URLs for guaranteed seekability,
// rAF-smoothed currentTime, seek coalescing, tiny crossfade at seams.

const LEGS = [1, 2, 3, 4, 5, 6].map((i) => `/world/leg_${i}.mp4`);
const POSTERS = [1, 2, 3, 4, 5, 6].map((i) => `/world/poster_${i}.jpg`);

// which acts each leg covers (act index → cinematic beat)
const LEG_ACTS: [number, number][] = [
  [0, 0],   // exterior night          — SURFACE
  [1, 2],   // into the server hall    — BREACH + DESCENT
  [3, 3],   // tank room               — THE PROBLEM
  [4, 5],   // under the fluid line    — SOLUTION + CONTACT
  [6, 7],   // GPU macro               — PROOF + PROTOCOL
  [8, 9],   // product finale          — STABLE + SEALED
];

const CROSSFADE = 0.06; // fraction of a leg over which seams blend

function legProgress(): { leg: number; t: number } {
  const pos = dive.act + dive.actProgress; // 0..10
  for (let i = 0; i < LEG_ACTS.length; i++) {
    const [a, b] = LEG_ACTS[i];
    if (pos <= b + 1 || i === LEG_ACTS.length - 1) {
      const t = Math.min(1, Math.max(0, (pos - a) / (b - a + 1)));
      return { leg: i, t };
    }
  }
  return { leg: LEGS.length - 1, t: 1 };
}

export default function VideoWorld({ onReady }: { onReady?: () => void }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const blobs = useRef<(string | null)[]>(LEGS.map(() => null));
  const loading = useRef<boolean[]>(LEGS.map(() => false));
  const [failed, setFailed] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // blob-load a leg (guaranteed-seekable regardless of host byte-range support)
  const load = (i: number) => {
    if (i < 0 || i >= LEGS.length || blobs.current[i] || loading.current[i]) return;
    loading.current[i] = true;
    fetch(LEGS[i])
      .then((r) => {
        if (!r.ok || !(r.headers.get('content-type') || '').includes('video')) throw new Error(String(r.status));
        return r.blob();
      })
      .then((b) => {
        blobs.current[i] = URL.createObjectURL(b);
        const v = refs.current[i];
        if (v) v.src = blobs.current[i]!;
        if (i === 0) onReady?.();
      })
      .catch(() => {
        if (i === 0) {
          setFailed(true); // assets not generated yet — caller falls back
          onReady?.();
        }
      });
  };

  useEffect(() => {
    load(0);
    load(1);
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (failed || reduced.current) return;
      const { leg, t } = legProgress();
      load(leg);
      load(leg + 1);

      for (let i = 0; i < LEGS.length; i++) {
        const v = refs.current[i];
        if (!v) continue;
        const isCurrent = i === leg;
        const isNext = i === leg + 1;

        // seam crossfade: fade the next leg in over the last CROSSFADE of this leg
        let opacity = 0;
        if (isCurrent) opacity = 1;
        if (isNext && t > 1 - CROSSFADE) opacity = (t - (1 - CROSSFADE)) / CROSSFADE;
        if (isNext && t > 1 - CROSSFADE) {
          if (v.readyState >= 1 && !v.seeking && Math.abs(v.currentTime) > 0.05) v.currentTime = 0;
        }
        v.style.opacity = String(isNext ? opacity : isCurrent ? 1 : 0);
        v.style.zIndex = isNext ? '2' : isCurrent ? '1' : '0';

        if (isCurrent && v.readyState >= 1 && v.duration > 0 && !v.seeking) {
          const target = Math.min(v.duration - 0.05, t * v.duration);
          // coalesced seek: only issue when meaningfully different
          if (Math.abs(v.currentTime - target) > 0.033) v.currentTime = target;
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      blobs.current.forEach((u) => u && URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failed]);

  if (failed) return null; // no assets yet — App falls back to the WebGL world

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617]">
      {LEGS.map((_, i) => (
        <video
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          muted
          playsInline
          preload="none"
          poster={POSTERS[i]}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: i === 0 ? 1 : 0 }}
        />
      ))}
      {/* gentle grade so overlay text always wins */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/55 via-transparent to-[#020617]/65" />
    </div>
  );
}
