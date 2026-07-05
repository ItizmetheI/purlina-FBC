const fs = require('fs');

let sceneContent = fs.readFileSync('src/canvas/Scene.tsx', 'utf8');
sceneContent = sceneContent.replace('<ExplodingBlade />', '<ExplodingBlade quality={quality} />');
fs.writeFileSync('src/canvas/Scene.tsx', sceneContent);

let explodingContent = fs.readFileSync('src/canvas/ExplodingBlade.tsx', 'utf8');
explodingContent = explodingContent.replace('export default function ExplodingBlade() {', 'export default function ExplodingBlade({ quality }: { quality: \'high\' | \'low\' }) {');
explodingContent = explodingContent.replace('<group position={[3, 0, 2]} ref={groupRef}>', '<group position={[3, 0, 2]} ref={groupRef} scale={quality === \'low\' ? 0.7 : 1}>');
fs.writeFileSync('src/canvas/ExplodingBlade.tsx', explodingContent);

