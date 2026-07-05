const fs = require('fs');

let sceneContent = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

// Use regex for robust replacement
sceneContent = sceneContent.replace(/function AbstractFluid\(\{ quality \}: \{ quality: 'high' \| 'low' \}\) \{[\s\S]*?useFrame\(\(sys, delta\) => \{[\s\S]*?if \(\!meshRef\.current\) return;/m, 
`function AbstractFluid({ quality }: { quality: 'high' | 'low' }) {
  const count = quality === 'high' ? 120 : 60;
  const sparkCount = quality === 'high' ? 12 : 6;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const sparkRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: getSpawnX(),
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() * 13) - 18,
      speed: Math.random() * 0.01 + 0.005,
      factor: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.3 + 0.05
    }));
  }, [count]);

  const sparks = useMemo(() => {
    return Array.from({ length: sparkCount }).map((_, i) => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() * 13) - 18,
      speed: Math.random() * 0.02 + 0.01,
      factor: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.05 + 0.02,
      isHot: i < sparkCount * 0.3
    }));
  }, [sparkCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorHot = useMemo(() => new THREE.Color('#ef4444').multiplyScalar(2), []);
  const colorCyan = useMemo(() => new THREE.Color('#06b6d4').multiplyScalar(2), []);

  useLayoutEffect(() => {
    if (!sparkRef.current) return;
    sparks.forEach((s, i) => {
      sparkRef.current.setColorAt(i, s.isHot ? colorHot : colorCyan);
    });
    sparkRef.current.instanceColor.needsUpdate = true;
  }, [sparks, colorHot, colorCyan]);

  useFrame((sys, delta) => {
    if (document.hidden) return;
    if (!meshRef.current) return;`
);

// End loop replacement
sceneContent = sceneContent.replace(/      meshRef\.current!\.setMatrixAt\(i, dummy\.matrix\);\n    \}\);\n    meshRef\.current\.instanceMatrix\.needsUpdate = true;\n  \}\);\n\n  return \(\n    <instancedMesh ref=\{meshRef\} args=\{\[undefined as any, undefined as any, count\]\}>\n      <sphereGeometry args=\{\[1, 16, 16\]\} \/>\n      <meshPhysicalMaterial \n        color="#06B6D4" \n        emissive="#0284c7"\n        emissiveIntensity=\{2\.5\}\n        transparent \n        opacity=\{0\.55\} \n        roughness=\{0\.05\}\n        metalness=\{0\}\n        envMapIntensity=\{1\.2\}\n      \/>\n    <\/instancedMesh>\n  \);\n\}/m,
`      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    if (sparkRef.current) {
      const sparkMat = sparkRef.current.material as THREE.MeshBasicMaterial;
      sparkMat.opacity = THREE.MathUtils.lerp(sparkMat.opacity, chapterState.chapter === 9 ? 0.0 : mat.opacity * 2.0, delta * 2);

      sparks.forEach((p, i) => {
        let ySpeedMod = 1;
        let xOffset = 0;
        let zOffset = 0;
        switch (mood.dynamics) {
          case 'ambient':
            xOffset = Math.sin(time * 0.5 + p.factor) * 0.5;
            zOffset = Math.cos(time * 0.3 + p.factor) * 0.5;
            break;
          case 'turbulent':
            xOffset = Math.sin(time * 2.0 + p.factor) * 2;
            zOffset = Math.cos(time * 1.8 + p.factor) * 2;
            ySpeedMod = 3.0;
            break;
          case 'frozen':
            ySpeedMod = 0.1;
            break;
          case 'flow':
            xOffset = Math.sin(time * 0.8 + p.factor) * 1;
            ySpeedMod = 1.5;
            break;
        }

        p.y += p.speed * ySpeedMod;
        if (p.y > 20) { p.y = -20; p.x = (Math.random() - 0.5) * 20; }
        
        dummy.position.set(p.x + xOffset, p.y, p.z + zOffset);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        sparkRef.current!.setMatrixAt(i, dummy.matrix);
      });
      sparkRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial 
          color="#06B6D4" 
          emissive="#0284c7"
          emissiveIntensity={0.55}
          transparent 
          opacity={0.55} 
          roughness={0.05}
          metalness={0}
          envMapIntensity={1.2}
        />
      </instancedMesh>
      <instancedMesh ref={sparkRef} args={[undefined as any, undefined as any, sparkCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.8} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}`
);

// Add useLayoutEffect to imports if missing
if (!sceneContent.includes('useLayoutEffect')) {
  sceneContent = sceneContent.replace('import { useRef, useMemo } from', 'import { useRef, useMemo, useLayoutEffect } from');
}

// Update Bloom values
sceneContent = sceneContent.replace(/<Bloom mipmapBlur luminanceThreshold=\{0\.85\} intensity=\{0\.5\} \/>/g, '<Bloom mipmapBlur luminanceThreshold={0.9} intensity={0.45} />');

fs.writeFileSync('src/canvas/Scene.tsx', sceneContent);
