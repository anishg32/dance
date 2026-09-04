"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ReactNode, useRef, useCallback, useEffect, useState } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxRotation?: number; // degrees, default 4
  scale?: number; // hover scale, default 1.02
  style?: React.CSSProperties;
}

export default function TiltCard({
  children,
  className,
  maxRotation = 4,
  scale = 1.02,
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const motionScale = useMotionValue(1);

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });
  const springScale = useSpring(motionScale, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || shouldReduceMotion || isTouchDevice) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      rotateX.set(-percentY * maxRotation);
      rotateY.set(percentX * maxRotation);
    },
    [maxRotation, shouldReduceMotion, isTouchDevice, rotateX, rotateY]
  );

  const handleMouseEnter = useCallback(() => {
    if (!shouldReduceMotion && !isTouchDevice) {
      motionScale.set(scale);
    }
  }, [shouldReduceMotion, isTouchDevice, scale, motionScale]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    motionScale.set(1);
  }, [rotateX, rotateY, motionScale]);

  if (shouldReduceMotion || isTouchDevice) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale: springScale,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
