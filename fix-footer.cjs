const fs = require('fs');

let sceneContent = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');

const oldTarget = `    const isHeroVisible = [0, 1, 3, 4, 5, 6].includes(chapterState.chapter);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, isHeroVisible ? 0.2 : 0.55, delta * 2);`;

const newTarget = `    const isHeroVisible = [0, 1, 3, 4, 5, 6].includes(chapterState.chapter);
    let targetOpacity = isHeroVisible ? 0.2 : 0.55;
    if (chapterState.chapter === 9) targetOpacity = 0.15;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 2);`;
    
sceneContent = sceneContent.replace(oldTarget, newTarget);
fs.writeFileSync('src/canvas/Scene.tsx', sceneContent);
