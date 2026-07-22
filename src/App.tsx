import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './sections/Hero';
import EvolutionQuote from './sections/EvolutionQuote';
import TableOfContents from './sections/TableOfContents';
import Vision from './sections/Vision';
import ThermalManagement from './sections/ThermalManagement';
import DataCenterGrowth from './sections/DataCenterGrowth';
import Technology from './sections/Technology';
import ThermalEnvironment from './sections/ThermalEnvironment';
import TechnicalSpecs from './sections/TechnicalSpecs';
import ProductSeries from './sections/ProductSeries';
import HandlingPrecautions from './sections/HandlingPrecautions';
import Efficiency from './sections/Efficiency';
import Advantages from './sections/Advantages';
import Applications from './sections/Applications';
import Footer from './sections/Footer';
import Scene from './canvas/Scene';
import BackdropFilm from './canvas/BackdropFilm';
import ParticleOverlay from './canvas/ParticleOverlay';
import SmoothScroll from './components/SmoothScroll';
import Loader from './components/Loader';
import SystemHUD from './components/SystemHUD';
import ThesisMoment from './sections/ThesisMoment';
import { useDiveEngine } from './utils/dive';
import { LangProvider } from './lib/lang';
import Header from './components/Header';
import ActRail from './components/ActRail';
import Cine from './components/Cine';
import BreachFlash from './components/BreachFlash';

function EngineMount() {
  useDiveEngine();
  return null;
}

export default function App() {
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [appState, setAppState] = useState<'loading' | 'ready' | 'arrived'>('loading');
  // video world, WebGL as fallback if it fails to load
  const [film, setFilm] = useState(true);

  useEffect(() => {
    // the dive always starts at the surface
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setMinTimePassed(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minTimePassed && canvasReady && appState === 'loading') {
      setAppState('ready');
      setTimeout(() => setAppState('arrived'), 1200);
    }
  }, [minTimePassed, canvasReady, appState]);

  const loading = appState === 'loading';

  return (
    <LangProvider>
    <SmoothScroll>
      <Header />
      <ActRail />
      <SystemHUD />
      <BreachFlash />
      <EngineMount />
      <main className="relative min-h-screen bg-[#020617] bg-grid selection:bg-brand-cyan/30 font-sans">
        <AnimatePresence>
          {loading && <Loader />}
        </AnimatePresence>

        {/* Cockpit bezel — the whole experience sits inside an instrument frame */}
        <div className="fixed inset-2 md:inset-3 pointer-events-none z-[55] border border-white/10 rounded-2xl" />

        {/* Cinematic Grain Overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[60] opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
          }}
        />

        <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {film ? (
            <>
              <BackdropFilm onReady={() => setCanvasReady(true)} onMissing={() => setFilm(false)} />
              <ParticleOverlay />
            </>
          ) : (
            <Scene onCreated={() => setCanvasReady(true)} isLoaded={appState === 'arrived'} />
          )}
          <div className="relative z-10 flex flex-col pointer-events-none">
            <div data-act="0">
              <Hero />
            </div>
            <div data-act="1">
              <Cine><EvolutionQuote /></Cine>
              {/* travel beat — the scene alone as we cross the surface */}
              <div className="h-[40vh]" aria-hidden />
            </div>
            <div data-act="2" id="toc-vision">
              <Cine><TableOfContents /></Cine>
              <div className="h-[35vh]" aria-hidden />
              <Cine><Vision /></Cine>
              <div className="h-[30vh]" aria-hidden />
            </div>
            <div data-act="3" id="toc-thermal">
              <ThermalManagement />
              <ThesisMoment />
              <Cine><DataCenterGrowth /></Cine>
              {/* travel beat — drifting along the burning racks */}
              <div className="h-[40vh]" aria-hidden />
            </div>
            <div data-act="4" id="toc-technology">
              <Technology />
            </div>
            <div data-act="5" id="toc-core">
              {/* travel beat — approaching the blade */}
              <div className="h-[30vh]" aria-hidden />
              <ThermalEnvironment />
            </div>
            <div data-act="6" id="toc-series">
              <Cine><TechnicalSpecs /></Cine>
              <div className="h-[50vh]" aria-hidden />
              <Cine><ProductSeries /></Cine>
            </div>
            <div data-act="7">
              <Cine><HandlingPrecautions /></Cine>
            </div>
            <div data-act="8" id="toc-advantages">
              <div className="h-[30vh]" aria-hidden />
              <Cine><Efficiency /></Cine>
              <Cine><Advantages /></Cine>
              <div id="toc-applications">
                <Cine><Applications /></Cine>
              </div>
            </div>
            <div data-act="9">
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </SmoothScroll>
    </LangProvider>
  );
}
