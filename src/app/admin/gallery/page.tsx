import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import styles from './GalleryAdmin.module.css';



export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';
  const categoryFilter = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : '';

  const items = await prisma.galleryItem.findMany({
    where: {
      OR: [
        { title: { contains: search } },
      ],
      ...(categoryFilter ? { category: categoryFilter } : {})
    },
    orderBy: { year: 'desc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gallery Management</h1>
          <p className={styles.pageSubtitle}>Manage and organize academy photos for the public gallery.</p>
        </div>
        <Link href="/admin/gallery/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Upload Image
        </Link>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search by title..." 
              defaultValue={search}
              className={styles.searchInput}
            />
          </div>
          
          <select name="category" defaultValue={categoryFilter} className={styles.filterSelect} onChange={(e) => e.target.form?.submit()}>
            <option value="">All Categories</option>
            <option value="Performances">Performances</option>
            <option value="Awards">Awards</option>
            <option value="Students">Students</option>
            <option value="Arangetram">Arangetram</option>
            <option value="Events">Events</option>
            <option value="Workshops">Workshops</option>
            <option value="Academy">Academy</option>
          </select>
          
          <button type="submit" className="btn btn-outline" style={{ padding: '0.6rem 1rem' }}>Filter</button>
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Details</th>
              <th>Category</th>
              <th>Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.imagePreview}>
                      {item.url ? (
                        <img src={item.url || undefined} alt={item.title || 'Image'} />
                      ) : (
                        <ImageIcon size={24} className={styles.placeholderIcon} />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.itemTitle}>{item.title}</div>
                    {item.event && <div className={styles.itemMeta}>Linked to Event</div>}
                  </td>
                  <td>
                    <span className={styles.categoryBadge}>{item.category}</span>
                  </td>
                  <td>{item.year}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${item.published ? styles.statusPublished : styles.statusDraft}`}>
                      {item.published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/gallery/${item.id}/edit`} className={styles.actionBtn} title="Edit Image">
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
                  No images found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
