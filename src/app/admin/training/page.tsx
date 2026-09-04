import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import styles from './TrainingAdmin.module.css';



export default async function AdminTrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';

  const programs = await prisma.trainingProgram.findMany({
    where: {
      OR: [
        { level: { contains: search } },
        { focus: { contains: search } },
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Training Programs</h1>
          <p className={styles.pageSubtitle}>Manage the academy's curriculum and level structures.</p>
        </div>
        <Link href="/admin/training/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Program
        </Link>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search programs..." 
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
              <th>Program Name</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Age Group</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length > 0 ? (
              programs.map((prog) => (
                <tr key={prog.id}>
                  <td><div className={styles.progName}>{prog.level}</div></td>
                  <td>
                    <div className={styles.progDesc}>
                      {prog.focus.length > 60 ? prog.focus.substring(0, 60) + '...' : prog.focus}
                    </div>
                  </td>
                  <td>{prog.duration}</td>
                  <td>{prog.ageGroup}</td>
                  <td>
                    <span className={`${styles.statusBadge} styles.statusPublished`}>
                      Active
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/training/${prog.id}/edit`} className={styles.actionBtn} title="Edit">
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
                <td colSpan={6} className={styles.emptyState}>
                  No training programs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
