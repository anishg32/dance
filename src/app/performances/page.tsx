import { academyConfig } from "@/config/academy";
import prisma from "@/lib/prisma";
import { MapPin, Users, Filter } from 'lucide-react';
import PremiumImage from "@/components/ui/PremiumImage";
import styles from './Performances.module.css';

export const revalidate = 3600; // Revalidate every hour

export default async function PublicPerformancesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const yearFilter = typeof resolvedSearchParams.year === 'string' ? parseInt(resolvedSearchParams.year, 10) : new Date().getFullYear();

  const performances = await prisma.performance.findMany({
    where: {
      date: {
        gte: new Date(yearFilter, 0, 1),
        lt: new Date(yearFilter + 1, 0, 1)
      }
    },
    include: {
      _count: {
        select: { students: true }
      }
    },
    orderBy: { date: 'desc' }
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - i);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <div className="container">
          <h1 className={styles.heroTitle}>Performance Archive</h1>
          <p className={styles.heroSubtitle}>Explore the rich history of stage performances and productions by {academyConfig.name}.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.filtersSection}>
          <form className={styles.filterForm}>
            <div className={styles.filterGroup}>
              <label>Select Year</label>
              <select name="year" defaultValue={yearFilter}>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="btn btn-outline" style={{ alignSelf: 'flex-end', height: '42px', borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}>
              <Filter size={16} style={{ marginRight: '0.5rem' }} /> Filter
            </button>
          </form>
        </div>

        <div className={styles.grid}>
          {performances.length > 0 ? (
            performances.map((perf) => (
              <div key={perf.id} className={styles.card}>
                <div className={styles.cardBackground}>
                  <PremiumImage 
                    src="/images/training/dancer.jpg" 
                    alt={perf.title} 
                    fill 
                    overlay="dark"
                  />
                </div>
                
                <div className={styles.dateBadge}>
                  <span className={styles.dateMonth}>{perf.date.toLocaleString('default', { month: 'short' })}</span>
                  <span className={styles.dateDay}>{perf.date.getDate()}</span>
                </div>
                
                <div className={styles.cardContent}>
                  <span className={styles.perfType}>{perf.type}</span>
                  <h3 className={styles.perfTitle}>{perf.title}</h3>
                  
                  <div className={styles.perfMeta}>
                    {perf.location && (
                      <div className={styles.metaItem}>
                        <MapPin size={16} />
                        {perf.location}
                      </div>
                    )}
                    <div className={styles.metaItem}>
                      <Users size={16} />
                      {perf._count?.students || 0} Performers
                    </div>
                  </div>
                  
                  {perf.description && (
                    <p className={styles.perfDesc}>{perf.description}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h3>No performances found for {yearFilter}</h3>
              <p>Try selecting a different year to explore our archives.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
