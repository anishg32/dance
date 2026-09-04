import prisma from "@/lib/prisma";
import { Search, Eye, Filter } from 'lucide-react';
import styles from './ContactAdmin.module.css';

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';
  const statusFilter = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : '';

  const messages = await prisma.contactMessage.findMany({
    where: {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { subject: { contains: search } },
      ],
      ...(statusFilter ? { status: statusFilter } : {})
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Contact Messages</h1>
          <p className={styles.pageSubtitle}>Review and manage incoming contact queries.</p>
        </div>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search by name, email, or subject..." 
              defaultValue={search}
              className={styles.searchInput}
            />
          </div>
          
          <select name="status" defaultValue={statusFilter} className={styles.filterSelect} onChange={(e) => e.target.form?.submit()}>
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Replied">Replied</option>
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
              <th>Date</th>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((message) => (
                <tr key={message.id} className={message.status === 'New' ? styles.rowNew : ''}>
                  <td>
                    <div className={styles.dateInfo}>
                      {message.createdAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className={styles.studentName}>{message.name}</div>
                  </td>
                  <td>
                    <div className={styles.contactInfo}>
                      <a href={`mailto:${message.email}`} className={styles.link}>{message.email}</a>
                      {message.phone && <a href={`tel:${message.phone}`} className={styles.link}>{message.phone}</a>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.metaInfo}>{message.subject || 'No Subject'}</div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${
                      message.status === 'New' ? styles.statusNew :
                      message.status === 'Read' ? styles.statusContacted :
                      styles.statusEnrolled
                    }`}>
                      {message.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.actionBtn} title="View Details">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  No messages found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
