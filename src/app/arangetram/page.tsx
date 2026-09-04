import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Sparkles, BookOpen, Crown, Star, Palette } from 'lucide-react';
import PremiumImage from "@/components/ui/PremiumImage";
import ScrollReveal from "@/components/motion/ScrollReveal";
import ParallaxSection from '@/components/motion/ParallaxSection';
import styles from './Arangetram.module.css';

export const revalidate = 3600; // Revalidate every hour

export default async function ArangetramPage() {
  const students = await prisma.studentProfile.findMany({
    where: {
      arangetramStatus: { in: ['Completed', 'Upcoming'] },
      isPublic: true,
      activeStatus: true
    },
    include: {
      user: true
    },
    orderBy: { user: { name: 'asc' } }
  });

  const completed = students.filter(s => s.arangetramStatus === 'Completed');
  const upcoming = students.filter(s => s.arangetramStatus === 'Upcoming');

  return (
    <div className={styles.pageContainer}>
      <ParallaxSection 
        className={styles.heroSection} 
        speed={0.5}
        backgroundImage={<PremiumImage src="/images/performances/stage.jpg" alt="Stage" fill overlay="dark" />}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <ScrollReveal direction="up">
            <h1 className={styles.heroTitle}>The Arangetram Journey</h1>
            <p className={styles.heroSubtitle}>Ascending the stage to become a complete artist. It takes years of rigorous discipline to reach this divine milestone.</p>
          </ScrollReveal>
        </div>
      </ParallaxSection>

      <div className={styles.journeySection}>
        <div className="container">
          <div className={styles.journeyTimeline}>
            <ScrollReveal direction="up">
              <div className={styles.stepCard}>
                <div className={styles.stepContent}>
                  <PremiumImage src="/images/hero/texture.jpg" alt="Training" fill overlay="maroon" containerClassName={styles.stepBg} />
                  <div className={styles.stepIcon}><BookOpen size={24} /></div>
                  <div className={styles.stepText}>
                    <h3 className={styles.stepTitle}>Training</h3>
                    <p className={styles.stepDesc}>Mastering the fundamental Adavus and rhythms over years of dedicated practice.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.1}>
              <div className={styles.stepCard}>
                <div className={styles.stepContent}>
                  <PremiumImage src="/images/training/dancer.jpg" alt="Preparation" fill overlay="dark" containerClassName={styles.stepBg} />
                  <div className={styles.stepIcon}><Star size={24} /></div>
                  <div className={styles.stepText}>
                    <h3 className={styles.stepTitle}>Preparation</h3>
                    <p className={styles.stepDesc}>Learning complex choreographies, building immense stamina, and perfecting the Margam.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.1}>
              <div className={styles.stepCard}>
                <div className={styles.stepContent}>
                  <PremiumImage src="/images/hero/texture.jpg" alt="Rehearsal" fill overlay="maroon" containerClassName={styles.stepBg} />
                  <div className={styles.stepIcon}><Palette size={24} /></div>
                  <div className={styles.stepText}>
                    <h3 className={styles.stepTitle}>Rehearsal</h3>
                    <p className={styles.stepDesc}>Live orchestra coordination, costume selection, and rigorous stage practice.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.1}>
              <div className={styles.stepCard}>
                <div className={styles.stepContent}>
                  <PremiumImage src="/images/training/dancer.jpg" alt="Stage" fill overlay="dark" containerClassName={styles.stepBg} />
                  <div className={styles.stepIcon}><Crown size={24} /></div>
                  <div className={styles.stepText}>
                    <h3 className={styles.stepTitle}>Stage</h3>
                    <p className={styles.stepDesc}>The final moments before the curtain rises, invoking the blessings of Nataraja and the Guru.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.1}>
              <div className={`${styles.stepCard} ${styles.stepFinal}`}>
                <div className={styles.stepContent}>
                  <PremiumImage src="/images/hero/nataraja.jpg" alt="Arangetram" fill overlay="gold" containerClassName={styles.stepBg} />
                  <div className={styles.stepIcon}><Sparkles size={24} /></div>
                  <div className={styles.stepText}>
                    <h3 className={styles.stepTitle}>Arangetram</h3>
                    <p className={styles.stepDesc}>The solo debut performance lasting 2-3 hours. A true offering of art.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {upcoming.length > 0 && (
          <div className={styles.sectionBlock}>
            <ScrollReveal direction="up">
              <h2 className={styles.sectionTitle}>Upcoming Arangetrams</h2>
            </ScrollReveal>
            <div className={styles.grid}>
              {upcoming.map(student => (
                <ScrollReveal direction="up" key={student.id}>
                  <Link href={`/students/${student.id}`} className={styles.studentCard}>
                    <div className={styles.avatarLarge}>
                      {student.user.image ? (
                        <PremiumImage src={student.user.image} alt={student.displayName || ''} fill />
                      ) : (
                        (student.displayName || student.user.name || 'S').charAt(0)
                      )}
                    </div>
                    <div className={styles.cardContent}>
                      <h3>{student.displayName || student.user.name}</h3>
                      <span className={styles.badgeUpcoming}>Preparing</span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div className={styles.sectionBlock}>
            <ScrollReveal direction="up">
              <h2 className={styles.sectionTitle}>Our Graduates</h2>
            </ScrollReveal>
            <div className={styles.grid}>
              {completed.map(student => (
                <ScrollReveal direction="up" key={student.id}>
                  <Link href={`/students/${student.id}`} className={styles.studentCard}>
                    <div className={styles.avatarLarge}>
                      {student.user.image ? (
                        <PremiumImage src={student.user.image} alt={student.displayName || ''} fill />
                      ) : (
                        (student.displayName || student.user.name || 'S').charAt(0)
                      )}
                    </div>
                    <div className={styles.cardContent}>
                      <h3>{student.displayName || student.user.name}</h3>
                      <span className={styles.badgeCompleted}>Completed</span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
