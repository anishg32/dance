import prisma from "@/lib/prisma";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import RankingsSettingsForm from './RankingsSettingsForm';
import RecalculateButton from './RecalculateButton';
import styles from './RankingsAdmin.module.css';



export default async function AdminRankingsPage() {
  const settingsList = await prisma.rankingSettings.findMany();
  const settings = {
    points1stPlace: settingsList.find(s => s.key === '1st Place')?.points || 100,
    points2ndPlace: settingsList.find(s => s.key === '2nd Place')?.points || 75,
    points3rdPlace: settingsList.find(s => s.key === '3rd Place')?.points || 50,
    pointsParticipation: settingsList.find(s => s.key === 'Participation')?.points || 20,
    pointsPerformance: settingsList.find(s => s.key === 'Performance')?.points || 10,
  };
  
  const students = await prisma.studentProfile.findMany({
    where: { 
      activeStatus: true,
      currentRank: { not: null }
    },
    include: {
      user: true,
      awards: true
    },
    orderBy: { currentRank: 'asc' }
  });

  const getTrendIcon = (current: number | null, previous: number | null) => {
    if (!current || !previous) return <Minus size={16} className={`${styles.trendIcon} ${styles.trendSame}`} />;
    if (current < previous) return <TrendingUp size={16} className={`${styles.trendIcon} ${styles.trendUp}`} />;
    if (current > previous) return <TrendingDown size={16} className={`${styles.trendIcon} ${styles.trendDown}`} />;
    return <Minus size={16} className={`${styles.trendIcon} ${styles.trendSame}`} />;
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Rankings Engine</h1>
          <p className={styles.pageSubtitle}>Configure point algorithms and monitor the live academy leaderboard.</p>
        </div>
        <RecalculateButton />
      </div>

      <div className={styles.topSection}>
        <RankingsSettingsForm settings={settings} />
        
        <div className={styles.infoCard}>
          <h3>How Rankings Work</h3>
          <p>
            The Ranking Engine automatically calculates achievement points for all active students based on their <strong>verified</strong> awards and performances.
          </p>
          <ul>
            <li>Only verified awards count towards points.</li>
            <li>If two students have the same points, the one with more Gold awards wins the tie-breaker.</li>
            <li>If Gold is tied, the student with the higher total verified award count wins.</li>
            <li>"Recalculate" forces the entire database to re-evaluate and updates rank trends.</li>
          </ul>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Current Rank</th>
              <th>Student</th>
              <th>Level</th>
              <th>Achievement Points</th>
              <th>Gold Count</th>
              <th>Total Awards</th>
              <th>Previous Rank</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span className={styles.rankBadge}>#{student.currentRank}</span>
                    {getTrendIcon(student.currentRank, student.previousRank)}
                  </td>
                  <td>
                    <div className={styles.studentInfo}>
                      <div className={styles.avatar}>
                        {student.user.image ? (
                          <img src={student.user.image} alt={student.displayName || ''} />
                        ) : (
                          (student.displayName || student.user.name || 'S').charAt(0)
                        )}
                      </div>
                      <span>{student.displayName || student.user.name}</span>
                    </div>
                  </td>
                  <td>{student.level}</td>
                  <td className={styles.pointsBadge}>{student.achievementPoints}</td>
                  <td>{student.awards.filter(a => a.position.toLowerCase().includes('1st')).length}</td>
                  <td>{student.awards.length}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {student.previousRank ? `#${student.previousRank}` : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No ranked students found. Try running a recalculation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
