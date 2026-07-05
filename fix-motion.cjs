const fs = require('fs');

const prefersReducedMotion = `  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);`;

let heroContent = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

// I will insert it into HeroCenterpiece and Scene components that use Math.sin(time)
heroContent = heroContent.replace('const groupRef = useRef<THREE.Group>(null);', 
`const groupRef = useRef<THREE.Group>(null);\n${prefersReducedMotion}`);

// In HeroCenterpiece:
heroContent = heroContent.replace('groupRef.current.position.y = 6.2 + Math.sin(time * 0.5) * 0.3;', 
'groupRef.current.position.y = 6.2 + (prefersReducedMotion ? 0 : Math.sin(time * 0.5) * 0.3);');
heroContent = heroContent.replace('groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;',
'groupRef.current.rotation.x = prefersReducedMotion ? 0 : Math.sin(time * 0.3) * 0.05;');
heroContent = heroContent.replace('groupRef.current.rotation.y = 0.35 + Math.cos(time * 0.2) * 0.05;',
'groupRef.current.rotation.y = 0.35 + (prefersReducedMotion ? 0 : Math.cos(time * 0.2) * 0.05);');

fs.writeFileSync('src/canvas/Scene.tsx', heroContent);

let explodingContent = fs.readFileSync('src/canvas/ExplodingBlade.tsx', 'utf8');
explodingContent = explodingContent.replace('const groupRef = useRef<THREE.Group>(null);', 
`const groupRef = useRef<THREE.Group>(null);\n${prefersReducedMotion}`);

explodingContent = explodingContent.replace('groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;',
'groupRef.current.position.y = prefersReducedMotion ? 0 : Math.sin(time * 0.5) * 0.2;');
explodingContent = explodingContent.replace('groupRef.current.rotation.x = Math.PI / 6 + Math.sin(time * 0.3) * 0.05;',
'groupRef.current.rotation.x = Math.PI / 6 + (prefersReducedMotion ? 0 : Math.sin(time * 0.3) * 0.05);');
explodingContent = explodingContent.replace('groupRef.current.rotation.y = -Math.PI / 4 + Math.cos(time * 0.2) * 0.05;',
'groupRef.current.rotation.y = -Math.PI / 4 + (prefersReducedMotion ? 0 : Math.cos(time * 0.2) * 0.05);');

fs.writeFileSync('src/canvas/ExplodingBlade.tsx', explodingContent);

// One more place: CameraRig in Scene.tsx
let sceneContent = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');
sceneContent = sceneContent.replace('const cameraRef = useRef<THREE.PerspectiveCamera>(null);',
`const cameraRef = useRef<THREE.PerspectiveCamera>(null);\n${prefersReducedMotion}`);
sceneContent = sceneContent.replace('const idleY = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;',
'const idleY = prefersReducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.5) * 0.2;');
fs.writeFileSync('src/canvas/Scene.tsx', sceneContent);

