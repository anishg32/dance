"use client";

import { motion } from 'framer-motion';
import { academyConfig } from '@/config/academy';
import styles from './Introduction.module.css';

export default function Introduction() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className={`container ${styles.grid}`}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>A Legacy of Grace, Discipline & Expression</h2>
          <p className={styles.text}>
            At {academyConfig.name}, we preserve the authentic {academyConfig.style}. 
            For over 15 years, our academy has been a sanctuary for those seeking to immerse 
            themselves in the divine art of classical dance.
          </p>
          <p className={styles.text}>
            Our teaching philosophy goes beyond technical perfection. We strive to instill 
            discipline, cultural understanding, and emotional intelligence in every student, 
            guiding them from their first steps to the professional stage.
          </p>
          <div className={styles.signature}>
            <span className={styles.guruName}>{academyConfig.guru.name}</span>
            <span className={styles.guruTitle}>{academyConfig.guru.title}</span>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.imageContainer}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.imageWrapper}>
            <div className={styles.imagePlaceholder}>
              {/* Replace with actual image later */}
              <span>Guru Portrait</span>
            </div>
            <div className={styles.decorativeBorder}></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
