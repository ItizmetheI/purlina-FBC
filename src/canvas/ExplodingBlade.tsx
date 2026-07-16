import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { dive } from '../utils/dive';

export default function ExplodingBlade({ quality, position = [0, 0, 0] }: { quality: 'high' | 'low'; position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);
  const powerRef = useRef<THREE.Group>(null);
  const vrmRef = useRef<THREE.Group>(null);
  const cpuRef = useRef<THREE.Group>(null);
  const gpuRef = useRef<THREE.Group>(null);
  
  const explosionRef = useRef(0);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame((sys, delta) => {
    if (!groupRef.current) return;
    
    // Staged at the CONTACT depth; explosion beat runs through act 5
    const isVisible = dive.act >= 4 && dive.act <= 6;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    let targetExplosion = 0;
    if (dive.act === 5) {
      if (dive.actProgress <= 0.3) {
        targetExplosion = dive.actProgress / 0.3;
      } else if (dive.actProgress <= 0.8) {
        targetExplosion = 1;
      } else {
        targetExplosion = 1 - ((dive.actProgress - 0.8) / 0.2) * 0.5;
      }
    } else if (dive.act > 5) {
      targetExplosion = 0;
    }
    
    explosionRef.current = THREE.MathUtils.lerp(
      explosionRef.current,
      targetExplosion,
      delta * 4
    );

    const exp = explosionRef.current;

    // Apply positions
    if (powerRef.current && vrmRef.current && cpuRef.current && gpuRef.current) {
      powerRef.current.position.y = -2.75 * exp;
      vrmRef.current.position.y = -0.916 * exp;
      cpuRef.current.position.y = 0.916 * exp;
      gpuRef.current.position.y = 2.75 * exp;
    }
    
    labelRefs.current.forEach((el, i) => {
      if (el) {
        const threshold = 0.5 + i * 0.08;
        el.style.opacity = exp > threshold ? '1' : '0';
      }
    });

    const time = sys.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + (prefersReducedMotion ? 0 : Math.sin(time * 0.5) * 0.2);
    groupRef.current.rotation.x = Math.PI / 6 + (prefersReducedMotion ? 0 : Math.sin(time * 0.3) * 0.05);
    groupRef.current.rotation.y = -Math.PI / 4 + (prefersReducedMotion ? 0 : Math.cos(time * 0.2) * 0.05);
  });

  const Label = ({ text, index }: { text: string, index: number }) => (
    <Html center position={[-2.9, 0, 0]} distanceFactor={10} className="pointer-events-none hidden md:block">
      <div 
        ref={el => { labelRefs.current[index] = el; }}
        className="text-brand-cyan font-mono text-xs tracking-widest uppercase bg-[#020617]/80 px-3 py-1 border border-brand-cyan/30 rounded whitespace-nowrap transition-opacity duration-500" 
        style={{ opacity: 0 }}
      >
        {text}
      </div>
    </Html>
  );

  const EdgeStrip = ({ width, depth, color }: { width: number, depth: number, color: string }) => {
    // We create the color directly since we are inside a functional component without useMemo here for simplicity, 
    // or we can just pass it directly. Actually, useMemo is better.
    const emissiveColor = React.useMemo(() => new THREE.Color(color).multiplyScalar(3), [color]);
    return (
      <group>
        <mesh position={[width/2 + 0.05, 0, 0]}>
          <boxGeometry args={[0.05, 0.1, depth * 0.5]} />
          <meshBasicMaterial color={emissiveColor} toneMapped={false} />
        </mesh>
        <mesh position={[-width/2 - 0.05, 0, 0]}>
          <boxGeometry args={[0.05, 0.1, depth * 0.5]} />
          <meshBasicMaterial color={emissiveColor} toneMapped={false} />
        </mesh>
      </group>
    );
  };

  return (
    <group position={position} ref={groupRef} scale={quality === 'low' ? 0.7 : 1}>
      <group ref={gpuRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 0.2, 4]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <EdgeStrip width={4} depth={4} color="#06B6D4" />
        <Label text="GPU Unit" index={3} />
      </group>
      
      <group ref={cpuRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.2, 3.8]} />
          <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <EdgeStrip width={3.8} depth={3.8} color="#3b82f6" />
        <Label text="CPU Node" index={2} />
      </group>
      
      <group ref={vrmRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.2, 3.6]} />
          <meshPhysicalMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>
        <EdgeStrip width={3.6} depth={3.6} color="#06B6D4" />
        <Label text="VRM Array" index={1} />
      </group>
      
      <group ref={powerRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.2, 3.4]} />
          <meshPhysicalMaterial color="#475569" metalness={0.6} roughness={0.5} />
        </mesh>
        <EdgeStrip width={3.4} depth={3.4} color="#3b82f6" />
        <Label text="Power Components" index={0} />
      </group>
    </group>
  );
}
