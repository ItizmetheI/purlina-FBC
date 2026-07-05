const fs = require('fs');
let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

const oldCamera = `function CameraRig({ isLoaded }: { isLoaded?: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  useFrame((sys, delta) => {
    if (document.hidden) return;
    if (!cameraRef.current) return;
    
    // Zoom in slightly as we scroll deeper into the site
    let targetZ = 16 - chapterState.scroll * 4; 
    if (!isLoaded) targetZ = 18;
    
    let targetY = 0;
    if (chapterState.chapter === 0) targetY = 8;
    else if (chapterState.chapter === 1) targetY = 6;
    else targetY = 0;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouseX = prefersReducedMotion ? 0 : (sys.pointer.x * Math.PI) / 20;
    const mouseY = prefersReducedMotion ? 0 : (sys.pointer.y * Math.PI) / 20;
    
    const time = sys.clock.getElapsedTime();
    const idleY = (!prefersReducedMotion && isLoaded) ? Math.sin(time * 0.5) * 0.1 : 0;
    
    let targetX = mouseX * 2;
    if (chapterState.chapter >= 3 && chapterState.chapter <= 6) {
      targetX = THREE.MathUtils.lerp(targetX, 1.5, 0.5); // Lerp towards exploded blade
    }
    _cameraTarget.set(targetX, targetY + mouseY * 2 + idleY, targetZ);
    
    // Use slightly different lerp for the 18->16 entrance
    cameraRef.current.position.lerp(_cameraTarget, delta * (isLoaded ? 2.5 : 2));
    
    cameraRef.current.rotation.y = THREE.MathUtils.lerp(cameraRef.current.rotation.y, -mouseX * 0.5, delta * 2);
    cameraRef.current.rotation.x = THREE.MathUtils.lerp(cameraRef.current.rotation.x, mouseY * 0.5, delta * 2);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 8, 16]} fov={45} />;
}`;

const newCamera = `function CameraRig({ isLoaded }: { isLoaded?: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  useFrame((sys, delta) => {
    if (document.hidden) return;
    if (!cameraRef.current) return;
    
    let targetZ = 16 - chapterState.scroll * 4; 
    if (!isLoaded) targetZ = 18;
    
    let descentProgress = 0;
    if (chapterState.chapter <= 2) {
      descentProgress = (chapterState.chapter + chapterState.chapterProgress) / 3;
    } else {
      descentProgress = 1;
    }
    
    let targetY = 8 * (1 - descentProgress);
    let baseRotX = -0.18 * (1 - descentProgress);
    
    const mouseX = prefersReducedMotion ? 0 : (sys.pointer.x * Math.PI) / 20;
    const mouseY = prefersReducedMotion ? 0 : (sys.pointer.y * Math.PI) / 20;
    
    const time = sys.clock.getElapsedTime();
    const idleY = (!prefersReducedMotion && isLoaded) ? Math.sin(time * 0.5) * 0.1 : 0;
    
    let targetX = mouseX * 2;
    
    let targetLookAtX = 0;
    if (chapterState.chapter === 5) { // ExplodingBlade chapter
       targetLookAtX = THREE.MathUtils.lerp(0, 1.5, chapterState.chapterProgress);
    } else if (chapterState.chapter === 4 || chapterState.chapter === 6) {
       // Slightly look towards it if adjacent
       targetLookAtX = chapterState.chapter === 4 ? THREE.MathUtils.lerp(0, 0, chapterState.chapterProgress) : THREE.MathUtils.lerp(1.5, 0, chapterState.chapterProgress);
    }

    _cameraTarget.set(targetX, targetY + mouseY * 2 + idleY, targetZ);
    cameraRef.current.position.lerp(_cameraTarget, delta * (isLoaded ? 2.5 : 2));
    
    let baseRotY = 0;
    if (targetLookAtX > 0) {
      baseRotY = -Math.atan2(targetLookAtX, targetZ - 2); 
    }
    
    cameraRef.current.rotation.y = THREE.MathUtils.lerp(cameraRef.current.rotation.y, baseRotY - mouseX * 0.5, delta * 2);
    cameraRef.current.rotation.x = THREE.MathUtils.lerp(cameraRef.current.rotation.x, baseRotX + mouseY * 0.5, delta * 2);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 8, 16]} fov={45} rotation={[-0.18, 0, 0]} />;
}`;

content = content.replace(oldCamera, newCamera);
fs.writeFileSync('src/canvas/Scene.tsx', content);

