"use client";

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './PremiumImage.module.css';

interface PremiumImageProps extends Omit<ImageProps, 'onLoad'> {
  containerClassName?: string;
  overlay?: 'dark' | 'maroon' | 'gold' | 'none';
  animateOnScroll?: boolean;
}

export default function PremiumImage({
  containerClassName = '',
  overlay = 'none',
  animateOnScroll = true,
  alt,
  className = '',
  ...props
}: PremiumImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const getOverlayClass = () => {
    switch (overlay) {
      case 'dark': return styles.overlayDark;
      case 'maroon': return styles.overlayMaroon;
      case 'gold': return styles.overlayGold;
      default: return '';
    }
  };

  const imageContent = (
    <div className={`${styles.imageContainer} ${containerClassName}`}>
      <Image
        {...props}
        alt={alt || ''}
        className={`${styles.image} ${className} ${
          isLoaded ? styles.imageLoaded : styles.imageLoading
        }`}
        onLoad={() => setIsLoaded(true)}
      />
      
      {overlay !== 'none' && (
        <div 
          className={`${styles.overlay} ${getOverlayClass()} ${isLoaded ? styles.overlayVisible : styles.overlayHidden}`} 
          aria-hidden="true" 
        />
      )}
    </div>
  );

  if (shouldReduceMotion || !animateOnScroll) {
    return imageContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      style={{ width: '100%', height: '100%' }}
    >
      {imageContent}
    </motion.div>
  );
}
