"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { academyConfig } from '@/config/academy';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.particles}></div>
      
      <div className={styles.content}>
        <motion.h1 
          className={styles.headline}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          dangerouslySetInnerHTML={{ __html: academyConfig.tagline.replace('Expression', '<span class="text-gold">Expression.</span>') }}
        />
        
        <motion.p 
          className={styles.subtext}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          {academyConfig.description}
        </motion.p>
        
        <motion.div 
          className={styles.ctaGroup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <Link href="/about" className="btn btn-primary">
            Explore the Academy
          </Link>
          <Link href="/join" className="btn btn-outline" style={{ borderColor: 'var(--color-ivory)', color: 'var(--color-ivory)' }}>
            Join the Academy
          </Link>
        </motion.div>
      </div>

      <motion.div 
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <span>SCROLL TO DISCOVER</span>
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
      </motion.div>
    </section>
  );
}
