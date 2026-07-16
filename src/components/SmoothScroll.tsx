import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <ReactLenis root options={{ lerp: isReduced ? 1 : 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
