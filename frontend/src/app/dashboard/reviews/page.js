'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import StarRating from '@/components/StarRating';

export default function DashReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const toast = useToast();

  const fetchData = () => {
    api.get(`/reviews?page=${page}&limit=20&all=true`)
      .then(res => { setReviews(res.data.data); setPagination(res.data.pagination); })
      .catch(() => {});
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Xóa review này?')) return;
    try { await api.delete(`/reviews/${id}`); toast.success('Đã xóa'); fetchData(); }
    catch { toast.error('Không thể xóa'); }
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Quản lý Review</h1>

      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Sinh viên</th><th>Giảng viên</th><th>Điểm</th><th>Nhận xét</th><th>Trạng thái</th><th>Ngày</th><th></th></tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id}>
                <td>{r.student?.name}</td>
                <td><strong>{r.teacher?.name}</strong></td>
                <td><StarRating rating={r.rating} size={14} showValue={true} /></td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{r.comment || '—'}</td>
                <td>
                  <span className={`badge ${r.status === 'flagged' ? 'badge-danger' : 'badge-success'}`}>
                    {r.status === 'flagged' ? 'Bị gắn cờ' : 'Đã duyệt'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>Xóa</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Trước</button>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Trang {page}/{pagination.pages}</span>
          <button className="pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages}>Sau</button>
        </div>
      )}
    </div>
  );
}
