import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function PuritySlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const rect = useRef<DOMRect | null>(null);

  // measure once per drag, not on every pointermove — a rect read forces
  // a synchronous layout reflow, and pointermove fires continuously
  const handleMove = (clientX: number) => {
    if (!rect.current) return;
    const x = Math.max(0, Math.min(clientX - rect.current.left, rect.current.width));
    const percentage = (x / rect.current.width) * 100;
    setSliderPosition(percentage);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    rect.current = containerRef.current.getBoundingClientRect();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((p) => Math.max(0, p - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((p) => Math.min(100, p + 5));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      <div 
        ref={containerRef}
        className="relative w-48 h-80 cursor-ew-resize select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Purity comparison slider"
        role="slider"
        aria-valuenow={sliderPosition}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Base Layer: Synthetic Base Oil (Amber) */}
        <div className="absolute inset-0 z-0 flex justify-center pointer-events-none">
          <div className="relative w-32 h-64 mt-16">
            <svg viewBox="0 0 100 200" className="w-full h-full absolute inset-0">
              <path d="M30 10 L30 30 C30 40 10 50 10 70 L10 180 C10 190 20 200 50 200 C80 200 90 190 90 180 L90 70 C90 50 70 40 70 30 L70 10 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <rect x="25" y="0" width="50" height="15" rx="2" fill="#334155" />
            </svg>
            <div className="absolute bottom-2 left-[12%] right-[12%] h-[65%] bg-gradient-to-b from-[#b45309] to-[#78350f] rounded-b-2xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
          </div>
        </div>

        {/* Top Layer: PURLINA (Crystal) */}
        <div 
          className="absolute inset-0 z-10 flex justify-center overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative w-32 h-64 mt-16 shrink-0" style={{ width: '8rem' /* 32 * 0.25rem = 8rem */ }}>
            <svg viewBox="0 0 100 200" className="w-full h-full absolute inset-0">
              <path d="M30 10 L30 30 C30 40 10 50 10 70 L10 180 C10 190 20 200 50 200 C80 200 90 190 90 180 L90 70 C90 50 70 40 70 30 L70 10 Z" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="4" />
              <rect x="25" y="0" width="50" height="15" rx="2" fill="#1e3a8a" />
            </svg>
            <div className="absolute bottom-2 left-[12%] right-[12%] h-[65%] bg-gradient-to-b from-blue-400/20 to-blue-300/30 rounded-b-2xl border-t border-white/40 backdrop-blur-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
          </div>
        </div>

        {/* Divider Handle */}
        <div 
          className="absolute top-0 bottom-0 z-20 flex flex-col items-center justify-center -ml-px w-2 cursor-ew-resize bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-6 h-12 bg-white rounded-full flex items-center justify-center shadow-lg -ml-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between w-full mt-6 text-sm">
        <div className="text-left" style={{ opacity: Math.max(0, (100 - sliderPosition - 20) / 30) }}>
          <p className="text-blue-400 font-bold">PURLINA</p>
        </div>
        <div className="text-right" style={{ opacity: Math.max(0, (sliderPosition - 20) / 30) }}>
          <p className="text-amber-500 font-bold">Base Oil</p>
        </div>
      </div>
    </div>
  );
}
