import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import styles from './TestimonialsAdmin.module.css';



export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';

  const testimonials = await prisma.testimonial.findMany({
    where: {
      OR: [
        { name: { contains: search } },
        { content: { contains: search } },
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Testimonials Management</h1>
          <p className={styles.pageSubtitle}>Manage feedback and reviews from students and parents.</p>
        </div>
        <Link href="/admin/testimonials/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Testimonial
        </Link>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search by author or content..." 
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
              <th>Author</th>
              <th>Role</th>
              <th>Testimonial Preview</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length > 0 ? (
              testimonials.map((test) => (
                <tr key={test.id}>
                  <td>
                    <div className={styles.authorInfo}>
                      {test.image ? (
                        <div className={styles.avatar}><img src={test.image} alt={test.name} /></div>
                      ) : (
                        <div className={styles.avatar}>{test.name.charAt(0)}</div>
                      )}
                      <span className={styles.authorName}>{test.name}</span>
                    </div>
                  </td>
                  <td><span className={styles.roleText}>{test.role}</span></td>
                  <td>
                    <div className={styles.contentPreview}>
                      "{test.content.length > 80 ? test.content.substring(0, 80) + '...' : test.content}"
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${test.published ? styles.statusPublished : styles.statusDraft}`}>
                      {test.published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/testimonials/${test.id}/edit`} className={styles.actionBtn} title="Edit">
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
                <td colSpan={5} className={styles.emptyState}>
                  No testimonials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
