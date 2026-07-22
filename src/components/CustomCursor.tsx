import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'hidden' | 'drag' | 'scan' | 'primary' | 'external'>('default');
  const [isSupported, setIsSupported] = useState(true);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Springs for smooth movement
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if we should disable the custom cursor
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isCoarse || isReducedMotion) {
      setIsSupported(false);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the 32px cursor
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (target.closest('[data-cursor="primary"]')) {
        setCursorState('primary');
      } else if (target.closest('[data-cursor="hover"]')) {
        setCursorState('hover');
      } else if (target.closest('[data-cursor="hidden"]')) {
        setCursorState('hidden');
      } else if (target.closest('[data-cursor="scan"]')) {
        setCursorState('scan');
      } else if (target.closest('[data-cursor="drag"]')) {
        setCursorState('drag');
      } else if (link && link.target === '_blank') {
        setCursorState('external');
      } else if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  const variants = {
    default: {
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      mixBlendMode: 'normal' as const,
    },
    hover: {
      scale: 2,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '1px solid transparent',
      mixBlendMode: 'difference' as const,
    },
    hidden: {
      scale: 0,
      opacity: 0,
    },
    scan: {
      scale: 2,
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      border: '1px solid rgba(6, 182, 212, 0.8)',
    },
    drag: {
      scale: 1.5,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '2px dashed rgba(255, 255, 255, 0.8)',
    },
    primary: {
      scale: 2.4,
      backgroundColor: 'rgba(246, 162, 59, 1)',
      border: '1px solid transparent',
      mixBlendMode: 'normal' as const,
    },
    external: {
      scale: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      mixBlendMode: 'normal' as const,
    },
  };

  if (!isSupported) return null;

  return (
    <>
      <style>{`
        body {
          cursor: none;
        }
        a, button, [data-cursor="hover"], [data-cursor="drag"], [data-cursor="scan"] {
          cursor: none;
        }
      `}</style>
      
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        variants={variants}
        animate={cursorState}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {cursorState === 'scan' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-brand-cyan text-[8px] font-mono font-bold tracking-widest"
          >
            SCAN
          </motion.div>
        )}
        {cursorState === 'drag' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white text-[8px] font-mono font-bold tracking-widest"
          >
            DRAG
          </motion.div>
        )}
        {cursorState === 'external' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white text-xs font-bold"
          >
            ↗
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
