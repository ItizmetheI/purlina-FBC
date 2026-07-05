const fs = require('fs');
let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

const targetLayout = `  useLayoutEffect(() => {
    if (!sparkRef.current) return;
    sparks.forEach((s, i) => {
      sparkRef.current.setColorAt(i, s.isHot ? colorHot : colorCyan);
    });
    sparkRef.current.instanceColor.needsUpdate = true;
  }, [sparks, colorHot, colorCyan]);`;

content = content.replace(targetLayout, '');

const targetUseFrame = `      sparks.forEach((p, i) => {
        let ySpeedMod = 1;`;

const replacementUseFrame = `      const isProblemChapter = chapterState.chapter === 3;
      sparks.forEach((p, i) => {
        if (p.isHot) {
           const targetColor = isProblemChapter ? colorHot : colorCyan;
           _color.copy(targetColor);
           sparkRef.current!.setColorAt(i, _color);
        } else {
           sparkRef.current!.setColorAt(i, colorCyan);
        }
      
        let ySpeedMod = 1;`;

content = content.replace(targetUseFrame, replacementUseFrame);
// We need to declare _color globally or inside the component
content = content.replace('const dummy = useMemo(() => new THREE.Object3D(), []);', 'const dummy = useMemo(() => new THREE.Object3D(), []);\n  const _color = useMemo(() => new THREE.Color(), []);');

// And we need to add sparkRef.current.instanceColor.needsUpdate = true;
// But it's already there! (Or we can just add it before instanceMatrix.needsUpdate)

const endOfSparks = `      sparkRef.current.instanceMatrix.needsUpdate = true;
    }
  });`;

const replacedEndOfSparks = `      sparkRef.current.instanceMatrix.needsUpdate = true;
      sparkRef.current.instanceColor!.needsUpdate = true;
    }
  });`;

content = content.replace(endOfSparks, replacedEndOfSparks);

fs.writeFileSync('src/canvas/Scene.tsx', content);

