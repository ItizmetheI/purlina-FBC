import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Lightformer, Preload, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { chapterState } from '../utils/chapterEngine';

// Reusable static colors to prevent per-frame allocation
const CHAPTER_MOODS = [
  // 0 HERO — surface, cyan glow
  { fog: new THREE.Color("#020617"), fluid: new THREE.Color("#06B6D4"), emissive: new THREE.Color("#0284c7"), light1: new THREE.Color("#06B6D4"), light2: new THREE.Color("#3b82f6"), dynamics: 'ambient' },
  // 1 THE MACHINE (pod) — x-ray blue
  { fog: new THREE.Color("#040b16"), fluid: new THREE.Color("#3b82f6"), emissive: new THREE.Color("#1d4ed8"), light1: new THREE.Color("#3b82f6"), light2: new THREE.Color("#60a5fa"), dynamics: 'ambient' },
  // 2 SUBMERSION (TOC+Vision) — muffled calm
  { fog: new THREE.Color("#081425"), fluid: new THREE.Color("#0ea5e9"), emissive: new THREE.Color("#0284c7"), light1: new THREE.Color("#0ea5e9"), light2: new THREE.Color("#38bdf8"), dynamics: 'ambient' },
  // 3 THE PROBLEM (Thermal+Growth) — heat, turbulence
  { fog: new THREE.Color("#0f172a"), fluid: new THREE.Color("#ef4444"), emissive: new THREE.Color("#dc2626"), light1: new THREE.Color("#ef4444"), light2: new THREE.Color("#f87171"), dynamics: 'turbulent' },
  // 4 THE SOLUTION (Technology) — heat cooling to cyan
  { fog: new THREE.Color("#040b16"), fluid: new THREE.Color("#06B6D4"), emissive: new THREE.Color("#0891b2"), light1: new THREE.Color("#06B6D4"), light2: new THREE.Color("#2dd4bf"), dynamics: 'flow' },
  // 5 THE CONTACT (ThermalEnvironment / exploding blade) — bright confident cyan
  { fog: new THREE.Color("#031019"), fluid: new THREE.Color("#22d3ee"), emissive: new THREE.Color("#0891b2"), light1: new THREE.Color("#22d3ee"), light2: new THREE.Color("#3b82f6"), dynamics: 'flow' },
  // 6 THE PROOF (Specs+Series) — crystalline silver
  { fog: new THREE.Color("#020617"), fluid: new THREE.Color("#e2e8f0"), emissive: new THREE.Color("#94a3b8"), light1: new THREE.Color("#f1f5f9"), light2: new THREE.Color("#cbd5e1"), dynamics: 'frozen' },
  // 7 GRAVITY (HandlingPrecautions) — slate + faint red, near-still. NEVER GREEN.
  { fog: new THREE.Color("#1e293b"), fluid: new THREE.Color("#475569"), emissive: new THREE.Color("#7f1d1d"), light1: new THREE.Color("#64748b"), light2: new THREE.Color("#450a0a"), dynamics: 'frozen' },
  // 8 TRANSFORMATION (Efficiency+Adv+Apps) — emerald
  { fog: new THREE.Color("#022c22"), fluid: new THREE.Color("#10b981"), emissive: new THREE.Color("#059669"), light1: new THREE.Color("#34d399"), light2: new THREE.Color("#059669"), dynamics: 'flow' },
  // 9 EXIT (Footer) — still water
  { fog: new THREE.Color("#020617"), fluid: new THREE.Color("#0ea5e9"), emissive: new THREE.Color("#0369a1"), light1: new THREE.Color("#0ea5e9"), light2: new THREE.Color("#020617"), dynamics: 'ambient' }
];

const _cameraTarget = new THREE.Vector3();

function useQuality() {
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    setQuality(isCoarse || hardwareConcurrency < 6 ? 'low' : 'high');
  }, []);
  return quality;
}

function EnvironmentColors() {
  const { scene, camera } = useThree();
  const fogColor = useMemo(() => new THREE.Color('#020617'), []);
  
  useFrame((_, delta) => {
    if (document.hidden) return;
    const mood = CHAPTER_MOODS[chapterState.chapter] || CHAPTER_MOODS[0];
    fogColor.lerp(mood.fog, delta * 2);
    scene.background = fogColor;
    if (scene.fog) {
      scene.fog.color = fogColor;
      const isSubmerged = camera.position.y < 4;
      const targetDensity = isSubmerged ? 0.045 : 0.03;
      (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp((scene.fog as THREE.FogExp2).density, targetDensity, delta * 2);
    }
  });

  return null;
}

function Lighting() {
  const light1 = useRef<THREE.DirectionalLight>(null);
  const light2 = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);

  useFrame((_, delta) => {
    if (document.hidden) return;
    if (!light1.current || !light2.current || !ambient.current) return;
    const mood = CHAPTER_MOODS[chapterState.chapter] || CHAPTER_MOODS[0];
    light1.current.color.lerp(mood.light1, delta * 2);
    light2.current.color.lerp(mood.light2, delta * 2);
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.2} />
      <directionalLight ref={light1} position={[10, 10, 5]} intensity={2} />
      <directionalLight ref={light2} position={[-10, -10, -5]} intensity={1.5} />
      <spotLight position={[0, 20, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
    </>
  );
}

// ── CAMERA PATH: film blocking. One shot per chapter, blended by scroll. ──
const CAM_POS = [
  new THREE.Vector3(0, 8.0, 16.0),    // 0 hero: above the surface, ribbon + blade
  new THREE.Vector3(1.5, 6.6, 13.0),  // 1 machine: approach the pod
  new THREE.Vector3(0, 3.2, 13.0),    // 2 submersion: crossing the surface
  new THREE.Vector3(1.2, 0.4, 12.5),  // 3 problem: rack wall burning red
  new THREE.Vector3(0, 0.4, 12.5),    // 4 solution: racks cooling to cyan
  new THREE.Vector3(0.6, 0.6, 12.0),  // 5 contact: the exploding blade
  new THREE.Vector3(-0.4, 0.6, 12.0), // 6 proof: the molecule
  new THREE.Vector3(0, 0.0, 13.5),    // 7 gravity: still void
  new THREE.Vector3(0.4, 0.8, 12.5),  // 8 transformation: emerald ribbon
  new THREE.Vector3(0, 1.6, 14.5),    // 9 exit: gaze back toward the light
];
const CAM_LOOK = [
  new THREE.Vector3(0, 5.2, -2),
  new THREE.Vector3(-2.4, 5.2, -3.5),
  new THREE.Vector3(0, 2.0, -4),
  new THREE.Vector3(-5, -1.0, -9),
  new THREE.Vector3(-2, -0.4, -8),
  new THREE.Vector3(3, 0, 2),
  new THREE.Vector3(-3.2, 0.6, -1),
  new THREE.Vector3(0, 0.2, -5),
  new THREE.Vector3(-0.5, 2.2, -6),
  new THREE.Vector3(0, 3.2, -5),
];
const _camPos = new THREE.Vector3();
const _camLook = new THREE.Vector3();

let _lastScroll = 0;

function CameraRig({ isLoaded }: { isLoaded?: boolean }) {
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

    // blend between chapter keyframes
    const t = chapterState.chapter + chapterState.chapterProgress;
    let i = Math.floor(t);
    let f = t - i;
    if (i >= 9) { i = 8; f = 1; }
    const sf = f * f * (3 - 2 * f); // smoothstep

    _camPos.lerpVectors(CAM_POS[i], CAM_POS[i + 1], sf);
    _camLook.lerpVectors(CAM_LOOK[i], CAM_LOOK[i + 1], sf);

    const time = sys.clock.getElapsedTime();
    const mouseX = prefersReducedMotion ? 0 : sys.pointer.x;
    const mouseY = prefersReducedMotion ? 0 : sys.pointer.y;
    const idleY = (!prefersReducedMotion && isLoaded) ? Math.sin(time * 0.5) * 0.08 : 0;

    _camPos.x += mouseX * 0.8;
    _camPos.y += mouseY * 0.5 + idleY;
    if (!isLoaded) _camPos.z += 2; // loader entrance dolly

    cameraRef.current.position.lerp(_camPos, delta * (isLoaded ? 2.5 : 2));
    cameraRef.current.lookAt(_camLook);
    // subtle parallax on top of the blocking
    cameraRef.current.rotation.y -= mouseX * 0.06;
    cameraRef.current.rotation.x += mouseY * 0.04;

    // scroll-velocity lens: fast scrolling widens the FOV slightly
    const vel = Math.abs(chapterState.scroll - _lastScroll) / Math.max(delta, 0.001);
    _lastScroll = chapterState.scroll;
    const targetFov = 45 + Math.min(vel * 30, 6);
    if (Math.abs(cameraRef.current.fov - targetFov) > 0.02) {
      cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, targetFov, delta * 4);
      cameraRef.current.updateProjectionMatrix();
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 8, 18]} fov={45} />;
}


// ════════════════════════════════════════════════════════════════════
// SET PIECES — the movie. One scene per chapter, camera travels between.
// ════════════════════════════════════════════════════════════════════

// ── FLOW RIBBON: the brochure cover's flowing light wave, as a shader ──
const _ribbonCyan = new THREE.Color('#38bdf8');
const _ribbonEmerald = new THREE.Color('#34d399');

function FlowRibbon({ position, rotation, scale = 1, reprise = false }:
  { position: [number, number, number], rotation: [number, number, number], scale?: number, reprise?: boolean }) {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(reprise ? '#34d399' : '#38bdf8') },
    uOpacity: { value: 0 },
  }), [reprise]);

  useFrame((sys, delta) => {
    if (document.hidden) return;
    uniforms.uTime.value = sys.clock.getElapsedTime();
    const ch = chapterState.chapter;
    let target = 0;
    if (reprise) {
      if (ch === 8) target = 0.7;
      else if (ch === 9) target = 0.35;
    } else {
      if (ch <= 1) target = 0.85;
      else if (ch === 2) target = 0.25;
    }
    uniforms.uOpacity.value = THREE.MathUtils.lerp(uniforms.uOpacity.value, target, delta * 2);
    uniforms.uColor.value.lerp(reprise ? _ribbonEmerald : _ribbonCyan, delta * 2);
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[44, 5, 220, 20]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 p = position;
            float w1 = sin(p.x * 0.25 + uTime * 0.50) * 1.2;
            float w2 = sin(p.x * 0.11 - uTime * 0.30) * 2.0;
            float w3 = sin(p.x * 0.05 + uTime * 0.15) * 2.6;
            p.y += w1 + w2 + w3;
            p.z += sin(p.x * 0.08 + uTime * 0.20) * 1.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            // fine light strands traveling along the ribbon
            float strands = pow(abs(sin((vUv.y * 24.0 + vUv.x * 6.0 - uTime * 0.6) * 3.14159)), 6.0);
            float core = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
            float endFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
            float a = (0.08 + strands * 0.55) * core * endFade * uOpacity;
            if (a < 0.004) discard;
            gl_FragColor = vec4(uColor * (0.6 + strands * 1.4), a);
          }
        `}
      />
    </mesh>
  );
}

// ── IMMERSION POD: the brochure page-2 tank as a set piece (chapter 1) ──
function ImmersionPod({ quality }: { quality: 'high' | 'low' }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((sys) => {
    if (document.hidden) return;
    if (!groupRef.current) return;
    const visible = chapterState.chapter <= 2;
    groupRef.current.visible = visible;
    if (!visible) return;
    const time = sys.clock.getElapsedTime();
    groupRef.current.rotation.y = -0.4 + Math.sin(time * 0.15) * 0.04;
  });

  return (
    <group ref={groupRef} position={[-2.8, 4.02, -3.5]} rotation={[0, -0.4, 0]}>
      {/* base plinth */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.5, 2.1]} />
        <meshPhysicalMaterial color="#0b1220" metalness={0.85} roughness={0.35} />
      </mesh>
      {/* inner fluid volume */}
      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[3.25, 1.68, 1.62]} />
        <meshBasicMaterial color="#0891b2" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      {/* submerged blade slats */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-1.35 + i * 0.45, 1.35, 0]}>
          <boxGeometry args={[0.12, 1.45, 1.35]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.85} roughness={0.3} emissive="#06B6D4" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* glass tank — the ONE transmissive hero object (high tier) */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[3.5, 2.2, 1.85]} />
        {quality === 'high' ? (
          <meshPhysicalMaterial transmission={1} thickness={0.4} roughness={0.08} metalness={0} color="#ffffff" />
        ) : (
          <meshPhysicalMaterial transparent opacity={0.14} roughness={0.08} metalness={0.1} color="#a5f3fc" />
        )}
      </mesh>
      {/* CDU block */}
      <mesh position={[-2.15, 1.1, 0]} castShadow>
        <boxGeometry args={[0.5, 1.7, 1.6]} />
        <meshPhysicalMaterial color="#111827" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* hot outlet / cold inlet pipes — the brochure diagram's story */}
      <mesh position={[-2.5, 0.35, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 1.2, 12]} />
        <meshPhysicalMaterial color="#450a0a" emissive="#ef4444" emissiveIntensity={0.7} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-2.5, 0.35, -0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 1.2, 12]} />
        <meshPhysicalMaterial color="#082f49" emissive="#0ea5e9" emissiveIntensity={0.7} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ── RACK WALL: the data-center scenery. LEDs burn red in the Problem
//    chapter, cool to cyan in the Solution chapter — the story as light. ──
const _ledHot = new THREE.Color('#ef4444').multiplyScalar(2);
const _ledCool = new THREE.Color('#06b6d4').multiplyScalar(2);
const _ledDim = new THREE.Color('#334155');

function RackWall() {
  const groupRef = useRef<THREE.Group>(null);
  const ledMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#334155', toneMapped: false }), []);

  useFrame((sys, delta) => {
    if (document.hidden) return;
    if (!groupRef.current) return;
    const ch = chapterState.chapter;
    const visible = ch >= 2 && ch <= 5;
    groupRef.current.visible = visible;
    if (!visible) return;
    const time = sys.clock.getElapsedTime();
    const pulse = 0.8 + 0.2 * Math.sin(time * (ch === 3 ? 4.0 : 1.2));
    const target = ch === 3 ? _ledHot : ch >= 4 ? _ledCool : _ledDim;
    ledMat.color.lerp(target, delta * 2);
    // gentle global pulse without allocation
    groupRef.current.children.forEach((child) => {
      if ((child as THREE.Mesh).material === ledMat) child.scale.setScalar(pulse);
    });
  });

  const units: [number, number][] = [];
  for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) units.push([c, r]);

  return (
    <group ref={groupRef} position={[-7.5, -2.2, -10]} rotation={[0, 0.35, 0]}>
      {units.map(([c, r], i) => (
        <mesh key={`u${i}`} position={[c * 1.9, r * 2.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 2.4, 0.9]} />
          <meshPhysicalMaterial color="#0b1220" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {units.map(([c, r], i) => (
        <mesh key={`l${i}`} position={[c * 1.9, r * 2.6 + 0.95, 0.48]} material={ledMat}>
          <planeGeometry args={[1.3, 0.08]} />
        </mesh>
      ))}
    </group>
  );
}

// ── MOLECULE CHAIN: straight-chain paraffin from the spec page (chapter 6) ──
function MoleculeChain() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((sys) => {
    if (document.hidden) return;
    if (!groupRef.current) return;
    const ch = chapterState.chapter;
    const visible = ch >= 5 && ch <= 7;
    groupRef.current.visible = visible;
    if (!visible) return;
    const time = sys.clock.getElapsedTime();
    groupRef.current.rotation.x = time * 0.15;
    groupRef.current.rotation.z = 0.2 + Math.sin(time * 0.1) * 0.05;
  });

  const atoms = Array.from({ length: 11 }).map((_, i) => ({
    x: -2.75 + i * 0.55,
    y: (i % 2 === 0 ? 0.16 : -0.16),
  }));

  return (
    <group ref={groupRef} position={[-3.2, 0.6, -1]}>
      {atoms.map((a, i) => (
        <mesh key={`a${i}`} position={[a.x, a.y, 0]} castShadow>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshPhysicalMaterial color="#e2e8f0" metalness={0.9} roughness={0.12} envMapIntensity={2} />
        </mesh>
      ))}
      {atoms.slice(0, -1).map((a, i) => {
        const b = atoms[i + 1];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        return (
          <mesh key={`b${i}`} position={[mx, my, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.62, 10]} />
            <meshPhysicalMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}


// ── BACKDROP: gradient light field — the mood carrier. Replaces particle soup as the "look". ──
const _bBase = new THREE.Color('#020617');
const _bGlowA = new THREE.Color('#06B6D4');
const _bGlowB = new THREE.Color('#3b82f6');

function BackdropGradient() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBase: { value: new THREE.Color('#020617') },
    uGlowA: { value: new THREE.Color('#06B6D4') },
    uGlowB: { value: new THREE.Color('#3b82f6') },
  }), []);

  useFrame((sys, delta) => {
    if (document.hidden) return;
    uniforms.uTime.value = sys.clock.getElapsedTime();
    const mood = CHAPTER_MOODS[chapterState.chapter] || CHAPTER_MOODS[0];
    _bBase.copy(mood.fog).multiplyScalar(0.6);
    _bGlowA.copy(mood.light1);
    _bGlowB.copy(mood.light2);
    uniforms.uBase.value.lerp(_bBase, delta * 2);
    uniforms.uGlowA.value.lerp(_bGlowA, delta * 2);
    uniforms.uGlowB.value.lerp(_bGlowB, delta * 2);
  });

  return (
    <mesh position={[0, 2, -48]} renderOrder={-10}>
      <planeGeometry args={[260, 140]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uBase;
          uniform vec3 uGlowA;
          uniform vec3 uGlowB;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }

          void main() {
            vec2 uv = vUv;
            // slow-drifting glow centers
            vec2 ca = vec2(0.32 + 0.10 * sin(uTime * 0.05), 0.62 + 0.08 * cos(uTime * 0.07));
            vec2 cb = vec2(0.72 + 0.08 * cos(uTime * 0.04), 0.28 + 0.10 * sin(uTime * 0.06));
            // elliptical falloff (wide plane)
            vec2 stretch = vec2(0.62, 1.0);
            float ga = smoothstep(0.62, 0.0, distance(uv * stretch, ca * stretch));
            float gb = smoothstep(0.52, 0.0, distance(uv * stretch, cb * stretch));
            vec3 col = uBase;
            col += uGlowA * ga * ga * 0.30;
            col += uGlowB * gb * gb * 0.20;
            // dither to kill banding
            col += (hash(uv * 913.0 + uTime * 0.37) - 0.5) * 0.014;
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// ── GRID FLOOR: engineering language. Anti-aliased line grid receding into darkness. ──
const _gridColor = new THREE.Color('#06B6D4');

function GridFloor() {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#06B6D4') },
    uOpacity: { value: 0.35 },
  }), []);

  useFrame((_, delta) => {
    if (document.hidden) return;
    const mood = CHAPTER_MOODS[chapterState.chapter] || CHAPTER_MOODS[0];
    _gridColor.copy(mood.light1);
    uniforms.uColor.value.lerp(_gridColor, delta * 2);
  });

  return (
    <mesh position={[0, -6, -10]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-5}>
      <planeGeometry args={[300, 300]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec3 vWorldPos;

          float gridLine(vec2 p, float scale) {
            vec2 g = abs(fract(p * scale - 0.5) - 0.5) / fwidth(p * scale);
            float line = min(g.x, g.y);
            return 1.0 - min(line, 1.0);
          }

          void main() {
            float fine = gridLine(vWorldPos.xz, 0.25);
            float coarse = gridLine(vWorldPos.xz, 0.05);
            float fade = smoothstep(95.0, 12.0, length(vWorldPos.xz));
            float a = (fine * 0.22 + coarse * 0.55) * fade * uOpacity;
            if (a < 0.003) discard;
            gl_FragColor = vec4(uColor, a);
          }
        `}
      />
    </mesh>
  );
}


function PostProcessing({ quality }: { quality: 'high' | 'low' }) {
  if (quality === 'low') {
    return (
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.9} intensity={0.45} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer enableNormalPass={false} multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={0.9} intensity={0.45} />
      <Vignette darkness={0.5} />
      <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}

function FluidSurface({ quality }: { quality: 'high' | 'low' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const segments = quality === 'high' ? 128 : 64;
  
  const meniscusTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.95, 'rgba(6, 182, 212, 0.8)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((sys) => {
    if (document.hidden) return;
    uniforms.uTime.value = sys.clock.getElapsedTime();
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = uniforms.uTime;
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
       uniform float uTime;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
       float wave1 = sin(position.x * 0.5 + uTime * 0.4) * 0.08;
       float wave2 = sin(position.y * 0.3 + uTime * 0.3) * 0.05;
       float wave3 = sin((position.x + position.y) * 0.2 + uTime * 0.5) * 0.03;
       transformed.z += wave1 + wave2 + wave3;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
       varying vec3 vViewPositionCustom;
       varying vec3 vNormalCustom;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <fog_vertex>',
      `#include <fog_vertex>
       vViewPositionCustom = -mvPosition.xyz;
       vNormalCustom = normalize(normalMatrix * normal);`
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>
       float fresnelTerm = dot(normalize(vViewPositionCustom), normalize(vNormalCustom));
       fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
       fresnelTerm = pow(fresnelTerm, 3.0);
       gl_FragColor.rgb += fresnelTerm * vec3(0.02, 0.44, 0.52) * 1.5;`
    );
  };

  return (
    <group position={[0, 4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[200, 200, segments, segments]} />
        <meshPhysicalMaterial 
           color="#06b6d4" 
           transparent 
           opacity={0.35} 
           roughness={0.1}
           metalness={0.1}
           depthWrite={false}
           onBeforeCompile={onBeforeCompile}
        />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial 
          map={meniscusTex} 
          transparent 
          opacity={0.25} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Bubbles({ quality }: { quality: 'high' | 'low' }) {
  const count = quality === 'high' ? 60 : 30;
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
  }, [count]);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useFrame((sys, delta) => {
    if (document.hidden) return;
    if (!meshRef.current) return;
    const time = sys.clock.getElapsedTime();
    
    // Bubbles are a submersion BEAT, not ambient decoration: chapter 2 only.
    const isActive = chapterState.chapter === 2;
    const targetOpacity = isActive ? 0.5 : 0;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 2);
    
    if (mat.opacity < 0.01) return;
    
    particles.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 4) {
        p.y = -20;
        p.x = getSpawnX();
      }
      
      const xOffset = Math.sin(time * 2 + p.factor) * 0.2;
      dummy.position.set(p.x + xOffset, p.y, p.z);
      
      let currentScale = p.scale;
      if (p.y > 3) {
        currentScale *= Math.max(0, 4 - p.y);
      }
      dummy.scale.setScalar(currentScale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0} roughness={0.1} />
    </instancedMesh>
  );
}

function LightShafts() {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);
  
  useFrame((sys, delta) => {
    if (document.hidden) return;
    let descentProgress = 0;
    if (chapterState.chapter <= 2) {
      descentProgress = (chapterState.chapter + chapterState.chapterProgress) / 3;
    } else {
      descentProgress = 1;
    }
    
    if (groupRef.current) {
      groupRef.current.children.forEach(mesh => {
        const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
        const factor = descentProgress < 0.9 ? 1 : Math.max(0, 1 - (descentProgress - 0.9) * 10);
        const targetOpacity = mesh.userData.baseOpacity * factor;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 2);
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 5, 2]} rotation={[0, 0, Math.PI / 8]}>
      <mesh position={[2, -5, 0]} userData={{ baseOpacity: 0.09 }}>
        <planeGeometry args={[15, 30]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-3, -5, -4]} rotation={[0, Math.PI/6, 0]} userData={{ baseOpacity: 0.06 }}>
        <planeGeometry args={[22.5, 30]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function HeroCenterpiece({ quality }: { quality: 'high' | 'low' }) {
  const groupRef = useRef<THREE.Group>(null);
  const dropRef = useRef<THREE.InstancedMesh>(null);
  const discMatRef = useRef<THREE.MeshBasicMaterial>(null);
  
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  const drops = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      y: -1 - i * 1.0,
      x: 0,
      z: 0,
      active: true
    }));
  }, []);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const emissiveColor = useMemo(() => new THREE.Color('#06B6D4').multiplyScalar(3), []);

  useFrame((sys, delta) => {
    if (document.hidden) return;
    if (!groupRef.current) return;
    
    const time = sys.clock.getElapsedTime();
    
    const isVisible = chapterState.chapter <= 1;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;
    
    // THE LIFT — the brochure cover motif in motion: the blade rises out of
    // the fluid (surface y=4) as the visitor scrolls the first chapter.
    let liftT = 0;
    if (chapterState.chapter === 0) liftT = chapterState.chapterProgress;
    else liftT = 1;
    const eased = liftT * liftT * (3 - 2 * liftT);
    const baseY = 4.55 + eased * 1.75; // half-submerged → fully lifted
    groupRef.current.position.y = baseY + (prefersReducedMotion ? 0 : Math.sin(time * 0.5) * 0.25);
    groupRef.current.rotation.x = prefersReducedMotion ? 0 : Math.sin(time * 0.3) * 0.05;
    groupRef.current.rotation.y = 0.35 + (prefersReducedMotion ? 0 : Math.cos(time * 0.2) * 0.05);
    
    if (dropRef.current) {
      let impactCount = 0;
      const dripRate = 2 + eased * 3.5;
      drops.forEach((d, i) => {
        d.y -= delta * dripRate;
        const surfaceLocal = 4.0 - baseY;
        if (d.y < surfaceLocal) { 
           d.y = -0.2;
           d.x = (Math.random() - 0.5) * 1.5;
           d.z = (Math.random() - 0.5) * 0.4;
        }
        
        dummy.position.set(d.x, d.y, d.z);
        
        let scale = 1;
        if (d.y > -0.5) scale = (-d.y - 0.2) * 2;
        if (d.y < surfaceLocal + 0.2) {
          scale = Math.max(0.01, (d.y - surfaceLocal)) * 5;
          impactCount++;
        }
        dummy.scale.setScalar(Math.max(0.01, scale));
        dummy.updateMatrix();
        dropRef.current!.setMatrixAt(i, dummy.matrix);
      });
      dropRef.current.instanceMatrix.needsUpdate = true;
      
      // keep the impact disc pinned to the world fluid surface (y=4)
      const disc = groupRef.current.children[groupRef.current.children.length - 1];
      if (disc) disc.position.y = 4.0 - baseY;
      if (discMatRef.current) {
        discMatRef.current.opacity = THREE.MathUtils.lerp(
          discMatRef.current.opacity, 
          impactCount > 0 ? 0.3 : 0.1, 
          delta * 4
        );
      }
    }
  });

  return (
    <group position={[3.2, 6.2, 5]} ref={groupRef} scale={quality === 'low' ? 0.7 : 1}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 0.4, 6]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} clearcoat={1} clearcoatRoughness={0.15} envMapIntensity={1.5} />
      </mesh>
      
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[-1.2 + i * 0.26, 0.475, 0]}>
          <boxGeometry args={[0.08, 0.55, 5.8]} />
          <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Indicator strips laid flat on the top face — visible from the above-looking hero camera */}
      <mesh position={[1.38, 0.206, 2.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 1.1]} />
        <meshBasicMaterial color={emissiveColor} toneMapped={false} />
      </mesh>
      <mesh position={[1.38, 0.206, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 1.1]} />
        <meshBasicMaterial color={emissiveColor} toneMapped={false} />
      </mesh>
      <mesh position={[1.38, 0.206, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, 1.1]} />
        <meshBasicMaterial color={emissiveColor} toneMapped={false} />
      </mesh>

      <instancedMesh ref={dropRef} args={[undefined as any, undefined as any, 4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} toneMapped={false} />
      </instancedMesh>
      
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial ref={discMatRef} color="#06b6d4" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

import ExplodingBlade from "./ExplodingBlade";


function getSpawnX() {
  const isEdge = Math.random() < 0.7;
  if (isEdge) {
    const sign = Math.random() > 0.5 ? 1 : -1;
    return sign * (Math.random() * 14 + 6);
  }
  return (Math.random() - 0.5) * 12;
}

export default function Scene({ onCreated, isLoaded }: { onCreated?: () => void, isLoaded?: boolean }) {
  const quality = useQuality();
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020617]">
      <Canvas 
        dpr={quality === 'high' ? [1, 1.5] : [1, 1.25]} 
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: false, 
          alpha: false, 
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
        onCreated={onCreated}
      >
        <color attach="background" args={['#020617']} />
        <fogExp2 attach="fog" args={['#020617', 0.03]} />
        
        <EnvironmentColors />
        <BackdropGradient />
        <GridFloor />
        <Lighting />

        {/* SET PIECES — the scroll-film */}
        <FlowRibbon position={[1.5, 6.2, -8]} rotation={[0.15, -0.35, -0.18]} />
        <FlowRibbon position={[3, 4.8, -11]} rotation={[-0.1, -0.3, 0.12]} scale={0.8} />
        <FlowRibbon position={[-0.5, 2.4, -7]} rotation={[0.05, 0.25, -0.1]} scale={0.9} reprise />
        <ImmersionPod quality={quality} />
        <RackWall />
        <MoleculeChain />
        <CameraRig isLoaded={isLoaded} />
        
        <FluidSurface quality={quality} />
        <Bubbles quality={quality} />
        <LightShafts />
        <HeroCenterpiece quality={quality} />
        <ExplodingBlade quality={quality} />
        
        <Environment resolution={256}>
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} color="white" />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} color="#06b6d4" />
          <Lightformer intensity={0.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} color="#3b82f6" />
        </Environment>
        
        <PostProcessing quality={quality} />
        {quality === 'low' && <AdaptiveDpr pixelated />}
        
        <Preload all />
      </Canvas>
    </div>
  );
}

