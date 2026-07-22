import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { dive } from '../utils/dive';

// Three Higgsfield-generated scenes (Kling 3.0 Pro, 1920x1080, 10s each,
// concatenated: hall 0-10s, blade-lift 10-20s, vials 20-30s), scrubbed by
// scroll. Each act maps to a time window inside the film so scene CUTS
// land exactly on section boundaries: server hall -> blade lift from the
// tank (brochure p8) -> lab vials (p11).
//
// DEPTH: two layers from one blob source. BACK — full-bleed, oversized,
// blurred, always the current frame. FRONT — the sharp video inside a
// rounded "portal" whose inset closes and scale grows with actProgress,
// so scrolling pushes you INTO the frame (video inside a video).

const SRC = '/world/visual.mp4';
const BACK_SRC = '/world/visual-back.mp4'; // pre-blurred, pre-dimmed, 640x360 — baked offline so the browser never runs a live full-viewport blur() filter
const POSTER = '/world/poster.jpg';

// The film only plays where its footage MATCHES the content; elsewhere it
// fades out to the engineered dark backdrop instead of stretching thin.
// scene windows (s): hall 0-10, blade-lift 10-20, vials 20-30
// act → [t0, t1] scrub window, or null → film hidden for that act
const WIN: ([number, number] | null)[] = [
  [0.5, 5.0],    // 0 surface — hall push-in behind the wordmark
  [5.0, 9.5],    // 1 breach — hall continues, bottoms out
  null,          // 2 descent — engineered dark (text/TOC carries it)
  null,          // 3 problem — dark; the DOM chart owns this beat
  [10.5, 15.5],  // 4 solution — blade lifts from the fluid (p8)
  [15.5, 19.5],  // 5 contact — lift completes, drips
  [20.5, 29.5],  // 6 proof — cutaway + lab vials (p11)
  null,          // 7 protocol — dark; safety datasheets need calm
  null,          // 8 stable — dark; stat cards own it
  null,          // 9 sealed — dark; contact
];

export default function BackdropFilm({ onReady, onMissing }: { onReady?: () => void; onMissing?: () => void }) {
  const backRef = useRef<HTMLVideoElement | null>(null);
  const frontRef = useRef<HTMLVideoElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const pulseRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const reduced = useRef(false);

  // Depth-pulse ambient: fills the acts with no matching footage (a
  // sonar-style probe sweep, on-theme with the dive HUD) so those beats
  // read as a designed moment instead of dead air behind the copy.
  useEffect(() => {
    if (reduced.current || !pulseRef.current) return;
    const rings = pulseRef.current.querySelectorAll<HTMLElement>('.pulse-ring');
    animate(rings, {
      scale: [0.5, 1.9],
      opacity: [0.55, 0],
      duration: 3200,
      ease: 'outSine',
      loop: true,
      delay: stagger(1000),
    });
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frontBlob: string | null = null;
    let backBlob: string | null = null;
    const asBlob = (r: Response) => {
      // dev servers SPA-fallback missing files to index.html — demand real video
      if (!r.ok || !(r.headers.get('content-type') || '').includes('video')) throw new Error(String(r.status));
      return r.blob();
    };
    Promise.all([fetch(SRC).then(asBlob), fetch(BACK_SRC).then(asBlob)])
      .then(([fb, bb]) => {
        frontBlob = URL.createObjectURL(fb);
        backBlob = URL.createObjectURL(bb);
        if (frontRef.current) frontRef.current.src = frontBlob;
        if (backRef.current) backRef.current.src = backBlob;
        onReady?.();
      })
      .catch(() => {
        setFailed(true);
        onMissing?.();
      });

    // seek gating: only issue a new seek once the previous frame PRESENTED
    // (rVFC where available) — prevents seek-queue pileup = visible stutter
    const busy = new WeakMap<HTMLVideoElement, boolean>();
    const seek = (v: HTMLVideoElement | null, target: number) => {
      if (!v || v.readyState < 1 || !(v.duration > 0) || v.seeking || busy.get(v)) return;
      const t = Math.min(v.duration - 0.05, target);
      if (Math.abs(v.currentTime - t) <= 0.033) return;
      busy.set(v, true);
      const rvfc = (v as any).requestVideoFrameCallback;
      if (typeof rvfc === 'function') {
        rvfc.call(v, () => busy.set(v, false));
      } else {
        v.addEventListener('seeked', () => busy.set(v, false), { once: true });
      }
      v.currentTime = t;
    };

    // critically-damped followers: film time + portal depth chase the scroll
    // target continuously instead of stepping straight to it
    let curT = 0;      // eased film time (s)
    let curP = 0;      // eased portal progress 0..1
    let lastWin: [number, number] | null = null;
    let lastNow = performance.now();

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastNow) / 1000);
      lastNow = now;
      if (reduced.current) return;
      const back = backRef.current;
      const portal = portalRef.current;
      if (!back || !portal) return;
      const win = WIN[Math.min(dive.act, WIN.length - 1)];
      // fade the film in/out on act boundaries instead of stretching it
      back.style.opacity = win ? '1' : '0';
      portal.style.opacity = win ? '1' : '0';
      if (pulseRef.current) pulseRef.current.style.opacity = win ? '0' : '1';
      if (!win) return;
      const [t0, t1] = win;
      const p = Math.min(1, Math.max(0, dive.actProgress));
      const targetT = t0 + (t1 - t0) * p;
      const ease = 1 - Math.exp(-dt * 10); // k≈10, framerate-independent
      if (win !== lastWin) {
        // scene CUT between windows: snap, never glide across foreign frames
        curT = targetT;
        curP = p;
        lastWin = win;
      } else {
        curT += (targetT - curT) * ease;
        curP += (p - curP) * ease;
      }
      // both layers seek to the SAME eased frame in the same rAF (coalesced)
      seek(back, curT);
      seek(frontRef.current, curT);
      // the portal closes and grows: 12% inset → 0%, scale 1 → 1.12, so
      // scroll pushes you INTO the sharp frame; next window it recedes again
      portal.style.inset = `${12 * (1 - curP)}%`;
      portal.style.borderRadius = `${40 * (1 - curP)}px`;
      portal.style.transform = `scale(${1 + 0.12 * curP})`;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (frontBlob) URL.revokeObjectURL(frontBlob);
      if (backBlob) URL.revokeObjectURL(backBlob);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
      {/* BACK layer — oversized, defocused world the portal floats in */}
      <video
        ref={backRef}
        muted
        playsInline
        preload="none"
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ transform: 'scale(1.06)' }}
      />
      {/* FRONT layer — the sharp frame inside the portal */}
      <div ref={portalRef} className="absolute overflow-hidden transition-opacity duration-1000" style={{ inset: '12%' }}>
        <video
          ref={frontRef}
          muted
          playsInline
          preload="none"
          poster={POSTER}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* ambient depth-pulse: fills acts with no matching footage so the
          screen never reads as empty — a sonar sweep on the HUD's own palette */}
      <div ref={pulseRef} className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-1000">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="pulse-ring absolute w-[38vmin] h-[38vmin] rounded-full border border-brand-cyan/40"
            style={{ opacity: 0 }}
          />
        ))}
        <div className="absolute w-2 h-2 rounded-full bg-brand-cyan/70 shadow-[0_0_24px_rgba(59,109,246,0.6)]" />
        {/* flowing coolant ribbons — cheap CSS stroke-dash sweep, no JS */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {[
            { d: 'M -10 30 C 25 20, 45 55, 110 35', delay: '0s' },
            { d: 'M -10 65 C 30 75, 60 40, 110 60', delay: '2.6s' },
            { d: 'M -10 48 C 40 30, 55 70, 110 45', delay: '5.2s' },
          ].map((r, i) => (
            <path
              key={i}
              d={r.d}
              fill="none"
              stroke="#3b6df6"
              strokeWidth="0.3"
              strokeDasharray="6 234"
              style={{ animation: `flowRibbon 7.8s linear infinite`, animationDelay: r.delay }}
            />
          ))}
        </svg>
      </div>
      {/* light overall grade only — per-text-block contrast is Cine's job
          (a local radial backing behind each copy block), not a blanket
          wash over the whole frame. The old full-bleed 65-70% scrim here
          was hiding most of the video's detail everywhere, all the time. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-transparent to-[#020617]/35" />
    </div>
  );
}
