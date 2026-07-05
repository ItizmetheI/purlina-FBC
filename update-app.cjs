const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetLayout = `            <div data-chapter="4">
              <Technology />
              <ThermalEnvironment />
            </div>
            <div data-chapter="5">
              <TechnicalSpecs />
              <ProductSeries />
            </div>
            <div data-chapter="6">
              <HandlingPrecautions />
            </div>
            <div data-chapter="7">
              <Efficiency />
              <Advantages />
              <Applications />
            </div>
            <div data-chapter="8">
              <Footer />
            </div>`;

const replaceLayout = `            <div data-chapter="4">
              <Technology />
            </div>
            <div data-chapter="5">
              <ThermalEnvironment />
            </div>
            <div data-chapter="6">
              <TechnicalSpecs />
              <ProductSeries />
            </div>
            <div data-chapter="7">
              <HandlingPrecautions />
            </div>
            <div data-chapter="8">
              <Efficiency />
              <Advantages />
              <Applications />
            </div>
            <div data-chapter="9">
              <Footer />
            </div>`;

content = content.replace(targetLayout, replaceLayout);

const grainOverlay = `        <AnimatePresence>
          {loading && <CinematicLoader />}
        </AnimatePresence>
        
        {/* Cinematic Grain Overlay */}
        <div 
          className="fixed inset-0 pointer-events-none z-[60] opacity-[0.04]"
          style={{
            backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
          }}
        />`;

content = content.replace(
  `<AnimatePresence>\n          {loading && <CinematicLoader />}\n        </AnimatePresence>`, 
  grainOverlay
);

fs.writeFileSync('src/App.tsx', content);
