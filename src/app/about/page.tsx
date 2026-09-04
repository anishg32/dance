import { academyConfig } from "@/config/academy";
import PremiumImage from "@/components/ui/PremiumImage";
import ScrollReveal from "@/components/motion/ScrollReveal";
import ParallaxSection from "@/components/motion/ParallaxSection";
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <PremiumImage src="/images/about/temple.jpg" alt="About" fill overlay="dark" containerClassName={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <ScrollReveal direction="up">
            <h1 className={styles.heroTitle}>About the Academy</h1>
            <p className={styles.heroSubtitle}>Preserving the ancient art of Bharatanatyam through discipline, devotion, and excellence.</p>
          </ScrollReveal>
        </div>
      </div>

      <ParallaxSection 
        backgroundImage={<PremiumImage src="/images/textures/stone.jpg" alt="Texture Background" fill overlay="ivory-fade" />}
      >
        <section className={styles.contentSection}>
          <div className={`container ${styles.grid}`}>
            <ScrollReveal direction="right">
              <div style={{ position: 'relative' }}>
                <div className={styles.imageBorder} />
                <div className={styles.imageWrapper}>
                  <PremiumImage src="/images/hero/texture.jpg" alt={academyConfig.guru.name} fill overlay="dark" />
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="left">
              <div className={styles.textContent}>
                <h2 className={styles.title}>The Guru&apos;s Vision</h2>
                <p className={styles.subtitle}>{academyConfig.guru.title} {academyConfig.guru.name}</p>
                
                <div className={styles.text}>
                  <p>
                    With decades of rigorous training and stage experience, {academyConfig.guru.name} founded {academyConfig.name} to impart the authentic Tanjore style of Bharatanatyam to the next generation.
                  </p>
                  <p>
                    Our curriculum emphasizes not just the physical vocabulary of Adavus and Abhinaya, but the spiritual depth and cultural context that elevates dance into a divine offering.
                  </p>
                  <p>
                    We believe that classical arts instill discipline, grace, and focus that enrich every aspect of a student&apos;s life.
                  </p>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statNum}>15+</span>
                    <span className={styles.statLabel}>Years of Teaching</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNum}>100+</span>
                    <span className={styles.statLabel}>Students Trained</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxSection>
    </div>
  );
}
