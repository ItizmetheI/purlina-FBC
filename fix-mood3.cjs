const fs = require('fs');
let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

const targetMood3 = `  // 3: The Problem - Blue with red heat cores, turbulence
  {
    fog: new THREE.Color("#0f172a"),
    fluid: new THREE.Color("#1e3a8a"),
    emissive: new THREE.Color("#dc2626"),
    light1: new THREE.Color("#ef4444"),
    light2: new THREE.Color("#b91c1c"),
    dynamics: 'turbulent'
  },`;

const replacedMood3 = `  // 3: The Problem - Blue with red heat cores, turbulence
  {
    fog: new THREE.Color("#0f172a"),
    fluid: new THREE.Color("#1e3a8a"),
    emissive: new THREE.Color("#1d4ed8"),
    light1: new THREE.Color("#ef4444"),
    light2: new THREE.Color("#b91c1c"),
    dynamics: 'turbulent'
  },`;
content = content.replace(targetMood3, replacedMood3);

// And we want to interpolate colors smoothly:
const replaceSparks = `      const isProblemChapter = chapterState.chapter === 3;
      sparks.forEach((p, i) => {
        if (p.isHot) {
           const targetColor = isProblemChapter ? colorHot : colorCyan;
           _color.copy(targetColor);
           sparkRef.current!.setColorAt(i, _color);
        } else {
           sparkRef.current!.setColorAt(i, colorCyan);
        }
      
        let ySpeedMod = 1;`;

const smoothlyLerpSparks = `      const isProblemChapter = chapterState.chapter === 3;
      // We need to store current color and lerp it. Since we can't store it easily per particle without a ref, 
      // let's just lerp a global "hotColor" towards colorHot or colorCyan.
      // But we can't use hooks here. Let's use a static or ref for the lerped hot color.
      // Actually, we can just compute a global lerp factor based on chapterProgress.
      let hotColorMix = 0;
      if (chapterState.chapter === 3) {
         hotColorMix = Math.min(1, chapterState.chapterProgress * 3);
      } else if (chapterState.chapter === 2) {
         hotColorMix = Math.max(0, (chapterState.chapterProgress - 0.7) * 3.33); // lerp in at end of 2
      } else if (chapterState.chapter === 4) {
         hotColorMix = Math.max(0, 1 - chapterState.chapterProgress * 3); // lerp out at start of 4
      }
      _color.copy(colorCyan).lerp(colorHot, hotColorMix);
      
      sparks.forEach((p, i) => {
        if (p.isHot) {
           sparkRef.current!.setColorAt(i, _color);
        } else {
           sparkRef.current!.setColorAt(i, colorCyan);
        }
        let ySpeedMod = 1;`;

content = content.replace(replaceSparks, smoothlyLerpSparks);

fs.writeFileSync('src/canvas/Scene.tsx', content);

