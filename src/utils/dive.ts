import { useLenis } from 'lenis/react';
import { useEffect } from 'react';

// ── THE SPINE ────────────────────────────────────────────────────────
// Scroll → depth (metres) → act. Single source of truth for the camera,
// the HUD and every set piece. World mapping: fluid surface = y 0,
// camera y = -depth. Nothing else may invent its own scroll math.

export const ACTS = [
  { name: 'SURFACE',  status: 'SURFACE CONTACT',     d0: 0,    d1: 0.4 },  // 0 Hero
  { name: 'BREACH',   status: 'SUBMERGING',          d0: 0.4,  d1: 3 },    // 1 EvolutionQuote
  { name: 'DESCENT',  status: 'DESCENT STABLE',      d0: 3,    d1: 10 },   // 2 TOC + Vision
  { name: 'PROBLEM',  status: 'THERMAL LOAD CRITICAL', d0: 10, d1: 16 },   // 3 Thermal + Growth
  { name: 'SOLUTION', status: 'HEAT TRANSFER ACTIVE', d0: 16,  d1: 24 },   // 4 Technology
  { name: 'CONTACT',  status: 'DIRECT CONTACT',      d0: 24,   d1: 30 },   // 5 ThermalEnvironment
  { name: 'PROOF',    status: 'ENVIRONMENT STABLE',  d0: 30,   d1: 36 },   // 6 Specs + Series
  { name: 'PROTOCOL', status: 'HANDLING PROTOCOL',   d0: 36,   d1: 38.5 }, // 7 Precautions
  { name: 'STABLE',   status: 'SYSTEM OPTIMAL',      d0: 38.5, d1: 40 },   // 8 Efficiency + Apps
  { name: 'SEALED',   status: 'SEALED',              d0: 40,   d1: 40 },   // 9 Footer
] as const;

export const MAX_DEPTH = 40;

export const dive = {
  scroll: 0,        // 0..1 page progress
  depth: 0,         // metres below the surface
  act: 0,
  actProgress: 0,   // 0..1 within the current act
};

// dev hook: lets tooling drive the dive state directly
if (typeof window !== 'undefined') (window as any).__dive = dive;

let bounds: { id: number; top: number; bottom: number }[] = [];

function measure() {
  const scrollY = window.scrollY;
  bounds = Array.from(document.querySelectorAll('[data-act]')).map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      id: parseInt(el.getAttribute('data-act') || '0', 10),
      top: rect.top + scrollY,
      bottom: rect.bottom + scrollY,
    };
  });
}

// Sections re-measure on load/resize and once late for lazy layout shifts.
export function useDiveEngine() {
  useEffect(() => {
    measure();
    window.addEventListener('load', measure);
    window.addEventListener('resize', measure);
    const t1 = setTimeout(measure, 500);
    const t2 = setTimeout(measure, 2000);
    return () => {
      window.removeEventListener('load', measure);
      window.removeEventListener('resize', measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useLenis(({ scroll, limit }) => {
    dive.scroll = limit > 0 ? scroll / limit : 0;
    if (bounds.length === 0) return;

    const triggerY = scroll + window.innerHeight / 2;
    for (const b of bounds) {
      if (triggerY >= b.top && triggerY < b.bottom) {
        dive.act = b.id;
        dive.actProgress = Math.max(0, Math.min(1, (triggerY - b.top) / (b.bottom - b.top)));
        break;
      }
    }
    const act = ACTS[dive.act] ?? ACTS[0];
    dive.depth = act.d0 + (act.d1 - act.d0) * dive.actProgress;
  });
}

// re-measure hook for layout-changing UI (e.g. language toggle)
export function remeasureDive() {
  measure();
}
