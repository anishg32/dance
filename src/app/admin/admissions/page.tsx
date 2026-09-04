import prisma from "@/lib/prisma";
import { Search, Eye, Filter } from 'lucide-react';
import styles from './AdmissionsAdmin.module.css';



export default async function AdminAdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';
  const statusFilter = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : '';

  const admissions = await prisma.admission.findMany({
    where: {
      OR: [
        { studentName: { contains: search } },
        { parentName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ],
      ...(statusFilter ? { status: statusFilter } : {})
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Admissions Management</h1>
          <p className={styles.pageSubtitle}>Review and manage incoming student enquiries.</p>
        </div>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search by name, email, or phone..." 
              defaultValue={search}
              className={styles.searchInput}
            />
          </div>
          
          <select name="status" defaultValue={statusFilter} className={styles.filterSelect} onChange={(e) => e.target.form?.submit()}>
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Rejected">Rejected</option>
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
              <th>Student Name</th>
              <th>Parent / Guardian</th>
              <th>Contact Info</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.length > 0 ? (
              admissions.map((admission) => (
                <tr key={admission.id} className={admission.status === 'New' ? styles.rowNew : ''}>
                  <td>
                    <div className={styles.dateInfo}>
                      {admission.createdAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className={styles.studentName}>{admission.studentName}</div>
                    <div className={styles.metaInfo}>Age: {admission.age} | Level: {admission.preferredLevel}</div>
                  </td>
                  <td>
                    <div className={styles.parentName}>{admission.parentName || '-'}</div>
                  </td>
                  <td>
                    <div className={styles.contactInfo}>
                      <a href={`mailto:${admission.email}`} className={styles.link}>{admission.email}</a>
                      <a href={`tel:${admission.phone}`} className={styles.link}>{admission.phone}</a>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${
                      admission.status === 'New' ? styles.statusNew :
                      admission.status === 'Contacted' ? styles.statusContacted :
                      admission.status === 'Enrolled' ? styles.statusEnrolled :
                      styles.statusRejected
                    }`}>
                      {admission.status}
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
                  No admissions found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
