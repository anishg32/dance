import { calculateStudentRankings } from '@/lib/rankingEngine';
import Link from 'next/link';
import { Trophy, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './Rankings.module.css';

export const revalidate = 3600; // Revalidate every hour // Revalidate every 60 seconds

export default async function RankingsPage() {
  const rankings = await calculateStudentRankings();

  const top3 = rankings.slice(0, 3);
  const others = rankings.slice(3);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className={styles.trendUp} />;
      case 'down': return <TrendingDown size={16} className={styles.trendDown} />;
      default: return <Minus size={16} className={styles.trendSame} />;
    }
  };

  return (
    <div className={styles.rankingsContainer}>
      <section className={styles.headerSection}>
        <div className="container">
          <h1 className={styles.title}>The Rising Stars</h1>
          <p className={styles.subtitle}>Celebrating dedication, discipline, and artistic excellence.</p>
        </div>
      </section>

      <section className={styles.podiumSection}>
        <div className="container">
          {top3.length > 0 && (
            <div className={styles.podiumContainer}>
              {top3[1] && (
                <div className={`${styles.podiumItem} ${styles.second}`}>
                  <div className={styles.avatarPlaceholder}>
                    {top3[1].displayName.charAt(0)}
                    <div className={styles.medal}>🥈</div>
                  </div>
                  <h3 className={styles.podiumName}>{top3[1].displayName}</h3>
                  <p className={styles.podiumLevel}>{top3[1].level}</p>
                  <div className={styles.podiumPoints}>{top3[1].points} pts</div>
                </div>
              )}
              
              {top3[0] && (
                <div className={`${styles.podiumItem} ${styles.first}`}>
                  <div className={styles.avatarPlaceholder}>
                    {top3[0].displayName.charAt(0)}
                    <div className={styles.medal}>🥇</div>
                  </div>
                  <h3 className={styles.podiumName}>{top3[0].displayName}</h3>
                  <p className={styles.podiumLevel}>{top3[0].level}</p>
                  <div className={styles.podiumPoints}>{top3[0].points} pts</div>
                </div>
              )}

              {top3[2] && (
                <div className={`${styles.podiumItem} ${styles.third}`}>
                  <div className={styles.avatarPlaceholder}>
                    {top3[2].displayName.charAt(0)}
                    <div className={styles.medal}>🥉</div>
                  </div>
                  <h3 className={styles.podiumName}>{top3[2].displayName}</h3>
                  <p className={styles.podiumLevel}>{top3[2].level}</p>
                  <div className={styles.podiumPoints}>{top3[2].points} pts</div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className={styles.listSection}>
        <div className="container">
          <div className={styles.filters}>
            <button className={`${styles.filterBtn} ${styles.active}`}>All Time</button>
            <button className={styles.filterBtn}>Advanced</button>
            <button className={styles.filterBtn}>Intermediate</button>
            <button className={styles.filterBtn}>Beginner</button>
          </div>

          <div className={styles.rankingsListContainer}>
            {/* Desktop Table */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Level</th>
                    <th>Awards</th>
                    <th>Performances</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {others.map((student) => (
                    <tr key={student.studentId} className={styles.tableRow}>
                      <td className={styles.rankCell}>
                        <span className={styles.rankNumber}>#{student.rank}</span>
                        {getTrendIcon(student.trend)}
                      </td>
                      <td>
                        <Link href={`/students/${student.studentId}`} className={styles.studentLink}>
                          <div className={styles.studentInfo}>
                            <div className={styles.smallAvatar}>{student.displayName.charAt(0)}</div>
                            <span>{student.displayName}</span>
                          </div>
                        </Link>
                      </td>
                      <td className={styles.levelCell}>{student.level}</td>
                      <td className={styles.statsCell}>
                        <Trophy size={14} className={styles.statIcon} /> {student.awardsCount}
                      </td>
                      <td className={styles.statsCell}>
                        <Star size={14} className={styles.statIcon} /> {student.performancesCount}
                      </td>
                      <td className={styles.pointsCell}>{student.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className={styles.mobileCardsContainer}>
              {others.map((student) => (
                <div key={student.studentId} className={styles.mobileCard}>
                  <div className={styles.mobileCardHeader}>
                    <div className={styles.rankCell}>
                      <span className={styles.rankNumber}>#{student.rank}</span>
                      {getTrendIcon(student.trend)}
                    </div>
                    <div className={styles.pointsCell}>{student.points} pts</div>
                  </div>
                  
                  <Link href={`/students/${student.studentId}`} className={styles.studentLink}>
                    <div className={styles.studentInfo}>
                      <div className={styles.smallAvatar}>{student.displayName.charAt(0)}</div>
                      <div>
                        <div>{student.displayName}</div>
                        <div className={styles.levelCell}>{student.level}</div>
                      </div>
                    </div>
                  </Link>

                  <div className={styles.mobileCardStats}>
                    <div className={styles.statsCell}>
                      <Trophy size={14} className={styles.statIcon} /> {student.awardsCount} Awards
                    </div>
                    <div className={styles.statsCell}>
                      <Star size={14} className={styles.statIcon} /> {student.performancesCount} Performances
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
