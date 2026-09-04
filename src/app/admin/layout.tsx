import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import styles from "./Admin.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar />
      <main className={styles.adminMain}>
        <div className={styles.adminContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
