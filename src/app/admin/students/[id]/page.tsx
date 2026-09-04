import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trophy, Star, TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';
import styles from './StudentDetailAdmin.module.css';



export default async function AdminStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const student = await prisma.studentProfile.findUnique({
    where: { id },
    include: {
      user: true,
      awards: {
        orderBy: { year: 'desc' }
      },
      performances: {
        include: { performance: true },
        orderBy: { performance: { date: 'desc' } }
      },
      parents: {
        include: {
          parent: { include: { user: true } }
        }
      }
    }
  });

  if (!student) {
    notFound();
  }

  const getTrendIcon = (current: number | null, previous: number | null) => {
    if (!current || !previous) return <Minus size={16} className={styles.trendSame} />;
    if (current < previous) return <TrendingUp size={16} className={styles.trendUp} />;
    if (current > previous) return <TrendingDown size={16} className={styles.trendDown} />;
    return <Minus size={16} className={styles.trendSame} />;
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/students" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Students
        </Link>
      </div>

      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.studentInfo}>
            <div className={styles.avatarLarge}>
              {student.user.image ? (
                <img src={student.user.image} alt={student.displayName || ''} />
              ) : (
                (student.displayName || student.user.name || 'S').charAt(0)
              )}
            </div>
            <div>
              <h1 className={styles.name}>{student.displayName || student.user.name}</h1>
              <div className={styles.badges}>
                <span className={styles.badge}>{student.level}</span>
                <span className={`${styles.badge} ${student.activeStatus ? styles.badgeActive : styles.badgeInactive}`}>
                  {student.activeStatus ? 'Active' : 'Inactive'}
                </span>
                <span className={`${styles.badge} ${student.isPublic ? styles.badgePublic : styles.badgePrivate}`}>
                  {student.isPublic ? 'Public Profile' : 'Private Profile'}
                </span>
              </div>
            </div>
          </div>
          
          <Link href={`/admin/students/${student.id}/edit`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit size={16} /> Edit Profile
          </Link>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Current Rank</div>
            <div className={styles.statValueRow}>
              <span className={styles.statValueLarge}>{student.currentRank ? `#${student.currentRank}` : 'Unranked'}</span>
              {getTrendIcon(student.currentRank, student.previousRank)}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Achievement Points</div>
            <div className={styles.statValueLarge}>{student.achievementPoints}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Joined</div>
            <div className={styles.statValueLarge}>{student.joiningYear}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Arangetram</div>
            <div className={styles.statValueLarge} style={{ fontSize: '1.2rem' }}>{student.arangetramStatus || 'Not Started'}</div>
          </div>
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><Trophy size={18} /> Awards & Achievements ({student.awards.length})</h2>
            <Link href={`/admin/awards?student=${student.id}`} className={styles.linkAction}>Manage Awards</Link>
          </div>
          <div className={styles.listContainer}>
            {student.awards.length > 0 ? (
              <ul className={styles.list}>
                {student.awards.map((award) => (
                  <li key={award.id} className={styles.listItem}>
                    <div>
                      <div className={styles.itemTitle}>{award.title}</div>
                      <div className={styles.itemMeta}>{award.competition} ({award.year})</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={styles.itemBadge}>{award.position}</span>
                      <div className={styles.itemMeta} style={{ marginTop: '0.2rem', color: award.verified ? '#2E7D32' : '#F57C00' }}>
                        {award.verified ? 'Verified' : 'Pending Verification'}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>No awards recorded yet.</div>
            )}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><Star size={18} /> Performances ({student.performances.length})</h2>
          </div>
          <div className={styles.listContainer}>
            {student.performances.length > 0 ? (
              <ul className={styles.list}>
                {student.performances.map((sp) => (
                  <li key={sp.performanceId} className={styles.listItem}>
                    <div>
                      <div className={styles.itemTitle}>{sp.performance.title}</div>
                      <div className={styles.itemMeta}>{sp.performance.type}</div>
                    </div>
                    <div className={styles.itemMeta}>
                      {sp.performance.date.toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>No performances recorded yet.</div>
            )}
          </div>
        </div>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><Users size={18} /> Linked Parents ({student.parents.length})</h2>
          </div>
          <div className={styles.listContainer}>
            {student.parents.length > 0 ? (
              <ul className={styles.list}>
                {student.parents.map((ps) => (
                  <li key={ps.parentId} className={styles.listItem}>
                    <div>
                      <div className={styles.itemTitle}>{ps.parent.user.name || 'Unnamed Parent'}</div>
                      <div className={styles.itemMeta}>{ps.parent.user.email}</div>
                    </div>
                    <Link href={`/admin/parents/${ps.parentId}/edit`} className={styles.linkAction}>View Parent</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>No parents linked yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
