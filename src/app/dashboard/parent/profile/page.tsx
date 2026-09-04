import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import Link from 'next/link';
import { ArrowLeft, User, Lock, Save } from 'lucide-react';
import { changePassword } from '../../profile/actions';
import { updateParentProfile } from './actions';
import styles from '../../profile/Profile.module.css'; // Re-use styles from student profile



export default async function ParentProfileSettings() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'PARENT') {
    redirect('/dashboard');
  }

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { parentProfile: true }
  });

  if (!user || !user.parentProfile) {
    redirect('/dashboard/parent');
  }

  return (
    <div className={styles.pageContainer}>
      <div className="container" style={{ padding: '2rem 0' }}>
        <Link href="/dashboard/parent" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Parent Portal
        </Link>

        <h1 className={styles.pageTitle}>Parent Settings</h1>

        <div className={styles.settingsGrid}>
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <User size={20} className={styles.headerIcon} />
              <h2>Account Details</h2>
            </div>
            
            <form action={updateParentProfile} className={styles.form}>
              <input type="hidden" name="userId" value={userId} />
              
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={user.name || ''} 
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={user.email || ''} 
                  className="form-control"
                  readOnly
                  disabled
                />
                <small>Contact administration to change your email address.</small>
              </div>

              <div className={styles.lockedFields}>
                <h4>Linked Students</h4>
                <p>You cannot modify student links here. Contact admin to link new students.</p>
              </div>

              <button type="submit" className="btn btn-primary">
                <Save size={16} style={{ marginRight: '0.5rem', display: 'inline' }} /> Save Changes
              </button>
            </form>
          </div>

          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <Lock size={20} className={styles.headerIcon} />
              <h2>Security</h2>
            </div>
            
            <form action={changePassword} className={styles.form}>
              <input type="hidden" name="userId" value={userId} />
              
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" name="currentPassword" required className="form-control" />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" name="newPassword" required className="form-control" minLength={8} />
                <small>Must be at least 8 characters long.</small>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" name="confirmPassword" required className="form-control" minLength={8} />
              </div>

              <button type="submit" className="btn btn-outline" style={{ borderColor: '#C62828', color: '#C62828' }}>
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
