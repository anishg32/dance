import prisma from "@/lib/prisma";
import { Users, Trophy, Star, Calendar, MessageSquare, ClipboardList } from 'lucide-react';
import styles from './Admin.module.css';



export default async function AdminDashboard() {
  // Fetch aggregate statistics concurrently
  const [
    totalStudents,
    totalAwards,
    totalPerformances,
    totalEvents,
    pendingAdmissions
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.award.count(),
    prisma.performance.count(),
    prisma.event.count(),
    prisma.admission.count({ where: { status: 'New' } })
  ]);

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users },
    { label: 'Total Awards', value: totalAwards, icon: Trophy },
    { label: 'Total Performances', value: totalPerformances, icon: Star },
    { label: 'Upcoming Events', value: totalEvents, icon: Calendar },
    { label: 'Pending Admissions', value: pendingAdmissions, icon: ClipboardList },
  ];

  return (
    <>
      <h1 className="heading-secondary" style={{ textAlign: 'left', marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>{stat.label}</span>
              <stat.icon className={styles.statIcon} size={36} />
            </div>
            <div className={styles.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'var(--color-ivory)', padding: '2rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-soft)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-maroon)', marginBottom: '1rem' }}>Welcome to the Management Portal</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Use the sidebar navigation to manage students, approve awards, schedule events, and moderate admissions. 
          Remember that only verified awards will count towards a student's ranking points.
        </p>
      </div>
    </>
  );
}
