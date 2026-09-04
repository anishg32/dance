"use client";

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import styles from './Rankings.module.css';

interface RankingProps {
  rankings: {
    rank: number;
    trend: string;
    name: string;
    level: string;
    points: number;
    stats: { gold: number; silver: number; performances: number };
  }[];
}

export default function Rankings({ rankings }: RankingProps) {
  const renderTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <ArrowUp size={16} className={styles.trendUp} />;
      case 'down': return <ArrowDown size={16} className={styles.trendDown} />;
      default: return <Minus size={16} className={styles.trendSame} />;
    }
  };

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="container">
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-secondary">The Rising Stars</h2>
          <p className={styles.subtitle}>Recognizing dedication, discipline and artistic excellence.</p>
        </motion.div>

        <div className={styles.rankingList}>
          {rankings.map((student, index) => (
            <motion.div 
              key={student.rank}
              className={`${styles.rankingCard} ${index === 0 ? styles.rankOne : ''}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className={styles.rankBadge}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                <span className={styles.rankNumber}>#{student.rank}</span>
              </div>
              
              <div className={styles.studentInfo}>
                <div className={styles.avatarPlaceholder}>
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className={styles.studentName}>{student.name}</h3>
                  <p className={styles.studentLevel}>{student.level}</p>
                </div>
              </div>
              
              <div className={styles.pointsGroup}>
                <div className={styles.points}>{student.points} <span className={styles.pointsLabel}>Points</span></div>
                <div className={styles.trendWrapper}>
                  {renderTrendIcon(student.trend)}
                </div>
              </div>
              
              <div className={styles.statsGroup}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{student.stats.gold}</span>
                  <span className={styles.statLabel}>Gold</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{student.stats.silver}</span>
                  <span className={styles.statLabel}>Silver</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{student.stats.performances}</span>
                  <span className={styles.statLabel}>Stage</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className={styles.actionContainer}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a href="/rankings" className="btn btn-outline">
            View Complete Rankings &rarr;
          </a>
        </motion.div>
      </div>
    </section>
  );
}
