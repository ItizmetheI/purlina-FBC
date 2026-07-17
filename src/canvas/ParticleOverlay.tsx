import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { dive } from '../utils/dive';

// Hybrid world, layer 2: live depth cues floating OVER the rendered film —
// drifting motes always, rising bubbles while inside the pod acts. Keeps the
// world feeling real-time without re-rendering the whole hall in WebGL.

function Motes() {
  const count = 140;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pts = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 10,
        z: -Math.random() * 10 - 2,
        s: Math.random() * 0.035 + 0.008,
        sw: Math.random() * Math.PI * 2,
        v: Math.random() * 0.12 + 0.03,
      })),
    []
  );

  useFrame((sys, delta) => {
    if (!ref.current) return;
    const t = sys.clock.getElapsedTime();
    // scroll drift: particles stream downward as you dive, selling motion
    const drift = dive.scroll * 26;
    pts.forEach((p, i) => {
      p.y += p.v * delta;
      if (p.y > 5) p.y = -5;
      dummy.position.set(p.x + Math.sin(t * 0.4 + p.sw) * 0.5, ((p.y - drift) % 10 + 15) % 10 - 5, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#9db8ff" transparent opacity={0.35} depthWrite={false} />
    </instancedMesh>
  );
}

function Bubbles() {
  const count = 40;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pts = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 14,
        y: -Math.random() * 10,
        z: -Math.random() * 6 - 1,
        v: Math.random() * 1.4 + 0.5,
        sw: Math.random() * Math.PI * 2,
        s: Math.random() * 0.05 + 0.015,
      })),
    []
  );

  useFrame((sys, delta) => {
    if (!ref.current) return;
    // bubbles only while the camera is in the fluid acts (breach → pod)
    const active = dive.act >= 1 && dive.act <= 6;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, active ? 0.4 : 0, delta * 2);
    if (mat.opacity < 0.01) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const t = sys.clock.getElapsedTime();
    pts.forEach((p, i) => {
      p.y += p.v * delta;
      if (p.y > 5) p.y = -6;
      dummy.position.set(p.x + Math.sin(t * 2 + p.sw) * 0.2, p.y, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#cfe0ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

export default function ParticleOverlay() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} camera={{ position: [0, 0, 8], fov: 50 }}>
        <Motes />
        <Bubbles />
      </Canvas>
    </div>
  );
}
