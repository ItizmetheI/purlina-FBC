const fs = require('fs');
let content = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

const oldTarget = `        const targetOpacity = THREE.MathUtils.lerp(mesh.userData.baseOpacity, 0, Math.pow(descentProgress, 2));`;
const newTarget = `        const factor = descentProgress < 0.9 ? 1 : Math.max(0, 1 - (descentProgress - 0.9) * 10);
        const targetOpacity = mesh.userData.baseOpacity * factor;`;
content = content.replace(oldTarget, newTarget);

fs.writeFileSync('src/canvas/Scene.tsx', content);
