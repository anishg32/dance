"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Star,
  Users,
  Trophy,
  GraduationCap,
  Heart,
} from "lucide-react";
import TiltCard from "./motion/TiltCard";
import ScrollReveal from "./motion/ScrollReveal";
import PremiumImage from "./ui/PremiumImage";
import styles from "./Features.module.css";

const features = [
  {
    icon: BookOpen,
    title: "Traditional Training",
    description: "Authentic Bharatanatyam training rooted in classical tradition.",
    image: "/images/training/dancer.jpg",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Personalized guidance from experienced teachers.",
    image: "/images/hero/texture.jpg",
  },
  {
    icon: Star,
    title: "Stage Experience",
    description: "Regular opportunities to perform on professional stages.",
    image: "/images/training/dancer.jpg",
  },
  {
    icon: Trophy,
    title: "Competition Excellence",
    description: "Preparation for district, state, national and international competitions.",
    image: "/images/hero/texture.jpg",
  },
  {
    icon: GraduationCap,
    title: "Arangetram Preparation",
    description: "Structured preparation for students progressing toward Arangetram.",
    image: "/images/training/dancer.jpg",
  },
  {
    icon: Heart,
    title: "Holistic Development",
    description: "Develop confidence, discipline, expression and artistic understanding.",
    image: "/images/hero/texture.jpg",
  },
];

export default function Features() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: shouldReduceMotion ? 0 : 5 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <ScrollReveal direction="up">
          <div className={styles.headingWrapper}>
            <h2 className="heading-secondary">Why Choose Us</h2>
          </div>
        </ScrollReveal>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <TiltCard
                className={styles.card}
                maxRotation={3}
                scale={1.02}
              >
                <div className={styles.cardBackground}>
                  <PremiumImage 
                    src={feature.image} 
                    alt={feature.title} 
                    fill 
                    overlay="dark"
                  />
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.iconWrapper}>
                    <feature.icon
                      className={styles.icon}
                      size={24}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className={styles.title}>{feature.title}</h3>
                  <p className={styles.description}>{feature.description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
