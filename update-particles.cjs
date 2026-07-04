const fs = require('fs');
let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

// Helper for X spawn
const getSpawnX = `
function getSpawnX() {
  const isEdge = Math.random() < 0.7;
  if (isEdge) {
    const sign = Math.random() > 0.5 ? 1 : -1;
    return sign * (Math.random() * 14 + 6);
  }
  return (Math.random() - 0.5) * 12;
}
`;

content = content.replace("export default function Scene", getSpawnX + "\nexport default function Scene");

// Update AbstractFluid
const fluidTarget = `function AbstractFluid({ quality }: { quality: 'high' | 'low' }) {
  const count = quality === 'high' ? 300 : 150;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 20 - 5,
      speed: Math.random() * 0.01 + 0.005,
      factor: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.2 + 0.05
    }));
  }, [count]);`;

const fluidReplace = `function AbstractFluid({ quality }: { quality: 'high' | 'low' }) {
  const count = quality === 'high' ? 120 : 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: getSpawnX(),
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() * 13) - 18,
      speed: Math.random() * 0.01 + 0.005,
      factor: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.3 + 0.05
    }));
  }, [count]);`;
content = content.replace(fluidTarget, fluidReplace);

const fluidLoopTarget = `    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    mat.color.lerp(mood.fluid, delta * 2);
    mat.emissive.lerp(mood.emissive, delta * 2);

    particles.forEach((p, i) => {`;
const fluidLoopReplace = `    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    mat.color.lerp(mood.fluid, delta * 2);
    mat.emissive.lerp(mood.emissive, delta * 2);
    
    const isHeroVisible = [0, 1, 3, 4, 5, 6].includes(chapterState.chapter);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, isHeroVisible ? 0.2 : 0.55, delta * 2);

    particles.forEach((p, i) => {`;
content = content.replace(fluidLoopTarget, fluidLoopReplace);

const fluidWrapTarget = `      p.y += p.speed * ySpeedMod;
      if (p.y > 20) p.y = -20;`;
const fluidWrapReplace = `      p.y += p.speed * ySpeedMod;
      if (p.y > 20) { p.y = -20; p.x = getSpawnX(); }`;
content = content.replace(fluidWrapTarget, fluidWrapReplace);

// Update Bubbles
const bubblesTarget = `function Bubbles({ quality }: { quality: 'high' | 'low' }) {
  const count = quality === 'high' ? 150 : 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40 - 10,
      z: (Math.random() - 0.5) * 30 - 10,
      speed: Math.random() * 0.05 + 0.02,
      factor: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.05 + 0.02
    }));
  }, [count]);`;
const bubblesReplace = `function Bubbles({ quality }: { quality: 'high' | 'low' }) {
  const count = quality === 'high' ? 150 : 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: getSpawnX(),
      y: (Math.random() - 0.5) * 40 - 10,
      z: (Math.random() * 13) - 18,
      speed: Math.random() * 0.05 + 0.02,
      factor: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.05 + 0.02
    }));
  }, [count]);`;
content = content.replace(bubblesTarget, bubblesReplace);

const bubblesLoopTarget = `    const isActive = chapterState.chapter <= 3;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, isActive ? 0.6 : 0, delta * 2);
    
    if (mat.opacity < 0.01) return;
    
    particles.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 4) {
        p.y = -20;
        p.x = (Math.random() - 0.5) * 40;
      }`;
const bubblesLoopReplace = `    const isActive = chapterState.chapter <= 3;
    const isHeroVisible = [0, 1, 3, 4, 5, 6].includes(chapterState.chapter);
    const targetOpacity = isActive ? (isHeroVisible ? 0.2 : 0.6) : 0;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 2);
    
    if (mat.opacity < 0.01) return;
    
    particles.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 4) {
        p.y = -20;
        p.x = getSpawnX();
      }`;
content = content.replace(bubblesLoopTarget, bubblesLoopReplace);

// Update DustMotes
const dustMotesTarget = `function DustMotes() {
  const count = 80;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 10 + 10,
      speed: Math.random() * 0.005 + 0.002,
      factor: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.02 + 0.01
    }));
  }, [count]);`;
const dustMotesReplace = `function DustMotes() {
  const count = 50;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: getSpawnX(),
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() * 8) - 14,
      speed: Math.random() * 0.005 + 0.002,
      factor: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.02 + 0.01
    }));
  }, [count]);`;
content = content.replace(dustMotesTarget, dustMotesReplace);

const dustMotesLoopTarget = `    useFrame((sys) => {
    if (!meshRef.current) return;
    const time = sys.clock.getElapsedTime();
    
    particles.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 10) p.y = -10;`;
const dustMotesLoopReplace = `    useFrame((sys, delta) => {
    if (!meshRef.current) return;
    const time = sys.clock.getElapsedTime();
    
    const isHeroVisible = [0, 1, 3, 4, 5, 6].includes(chapterState.chapter);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, isHeroVisible ? 0.02 : 0.06, delta * 2);

    particles.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 10) { p.y = -10; p.x = getSpawnX(); }`;
content = content.replace(dustMotesLoopTarget, dustMotesLoopReplace);

const dustMotesOpacityTarget = `<meshBasicMaterial color="#ffffff" transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />`;
const dustMotesOpacityReplace = `<meshBasicMaterial color="#ffffff" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />`;
content = content.replace(dustMotesOpacityTarget, dustMotesOpacityReplace);

fs.writeFileSync('src/canvas/Scene.tsx', content);
