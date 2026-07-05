const fs = require('fs');

// Fix ExplodingBlade
let explodingContent = fs.readFileSync('src/canvas/ExplodingBlade.tsx', 'utf8');
explodingContent = explodingContent.replace(`ref={el => labelRefs.current[index] = el}`, `ref={el => { labelRefs.current[index] = el; }}`);
fs.writeFileSync('src/canvas/ExplodingBlade.tsx', explodingContent);

// Fix Scene
let sceneContent = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');
sceneContent = sceneContent.replace(/disableNormalPass/g, 'enableNormalPass={false}');
fs.writeFileSync('src/canvas/Scene.tsx', sceneContent);

