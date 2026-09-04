import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import Link from 'next/link';
import { Award, Star, Medal, ArrowUpRight, TrendingUp, BookOpen, Calendar, Settings, Users } from 'lucide-react';
import styles from './ParentDashboard.module.css';



export default async function ParentDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  if ((session.user as any).role !== 'PARENT') {
    redirect('/dashboard');
  }

  const userId = (session.user as any).id;
  const resolvedSearchParams = await searchParams;
  const activeStudentId = typeof resolvedSearchParams.student === 'string' ? resolvedSearchParams.student : null;

  // 1. Authenticate Parent and fetch linked students
  const parentProfile = await prisma.parentProfile.findUnique({
    where: { userId },
    include: {
      students: {
        include: {
          student: {
            include: { user: true }
          }
        }
      }
    }
  });

  if (!parentProfile) {
    return (
      <div className={styles.pageContainer}>
        <div className="container">
          <div className={styles.orBox}>
            <h2>Profile Not Found</h2>
            <p>Your parent profile has not been created yet. Please contact administration.</p>
          </div>
        </div>
      </div>
    );
  }

  const linkedStudents = parentProfile.students.map(s => s.student);
  
  if (linkedStudents.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <div className="container">
          <div className={styles.orBox}>
            <h2>No Linked Students</h2>
            <p>You currently have no students linked to your account. Please contact administration to link your children's profiles.</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine active student
  let activeStudent = linkedStudents[0];
  if (activeStudentId) {
    const found = linkedStudents.find(s => s.id === activeStudentId);
    if (found) activeStudent = found;
  }

  // Fetch full details ONLY for the active linked student
  const profile = await prisma.studentProfile.findUnique({
    where: { id: activeStudent.id },
    include: {
      awards: { orderBy: { date: 'desc' }, take: 5 },
      performances: { include: { performance: true }, orderBy: { performance: { date: 'desc' } }, take: 5 },
      certificates: { orderBy: { createdAt: 'desc' }, take: 5 },
    }
  });

  if (!profile) {
    return <div>Error loading student data.</div>;
  }

  // Calculate summaries
  const goldAwards = profile.awards.filter(a => a.position.toLowerCase().includes('1st')).length;
  const silverAwards = profile.awards.filter(a => a.position.toLowerCase().includes('2nd')).length;
  const bronzeAwards = profile.awards.filter(a => a.position.toLowerCase().includes('3rd')).length;
  const isRankImproved = profile.previousRank && profile.currentRank && profile.currentRank < profile.previousRank;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dashboardHeader}>
        <div className="container">
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.welcomeText}>Parent Portal</h1>
              <p className={styles.subtitle}>Welcome back, {session.user.name}</p>
            </div>
            <Link href="/dashboard/parent/profile" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} /> Settings
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        
        {/* Student Switcher */}
        <div className={styles.switcherSection}>
          <h3 className={styles.switcherTitle}><Users size={18} /> My Students</h3>
          <div className={styles.studentCards}>
            {linkedStudents.map(student => {
              const isActive = student.id === activeStudent.id;
              return (
                <Link 
                  key={student.id} 
                  href={`/dashboard/parent?student=${student.id}`}
                  className={`${styles.studentCard} ${isActive ? styles.activeStudentCard : ''}`}
                >
                  <div className={styles.studentAvatar}>
                    {student.user.image ? <img src={student.user.image} alt={student.displayName || student.user.name || ''} /> : (student.displayName?.[0] || student.user.name?.[0] || 'S')}
                  </div>
                  <div className={styles.studentInfo}>
                    <h4>{student.displayName || student.user.name}</h4>
                    <span>{student.level} Level</span>
                  </div>
                  {isActive && <div className={styles.activeIndicator}></div>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Active Student Dashboard Area */}
        <div className={styles.activeArea}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><Star size={24} /></div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Current Rank</span>
                <span className={styles.statValue}>#{profile.currentRank || '-'}</span>
                {isRankImproved && (
                  <span className={styles.trendUp}><TrendingUp size={14} /> Improved</span>
                )}
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: 'var(--color-gold-dark)' }}><Medal size={24} /></div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Achievement Points</span>
                <span className={styles.statValue}>{profile.achievementPoints}</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#2E7D32' }}><Award size={24} /></div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Total Awards</span>
                <span className={styles.statValue}>{profile.awards.length}</span>
                <span className={styles.awardBreakdown}>
                  <span style={{ color: '#FBC02D' }}>{goldAwards} Gold</span>
                </span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#1565C0' }}><BookOpen size={24} /></div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Arangetram Status</span>
                <span className={styles.statValue} style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                  {profile.arangetramStatus || 'Not Started'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.mainCol}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2>Recent Awards</h2>
                  <Link href="/achievements" className={styles.viewAll}>View Public Hall of Fame <ArrowUpRight size={16} /></Link>
                </div>
                
                {profile.awards.length > 0 ? (
                  <div className={styles.list}>
                    {profile.awards.map(award => (
                      <div key={award.id} className={styles.listItem}>
                        <div className={styles.itemMain}>
                          <h4>{award.title}</h4>
                          <p>{award.competition} • {award.year}</p>
                        </div>
                        <div className={styles.itemBadge}>
                          {award.position}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>No awards recorded yet.</div>
                )}
              </div>

              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2>Private Certificates</h2>
                </div>
                
                {profile.certificates.length > 0 ? (
                  <div className={styles.certGrid}>
                    {profile.certificates.map(cert => (
                      <div key={cert.id} className={styles.certCard}>
                        <div className={styles.certImagePreview} style={{ backgroundImage: `url(${cert.image})` }}></div>
                        <div className={styles.certInfo}>
                          <h4>{cert.awardTitle}</h4>
                          <p>{cert.organization} ({cert.year})</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>No certificates uploaded.</div>
                )}
              </div>
            </div>

            <div className={styles.sideCol}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2>Performances</h2>
                  <Link href="/performances" className={styles.viewAll}><ArrowUpRight size={16} /></Link>
                </div>
                
                {profile.performances.length > 0 ? (
                  <div className={styles.timelineList}>
                    {profile.performances.map(sp => (
                      <div key={sp.performanceId} className={styles.timelineItem}>
                        <div className={styles.timelineIcon}><Calendar size={14} /></div>
                        <div className={styles.timelineContent}>
                          <h4>{sp.performance.title}</h4>
                          <p>{new Date(sp.performance.date).toLocaleDateString()} • {sp.performance.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>No performances recorded.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
