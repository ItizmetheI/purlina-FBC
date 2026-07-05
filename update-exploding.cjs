const fs = require('fs');
let content = fs.readFileSync('src/canvas/ExplodingBlade.tsx', 'utf8');

const applyPosTarget = `    // Apply positions
    if (powerRef.current && vrmRef.current && cpuRef.current && gpuRef.current) {
      powerRef.current.position.y = -1.5 * exp;
      vrmRef.current.position.y = -0.5 * exp;
      cpuRef.current.position.y = 0.5 * exp;
      gpuRef.current.position.y = 1.5 * exp;
    }`;

const applyPosReplace = `    // Apply positions
    if (powerRef.current && vrmRef.current && cpuRef.current && gpuRef.current) {
      powerRef.current.position.y = -2.75 * exp;
      vrmRef.current.position.y = -0.916 * exp;
      cpuRef.current.position.y = 0.916 * exp;
      gpuRef.current.position.y = 2.75 * exp;
    }`;
content = content.replace(applyPosTarget, applyPosReplace);

const groupTarget = `  return (
    <group position={[4, 0, 0]} ref={groupRef}>
      <mesh ref={gpuRef} castShadow receiveShadow>
        <boxGeometry args={[4, 0.2, 4]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        <Label text="GPU Unit" index={3} />
      </mesh>
      
      <mesh ref={cpuRef} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.2, 3.8]} />
        <meshPhysicalMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        <Label text="CPU Node" index={2} />
      </mesh>
      
      <mesh ref={vrmRef} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.2, 3.6]} />
        <meshPhysicalMaterial color="#334155" metalness={0.7} roughness={0.4} />
        <Label text="VRM Array" index={1} />
      </mesh>
      
      <mesh ref={powerRef} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.2, 3.4]} />
        <meshPhysicalMaterial color="#475569" metalness={0.6} roughness={0.5} />
        <Label text="Power Components" index={0} />
      </mesh>
    </group>
  );`;

const groupReplace = `  const EdgeStrip = ({ width, depth, color }: { width: number, depth: number, color: string }) => {
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
    <group position={[3, 0, 2]} ref={groupRef}>
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
  );`;

// Need to import React
content = content.replace(`import { useRef } from 'react';`, `import React, { useRef } from 'react';`);
content = content.replace(groupTarget, groupReplace);

// Fix refs
const refsTarget = `  const powerRef = useRef<THREE.Mesh>(null);
  const vrmRef = useRef<THREE.Mesh>(null);
  const cpuRef = useRef<THREE.Mesh>(null);
  const gpuRef = useRef<THREE.Mesh>(null);`;
const refsReplace = `  const powerRef = useRef<THREE.Group>(null);
  const vrmRef = useRef<THREE.Group>(null);
  const cpuRef = useRef<THREE.Group>(null);
  const gpuRef = useRef<THREE.Group>(null);`;
content = content.replace(refsTarget, refsReplace);

fs.writeFileSync('src/canvas/ExplodingBlade.tsx', content);
