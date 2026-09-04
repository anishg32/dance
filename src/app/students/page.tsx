import { academyConfig } from "@/config/academy";
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import PremiumImage from "@/components/ui/PremiumImage";
import ParallaxSection from '@/components/motion/ParallaxSection';
import styles from './StudentsDirectory.module.css';



export const revalidate = 3600; // Revalidate every hour

export default async function PublicStudentsDirectory({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';
  const levelFilter = typeof resolvedSearchParams.level === 'string' ? resolvedSearchParams.level : '';

  const students = await prisma.studentProfile.findMany({
    where: {
      activeStatus: true,
      isPublic: true,
      AND: [
        {
          OR: [
            { displayName: { contains: search } },
            { user: { name: { contains: search } } },
          ]
        },
        levelFilter ? { level: levelFilter } : {}
      ]
    },
    include: {
      user: true,
      _count: {
        select: { awards: { where: { verified: true } }, performances: true }
      }
    },
    orderBy: { currentRank: 'asc' }
  });

  return (
    <div className={styles.pageContainer}>
      <ParallaxSection 
        className={styles.heroSection} 
        speed={0.5}
        backgroundImage={<PremiumImage src="/images/students/silhouette.jpg" alt="Students" fill overlay="dark" />}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className={styles.heroTitle}>Our Students</h1>
          <p className={styles.heroSubtitle}>Meet the dedicated dancers carrying forward the legacy of {academyConfig.name}.</p>
        </div>
      </ParallaxSection>

      <div className="container">
        <div className={styles.filtersSection}>
          <form className={styles.filterForm}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                name="search" 
                placeholder="Search by name..." 
                defaultValue={search}
                className={styles.searchInput}
              />
            </div>
            
            <select name="level" defaultValue={levelFilter} className={styles.filterSelect}>
              <option value="">All Levels</option>
              <option value="Beginner Level">Beginner</option>
              <option value="Intermediate Level">Intermediate</option>
              <option value="Advanced Level">Advanced</option>
              <option value="Senior Level">Senior</option>
            </select>
            
            <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </form>
        </div>

        <div className={styles.directoryGrid}>
          {students.length > 0 ? (
            students.map((student) => (
              <Link href={`/students/${student.id}`} key={student.id} className={styles.studentCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatarLarge}>
                    {student.user.image ? (
                      <PremiumImage src={student.user.image} alt={student.displayName || ''} fill />
                    ) : (
                      (student.displayName || student.user.name || 'S').charAt(0)
                    )}
                  </div>
                  {student.currentRank && (
                    <div className={styles.rankBadge}>#{student.currentRank}</div>
                  )}
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.studentName}>{student.displayName || student.user.name}</h3>
                  <div className={styles.levelBadge}>{student.level}</div>
                  
                  <div className={styles.statsRow}>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{student._count.awards}</span>
                      <span className={styles.statLabel}>Awards</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{student._count.performances}</span>
                      <span className={styles.statLabel}>Shows</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{student.achievementPoints}</span>
                      <span className={styles.statLabel}>Pts</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h3>No students found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
