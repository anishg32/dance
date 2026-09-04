import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import VerifyButton from './VerifyButton';
import styles from './AwardsAdmin.module.css';



export default async function AdminAwardsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';
  const verifiedFilter = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : '';

  const awards = await prisma.award.findMany({
    where: {
      AND: [
        {
          OR: [
            { title: { contains: search } },
            { competition: { contains: search } },
            { student: { displayName: { contains: search } } },
          ]
        },
        verifiedFilter === 'verified' ? { verified: true } : verifiedFilter === 'unverified' ? { verified: false } : {}
      ]
    },
    include: {
      student: {
        include: { user: true }
      }
    },
    orderBy: { year: 'desc' }
  });

  return (
    <div className={styles.adminPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Awards Management</h1>
          <p className={styles.pageSubtitle}>Verify awards to automatically calculate student ranking points.</p>
        </div>
        <Link href="/admin/awards/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Award
        </Link>
      </div>

      <div className={styles.controlsBar}>
        <form className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              name="search" 
              placeholder="Search awards, competitions, or students..." 
              defaultValue={search}
              className={styles.searchInput}
            />
          </div>
          
          <select name="status" defaultValue={verifiedFilter} className={styles.filterSelect} onChange={(e) => e.target.form?.submit()}>
            <option value="">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          
          <button type="submit" className="btn btn-outline" style={{ padding: '0.6rem 1rem' }}>Filter</button>
        </form>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Award details</th>
              <th>Student</th>
              <th>Year</th>
              <th>Position</th>
              <th>Level</th>
              <th>Verification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {awards.length > 0 ? (
              awards.map((award) => (
                <tr key={award.id}>
                  <td>
                    <div className={styles.awardTitle}>{award.title}</div>
                    <div className={styles.awardComp}>{award.competition}</div>
                  </td>
                  <td>
                    <div className={styles.studentInfo}>
                      <div className={styles.avatar}>
                        {award.student.user.image ? (
                          <img src={award.student.user.image} alt={award.student.displayName || ''} />
                        ) : (
                          (award.student.displayName || award.student.user.name || 'S').charAt(0)
                        )}
                      </div>
                      <span>{award.student.displayName || award.student.user.name}</span>
                    </div>
                  </td>
                  <td>{award.year}</td>
                  <td><span className={styles.positionBadge}>{award.position}</span></td>
                  <td>{award.competitionLevel}</td>
                  <td>
                    <VerifyButton awardId={award.id} isVerified={award.verified} />
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/awards/${award.id}/edit`} className={styles.actionBtn} title="Edit Award">
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
                <td colSpan={7} className={styles.emptyState}>
                  No awards found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
