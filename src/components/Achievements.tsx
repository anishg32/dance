"use client";

import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Calendar } from 'lucide-react';
import styles from './Achievements.module.css';

export default function Achievements() {
  const stats = [
    { value: "128+", label: "Students" },
    { value: "76+", label: "Awards" },
    { value: "42+", label: "Performances" },
    { value: "15+", label: "Years of Tradition" }
  ];

  const featuredAward = {
    title: "BEST CLASSICAL DANCE PERFORMANCE",
    year: "2026",
    student: "Ananya R",
    level: "State Level Competition"
  };

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-secondary">Celebrating Excellence</h2>
        </motion.div>

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className={styles.statCard}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className={styles.featuredCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles.featuredIcon}>
            <Trophy size={48} strokeWidth={1} />
          </div>
          <div className={styles.featuredContent}>
            <div className={styles.featuredYear}>{featuredAward.year}</div>
            <h3 className={styles.featuredTitle}>{featuredAward.title}</h3>
            <p className={styles.featuredStudent}>{featuredAward.student}</p>
            <p className={styles.featuredLevel}>{featuredAward.level}</p>
          </div>
          
          <div className={styles.featuredAction}>
            <a href="/achievements" className="btn btn-primary">
              View All Achievements
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
