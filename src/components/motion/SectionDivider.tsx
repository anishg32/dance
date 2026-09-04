"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./SectionDivider.module.css";

interface SectionDividerProps {
  variant?: "gold" | "maroon" | "subtle";
  className?: string;
}

export default function SectionDivider({
  variant = "gold",
  className,
}: SectionDividerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      <motion.div
        className={`${styles.line} ${styles[variant]}`}
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      />
      <motion.div
        className={styles.diamond}
        initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.8 }}
      />
      <motion.div
        className={`${styles.line} ${styles[variant]}`}
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      />
    </div>
  );
}
