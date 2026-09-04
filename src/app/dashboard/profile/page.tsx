import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import Link from 'next/link';
import { ArrowLeft, User, Lock, Save } from 'lucide-react';
import { updateStudentProfile, changePassword } from './actions';
import styles from './Profile.module.css';



export default async function StudentProfileSettings() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'STUDENT') {
    redirect('/dashboard');
  }

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { studentProfile: true }
  });

  if (!user || !user.studentProfile) {
    redirect('/dashboard');
  }

  return (
    <div className={styles.pageContainer}>
      <div className="container" style={{ padding: '2rem 0' }}>
        <Link href="/dashboard" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className={styles.pageTitle}>Profile Settings</h1>

        <div className={styles.settingsGrid}>
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <User size={20} className={styles.headerIcon} />
              <h2>Public Profile</h2>
            </div>
            
            <form action={updateStudentProfile} className={styles.form}>
              <input type="hidden" name="userId" value={userId} />
              
              <div className="form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  name="displayName" 
                  defaultValue={user.studentProfile.displayName || user.name || ''} 
                  className="form-control"
                  placeholder="How you appear on the public directory"
                />
                <small>Leave blank to use your real name.</small>
              </div>

              <div className="form-group">
                <label>Biography</label>
                <textarea 
                  name="bio" 
                  defaultValue={user.studentProfile.bio || ''} 
                  className="form-control"
                  rows={4}
                  placeholder="Tell us about your dance journey..."
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  name="isPublic" 
                  id="isPublic" 
                  defaultChecked={user.studentProfile.isPublic}
                />
                <label htmlFor="isPublic" style={{ margin: 0, fontWeight: 'normal' }}>
                  Make my profile visible on the public directory
                </label>
              </div>

              <div className={styles.lockedFields}>
                <h4>Locked Fields</h4>
                <p>The following fields can only be modified by administrators:</p>
                <ul>
                  <li>Training Level: <strong>{user.studentProfile.level}</strong></li>
                  <li>Achievement Points: <strong>{user.studentProfile.achievementPoints}</strong></li>
                  <li>Current Rank: <strong>#{user.studentProfile.currentRank || '-'}</strong></li>
                </ul>
              </div>

              <button type="submit" className="btn btn-primary">
                <Save size={16} style={{ marginRight: '0.5rem', display: 'inline' }} /> Save Profile
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
