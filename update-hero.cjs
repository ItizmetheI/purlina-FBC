const fs = require('fs');
let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

const heroTarget = `function HeroCenterpiece() {
  const groupRef = useRef<THREE.Group>(null);
  const dropRef = useRef<THREE.InstancedMesh>(null);
  const discMatRef = useRef<THREE.MeshBasicMaterial>(null);
  
  const drops = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      y: -1 - i * 1.0,
      x: (Math.random() - 0.5) * 1.5,
      z: 2.8 + (Math.random() - 0.5) * 0.4,
      active: true
    }));
  }, []);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((sys, delta) => {
    if (!groupRef.current) return;
    
    const time = sys.clock.getElapsedTime();
    
    // Only visible in early chapters to save performance
    const isVisible = chapterState.chapter <= 1;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;
    
    groupRef.current.position.y = 8 + Math.sin(time * 0.5) * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
    groupRef.current.rotation.y = Math.cos(time * 0.2) * 0.05;
    
    if (dropRef.current) {
      let impactCount = 0;
      drops.forEach((d, i) => {
        d.y -= delta * 3;
        if (d.y < -4) { 
           d.y = -0.5; 
           d.x = (Math.random() - 0.5) * 1.5;
        }
        
        dummy.position.set(d.x, d.y, d.z);
        
        let scale = 1;
        if (d.y > -1) scale = (1 - d.y) * 2;
        if (d.y < -3.5) {
          scale = (d.y + 4) * 2;
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
    <group position={[4, 8, 4]} ref={groupRef}>
      {/* Blade chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 0.4, 6]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Fin rows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-1.0 + i * 0.4, 0.4, 0]}>
          <boxGeometry args={[0.1, 0.4, 5]} />
          <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Emissive indicator strips */}
      <mesh position={[1.2, 0, 2.5]}>
        <planeGeometry args={[0.1, 0.8]} />
        <meshBasicMaterial color="#06B6D4" />
      </mesh>
      <mesh position={[1.2, 0, 2.0]}>
        <planeGeometry args={[0.1, 0.8]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>

      {/* Droplets */}
      <instancedMesh ref={dropRef} args={[undefined as any, undefined as any, 4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial color="#06b6d4" transparent opacity={0.6} roughness={0} />
      </instancedMesh>
      
      {/* Glow disc at impact point */}
      <mesh position={[0, -4, 2.8]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial ref={discMatRef} color="#06b6d4" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}`;

const heroReplace = `function HeroCenterpiece({ quality }: { quality: 'high' | 'low' }) {
  const groupRef = useRef<THREE.Group>(null);
  const dropRef = useRef<THREE.InstancedMesh>(null);
  const discMatRef = useRef<THREE.MeshBasicMaterial>(null);
  
  const drops = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      y: -1 - i * 1.0,
      x: 0,
      z: 0,
      active: true
    }));
  }, []);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Emissive color
  const emissiveColor = useMemo(() => new THREE.Color('#06B6D4').multiplyScalar(3), []);

  useFrame((sys, delta) => {
    if (!groupRef.current) return;
    
    const time = sys.clock.getElapsedTime();
    
    // Only visible in early chapters to save performance
    const isVisible = chapterState.chapter <= 1;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;
    
    groupRef.current.position.y = 6.2 + Math.sin(time * 0.5) * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
    groupRef.current.rotation.y = 0.35 + Math.cos(time * 0.2) * 0.05;
    
    if (dropRef.current) {
      let impactCount = 0;
      drops.forEach((d, i) => {
        d.y -= delta * 3;
        // World y=4 is fluid surface. Group is at 6.2. Diff is -2.2
        if (d.y < -2.2) { 
           d.y = -0.2; // restart at underside of chassis
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
      {/* Blade chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 0.4, 6]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} clearcoat={1} clearcoatRoughness={0.15} envMapIntensity={1.5} />
      </mesh>
      
      {/* Fin rows */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[-1.2 + i * 0.26, 0.475, 0]}>
          <boxGeometry args={[0.08, 0.55, 5.8]} />
          <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Emissive indicator strips */}
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

      {/* Droplets */}
      <instancedMesh ref={dropRef} args={[undefined as any, undefined as any, 4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial color="#06b6d4" transparent opacity={0.6} roughness={0} />
      </instancedMesh>
      
      {/* Glow disc at impact point */}
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial ref={discMatRef} color="#06b6d4" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}`;

content = content.replace(heroTarget, heroReplace);
content = content.replace("<HeroCenterpiece />", "<HeroCenterpiece quality={quality} />");

fs.writeFileSync('src/canvas/Scene.tsx', content);
