import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import styles from './EventsAdmin.module.css';



export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';

  const events = await prisma.event.findMany({
    where: {
      OR: [
        { title: { contains: search } },
        { location: { contains: search } },
      ]
    },
    orderBy: { date: 'desc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Event Management</h1>
          <p className={styles.pageSubtitle}>Manage upcoming and past academy events, performances, and workshops.</p>
        </div>
        <Link href="/admin/events/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Event
        </Link>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search events by title or location..." 
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
              <th>Event Title</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div className={styles.eventTitle}>{event.title}</div>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      <Calendar size={14} /> 
                      {event.date.toLocaleDateString()}
                    </div>
                    {event.time && (
                      <div className={styles.timeInfo}>{event.time}</div>
                    )}
                  </td>
                  <td>
                    <div className={styles.locationInfo}>
                      <MapPin size={14} />
                      {event.location}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.typeBadge}`}>
                      {event.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td>
                    {event.featured ? (
                      <span className={styles.featuredBadge}>⭐ Featured</span>
                    ) : (
                      <span className={styles.unfeaturedText}>-</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/events/${event.id}/edit`} className={styles.actionBtn} title="Edit Event">
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
                  No events found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
