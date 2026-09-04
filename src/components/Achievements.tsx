"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";
import AnimatedCounter from "./motion/AnimatedCounter";
import ScrollReveal from "./motion/ScrollReveal";
import PremiumImage from "./ui/PremiumImage";
import styles from "./Achievements.module.css";

export default function Achievements() {
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    { value: 128, suffix: "+", label: "Students" },
    { value: 76, suffix: "+", label: "Awards" },
    { value: 42, suffix: "+", label: "Performances" },
    { value: 15, suffix: "+", label: "Years of Tradition" },
  ];

  const featuredAward = {
    title: "BEST CLASSICAL DANCE PERFORMANCE",
    year: "2026",
    student: "Ananya R",
    level: "State Level Competition",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section className="section" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="container">
        <ScrollReveal direction="up">
          <h2 className="heading-secondary">Celebrating Excellence</h2>
        </ScrollReveal>

        <motion.div
          className={styles.statsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statCard}
              variants={itemVariants}
            >
              <div className={styles.statValue}>
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  duration={2000}
                />
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal direction="up" delay={0.3}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredImageBg}>
              <PremiumImage 
                src="/images/hero/texture.jpg" 
                alt="Award Background" 
                fill 
                overlay="maroon" 
              />
            </div>
            
            <div className={styles.shimmerOverlay} />
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
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
