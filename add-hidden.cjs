const fs = require('fs');

let sceneContent = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');
sceneContent = sceneContent.replace(/useFrame\(\(sys, delta\) => \{/g, 'useFrame((sys, delta) => {\n    if (document.hidden) return;');
sceneContent = sceneContent.replace(/useFrame\(\(sys\) => \{/g, 'useFrame((sys) => {\n    if (document.hidden) return;');
sceneContent = sceneContent.replace(/useFrame\(\(state, delta\) => \{/g, 'useFrame((state, delta) => {\n    if (document.hidden) return;');
fs.writeFileSync('src/canvas/Scene.tsx', sceneContent);

let heroContent = fs.readFileSync('src/canvas/ExplodingBlade.tsx', 'utf8');
heroContent = heroContent.replace(/useFrame\(\(sys, delta\) => \{/g, 'useFrame((sys, delta) => {\n    if (document.hidden) return;');
fs.writeFileSync('src/canvas/ExplodingBlade.tsx', heroContent);

