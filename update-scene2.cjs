const fs = require('fs');
let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

const oldFluidTarget = `function FluidSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshPhysicalMaterial 
         color="#06b6d4" 
         transparent 
         opacity={0.05} 
         roughness={0.1}
         metalness={0.1}
         depthWrite={false}
      />
    </mesh>
  );
}`;

const newFluidTarget = `function FluidSurface({ quality }: { quality: 'high' | 'low' }) {
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
    uniforms.uTime.value = sys.clock.getElapsedTime();
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = uniforms.uTime;
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      \`#include <common>
       uniform float uTime;\`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      \`#include <begin_vertex>
       float wave1 = sin(position.x * 0.5 + uTime * 0.4) * 0.08;
       float wave2 = sin(position.y * 0.3 + uTime * 0.3) * 0.05;
       float wave3 = sin((position.x + position.y) * 0.2 + uTime * 0.5) * 0.03;
       transformed.z += wave1 + wave2 + wave3;\`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      \`#include <common>
       varying vec3 vViewPositionCustom;
       varying vec3 vNormalCustom;\`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <fog_vertex>',
      \`#include <fog_vertex>
       vViewPositionCustom = -mvPosition.xyz;
       vNormalCustom = normalize(normalMatrix * normal);\`
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      \`#include <dithering_fragment>
       float fresnelTerm = dot(normalize(vViewPositionCustom), normalize(vNormalCustom));
       fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
       fresnelTerm = pow(fresnelTerm, 3.0);
       gl_FragColor.rgb += fresnelTerm * vec3(0.02, 0.44, 0.52) * 1.5;\`
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
}`;

content = content.replace(oldFluidTarget, newFluidTarget);
content = content.replace("<FluidSurface />", "<FluidSurface quality={quality} />");

const lightShaftsTarget = `function LightShafts() {
  return (
    <group position={[0, 5, 2]} rotation={[0, 0, Math.PI / 8]}>
      <mesh position={[2, -5, 0]}>
        <planeGeometry args={[10, 30]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-3, -5, -4]} rotation={[0, Math.PI/6, 0]}>
        <planeGeometry args={[15, 30]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.02} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}`;
const lightShaftsReplace = `function LightShafts() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((sys, delta) => {
    let descentProgress = 0;
    if (chapterState.chapter <= 2) {
      descentProgress = (chapterState.chapter + chapterState.chapterProgress) / 3;
    } else {
      descentProgress = 1;
    }
    
    if (groupRef.current) {
      groupRef.current.children.forEach(mesh => {
        const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
        const targetOpacity = THREE.MathUtils.lerp(mesh.userData.baseOpacity, 0, Math.pow(descentProgress, 2));
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
}`;
content = content.replace(lightShaftsTarget, lightShaftsReplace);

// CameraRig targetX fix
const cameraRigX = `    _cameraTarget.set(mouseX * 2, targetY + mouseY * 2 + idleY, targetZ);`;
const cameraRigXReplace = `    let targetX = mouseX * 2;
    if (chapterState.chapter >= 3 && chapterState.chapter <= 6) {
      targetX = THREE.MathUtils.lerp(targetX, 1.5, 0.5); // Lerp towards exploded blade
    }
    _cameraTarget.set(targetX, targetY + mouseY * 2 + idleY, targetZ);`;
content = content.replace(cameraRigX, cameraRigXReplace);

fs.writeFileSync('src/canvas/Scene.tsx', content);
