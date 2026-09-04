import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, Calendar, Users, MapPin } from 'lucide-react';
import styles from './PerformancesAdmin.module.css';



export default async function AdminPerformancesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';

  const performances = await prisma.performance.findMany({
    where: {
      OR: [
        { title: { contains: search } },
        { location: { contains: search } },
        { type: { contains: search } },
      ]
    },
    include: {
      _count: {
        select: { students: true }
      }
    },
    orderBy: { date: 'desc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Performance Management</h1>
          <p className={styles.pageSubtitle}>Manage academy performances and track participating students.</p>
        </div>
        <Link href="/admin/performances/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Performance
        </Link>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search by title, location, or type..." 
              defaultValue={search}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className="btn btn-outline" style={{ padding: '0.6rem 1rem' }}>Filter</button>
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Performance</th>
              <th>Date & Location</th>
              <th>Participants</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {performances.length > 0 ? (
              performances.map((perf) => (
                <tr key={perf.id}>
                  <td>
                    <div className={styles.perfTitle}>{perf.title}</div>
                    <div className={styles.perfType}>{perf.type}</div>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      <Calendar size={14} /> 
                      {perf.date.toLocaleDateString()}
                    </div>
                    {perf.location && (
                      <div className={styles.locationInfo}>
                        <MapPin size={14} />
                        {perf.location}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className={styles.participantsInfo}>
                      <Users size={14} />
                      {perf._count.students} Students
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${perf.featured ? styles.statusPublished : styles.statusDraft}`}>
                      {perf.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td>
                    {perf.featured ? (
                      <span className={styles.featuredBadge}>⭐ Featured</span>
                    ) : (
                      <span className={styles.unfeaturedText}>-</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/performances/${perf.id}/edit`} className={styles.actionBtn} title="Edit Performance">
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
                  No performances found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
