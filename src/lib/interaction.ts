// Motion Bible for Purlina Story World
export const MotionBible = {
  duration: {
    base: 0.8,
    slow: 1.5,
    fast: 0.4,
    cinematic: 2.0
  },
  easing: {
    // Custom easing curves for premium feel
    cinematic: [0.16, 1, 0.3, 1] as const,
    elastic: [0.34, 1.56, 0.64, 1] as const,
    smooth: [0.25, 1, 0.5, 1] as const,
  }
};
