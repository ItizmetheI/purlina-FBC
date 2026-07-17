import { useEffect, useRef, useState } from 'react';
import { dive } from '../utils/dive';

// Hybrid world, layer 1: the Blender-rendered pod-hall film, one unbroken
// camera, scrubbed by scroll. Blob URL for guaranteed seekability,
// rAF-smoothed coalesced seeks. Layer 2 (particles/depth) draws above it.

const SRC = '/world/world.mp4';
const POSTER = '/world/poster.jpg';

export default function BackdropFilm({ onReady, onMissing }: { onReady?: () => void; onMissing?: () => void }) {
  const ref = useRef<HTMLVideoElement | null>(null);
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
      const target = Math.min(v.duration - 0.05, Math.max(0, dive.scroll) * v.duration);
      if (Math.abs(v.currentTime - target) > 0.033) v.currentTime = target;
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
    </div>
  );
}
