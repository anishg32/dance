"use client";

import { motion, useReducedMotion } from "framer-motion";
import { academyConfig } from "@/config/academy";
import TiltCard from "./motion/TiltCard";
import ScrollReveal from "./motion/ScrollReveal";
import PremiumImage from "./ui/PremiumImage";
import styles from "./Introduction.module.css";

export default function Introduction() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.content}>
          {/* Animated gold accent line */}
          <motion.div
            className={styles.accentLine}
            initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          />

          <ScrollReveal direction="up" delay={0.1}>
            <h2 className={styles.title}>
              A Legacy of Grace, Discipline &amp; Expression
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25}>
            <p className={styles.text}>
              At {academyConfig.name}, we preserve the authentic{" "}
              {academyConfig.style}. For over 15 years, our academy has been a
              sanctuary for those seeking to immerse themselves in the divine art
              of classical dance.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <p className={styles.text}>
              Our teaching philosophy goes beyond technical perfection. We strive
              to instill discipline, cultural understanding, and emotional
              intelligence in every student, guiding them from their first steps
              to the professional stage.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.55}>
            <div className={styles.signature}>
              <span className={styles.guruName}>{academyConfig.guru.name}</span>
              <span className={styles.guruTitle}>
                {academyConfig.guru.title}
              </span>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="right" delay={0.2}>
          <div className={styles.imageContainer}>
            <TiltCard className={styles.imageWrapper} maxRotation={3}>
              <PremiumImage 
                src="/images/hero/texture.jpg" 
                alt="Guru Portrait Placeholder"
                fill
                overlay="maroon"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
                <span style={{ color: 'rgba(253, 251, 247, 0.5)', fontFamily: 'var(--font-heading)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>Awaiting Guru Portrait</span>
              </div>
            </TiltCard>
            <div className={styles.decorativeBorder} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
