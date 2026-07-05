const fs = require('fs');
let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

// A1: CHAPTER_MOODS
const oldMoods = `const CHAPTER_MOODS = [
  { name: 'Surface', fog: new THREE.Color('#020617') },
  { name: 'The Machine', fog: new THREE.Color('#050b14') },
  { name: 'Submersion', fog: new THREE.Color('#041224') },
  { name: 'The Problem', fog: new THREE.Color('#0a0505') }, // red heat hint
  { name: 'The Solution', fog: new THREE.Color('#04181a') }, // cooling flow
  { name: 'The Proof', fog: new THREE.Color('#05101f') },
  { name: 'Gravity', fog: new THREE.Color('#080d14') },
  { name: 'Transformation', fog: new THREE.Color('#030f14') },
  { name: 'Exit', fog: new THREE.Color('#020617') }
];`;

const newMoods = `const CHAPTER_MOODS = [
  { name: 'Surface', fog: new THREE.Color('#020617') },
  { name: 'The Machine', fog: new THREE.Color('#050b14') },
  { name: 'Submersion', fog: new THREE.Color('#041224') },
  { name: 'The Problem', fog: new THREE.Color('#0a0505') }, // red heat hint
  { name: 'The Solution', fog: new THREE.Color('#04181a') }, // cooling flow
  { name: 'Thermal Env', fog: new THREE.Color('#04181a') }, // thermal env
  { name: 'The Proof', fog: new THREE.Color('#05101f') },
  { name: 'Gravity', fog: new THREE.Color('#080d14') },
  { name: 'Transformation', fog: new THREE.Color('#030f14') },
  { name: 'Exit', fog: new THREE.Color('#020617') }
];`;

content = content.replace(oldMoods, newMoods);

// A4: Remove noiseFilter div from Scene
const noiseDivTarget = `    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617]">
      <div 
        className="fixed inset-0 z-[100] pointer-events-none opacity-[0.04]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
      <Canvas`;
const noiseDivReplace = `    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617]">
      <Canvas`;
content = content.replace(noiseDivTarget, noiseDivReplace);

// A5: Update CameraRig
const cameraRigTarget = `  useFrame((state, delta) => {
    let targetY = 8;
    if (chapterState.chapter >= 2) targetY = 0;
    else if (chapterState.chapter === 1) targetY = 6;

    const idleY = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    
    _cameraTarget.set(mouseX * 2, targetY + mouseY * 2 + idleY, targetZ);
    cameraRef.current.position.lerp(_cameraTarget, delta * (isLoaded ? 2.5 : 2));

    cameraRef.current.rotation.y = THREE.MathUtils.lerp(cameraRef.current.rotation.y, -mouseX * 0.5, delta * 2);
    cameraRef.current.rotation.x = THREE.MathUtils.lerp(cameraRef.current.rotation.x, mouseY * 0.5, delta * 2);
  });`;

const cameraRigReplace = `  useFrame((state, delta) => {
    let descentProgress = 0;
    if (chapterState.chapter <= 2) {
      descentProgress = (chapterState.chapter + chapterState.chapterProgress) / 3;
    } else {
      descentProgress = 1;
    }

    let targetY = THREE.MathUtils.lerp(8, 0, descentProgress);
    let targetPitch = THREE.MathUtils.lerp(-0.18, 0, descentProgress);

    const idleY = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    
    _cameraTarget.set(mouseX * 2, targetY + mouseY * 2 + idleY, targetZ);
    cameraRef.current.position.lerp(_cameraTarget, delta * (isLoaded ? 2.5 : 2));

    cameraRef.current.rotation.y = THREE.MathUtils.lerp(cameraRef.current.rotation.y, -mouseX * 0.5, delta * 2);
    cameraRef.current.rotation.x = THREE.MathUtils.lerp(cameraRef.current.rotation.x, targetPitch + mouseY * 0.5, delta * 2);
  });`;

content = content.replace(cameraRigTarget, cameraRigReplace);

fs.writeFileSync('src/canvas/Scene.tsx', content);
