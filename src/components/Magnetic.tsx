import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.5 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // measure once on enter, not on every mousemove — a rect read forces a
  // synchronous layout reflow, and mousemove can fire 60-120+ times/sec
  const handleEnter = () => {
    rect.current = ref.current!.getBoundingClientRect();
  };

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rect.current) rect.current = ref.current!.getBoundingClientRect();
    const { clientX, clientY } = e;
    const { height, width, left, top } = rect.current;
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    rect.current = null;
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
