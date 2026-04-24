'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  const { user, loading, canManage } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !canManage) {
      router.push('/');
    }
  }, [loading, canManage, router]);

  if (loading) return <div className="loading-page"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;
  if (!canManage) return null;

  const sideLinks = [
    { href: '/dashboard', label: 'Tổng quan' },
    { href: '/dashboard/departments', label: 'Khoa' },
    { href: '/dashboard/subjects', label: 'Môn học' },
    { href: '/dashboard/teachers', label: 'Giảng viên' },
    { href: '/dashboard/requests', label: 'Yêu cầu (GV)' },
    { href: '/dashboard/flagged', label: 'Bị gắn cờ' },
    { href: '/dashboard/reviews', label: 'Review' },
  ];

  if (user?.role === 'admin') {
    sideLinks.push({ href: '/dashboard/users', label: 'Người dùng' });
  }

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Quản trị</h2>
          <span className={styles.sidebarRole}>
            {user?.role === 'admin' ? 'Admin' : 'Quản trị viên'}
          </span>
        </div>
        <nav className={styles.sideNav}>
          {sideLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.sideLink} ${isActive(link.href) ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
