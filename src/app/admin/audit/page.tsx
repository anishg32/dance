import prisma from "@/lib/prisma";
import { Search, Filter, ShieldAlert } from 'lucide-react';
import styles from './AuditAdmin.module.css';



export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';

  const logs = await prisma.auditLog.findMany({
    where: {
      OR: [
        { action: { contains: search } },
        { actorName: { contains: search } },
        { targetType: { contains: search } },
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 100 // Limit to recent 100 for performance in this view
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ShieldAlert size={28} style={{ color: '#1565C0' }} />
            Security Audit Log
          </h1>
          <p className={styles.pageSubtitle}>Track administrative actions and system modifications.</p>
        </div>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search actions, actors, or targets..." 
              defaultValue={search}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className="btn btn-outline" style={{ padding: '0.6rem 1rem' }}>
            <Filter size={16} style={{ marginRight: '0.4rem', display: 'inline' }} /> Filter
          </button>
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div className={styles.timestamp}>
                      <div className={styles.date}>{log.createdAt.toLocaleDateString()}</div>
                      <div className={styles.time}>{log.createdAt.toLocaleTimeString()}</div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actor}>
                      <span className={styles.actorName}>{log.actorName || 'Unknown'}</span>
                      <span className={styles.actorRole}>{log.actorRole}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.actionBadge}>{log.action}</span>
                  </td>
                  <td>
                    <div className={styles.target}>
                      <span className={styles.targetType}>{log.targetType}</span>
                      {log.targetId && <span className={styles.targetId}>ID: {log.targetId.substring(0, 8)}...</span>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.details}>{log.details || '-'}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  No audit logs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
