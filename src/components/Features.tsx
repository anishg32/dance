"use client";

import { motion } from 'framer-motion';
import { BookOpen, Star, Users, Trophy, GraduationCap, Heart } from 'lucide-react';
import styles from './Features.module.css';

const features = [
  {
    icon: BookOpen,
    title: "Traditional Training",
    description: "Authentic Bharatanatyam training rooted in classical tradition."
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Personalized guidance from experienced teachers."
  },
  {
    icon: Star,
    title: "Stage Experience",
    description: "Regular opportunities to perform on professional stages."
  },
  {
    icon: Trophy,
    title: "Competition Excellence",
    description: "Preparation for district, state, national and international competitions."
  },
  {
    icon: GraduationCap,
    title: "Arangetram Preparation",
    description: "Structured preparation for students progressing toward Arangetram."
  },
  {
    icon: Heart,
    title: "Holistic Development",
    description: "Develop confidence, discipline, expression and artistic understanding."
  }
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-secondary">Why Choose Us</h2>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}>
                <feature.icon className={styles.icon} size={28} strokeWidth={1.5} />
              </div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.description}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
