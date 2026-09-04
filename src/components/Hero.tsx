"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { academyConfig } from "@/config/academy";
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll-driven parallax transforms
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 0.9]);

  // Staggered entrance animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Nataraja Background Image Layer */}
      <motion.div
        className={styles.bgLayer}
        style={shouldReduceMotion ? {} : { scale: bgScale }}
      >
        <Image
          src="/images/hero/nataraja.jpg"
          alt="Nataraja Cosmic Dancer"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
      </motion.div>

      {/* Dark maroon overlay with scroll-responsive opacity */}
      <motion.div
        className={styles.overlay}
        style={shouldReduceMotion ? {} : { opacity: overlayOpacity }}
      />

      {/* Floating gold particles */}
      <div className={styles.particles} />

      {/* Decorative corner accents */}
      <div className={`${styles.cornerAccent} ${styles.topLeft}`} />
      <div className={`${styles.cornerAccent} ${styles.bottomRight}`} />

      {/* Main content with scroll parallax */}
      <motion.div
        className={styles.content}
        style={shouldReduceMotion ? {} : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Decorative pre-heading */}
          <motion.div className={styles.preHeading} variants={itemVariants}>
            <span className={styles.preHeadingLine} />
            <span>Bharatanatyam Academy</span>
            <span className={styles.preHeadingLine} />
          </motion.div>

          <motion.h1
            className={styles.headline}
            variants={itemVariants}
          >
            {academyConfig.name}
          </motion.h1>

          <motion.p className={styles.subtext} variants={itemVariants}>
            {academyConfig.tagline}. {academyConfig.description}
          </motion.p>

          <motion.div className={styles.ctaGroup} variants={itemVariants}>
            <Link href="/admissions" className="btn btn-primary">
              Apply for Admission
            </Link>
            <Link
              href="/about"
              className={`btn btn-outline ${styles.heroOutlineBtn}`}
            >
              Explore the Academy
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <span>SCROLL TO DISCOVER</span>
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
      </motion.div>
    </section>
  );
}
