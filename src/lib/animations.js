import { useRef } from "react";
import { useInView } from "framer-motion";

/**
 * Reusable Framer Motion variants for consistent animations
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const slideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const cardHover = {
  y: -4,
  transition: { duration: 0.2 },
};

/**
 * Transition presets
 */
export const transitions = {
  smooth: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 0.5, ease: "easeOut" },
  spring: { type: "spring", stiffness: 300, damping: 20 },
};

/**
 * Hook for scroll-triggered animations
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {{ ref: React.RefObject, isInView: boolean }}
 */
export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold, triggerOnce: true });
  return { ref, isInView };
};
