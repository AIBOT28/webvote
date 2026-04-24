'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import TeacherCard from '@/components/TeacherCard';
import styles from './page.module.css';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [sort, setSort] = useState('-averageRating');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const toast = useToast();

  useEffect(() => {
    api.get('/departments').then(res => setDepartments(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (search) params.search = search;
        if (department) params.department = department;
        const res = await api.get('/teachers', { params });
        console.log('Teachers API Response:', res.data);
        setTeachers(res.data?.data || []);
        setPagination(res.data?.pagination || {});
      } catch (err) {
        console.error('Fetch Teachers Error:', err);
        toast.error('Không thể tải danh sách giảng viên');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [search, department, sort, page]);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 className="page-title">Danh sách giảng viên</h1>
          <p className="page-subtitle">Tìm kiếm, review giảng viên theo khoa hoặc xếp hạng</p>
        </div>
        <Link href="/teachers/request" className="btn btn-secondary">
          Yêu cầu thêm giảng viên
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          className="form-input"
          placeholder="Tìm kiếm giảng viên..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ maxWidth: 320 }}
        />
        <select className="form-select" value={department} onChange={e => { setDepartment(e.target.value); setPage(1); }} style={{ maxWidth: 220 }}>
          <option value="">Tất cả khoa</option>
          {departments.map(d => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <select className="form-select" value={sort} onChange={e => setSort(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="-averageRating">Review cao nhất</option>
          <option value="averageRating">Review thấp nhất</option>
          <option value="-createdAt">Mới nhất</option>
          <option value="-totalReviews">Nhiều review nhất</option>
          <option value="name">Tên A-Z</option>
          <option value="-name">Tên Z-A</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="loading-page"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>
      ) : teachers.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">Không tìm thấy giảng viên nào</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {teachers.map(t => (
              <TeacherCard key={t._id} teacher={t} />
            ))}
          </div>
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Trước</button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`pagination-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages}>Sau</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
