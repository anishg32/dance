import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import Link from 'next/link';
import { Award, Star, Medal, ArrowUpRight, TrendingUp, BookOpen, Calendar, Settings } from 'lucide-react';
import styles from './Dashboard.module.css';



export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Strictly fetch based on authenticated user ID
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      studentProfile: {
        include: {
          awards: {
            orderBy: { date: 'desc' },
            take: 5
          },
          performances: {
            include: { performance: true },
            orderBy: { performance: { date: 'desc' } },
            take: 5
          },
          certificates: {
            orderBy: { createdAt: 'desc' },
            take: 5
          },
        }
      }
    }
  });

  if (!user || user.role !== 'STUDENT') {
    // If Admin, redirect to admin
    if (user?.role === 'ADMIN') redirect('/admin');
    if (user?.role === 'PARENT') redirect('/dashboard/parent');
    redirect('/login');
  }

  const profile = user.studentProfile;
  
  if (!profile) {
    return (
      <div className={styles.pageContainer}>
        <div className="container">
          <div className={styles.errorBox}>
            <h2>Profile Not Found</h2>
            <p>Your student profile has not been created yet. Please contact administration.</p>
          </div>
        </div>
      </div>
    );
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
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {user.image ? <img src={user.image} alt={user.name || 'Student'} /> : (user.name?.[0] || 'S')}
              </div>
              <div>
                <h1 className={styles.welcomeText}>Welcome, {user.name}</h1>
                <p className={styles.levelText}>{profile.level} Level</p>
              </div>
            </div>
            <Link href="/dashboard/profile" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} /> Settings
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Star size={24} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Current Rank</span>
              <span className={styles.statValue}>#{profile.currentRank || '-'}</span>
              {isRankImproved && (
                <span className={styles.trendUp}><TrendingUp size={14} /> Improved from #{profile.previousRank}</span>
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
                <span style={{ color: '#FBC02D' }}>{goldAwards} Gold</span> • 
                <span style={{ color: '#9E9E9E' }}> {silverAwards} Silver</span> • 
                <span style={{ color: '#FF8A65' }}> {bronzeAwards} Bronze</span>
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
                        <span className={styles.certVisibility}>{cert.isPublic ? 'Public' : 'Private'}</span>
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
            
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2>Profile Progress</h2>
              </div>
              <div className={styles.progressTracker}>
                <div className={styles.progressStep}>
                  <div className={`${styles.progressDot} ${styles.progressDone}`}></div>
                  <div className={styles.progressText}>Enrollment ({profile.joiningYear})</div>
                </div>
                <div className={styles.progressStep}>
                  <div className={`${styles.progressDot} ${styles.progressDone}`}></div>
                  <div className={styles.progressText}>Current Level: {profile.level}</div>
                </div>
                <div className={styles.progressStep}>
                  <div className={`${styles.progressDot} ${profile.arangetramStatus === 'Completed' ? styles.progressDone : ''}`}></div>
                  <div className={styles.progressText}>Arangetram: {profile.arangetramStatus || 'Pending'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
