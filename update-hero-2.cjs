const fs = require('fs');

let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

// Replace HeroCenterpiece completely
content = content.replace(/function HeroCenterpiece\(\{ quality \}: \{ quality: 'high' \| 'low' \}\) \{[\s\S]*?\/\/ Glow disc at impact point \*\/\n      <mesh position=\{\[0, -4, 2\.8\]\} rotation=\{\[-Math\.PI\/2, 0, 0\]\}>\n        <circleGeometry args=\{\[1\.2, 32\]\} \/>\n        <meshBasicMaterial ref=\{discMatRef\} color="#06b6d4" transparent opacity=\{0\.1\} blending=\{THREE\.AdditiveBlending\} depthWrite=\{false\} \/>\n      <\/mesh>\n    <\/group>\n  \);\n\}/m,
`function HeroCenterpiece({ quality }: { quality: 'high' | 'low' }) {
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
    
    groupRef.current.position.y = 6.2 + (prefersReducedMotion ? 0 : Math.sin(time * 0.5) * 0.3);
    groupRef.current.rotation.x = prefersReducedMotion ? 0 : Math.sin(time * 0.3) * 0.05;
    groupRef.current.rotation.y = 0.35 + (prefersReducedMotion ? 0 : Math.cos(time * 0.2) * 0.05);
    
    if (dropRef.current) {
      let impactCount = 0;
      drops.forEach((d, i) => {
        d.y -= delta * 3;
        if (d.y < -2.2) { 
           d.y = -0.2;
           d.x = (Math.random() - 0.5) * 1.5;
           d.z = (Math.random() - 0.5) * 0.4;
        }
        
        dummy.position.set(d.x, d.y, d.z);
        
        let scale = 1;
        if (d.y > -0.5) scale = (-d.y - 0.2) * 2;
        if (d.y < -2.0) {
          scale = (d.y + 2.2) * 5;
          impactCount++;
        }
        dummy.scale.setScalar(Math.max(0.01, scale));
        dummy.updateMatrix();
        dropRef.current!.setMatrixAt(i, dummy.matrix);
      });
      dropRef.current.instanceMatrix.needsUpdate = true;
      
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
      
      <mesh position={[1.4, 0, 2.5]}>
        <planeGeometry args={[0.15, 1.2]} />
        <meshBasicMaterial color={emissiveColor} toneMapped={false} />
      </mesh>
      <mesh position={[1.4, 0, 2.0]}>
        <planeGeometry args={[0.15, 1.2]} />
        <meshBasicMaterial color={emissiveColor} toneMapped={false} />
      </mesh>
      <mesh position={[1.4, 0, 1.5]}>
        <planeGeometry args={[0.15, 1.2]} />
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
}`
);

fs.writeFileSync('src/canvas/Scene.tsx', content);
