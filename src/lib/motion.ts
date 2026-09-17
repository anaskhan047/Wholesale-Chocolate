export const MOTION = {
  fadeUp: "animate-fade-up",
  overlay: "animate-overlay-in",
  sheet: "animate-sheet-in",
  pop: "animate-pop-in",
} as const;

export function motionClass(name: keyof typeof MOTION) {
  return MOTION[name];
}

export function staggerDelay(index: number, stepMs = 55) {
  return { animationDelay: `${index * stepMs}ms` };
}

export function joinClass(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const springSoft = {
  type: "spring" as const,
  stiffness: 280,
  damping: 22,
  mass: 0.8,
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

export const fadeUpItem = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSoft,
  },
};
