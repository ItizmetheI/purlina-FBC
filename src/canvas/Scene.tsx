import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Lightformer, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useState, useEffect, useMemo } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { dive } from '../utils/dive';
import ExplodingBlade from './ExplodingBlade';

// ====================================================================
// THE TANK -- one environment, one continuous camera descent.
// World mapping: fluid surface = y 0, camera y = -dive.depth,
// tank walls at x +/-13 / z -14, floor at y -42.
// Law: background stays in the dark band; color lives on objects only.
// ====================================================================

const FOG_COLOR = '#020b18';
const CYAN = '#22d3ee';

function useQuality() {
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    setQuality(isCoarse || hardwareConcurrency < 6 ? 'low' : 'high');
  }, []);
  return quality;
}

// -- CAMERA: depth-keyed keyframes, one continuous path --------------
const CAM_KEYS: { d: number; pos: THREE.Vector3; look: THREE.Vector3 }[] = [
  { d: 0,    pos: new THREE.Vector3(0, 1.8, 12),    look: new THREE.Vector3(2.5, 0, -4) },
  { d: 0.4,  pos: new THREE.Vector3(0, 1.0, 11),    look: new THREE.Vector3(1.5, -1, -4) },
  { d: 3,    pos: new THREE.Vector3(0, -3, 10.5),   look: new THREE.Vector3(0, -5, -5) },
  { d: 6.5,  pos: new THREE.Vector3(-1, -6.5, 10),  look: new THREE.Vector3(4, -8.5, -5) },
  { d: 10,   pos: new THREE.Vector3(1, -10, 9.5),   look: new THREE.Vector3(-3, -12, -6) },
  { d: 13,   pos: new THREE.Vector3(2, -13, 9),     look: new THREE.Vector3(-5, -14.5, -6) },
  { d: 16,   pos: new THREE.Vector3(0, -16, 8.5),   look: new THREE.Vector3(-5, -18, -6) },
  { d: 20,   pos: new THREE.Vector3(-7, -20, 8),    look: new THREE.Vector3(-3, -21, -6) },
  { d: 24,   pos: new THREE.Vector3(-6, -24, 9.5),  look: new THREE.Vector3(-1, -26, -3) },
  { d: 27,   pos: new THREE.Vector3(2, -27, 10),    look: new THREE.Vector3(-4, -28, -1) },
  { d: 30,   pos: new THREE.Vector3(2, -30, 10),    look: new THREE.Vector3(-2, -32, -3) },
  { d: 33,   pos: new THREE.Vector3(0, -33, 10),    look: new THREE.Vector3(4, -35, -3) },
  { d: 36,   pos: new THREE.Vector3(0, -36, 10.5),  look: new THREE.Vector3(2, -38.5, -4) },
  { d: 38.5, pos: new THREE.Vector3(0, -38.5, 10.5), look: new THREE.Vector3(0, -40.5, -6) },
  { d: 40,   pos: new THREE.Vector3(0, -39.8, 10),  look: new THREE.Vector3(0, -34, -8) },
];

const _camPos = new THREE.Vector3();
const _camLook = new THREE.Vector3();
let _lastScroll = 0;

function sampleKeys(d: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  const keys = CAM_KEYS;
  if (d <= keys[0].d) { outPos.copy(keys[0].pos); outLook.copy(keys[0].look); return; }
  const last = keys[keys.length - 1];
  if (d >= last.d) { outPos.copy(last.pos); outLook.copy(last.look); return; }
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (d >= a.d && d < b.d) {
      const f = (d - a.d) / (b.d - a.d);
      const sf = f * f * (3 - 2 * f);
      outPos.lerpVectors(a.pos, b.pos, sf);
      outLook.lerpVectors(a.look, b.look, sf);
      return;
    }
  }
}

function DiveCamera({ isLoaded }: { isLoaded?: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useFrame((sys, delta) => {
    if (!cameraRef.current) return;

    sampleKeys(dive.depth, _camPos, _camLook);

    // dev hook: place the camera instantly (used by tooling that renders
    // single frames in hidden tabs, where the smoothing lerp can't converge)
    if ((window as any).__snapCam) {
      cameraRef.current.position.copy(_camPos);
      if (dive.act === 9) {
        const f9 = dive.actProgress * dive.actProgress * (3 - 2 * dive.actProgress);
        _camLook.y += f9 * 10;
      }
      cameraRef.current.lookAt(_camLook);
      return;
    }

    // act 9: settle, then gaze back up toward the distant surface
    if (dive.act === 9) {
      const f = dive.actProgress * dive.actProgress * (3 - 2 * dive.actProgress);
      _camLook.y += f * 10;
    }

    const time = sys.clock.getElapsedTime();
    const mouseX = prefersReducedMotion ? 0 : sys.pointer.x;
    const mouseY = prefersReducedMotion ? 0 : sys.pointer.y;
    const idleY = (!prefersReducedMotion && isLoaded) ? Math.sin(time * 0.4) * 0.06 : 0;

    _camPos.x += mouseX * 0.5;
    _camPos.y += mouseY * 0.3 + idleY;
    if (!isLoaded) _camPos.z += 2; // loader entrance dolly

    cameraRef.current.position.lerp(_camPos, delta * (isLoaded ? 2.5 : 2));
    cameraRef.current.lookAt(_camLook);
    cameraRef.current.rotation.y -= mouseX * 0.04;
    cameraRef.current.rotation.x += mouseY * 0.03;

    // scroll-velocity lens: fast scrolling widens FOV slightly
    const vel = Math.abs(dive.scroll - _lastScroll) / Math.max(delta, 0.001);
    _lastScroll = dive.scroll;
    const targetFov = 45 + Math.min(vel * 30, 6);
    if (Math.abs(cameraRef.current.fov - targetFov) > 0.02) {
      cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, targetFov, delta * 4);
      cameraRef.current.updateProjectionMatrix();
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1.8, 14]} fov={45} />;
}

// -- ATMOSPHERE: fixed dark band. Sunlight starves with depth. -------
function Atmosphere() {
  const { scene } = useThree();
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const fogColor = useMemo(() => new THREE.Color(FOG_COLOR), []);

  useEffect(() => {
    scene.background = fogColor;
  }, [scene, fogColor]);

  useFrame((_, delta) => {
    if (scene.fog) {
      const underwater = dive.depth > 0.4;
      const target = underwater ? 0.042 + 0.012 * (dive.depth / 40) : 0.03;
      (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp(
        (scene.fog as THREE.FogExp2).density, target, delta * 2
      );
    }
    if (sunRef.current) {
      const target = 1.2 * Math.exp(-dive.depth / 4) + 0.07;
      sunRef.current.intensity = THREE.MathUtils.lerp(sunRef.current.intensity, target, delta * 2);
    }
  });

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight ref={sunRef} position={[3, 10, 4]} intensity={1.2} color="#cfeaff" />
      <directionalLight position={[-6, -30, 8]} intensity={0.35} color="#164e63" />
    </>
  );
}

// -- TANK ENVIRONMENT: walls, ribs, service lights, floor grid -------
function TankEnvironment() {
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#020813', roughness: 0.92, metalness: 0.2 }), []);
  const ribMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#060d1a', roughness: 0.6, metalness: 0.5 }), []);
  const stripMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('#0e7490').multiplyScalar(0.55), toneMapped: false }), []);

  // ribs: horizontal structure lines on the three walls, every 2.2 m
  const ribs = useMemo(() => {
    const items: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let y = 0; y > -44; y -= 2.2) {
      items.push({ pos: [-13, y, 2], rot: [0, Math.PI / 2, 0] });
      items.push({ pos: [13, y, 2], rot: [0, Math.PI / 2, 0] });
      items.push({ pos: [0, y, -14], rot: [0, 0, 0] });
    }
    return items;
  }, []);

  // service strip lights every 8 m of depth
  const strips = useMemo(() => {
    const items: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let y = -8; y >= -40; y -= 8) {
      items.push({ pos: [-12.9, y, 2], rot: [0, Math.PI / 2, 0] });
      items.push({ pos: [12.9, y, 2], rot: [0, Math.PI / 2, 0] });
      items.push({ pos: [0, y, -13.9], rot: [0, 0, 0] });
    }
    return items;
  }, []);

  const ribRef = useRef<THREE.InstancedMesh>(null);
  const stripRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (ribRef.current) {
      ribs.forEach((r, i) => {
        dummy.position.set(...r.pos);
        dummy.rotation.set(...r.rot);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        ribRef.current!.setMatrixAt(i, dummy.matrix);
      });
      ribRef.current.instanceMatrix.needsUpdate = true;
    }
    if (stripRef.current) {
      strips.forEach((s, i) => {
        dummy.position.set(...s.pos);
        dummy.rotation.set(...s.rot);
        dummy.updateMatrix();
        stripRef.current!.setMatrixAt(i, dummy.matrix);
      });
      stripRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [ribs, strips]);

  return (
    <group>
      {/* walls */}
      <mesh position={[-13.1, -21, 2]} rotation={[0, Math.PI / 2, 0]} material={wallMat}>
        <planeGeometry args={[34, 48]} />
      </mesh>
      <mesh position={[13.1, -21, 2]} rotation={[0, -Math.PI / 2, 0]} material={wallMat}>
        <planeGeometry args={[34, 48]} />
      </mesh>
      <mesh position={[0, -21, -14.1]} material={wallMat}>
        <planeGeometry args={[28, 48]} />
      </mesh>

      {/* structural ribs */}
      <instancedMesh ref={ribRef} args={[undefined as any, undefined as any, ribs.length]} material={ribMat}>
        <boxGeometry args={[30, 0.14, 0.22]} />
      </instancedMesh>

      {/* service strip lights */}
      <instancedMesh ref={stripRef} args={[undefined as any, undefined as any, strips.length]} material={stripMat}>
        <boxGeometry args={[24, 0.05, 0.05]} />
      </instancedMesh>

      {/* floor grid */}
      <FloorGrid />
    </group>
  );
}

// -- PASSERS: near-field silhouettes that sweep past the lens as you
//    descend. The whole depth sensation comes from this layer: without
//    something crossing CLOSE to camera, a dive reads as a flat backdrop.
function Passers() {
  const items = useMemo(() => {
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const arr: { x: number; y: number; z: number; w: number; h: number; rot: number }[] = [];
    for (let d = 3; d < 41; d += 2.2) {
      const side = rand() > 0.5 ? 1 : -1;
      arr.push({
        x: side * (7.5 + rand() * 4),
        y: -d,
        z: 3.5 + rand() * 3,
        w: 0.5 + rand() * 1.1,
        h: 3 + rand() * 5,
        rot: rand() * 0.5 - 0.25,
      });
    }
    return arr;
  }, []);

  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#01060f', roughness: 0.95, metalness: 0.15 }), []);

  return (
    <group>
      {items.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} rotation={[0, p.rot, 0]} material={mat}>
          <boxGeometry args={[p.w, p.h, p.w]} />
        </mesh>
      ))}
      {/* tank plumbing: vertical service pipes hugging the walls */}
      {[[-11.6, -6], [-11, -2.5], [11.4, -7], [11.9, -3.5], [-11.9, 0.5], [11.1, 1.5]].map(([x, z], i) => (
        <mesh key={`p${i}`} position={[x, -21, z]}>
          <cylinderGeometry args={[0.14 + (i % 3) * 0.05, 0.14 + (i % 3) * 0.05, 44, 8]} />
          <meshStandardMaterial color="#040c18" roughness={0.5} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function FloorGrid() {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#164e63') },
    uOpacity: { value: 0.45 },
  }), []);

  return (
    <mesh position={[0, -42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 60]} />
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
            return 1.0 - min(min(g.x, g.y), 1.0);
          }
          void main() {
            float fine = gridLine(vWorldPos.xz, 0.5);
            float coarse = gridLine(vWorldPos.xz, 0.125);
            float fade = smoothstep(30.0, 6.0, length(vWorldPos.xz));
            float a = (fine * 0.2 + coarse * 0.55) * fade * uOpacity;
            if (a < 0.003) discard;
            gl_FragColor = vec4(uColor, a);
          }
        `}
      />
    </mesh>
  );
}

// -- CAUSTICS: light dapple on the walls, only near the surface ------
function Caustics() {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((sys) => {
    uniforms.uTime.value = sys.clock.getElapsedTime();
  });

  const shader = {
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec3 vWorldPos;
      void main() {
        if (vWorldPos.y > -0.4) discard; // caustics live under the waterline only
        vec2 p = vec2(vWorldPos.x + vWorldPos.z, vWorldPos.y);
        float c1 = sin(p.x * 0.8 + uTime * 0.6) * sin(p.y * 1.3 - uTime * 0.4);
        float c2 = sin(p.x * 1.7 - uTime * 0.5) * sin(p.y * 0.7 + uTime * 0.7);
        float c = pow(max(0.0, c1 * c2), 2.0);
        float depthFade = smoothstep(-12.0, -2.0, vWorldPos.y);
        // additive dapples at grazing angles pile into a gray wash — fade by view distance
        float viewFade = exp(-distance(vWorldPos, cameraPosition) * 0.14);
        float a = c * depthFade * viewFade * 0.16;
        if (a < 0.004) discard;
        gl_FragColor = vec4(vec3(0.49, 0.83, 0.99), a);
      }
    `,
  };

  return (
    <group>
      <mesh position={[-12.9, -5, 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[32, 14]} />
        <shaderMaterial args={[shader]} />
      </mesh>
      <mesh position={[12.9, -5, 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[32, 14]} />
        <shaderMaterial args={[shader]} />
      </mesh>
      <mesh position={[0, -5, -13.9]}>
        <planeGeometry args={[26, 14]} />
        <shaderMaterial args={[shader]} />
      </mesh>
    </group>
  );
}

// -- FLUID SURFACE: only lives near the surface acts -----------------
function FluidSurface({ quality }: { quality: 'high' | 'low' }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const segments = quality === 'high' ? 96 : 48;

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((sys) => {
    if (groupRef.current) {
      // the surface only exists while crossing it — never from above
      // (its grazing-angle env reflection reads as a gray slab in the hero)
      groupRef.current.visible = dive.depth > 0.25 && dive.depth < 7;
      if (!groupRef.current.visible) return;
    }
    if (matRef.current) {
      matRef.current.opacity = 0.08 * (1 - THREE.MathUtils.smoothstep(dive.depth, 4, 6.5));
    }
    uniforms.uTime.value = sys.clock.getElapsedTime();
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
       uniform float uTime;
       varying vec3 vViewPositionCustom;
       varying vec3 vNormalCustom;`
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
       gl_FragColor.rgb += fresnelTerm * vec3(0.02, 0.44, 0.52) * 0.6;`
    );
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[90, 90, segments, segments]} />
        <meshPhysicalMaterial
          ref={matRef}
          color="#0e7490"
          transparent
          opacity={0.08}
          roughness={0.35}
          metalness={0.05}
          envMapIntensity={0.15}
          depthWrite={false}
          side={THREE.DoubleSide}
          onBeforeCompile={onBeforeCompile}
        />
      </mesh>
    </group>
  );
}

// -- SURFACE GLOW: the distant light above, seen from the floor ------
function SurfaceGlow() {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(190, 235, 255, 0.9)');
      grad.addColorStop(0.4, 'rgba(56, 189, 248, 0.35)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const target = dive.act >= 9 ? 0.5 : dive.act >= 8 ? 0.15 : 0;
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, target, delta * 2);
  });

  return (
    <mesh position={[0, -24, -6]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[26, 26]} />
      <meshBasicMaterial ref={matRef} map={tex} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// -- LIGHT SHAFTS: near-surface only ---------------------------------
function LightShafts() {
  const groupRef = useRef<THREE.Group>(null);

  // soft radial alpha so the planes read as light, not glass sheets
  const softTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const d = dive.depth;
    const factor = THREE.MathUtils.smoothstep(d, 0.5, 2) * (1 - THREE.MathUtils.smoothstep(d, 8, 12));
    groupRef.current.visible = factor > 0.01;
    groupRef.current.children.forEach((mesh) => {
      const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, mesh.userData.baseOpacity * factor, delta * 2);
    });
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]} rotation={[0, 0, Math.PI / 9]}>
      <mesh position={[2, -6, -2]} userData={{ baseOpacity: 0.08 }}>
        <planeGeometry args={[11, 26]} />
        <meshBasicMaterial color="#0ea5e9" alphaMap={softTex} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-4, -6, -6]} rotation={[0, Math.PI / 6, 0]} userData={{ baseOpacity: 0.05 }}>
        <planeGeometry args={[15, 26]} />
        <meshBasicMaterial color="#38bdf8" alphaMap={softTex} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// -- MOTES: one drifting particle system for the whole tank ----------
function Motes({ quality }: { quality: 'high' | 'low' }) {
  const count = quality === 'high' ? 220 : 110;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const motes = useMemo(() =>
    Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 24,
      y: -Math.random() * 44,
      z: (Math.random() - 0.5) * 16 - 4, // stay behind the camera plane — near-lens motes blow up into flat blobs
      speed: Math.random() * 0.25 + 0.08,
      sway: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.05 + 0.015,
    })), [count]);

  useFrame((sys, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const target = dive.depth > 1 ? 0.35 : 0;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, delta * 2);
    if (mat.opacity < 0.01) { meshRef.current.visible = false; return; }
    meshRef.current.visible = true;

    const time = sys.clock.getElapsedTime();
    motes.forEach((p, i) => {
      p.y += p.speed * delta;
      if (p.y > 0) p.y = -44;
      dummy.position.set(p.x + Math.sin(time * 0.5 + p.sway) * 0.4, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#7dd3fc" transparent opacity={0} depthWrite={false} />
    </instancedMesh>
  );
}

// -- BUBBLES: the breach beat (acts 1-2 only) ------------------------
function Bubbles({ quality }: { quality: 'high' | 'low' }) {
  const count = quality === 'high' ? 50 : 25;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 16,
      y: -Math.random() * 12,
      z: (Math.random() - 0.5) * 8 - 1,
      speed: Math.random() * 1.6 + 0.6,
      factor: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.05 + 0.02,
    })), [count]);

  useFrame((sys, delta) => {
    if (!meshRef.current) return;
    const isActive = dive.act === 1 || dive.act === 2;
    const targetOpacity = dive.act === 1 ? 0.55 : dive.act === 2 ? 0.25 : 0;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, isActive ? targetOpacity : 0, delta * 2);
    if (mat.opacity < 0.01) { meshRef.current.visible = false; return; }
    meshRef.current.visible = true;

    const time = sys.clock.getElapsedTime();
    particles.forEach((p, i) => {
      p.y += p.speed * delta;
      if (p.y > -0.2) {
        p.y = -12;
        p.x = (Math.random() - 0.5) * 16;
      }
      dummy.position.set(p.x + Math.sin(time * 2 + p.factor) * 0.2, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#9ceef7" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// -- COOLANT STREAM: the protagonist. One continuous ribbon of liquid
//    light that travels the whole dive with the visitor -- enters at the
//    surface, threads the burning racks (running hot as it absorbs
//    their heat), cools back to cyan, and pools at the product vials.
//    Everything else in the tank is silhouette; this gets the light. --
const STREAM_POINTS: [number, number, number][] = [
  [7.5, 2.2, 4],      // above the surface, beside the hero blade
  [4.5, 0.2, 2.5],    // pierces the meniscus
  [1.5, -3.5, -1],    // first sweep down
  [-3, -7.5, -4],     // toward the wall
  [-4.8, -11.5, -5.2],// enters the rack column -- heat pickup
  [-4.2, -15, -6.2],
  [-5.2, -18.5, -5.6],// exits the racks
  [-8.5, -22, -3.5],  // wide curl as the camera swings around
  [-6.5, -25.5, -1],
  [-3.8, -28, -0.5],  // past the exploded blade
  [-0.5, -30.5, -2.5],
  [3, -33.5, -2.5],   // past the molecule
  [5, -36.5, -3],
  [4.5, -39.5, -3],   // pools at the vials
  [3.5, -41.2, -3],
];

function CoolantStream() {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(STREAM_POINTS.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.5),
    []
  );

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHeat: { value: 0 },   // how hot the rack zone runs (act 3 -> 1, act 4 sweeps to 0)
  }), []);

  useFrame((sys, delta) => {
    uniforms.uTime.value = sys.clock.getElapsedTime();
    const targetHeat = dive.act === 3 ? 1 : dive.act === 4 ? Math.max(0, 1 - dive.actProgress * 1.4) : 0;
    uniforms.uHeat.value = THREE.MathUtils.lerp(uniforms.uHeat.value, targetHeat, delta * 1.5);
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    uniform float uTime;
    uniform float uHeat;
    varying vec2 vUv;
    void main() {
      // luminous pulses travelling along the stream (constants pre-folded --
      // nested constant math hangs the ANGLE/D3D shader compiler on some iGPUs)
      float strands = pow(abs(sin(vUv.x * 502.65 - uTime * 0.22)), 2.0);
      float slow = pow(abs(sin(vUv.x * 56.55 - uTime * 0.0785)), 2.0);
      // the stretch that threads the racks runs hot while they burn
      float heatZone = smoothstep(0.24, 0.30, vUv.x) * (1.0 - smoothstep(0.42, 0.50, vUv.x));
      float heat = heatZone * uHeat;
      vec3 cool = vec3(0.13, 0.83, 0.93);
      vec3 hot  = vec3(1.0, 0.32, 0.16);
      vec3 col = mix(cool, hot, heat);
      float intensity = (0.6 + strands * 0.95 + slow * 0.5) * 2.5;
      float startFade = smoothstep(0.0, 0.04, vUv.x);
      float endFade = 1.0 - smoothstep(0.96, 1.0, vUv.x);
      float alpha = (0.62 + strands * 0.38) * startFade * endFade;
      gl_FragColor = vec4(col * intensity, alpha);
    }
  `;

  // ponytail: single tube; the glow halo comes free from Bloom -- a second
  // fat additive tube caused GPU-timeout freezes on integrated GPUs
  return (
    <mesh>
      <tubeGeometry args={[curve, 240, 0.13, 12, false]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// -- FLOW RIBBON: the brochure cover wave, on the surface horizon ----
function FlowRibbon() {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#38bdf8') },
    uOpacity: { value: 0 },
  }), []);

  useFrame((sys, delta) => {
    uniforms.uTime.value = sys.clock.getElapsedTime();
    const target = dive.act <= 1 ? 0.8 : dive.act === 2 ? 0.2 : 0;
    uniforms.uOpacity.value = THREE.MathUtils.lerp(uniforms.uOpacity.value, target, delta * 2);
  });

  return (
    <mesh position={[0, 1.4, -11]} rotation={[0.08, -0.1, -0.06]}>
      <planeGeometry args={[44, 4, 220, 16]} />
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
            float w1 = sin(p.x * 0.25 + uTime * 0.50) * 0.9;
            float w2 = sin(p.x * 0.11 - uTime * 0.30) * 1.5;
            float w3 = sin(p.x * 0.05 + uTime * 0.15) * 2.0;
            p.y += w1 + w2 + w3;
            p.z += sin(p.x * 0.08 + uTime * 0.20) * 1.2;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            float strands = pow(abs(sin(vUv.y * 75.4 + vUv.x * 18.85 - uTime * 1.885)), 6.0);
            float core = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
            float endFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
            float a = (0.08 + strands * 0.5) * core * endFade * uOpacity;
            if (a < 0.004) discard;
            gl_FragColor = vec4(uColor * (0.6 + strands * 1.4), a);
          }
        `}
      />
    </mesh>
  );
}

// -- HERO BLADE: rises from the fluid as the first chapter scrolls ---
function HeroBlade({ quality }: { quality: 'high' | 'low' }) {
  const groupRef = useRef<THREE.Group>(null);
  const dropRef = useRef<THREE.InstancedMesh>(null);
  const discMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const drops = useMemo(() => Array.from({ length: 4 }).map((_, i) => ({ y: -1 - i, x: 0, z: 0 })), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const emissiveColor = useMemo(() => new THREE.Color(CYAN).multiplyScalar(3), []);

  useFrame((sys, delta) => {
    if (!groupRef.current) return;

    const isVisible = dive.act <= 1;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const time = sys.clock.getElapsedTime();
    const liftT = dive.act === 0 ? dive.actProgress : 1;
    const eased = liftT * liftT * (3 - 2 * liftT);
    const baseY = 0.55 + eased * 1.75; // half-submerged -> lifted
    groupRef.current.position.y = baseY + (prefersReducedMotion ? 0 : Math.sin(time * 0.5) * 0.2);
    groupRef.current.rotation.x = prefersReducedMotion ? 0 : Math.sin(time * 0.3) * 0.05;
    groupRef.current.rotation.y = 0.35 + (prefersReducedMotion ? 0 : Math.cos(time * 0.2) * 0.05);

    if (dropRef.current) {
      let impactCount = 0;
      const dripRate = 2 + eased * 3.5;
      const surfaceLocal = -baseY;
      drops.forEach((d, i) => {
        d.y -= delta * dripRate;
        if (d.y < surfaceLocal) {
          d.y = -0.2;
          d.x = (Math.random() - 0.5) * 1.5;
          d.z = (Math.random() - 0.5) * 0.4;
        }
        dummy.position.set(d.x, d.y, d.z);
        let scale = 1;
        if (d.y > -0.5) scale = (-d.y - 0.2) * 2;
        if (d.y < surfaceLocal + 0.2) {
          scale = Math.max(0.01, d.y - surfaceLocal) * 5;
          impactCount++;
        }
        dummy.scale.setScalar(Math.max(0.01, scale));
        dummy.updateMatrix();
        dropRef.current!.setMatrixAt(i, dummy.matrix);
      });
      dropRef.current.instanceMatrix.needsUpdate = true;

      const disc = groupRef.current.children[groupRef.current.children.length - 1];
      if (disc) disc.position.y = -baseY;
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
    <group position={[4.5, 0.55, 2]} ref={groupRef} scale={quality === 'low' ? 0.7 : 1}>
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

      {[2.3, 1.0, -0.3].map((z) => (
        <mesh key={z} position={[1.38, 0.206, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 1.1]} />
          <meshBasicMaterial color={emissiveColor} toneMapped={false} />
        </mesh>
      ))}

      <instancedMesh ref={dropRef} args={[undefined as any, undefined as any, 4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} toneMapped={false} />
      </instancedMesh>

      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial ref={discMatRef} color="#06b6d4" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

// -- RACK COLUMN: submerged compute, burns red then cools as the
//    camera swings past -- the product story told as light -----------
const _ledHot = new THREE.Color('#ef4444').multiplyScalar(2.8);
const _ledCool = new THREE.Color('#22d3ee').multiplyScalar(2.2);
const _ledDim = new THREE.Color('#1e293b');
const _ledTmp = new THREE.Color();

function RackColumn() {
  const groupRef = useRef<THREE.Group>(null);

  // 2 columns Ã— 6 rows spanning the problem/solution depths
  const units = useMemo(() => {
    const items: { pos: [number, number, number]; idx: number }[] = [];
    let idx = 0;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 2; c++) {
        items.push({ pos: [-5.6 + c * 2.1, -11 - r * 2.2, -6], idx: idx++ });
      }
    }
    return items;
  }, []);

  const ledMats = useMemo(
    () => units.map(() => new THREE.MeshBasicMaterial({ color: '#1e293b', toneMapped: false })),
    [units]
  );

  useFrame((sys, delta) => {
    if (!groupRef.current) return;
    const visible = dive.act >= 2 && dive.act <= 5;
    groupRef.current.visible = visible;
    if (!visible) return;

    const time = sys.clock.getElapsedTime();
    units.forEach((u, i) => {
      // cool front: sweeps top->bottom through act 4
      const unitT = (i + 1) / units.length;
      let target: THREE.Color;
      if (dive.act === 3) target = _ledHot;
      else if (dive.act === 4) target = dive.actProgress > unitT * 0.85 ? _ledCool : _ledHot;
      else if (dive.act === 5) target = _ledCool;
      else target = _ledDim;

      const pulse = target === _ledHot ? 0.75 + 0.25 * Math.sin(time * 5 + i) : 1;
      _ledTmp.copy(target).multiplyScalar(pulse);
      ledMats[i].color.lerp(_ledTmp, delta * 3);
    });
  });

  return (
    <group ref={groupRef} rotation={[0, 0.18, 0]}>
      {units.map((u) => (
        <mesh key={`b${u.idx}`} position={u.pos} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.0, 1.0]} />
          <meshPhysicalMaterial color="#0b1220" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {/* second row deeper in the gloom — a data hall, not a lone cabinet */}
      {units.map((u) => (
        <mesh key={`r${u.idx}`} position={[u.pos[0] - 1.6, u.pos[1], -11]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.0, 1.0]} />
          <meshPhysicalMaterial color="#070d18" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
      {units.map((u) => (
        <mesh key={`l${u.idx}`} position={[u.pos[0], u.pos[1] + 0.75, u.pos[2] + 0.53]} material={ledMats[u.idx]}>
          <planeGeometry args={[1.4, 0.09]} />
        </mesh>
      ))}
      {units.map((u) => (
        <mesh
          key={`s${u.idx}`}
          position={[u.pos[0] - 0.93, u.pos[1] + 0.75, u.pos[2]]}
          rotation={[0, -Math.PI / 2, 0]}
          material={ledMats[u.idx]}
        >
          <planeGeometry args={[0.8, 0.09]} />
        </mesh>
      ))}
    </group>
  );
}

// -- MOLECULE CHAIN: straight-chain paraffin, drifting past (act 6) --
function MoleculeChain() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((sys) => {
    if (!groupRef.current) return;
    const visible = dive.act >= 5 && dive.act <= 7;
    groupRef.current.visible = visible;
    if (!visible) return;
    const time = sys.clock.getElapsedTime();
    groupRef.current.rotation.x = time * 0.15;
    groupRef.current.rotation.z = 0.2 + Math.sin(time * 0.1) * 0.05;
  });

  const atoms = Array.from({ length: 11 }).map((_, i) => ({
    x: -2.75 + i * 0.55,
    y: i % 2 === 0 ? 0.16 : -0.16,
  }));

  return (
    <group ref={groupRef} position={[4.5, -33.5, -2]}>
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

// -- VIALS: the X-series as lit monoliths on the tank floor ----------
function Vials() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = dive.act >= 6;
  });

  const fills = [0.55, 0.72, 0.88];

  return (
    <group ref={groupRef} position={[4.5, 0, -3]}>
      {fills.map((fill, i) => (
        <group key={i} position={[(i - 1) * 2.2, -40.4, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.55, 2.2, 6, 20]} />
            <meshPhysicalMaterial color="#0a1220" metalness={0.2} roughness={0.15} envMapIntensity={1.5} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, -1.1 + (2.6 * fill) / 2, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 2.6 * fill, 16]} />
            <meshBasicMaterial color={new THREE.Color('#0891b2').multiplyScalar(2.4)} transparent opacity={0.9} toneMapped={false} />
          </mesh>
          <mesh position={[0, -1.62, 0]}>
            <cylinderGeometry args={[0.7, 0.8, 0.24, 20]} />
            <meshPhysicalMaterial color="#0b1220" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <spotLight position={[0, -36, 4]} angle={0.6} penumbra={1} intensity={30} color="#38bdf8" target-position={[0, -41, -3]} />
    </group>
  );
}

function PostFX() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom mipmapBlur luminanceThreshold={0.72} intensity={0.75} />
    </EffectComposer>
  );
}

// Signals readiness on mount (not first painted frame) so the loader clears
// even when the tab starts hidden, and exposes the R3F state for tooling.
function ReadyHook({ onReady }: { onReady?: () => void }) {
  const state = useThree();
  useEffect(() => {
    (window as any).__r3f = state;
    onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function Scene({ onCreated, isLoaded }: { onCreated?: () => void; isLoaded?: boolean }) {
  const quality = useQuality();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020b18]">
      <Canvas
        dpr={quality === 'high' ? [1, 1.5] : [1, 1.25]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <color attach="background" args={[FOG_COLOR]} />
        <fogExp2 attach="fog" args={[FOG_COLOR, 0.024]} />

        <Atmosphere />
        <TankEnvironment />
        <Passers />
        <Caustics />
        <DiveCamera isLoaded={isLoaded} />

        {/* set pieces staged along the descent */}
        <CoolantStream />
        <FlowRibbon />
        <FluidSurface quality={quality} />
        <HeroBlade quality={quality} />
        <LightShafts />
        <Bubbles quality={quality} />
        <Motes quality={quality} />
        <RackColumn />
        <ExplodingBlade quality={quality} position={[-4, -28, -1]} />
        <MoleculeChain />
        <Vials />
        <SurfaceGlow />

        <Environment resolution={128}>
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} color="white" />
          <Lightformer intensity={1.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} color="#06b6d4" />
        </Environment>

        <PostFX />
        <AdaptiveDpr pixelated />
        <ReadyHook onReady={onCreated} />
      </Canvas>
    </div>
  );
}
