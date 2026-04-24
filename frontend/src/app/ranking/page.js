'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import TeacherCard from '@/components/TeacherCard';
import styles from './page.module.css';

export default function RankingPage() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/departments').then(res => setDepartments(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const params = { limit: 50 };
        if (selectedDept) params.department = selectedDept;
        const res = await api.get('/stats/ranking', { params });
        setTeachers(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [selectedDept]);

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="page-header">
        <h1 className="page-title">Bảng xếp hạng</h1>
        <p className="page-subtitle">Xếp hạng dựa trên review trung bình của sinh viên</p>
      </div>

      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${!selectedDept ? styles.active : ''}`} onClick={() => setSelectedDept('')}>
          Toàn trường
        </button>
        {departments.map(d => (
          <button
            key={d._id}
            className={`${styles.filterBtn} ${selectedDept === d._id ? styles.active : ''}`}
            onClick={() => setSelectedDept(d._id)}
          >
            {d.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>
      ) : teachers.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">Chưa có đủ dữ liệu để xếp hạng</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {teachers.map((t, idx) => (
            <TeacherCard key={t._id} teacher={t} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
