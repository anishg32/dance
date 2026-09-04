import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import styles from './StudentsAdmin.module.css';



export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';
  const levelFilter = typeof resolvedSearchParams.level === 'string' ? resolvedSearchParams.level : '';

  const students = await prisma.studentProfile.findMany({
    where: {
      AND: [
        {
          OR: [
            { displayName: { contains: search } },
            { user: { name: { contains: search } } },
            { user: { email: { contains: search } } },
          ]
        },
        levelFilter ? { level: levelFilter } : {}
      ]
    },
    include: {
      user: true,
      _count: {
        select: { awards: true, performances: true }
      }
    },
    orderBy: { currentRank: 'asc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Student Management</h1>
          <p className={styles.pageSubtitle}>Manage academy students, their levels, and profiles.</p>
        </div>
        <Link href="/admin/students/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Student
        </Link>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search by name or email..." 
              defaultValue={search}
              className={styles.searchInput}
            />
          </div>
          
          <select name="level" defaultValue={levelFilter} className={styles.filterSelect} onChange={(e) => e.target.form?.submit()}>
            <option value="">All Levels</option>
            <option value="Beginner Level">Beginner</option>
            <option value="Intermediate Level">Intermediate</option>
            <option value="Advanced Level">Advanced</option>
            <option value="Senior Level">Senior</option>
          </select>
          
          <button type="submit" className="btn btn-outline" style={{ padding: '0.6rem 1rem' }}>Filter</button>
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Level</th>
              <th>Rank</th>
              <th>Points</th>
              <th>Awards</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className={styles.studentInfo}>
                      <div className={styles.avatar}>
                        {student.user.image ? (
                          <img src={student.user.image} alt={student.displayName || ''} />
                        ) : (
                          (student.displayName || student.user.name || 'S').charAt(0)
                        )}
                      </div>
                      <div>
                        <div className={styles.studentName}>{student.displayName || student.user.name}</div>
                        <div className={styles.studentEmail}>{student.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{student.level}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--color-maroon)' }}>{student.currentRank ? `#${student.currentRank}` : '-'}</td>
                  <td>{student.achievementPoints}</td>
                  <td>{student._count.awards}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${student.activeStatus ? styles.statusActive : styles.statusInactive}`}>
                      {student.activeStatus ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/students/${student.id}`} className={styles.actionBtn} title="View Profile">
                        <Eye size={18} />
                      </Link>
                      <Link href={`/admin/students/${student.id}/edit`} className={styles.actionBtn} title="Edit Student">
                        <Edit size={18} />
                      </Link>
                      <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
