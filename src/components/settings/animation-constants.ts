// Animation constants for settings components
import { Variants } from "framer-motion";

// Common timing constants
export const TRANSITION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
};

// Staggered children animation
export const staggeredContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: TRANSITION_DURATION.normal,
      ease: "easeOut",
    },
  },
};

// Slide up animation
export const slideUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TRANSITION_DURATION.normal,
      ease: "easeOut",
    },
  },
};

// Scale animation
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: TRANSITION_DURATION.normal,
      ease: [0.34, 1.56, 0.64, 1], // Spring-like effect
    },
  },
};

// Card hover effect
export const cardHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: { duration: TRANSITION_DURATION.fast },
  },
};

// Switch toggle animation
export const switchVariants: Variants = {
  checked: { scale: 1.05 },
  unchecked: { scale: 1 },
};

// Loading spinner animation
export const spinAnimation: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear",
    },
  },
};

// Progress bar animation
export const progressAnimation = (value: number): Variants => ({
  initial: { width: "0%" },
  animate: {
    width: `${value}%`,
    transition: { duration: 0.7, ease: "easeOut" },
  },
});

// Toast notification animation
export const toastAnimation: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: TRANSITION_DURATION.normal,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: TRANSITION_DURATION.fast,
    },
  },
};

// Form field animations
export const formFieldAnimation: Variants = {
  focus: { scale: 1.02, borderColor: "var(--focus-color)" },
  blur: { scale: 1, borderColor: "var(--border-color)" },
  error: {
    scale: [1, 1.02, 1],
    x: [0, -5, 5, -5, 5, 0],
    borderColor: "var(--error-color)",
    transition: { duration: 0.4 },
  },
};
