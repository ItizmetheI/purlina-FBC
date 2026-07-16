# PURLINA MATRIX CORE

Marketing site for PURLINA MATRIX CORE — a single-phase dielectric immersion
cooling fluid by ALKİM Petrokimya — built as one continuous scroll-driven dive
into an immersion tank (React 19, Three.js via react-three-fiber, Lenis,
Tailwind v4, Vite).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build to dist/
npm run lint     # type-check
```

## Structure

- `src/utils/dive.ts` — the spine: scroll → depth (0–40 m) → act. Single source
  of truth for camera, HUD, and scene staging.
- `src/canvas/` — the WebGL tank: environment, set pieces, camera rig.
- `src/sections/` — DOM content, faithful to the MATRIXCORE-v4 brochure.
- `src/lib/lang.tsx` — TR/EN language toggle.

Content (specs, tables, safety text) mirrors the printed brochure exactly —
do not edit values without confirmation from ALKİM.
