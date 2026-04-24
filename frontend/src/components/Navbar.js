'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, updateProfile, canManage } = useAuth();
  const pathname = usePathname();
  const toast = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) setNewName(user.name);
  }, [user, editModal]);

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/teachers', label: 'Giảng viên' },
    { href: '/ranking', label: 'Xếp hạng' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    try {
      await updateProfile({ name: newName });
      toast.success('Đã cập nhật tên tài khoản');
      setEditModal(false);
    } catch (err) {
      toast.error('Lỗi khi cập nhật tên');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>EduRate</span>
        </Link>

        <div className={`${styles.navLinks} ${mobileOpen ? styles.open : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {canManage && (
            <Link
              href="/dashboard"
              className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              Quản trị
            </Link>
          )}
        </div>

        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <div className={styles.userAvatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userInfo}>
                <div className={styles.nameRow}>
                  <span className={styles.userName}>{user.name}</span>
                  <button className={styles.editBtn} onClick={() => setEditModal(true)} title="Đổi tên">
                    [Sửa]
                  </button>
                </div>
                <span className={styles.userRole}>{
                  user.role === 'admin' ? 'Admin' :
                  user.role === 'manager' ? 'Quản trị' : 'Sinh viên'
                }</span>
              </div>
              <button onClick={logout} className={styles.logoutBtn} title="Đăng xuất">
                Thoát
              </button>
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link href="/login" className="btn btn-primary btn-sm">Đăng nhập</Link>
            </div>
          )}
          <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Edit Name Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Đổi tên tài khoản</h3>
              <button className="modal-close" onClick={() => setEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdateName}>
              <div className="form-group">
                <label className="form-label">Tên mới</label>
                <input 
                  className="form-input" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  required 
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? '...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
