import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Crown, Star } from 'lucide-react';
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
      <div className={styles.heroSection}>
        <div className="container">
          <h1 className={styles.heroTitle}>The Arangetram Journey</h1>
          <p className={styles.heroSubtitle}>Ascending the stage to become a complete artist. It takes years of rigorous discipline to reach this divine milestone.</p>
        </div>
      </div>

      <div className={styles.journeySection}>
        <div className="container">
          <div className={styles.journeyPath}>
            <div className={styles.step}>
              <div className={styles.stepIcon}><BookOpen size={24} /></div>
              <h3 className={styles.stepTitle}>Beginner</h3>
              <p className={styles.stepDesc}>Mastering the fundamental Adavus and rhythms.</p>
            </div>
            
            <div className={styles.stepConnector}><ArrowRight size={24} /></div>
            
            <div className={styles.step}>
              <div className={styles.stepIcon}><Star size={24} /></div>
              <h3 className={styles.stepTitle}>Intermediate</h3>
              <p className={styles.stepDesc}>Learning complex choreographies and expressions (Abhinaya).</p>
            </div>
            
            <div className={styles.stepConnector}><ArrowRight size={24} /></div>
            
            <div className={styles.step}>
              <div className={styles.stepIcon}><Crown size={24} /></div>
              <h3 className={styles.stepTitle}>Advanced</h3>
              <p className={styles.stepDesc}>Perfecting the Margam (repertoire) and building stamina.</p>
            </div>
            
            <div className={styles.stepConnector}><ArrowRight size={24} /></div>
            
            <div className={`${styles.step} ${styles.stepFinal}`}>
              <div className={styles.stepIcon}><Sparkles size={24} /></div>
              <h3 className={styles.stepTitle}>Arangetram</h3>
              <p className={styles.stepDesc}>The solo debut performance lasting 2-3 hours.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '6rem' }}>
        {upcoming.length > 0 && (
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Upcoming Arangetrams</h2>
            <div className={styles.grid}>
              {upcoming.map(student => (
                <Link href={`/students/${student.id}`} key={student.id} className={styles.studentCard}>
                  <div className={styles.avatarLarge}>
                    {student.user.image ? (
                      <img src={student.user.image} alt={student.displayName || ''} />
                    ) : (
                      (student.displayName || student.user.name || 'S').charAt(0)
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{student.displayName || student.user.name}</h3>
                    <span className={styles.badgeUpcoming}>Preparing</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Our Graduates</h2>
            <div className={styles.grid}>
              {completed.map(student => (
                <Link href={`/students/${student.id}`} key={student.id} className={styles.studentCard}>
                  <div className={styles.avatarLarge}>
                    {student.user.image ? (
                      <img src={student.user.image} alt={student.displayName || ''} />
                    ) : (
                      (student.displayName || student.user.name || 'S').charAt(0)
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{student.displayName || student.user.name}</h3>
                    <span className={styles.badgeCompleted}>Completed</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
