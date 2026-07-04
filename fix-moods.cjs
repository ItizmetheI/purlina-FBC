const fs = require('fs');
let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

const oldMoods = `const CHAPTER_MOODS = [
  // 0: Surface - Cyan glow under a dark surface, heat shimmer above
  {
    fog: new THREE.Color("#020617"), 
    fluid: new THREE.Color("#06B6D4"),
    emissive: new THREE.Color("#0284c7"),
    light1: new THREE.Color("#06B6D4"),
    light2: new THREE.Color("#3b82f6"),
    dynamics: 'ambient'
  },
  // 1: The Machine - X-ray clarity
  {
    fog: new THREE.Color("#040b16"),
    fluid: new THREE.Color("#3b82f6"),
    emissive: new THREE.Color("#1d4ed8"),
    light1: new THREE.Color("#3b82f6"),
    light2: new THREE.Color("#60a5fa"),
    dynamics: 'ambient'
  },
  // 2: Submersion - Fog shift, bubbles, muffled calm
  {
    fog: new THREE.Color("#081425"),
    fluid: new THREE.Color("#0ea5e9"),
    emissive: new THREE.Color("#0284c7"),
    light1: new THREE.Color("#0ea5e9"),
    light2: new THREE.Color("#38bdf8"),
    dynamics: 'flow'
  },
  // 3: The Problem - Blue with red heat cores, turbulence
  {
    fog: new THREE.Color("#0f172a"),
    fluid: new THREE.Color("#1e3a8a"),
    emissive: new THREE.Color("#dc2626"),
    light1: new THREE.Color("#ef4444"),
    light2: new THREE.Color("#b91c1c"),
    dynamics: 'turbulent'
  },
  // 4: The Solution - Heat particles cooling to cyan
  {
    fog: new THREE.Color("#040b16"),
    fluid: new THREE.Color("#06b6d4"),
    emissive: new THREE.Color("#0284c7"),
    light1: new THREE.Color("#06b6d4"),
    light2: new THREE.Color("#0891b2"),
    dynamics: 'flow'
  },
  // 5: The Proof - Crystalline, near-frozen, silver
  {
    fog: new THREE.Color("#020617"),
    fluid: new THREE.Color("#94a3b8"),
    emissive: new THREE.Color("#cbd5e1"),
    light1: new THREE.Color("#e2e8f0"),
    light2: new THREE.Color("#f8fafc"),
    dynamics: 'frozen'
  },
  // 6: Gravity - Desaturated slate + faint red rim, minimal motion
  {
    fog: new THREE.Color("#1e293b"),
    fluid: new THREE.Color("#475569"),
    emissive: new THREE.Color("#64748b"),
    light1: new THREE.Color("#fca5a5"), 
    light2: new THREE.Color("#94a3b8"),
    dynamics: 'ambient'
  },
  // 7: Transformation - Emerald warmth, counters rising
  {
    fog: new THREE.Color("#022c22"),
    fluid: new THREE.Color("#10b981"),
    emissive: new THREE.Color("#059669"),
    light1: new THREE.Color("#34d399"),
    light2: new THREE.Color("#059669"),
    dynamics: 'ambient'
  },
  // 8: Exit - Still water, single light, calm
  {
    fog: new THREE.Color("#020617"),
    fluid: new THREE.Color("#0f172a"),
    emissive: new THREE.Color("#020617"),
    light1: new THREE.Color("#38bdf8"),
    light2: new THREE.Color("#020617"),
    dynamics: 'ambient'
  }
];`;

const newMoods = `const CHAPTER_MOODS = [
  // 0: Surface - Cyan glow under a dark surface, heat shimmer above
  {
    fog: new THREE.Color("#020617"), 
    fluid: new THREE.Color("#06B6D4"),
    emissive: new THREE.Color("#0284c7"),
    light1: new THREE.Color("#06B6D4"),
    light2: new THREE.Color("#3b82f6"),
    dynamics: 'ambient'
  },
  // 1: The Machine - X-ray clarity
  {
    fog: new THREE.Color("#040b16"),
    fluid: new THREE.Color("#3b82f6"),
    emissive: new THREE.Color("#1d4ed8"),
    light1: new THREE.Color("#3b82f6"),
    light2: new THREE.Color("#60a5fa"),
    dynamics: 'ambient'
  },
  // 2: Submersion - Fog shift, bubbles, muffled calm
  {
    fog: new THREE.Color("#081425"),
    fluid: new THREE.Color("#0ea5e9"),
    emissive: new THREE.Color("#0284c7"),
    light1: new THREE.Color("#0ea5e9"),
    light2: new THREE.Color("#38bdf8"),
    dynamics: 'flow'
  },
  // 3: The Problem - Blue with red heat cores, turbulence
  {
    fog: new THREE.Color("#0f172a"),
    fluid: new THREE.Color("#1e3a8a"),
    emissive: new THREE.Color("#dc2626"),
    light1: new THREE.Color("#ef4444"),
    light2: new THREE.Color("#b91c1c"),
    dynamics: 'turbulent'
  },
  // 4: The Solution (Technology) - Heat particles cooling to cyan
  {
    fog: new THREE.Color("#040b16"),
    fluid: new THREE.Color("#06b6d4"),
    emissive: new THREE.Color("#0284c7"),
    light1: new THREE.Color("#06b6d4"),
    light2: new THREE.Color("#0891b2"),
    dynamics: 'flow'
  },
  // 5: Thermal Environment - same cyan flow
  {
    fog: new THREE.Color("#040b16"),
    fluid: new THREE.Color("#06b6d4"),
    emissive: new THREE.Color("#0284c7"),
    light1: new THREE.Color("#06b6d4"),
    light2: new THREE.Color("#0891b2"),
    dynamics: 'flow'
  },
  // 6: The Proof (Specs) - Crystalline, near-frozen, silver
  {
    fog: new THREE.Color("#020617"),
    fluid: new THREE.Color("#94a3b8"),
    emissive: new THREE.Color("#cbd5e1"),
    light1: new THREE.Color("#e2e8f0"),
    light2: new THREE.Color("#f8fafc"),
    dynamics: 'frozen'
  },
  // 7: Gravity (Safety) - Desaturated slate + faint red rim, minimal motion
  {
    fog: new THREE.Color("#1e293b"),
    fluid: new THREE.Color("#475569"),
    emissive: new THREE.Color("#64748b"),
    light1: new THREE.Color("#fca5a5"), 
    light2: new THREE.Color("#94a3b8"),
    dynamics: 'ambient'
  },
  // 8: Transformation (Efficiency) - Emerald warmth, counters rising
  {
    fog: new THREE.Color("#022c22"),
    fluid: new THREE.Color("#10b981"),
    emissive: new THREE.Color("#059669"),
    light1: new THREE.Color("#34d399"),
    light2: new THREE.Color("#059669"),
    dynamics: 'ambient'
  },
  // 9: Exit (Footer) - Still water, single light, calm
  {
    fog: new THREE.Color("#020617"),
    fluid: new THREE.Color("#0f172a"),
    emissive: new THREE.Color("#020617"),
    light1: new THREE.Color("#38bdf8"),
    light2: new THREE.Color("#020617"),
    dynamics: 'ambient'
  }
];`;
content = content.replace(oldMoods, newMoods);
fs.writeFileSync('src/canvas/Scene.tsx', content);

