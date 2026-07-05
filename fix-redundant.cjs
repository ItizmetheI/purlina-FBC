const fs = require('fs');

let sceneContent = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');
sceneContent = sceneContent.replace(/if \(document.hidden\) return;\n    if \(document.hidden\) return;/g, 'if (document.hidden) return;');
sceneContent = sceneContent.replace(/useFrame\(\(_, delta\) => \{/g, 'useFrame((_, delta) => {\n    if (document.hidden) return;');
fs.writeFileSync('src/canvas/Scene.tsx', sceneContent);
