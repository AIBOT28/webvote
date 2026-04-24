'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import styles from './page.module.css';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [topTeachers, setTopTeachers] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/stats/overview'),
      api.get('/stats/ranking?limit=5')
    ]).then(([statsRes, rankRes]) => {
      setStats(statsRes.data.data);
      setTopTeachers(rankRes.data.data);
    }).catch(() => {});
  }, []);

  if (!stats) return <div className="loading-page"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;

  const cards = [
    { value: stats.departments, label: 'Khoa', color: '#6366f1' },
    { value: stats.subjects, label: 'Môn học', color: '#06b6d4' },
    { value: stats.teachers, label: 'Giảng viên', color: '#10b981' },
    { value: stats.students, label: 'Sinh viên', color: '#f59e0b' },
    { value: stats.reviews, label: 'Review', color: '#ef4444' },
  ];

  return (
    <div>
      <h1 className="page-title">Tổng quan</h1>
      <p className="page-subtitle" style={{ marginBottom: 28 }}>Thống kê hệ thống review giảng viên</p>

      <div className={styles.statsGrid}>
        {cards.map((c, i) => (
          <div key={i} className={styles.statCard}>
            <div>
              <div className={styles.statValue} style={{ color: c.color }}>{c.value}</div>
              <div className={styles.statLabel}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {topTeachers.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Xếp hạng giảng viên</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Giảng viên</th>
                  <th>Khoa</th>
                  <th>Điểm</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {topTeachers.map((t, idx) => (
                  <tr key={t._id}>
                    <td><strong>{idx + 1}</strong></td>
                    <td>{t.name}</td>
                    <td>{t.department?.name}</td>
                    <td><span style={{ fontWeight: 700 }}>{t.averageRating}</span></td>
                    <td>{t.totalReviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
