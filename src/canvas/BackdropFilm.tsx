import { useEffect, useRef, useState } from 'react';
import { dive } from '../utils/dive';

// The client's cinematic (10s, 4 scenes) scrubbed by scroll. Each act maps
// to a time window inside the film so scene CUTS land exactly on section
// boundaries: server hall → blade lift from the tank (brochure p8) →
// lab vials (p11) → efficiency icons (p15).

const SRC = '/world/visual.mp4';
const POSTER = '/world/poster.jpg';

// scene windows (s): hall 0–2.45, blade 2.55–4.95, icons 5.05–7.45, vials 7.55–9.95
// act → [t0, t1]; within an act we scrub t0→t1 by actProgress
const WIN: [number, number][] = [
  [0.0, 1.0],    // 0 surface — hall push-in begins
  [1.0, 1.7],    // 1 breach
  [1.7, 2.45],   // 2 descent — hall bottoms out
  [2.45, 2.45],  // 3 problem — hold (text carries the beat)
  [2.55, 3.9],   // 4 solution — blade lifts from the fluid
  [3.9, 4.95],   // 5 contact — lift completes, drips
  [7.55, 8.9],   // 6 proof — lab vials, amber vs clear
  [8.9, 9.95],   // 7 protocol — vials settle
  [5.05, 7.45],  // 8 stable — efficiency icon wall
  [7.45, 7.45],  // 9 sealed — hold
];
// the icons scene is white — push the scrim harder there so text stays first
const WHITE_SEG: [number, number] = [5.0, 7.5];

export default function BackdropFilm({ onReady, onMissing }: { onReady?: () => void; onMissing?: () => void }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let blob: string | null = null;
    fetch(SRC)
      .then((r) => {
        // dev servers SPA-fallback missing files to index.html — demand real video
        if (!r.ok || !(r.headers.get('content-type') || '').includes('video')) throw new Error(String(r.status));
        return r.blob();
      })
      .then((b) => {
        blob = URL.createObjectURL(b);
        if (ref.current) ref.current.src = blob;
        onReady?.();
      })
      .catch(() => {
        setFailed(true);
        onMissing?.();
      });

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (reduced.current) return;
      const v = ref.current;
      if (!v || v.readyState < 1 || !(v.duration > 0) || v.seeking) return;
      const [t0, t1] = WIN[Math.min(dive.act, WIN.length - 1)];
      const target = Math.min(v.duration - 0.05, t0 + (t1 - t0) * Math.min(1, Math.max(0, dive.actProgress)));
      if (Math.abs(v.currentTime - target) > 0.033) v.currentTime = target;
      if (scrimRef.current) {
        const inWhite = target >= WHITE_SEG[0] && target <= WHITE_SEG[1];
        scrimRef.current.style.opacity = inWhite ? '0.82' : '0';
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (blob) URL.revokeObjectURL(blob);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617]">
      <video
        ref={ref}
        muted
        playsInline
        preload="none"
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* gentle grade so overlay text always wins */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-transparent to-[#020617]/60" />
      {/* heavy scrim for the white icons scene */}
      <div ref={scrimRef} className="absolute inset-0 bg-[#020617] transition-opacity duration-700" style={{ opacity: 0 }} />
    </div>
  );
}
