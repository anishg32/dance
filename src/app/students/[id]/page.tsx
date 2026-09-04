import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';
import { Trophy, Star, Calendar, MapPin, Award as AwardIcon } from 'lucide-react';
import PremiumImage from "@/components/ui/PremiumImage";
import styles from './StudentProfile.module.css';



export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Extract id from the Promise params (Next.js 15 App Router dynamic routes pass a Promise)
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const student = await prisma.studentProfile.findUnique({
    where: { id },
    include: {
      user: true,
      awards: {
        where: { verified: true },
        orderBy: { year: 'desc' }
      },
      performances: {
        include: { performance: true },
        orderBy: { performance: { date: 'desc' } }
      }
    }
  });

  if (!student || !student.isPublic || !student.activeStatus) {
    notFound();
  }

  const displayName = student.displayName || student.user.name || 'Student';
  
  // Create timeline of achievements (combining awards and performances)
  const timelineEvents: any[] = [];
  
  student.awards.forEach(award => {
    timelineEvents.push({
      type: 'award',
      date: award.date || new Date(award.year, 0, 1),
      year: award.year,
      title: award.title,
      subtitle: `${award.competition} - ${award.position}`,
      icon: Trophy,
      color: 'gold'
    });
  });
  
  student.performances.forEach(sp => {
    timelineEvents.push({
      type: 'performance',
      date: sp.performance.date,
      year: sp.performance.date.getFullYear(),
      title: sp.performance.title,
      subtitle: sp.performance.type,
      icon: Star,
      color: 'maroon'
    });
  });

  // Sort timeline by date descending
  timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className={styles.profileContainer}>
      <div className={styles.headerBackground}></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarLarge}>
              {student.user.image ? (
                <PremiumImage src={student.user.image} alt={displayName} fill containerClassName={styles.avatarImg} />
              ) : (
                displayName.charAt(0)
              )}
            </div>
            
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>{displayName}</h1>
              <div className={styles.levelBadge}>{student.level}</div>
              {student.bio && <p className={styles.bio}>{student.bio}</p>}
            </div>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{student.currentRank ? `#${student.currentRank}` : 'N/A'}</div>
              <div className={styles.statLabel}>Academy Rank</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{student.achievementPoints}</div>
              <div className={styles.statLabel}>Total Points</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{student.awards.length}</div>
              <div className={styles.statLabel}>Verified Awards</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{student.performances.length}</div>
              <div className={styles.statLabel}>Performances</div>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.timelineSection}>
            <h2 className={styles.sectionTitle}>Journey & Achievements</h2>
            
            {timelineEvents.length > 0 ? (
              <div className={styles.timeline}>
                {timelineEvents.map((event, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={`${styles.timelineIcon} ${styles[event.color]}`}>
                      <event.icon size={18} />
                    </div>
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineDate}>
                        {event.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <h3 className={styles.timelineTitle}>{event.title}</h3>
                      <p className={styles.timelineSubtitle}>{event.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>No public journey events available yet.</p>
            )}
          </div>
          
          <div className={styles.sidebarSection}>
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Student Details</h3>
              <ul className={styles.detailList}>
                <li>
                  <Calendar size={18} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Joined</span>
                    <span className={styles.detailValue}>{student.joiningYear}</span>
                  </div>
                </li>
                <li>
                  <AwardIcon size={18} className={styles.detailIcon} />
                  <div>
                    <span className={styles.detailLabel}>Arangetram</span>
                    <span className={styles.detailValue}>{student.arangetramStatus || 'Not Started'}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
