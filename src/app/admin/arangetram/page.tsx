import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search, Edit, Eye, Filter } from 'lucide-react';
import styles from './ArangetramAdmin.module.css';



export default async function AdminArangetramPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';
  const statusFilter = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : '';

  // Find students who have an arangetram status set
  const students = await prisma.studentProfile.findMany({
    where: {
      arangetramStatus: { not: null },
      AND: [
        {
          OR: [
            { displayName: { contains: search } },
            { user: { name: { contains: search } } },
          ]
        },
        statusFilter ? { arangetramStatus: statusFilter } : {}
      ]
    },
    include: {
      user: true,
    },
    orderBy: { user: { name: 'asc' } }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Arangetram Management</h1>
          <p className={styles.pageSubtitle}>Manage students preparing for or who have completed their Arangetram.</p>
        </div>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search students..." 
              defaultValue={search}
              className={styles.searchInput}
            />
          </div>
          
          <select name="status" defaultValue={statusFilter} className={styles.filterSelect} onChange={(e) => e.target.form?.submit()}>
            <option value="">All Statuses</option>
            <option value="Preparing">Preparing</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
          
          <button type="submit" className="btn btn-outline" style={{ padding: '0.6rem 1rem' }}>
            <Filter size={16} /> Filter
          </button>
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Current Level</th>
              <th>Arangetram Status</th>
              <th>Visibility</th>
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
                  <td>
                    <span className={`${styles.statusBadge} ${
                      student.arangetramStatus === 'Completed' ? styles.statusCompleted : 
                      student.arangetramStatus === 'Upcoming' ? styles.statusUpcoming : 
                      styles.statusPreparing
                    }`}>
                      {student.arangetramStatus}
                    </span>
                  </td>
                  <td>
                    <span className={student.isPublic ? styles.visibilityPublic : styles.visibilityPrivate}>
                      {student.isPublic ? 'Public' : 'Private'}
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  No Arangetram candidates found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
