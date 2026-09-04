"use client";

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage: ReactNode; // A PremiumImage component
  speed?: number; // Parallax speed factor (0 to 1, default 0.5)
  className?: string;
  overlayClass?: string;
}

export default function ParallaxSection({
  children,
  backgroundImage,
  speed = 0.3,
  className = '',
  overlayClass = ''
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // If scrollYProgress goes from 0 to 1, y goes from -20% to 20%
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div 
        style={{
          position: 'absolute',
          inset: '-20%', // Make it taller to allow parallax scrolling without clipping
          zIndex: 0,
        }}
      >
        {!shouldReduceMotion ? (
          <motion.div style={{ y, width: '100%', height: '100%' }}>
            {backgroundImage}
          </motion.div>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            {backgroundImage}
          </div>
        )}
      </div>

      {overlayClass && (
        <div className={overlayClass} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
