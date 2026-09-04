import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import styles from './ParentsAdmin.module.css';



export default async function AdminParentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';

  const parents = await prisma.user.findMany({
    where: {
      role: 'PARENT',
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    },
    include: {
      parentProfile: {
        include: {
          students: {
            include: { student: { include: { user: true } } }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Parents Management</h1>
          <p className={styles.pageSubtitle}>Manage parent accounts and their linked student profiles.</p>
        </div>
        <Link href="/admin/parents/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Parent
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
          <button type="submit" className="btn btn-outline" style={{ padding: '0.6rem 1rem' }}>Search</button>
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Parent Name</th>
              <th>Email</th>
              <th>Linked Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parents.length > 0 ? (
              parents.map((parent) => (
                <tr key={parent.id}>
                  <td>
                    <div className={styles.parentName}>{parent.name || 'Unnamed Parent'}</div>
                  </td>
                  <td>{parent.email}</td>
                  <td>
                    <div className={styles.linkedStudents}>
                      {parent.parentProfile?.students && parent.parentProfile.students.length > 0 ? (
                        parent.parentProfile.students.map(ps => (
                          <span key={ps.studentId} className={styles.studentBadge}>
                            {ps.student.displayName || ps.student.user.name}
                          </span>
                        ))
                      ) : (
                        <span className={styles.noStudents}>No students linked</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/parents/${parent.id}/link`} className={styles.actionBtn} title="Link Students">
                        <LinkIcon size={18} />
                      </Link>
                      <Link href={`/admin/parents/${parent.id}/edit`} className={styles.actionBtn} title="Edit">
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
                <td colSpan={4} className={styles.emptyState}>
                  No parent accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
