import { academyConfig } from "@/config/academy";
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Trophy, Award, Medal, Star } from 'lucide-react';
import styles from './Achievements.module.css';



export const revalidate = 3600; // Revalidate every hour // Revalidate every minute

export default async function HallOfFamePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const levelFilter = typeof resolvedSearchParams.level === 'string' ? resolvedSearchParams.level : '';
  const positionFilter = typeof resolvedSearchParams.position === 'string' ? resolvedSearchParams.position : '';

  const awards = await prisma.award.findMany({
    where: {
      verified: true,
      student: {
        activeStatus: true,
        isPublic: true
      },
      ...(positionFilter ? { position: { contains: positionFilter } } : {})
    },
    include: {
      student: {
        include: { user: true }
      }
    },
    orderBy: { year: 'desc' }
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <div className="container">
          <h1 className={styles.heroTitle}>Hall of Fame</h1>
          <p className={styles.heroSubtitle}>Celebrating the outstanding achievements of {academyConfig.name}'s brightest talents across the nation.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.filtersSection}>
          <form className={styles.filterForm}>
            <div className={styles.filterGroup}>
              <label>Position</label>
              <select name="position" defaultValue={positionFilter} onChange={(e) => e.target.form?.submit()}>
                <option value="">All Positions</option>
                <option value="1st Place">1st Place (Gold)</option>
                <option value="2nd Place">2nd Place (Silver)</option>
                <option value="3rd Place">3rd Place (Bronze)</option>
              </select>
            </div>
            <button type="submit" className="btn btn-outline" style={{ alignSelf: 'flex-end', height: '42px' }}>
              Apply Filters
            </button>
          </form>
        </div>

        <div className={styles.awardsGrid}>
          {awards.length > 0 ? (
            awards.map((award) => (
              <div key={award.id} className={styles.awardCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.positionIcon}>
                    {award.position.includes('1st') ? <Trophy size={32} color="#FFD700" /> :
                     award.position.includes('2nd') ? <Medal size={32} color="#C0C0C0" /> :
                     award.position.includes('3rd') ? <Medal size={32} color="#CD7F32" /> :
                     <Award size={32} color="var(--color-gold)" />}
                  </div>
                  <div className={styles.yearBadge}>{award.year}</div>
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.awardTitle}>{award.title}</h3>
                  <div className={styles.competitionName}>{award.competition}</div>
                  
                  <div className={styles.detailsRow}>
                    <span className={styles.positionText}>{award.position}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`/students/${award.student.id}`} className={styles.studentInfo}>
                    <div className={styles.avatar}>
                      {award.student.user.image ? (
                        <img src={award.student.user.image} alt={award.student.displayName || ''} />
                      ) : (
                        (award.student.displayName || award.student.user.name || 'S').charAt(0)
                      )}
                    </div>
                    <div>
                      <div className={styles.studentName}>{award.student.displayName || award.student.user.name}</div>
                      <div className={styles.studentLevel}>{award.student.level}</div>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <Star size={48} className={styles.emptyIcon} />
              <h3>No achievements found</h3>
              <p>Try adjusting your filters or check back later for new updates.</p>
              <Link href="/achievements" className="btn btn-primary" style={{ marginTop: '1rem' }}>Clear Filters</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
