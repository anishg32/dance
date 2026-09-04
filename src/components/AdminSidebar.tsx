"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Star, 
  Calendar, 
  Image as ImageIcon, 
  MessageSquare,
  BookOpen,
  ClipboardList,
  Settings,
  Menu,
  X
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Awards', path: '/admin/awards', icon: Trophy },
    { name: 'Performances', path: '/admin/performances', icon: Star },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Training Programs', path: '/admin/training', icon: BookOpen },
    { name: 'Admissions', path: '/admin/admissions', icon: ClipboardList },
    { name: 'Parents', path: '/admin/parents', icon: Users },
    { name: 'Contact Queries', path: '/admin/contact', icon: MessageSquare },
  ];

  return (
    <>
      <button 
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Admin Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.path}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} className={styles.navIcon} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
