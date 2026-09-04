"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import ScrollReveal from "./motion/ScrollReveal";
import PremiumImage from "./ui/PremiumImage";
import styles from "./Rankings.module.css";

interface RankingProps {
  rankings: {
    rank: number;
    trend: string;
    name: string;
    image?: string;
    level: string;
    points: number;
    stats: { gold: number; silver: number; performances: number };
  }[];
}

export default function Rankings({ rankings }: RankingProps) {
  const shouldReduceMotion = useReducedMotion();

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp size={16} className={styles.trendUp} />;
      case "down":
        return <ArrowDown size={16} className={styles.trendDown} />;
      default:
        return <Minus size={16} className={styles.trendSame} />;
    }
  };

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <ScrollReveal direction="up">
          <div className={styles.header}>
            <h2 className="heading-secondary">The Rising Stars</h2>
            <p className={styles.subtitle}>
              Recognizing dedication, discipline and artistic excellence.
            </p>
          </div>
        </ScrollReveal>

        <div className={styles.rankingList}>
          {rankings.map((student, index) => (
            <motion.div
              key={student.rank}
              className={`${styles.rankingCard} ${index === 0 ? styles.rankOne : ""}`}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: -40, scale: 0.97 }
              }
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
            >
              <div className={styles.rankBadge}>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                <span className={styles.rankNumber}>#{student.rank}</span>
              </div>

              <div className={styles.studentInfo}>
                {student.image ? (
                  <div className={styles.avatarPlaceholder} style={{ overflow: 'hidden', padding: 0 }}>
                    <PremiumImage src={student.image} alt={student.name} fill />
                  </div>
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {student.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className={styles.studentName}>{student.name}</h3>
                  <p className={styles.studentLevel}>{student.level}</p>
                </div>
              </div>

              <div className={styles.pointsGroup}>
                <div className={styles.points}>
                  {student.points}{" "}
                  <span className={styles.pointsLabel}>Points</span>
                </div>
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
                  <span className={styles.statValue}>
                    {student.stats.silver}
                  </span>
                  <span className={styles.statLabel}>Silver</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    {student.stats.performances}
                  </span>
                  <span className={styles.statLabel}>Stage</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.5}>
          <div className={styles.actionContainer}>
            <a href="/rankings" className="btn btn-outline">
              View Complete Rankings &rarr;
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
