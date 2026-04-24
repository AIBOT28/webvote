'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function DashFlaggedPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchData = () => {
    api.get('/reviews?status=flagged')
      .then(res => { setReviews(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/reviews/${id}`, { status: 'approved' });
        toast.success('Đã duyệt review');
      } else {
        await api.delete(`/reviews/${id}`);
        toast.success('Đã xóa review vi phạm');
      }
      fetchData();
    } catch (err) {
      toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Review bị gắn cờ</h1>
      <p className="page-subtitle" style={{ marginBottom: 28 }}>Hệ thống AI phát hiện các từ ngữ nhạy cảm cần admin xem xét.</p>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Sinh viên</th>
              <th>Giảng viên</th>
              <th>Nội dung bị gắn cờ</th>
              <th>Từ khóa vi phạm</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id}>
                <td>{r.student?.name}</td>
                <td><strong>{r.teacher?.name}</strong></td>
                <td>
                  <div style={{ maxWidth: 300, whiteSpace: 'normal', fontSize: 13, color: 'var(--text-secondary)' }}>
                    {r.comment}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {r.flaggedKeywords?.map((k, i) => (
                      <span key={i} style={{ fontSize: 11, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(239, 68, 68, 0.2)' }}>{k}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-success btn-sm" onClick={() => handleAction(r._id, 'approve')}>Duyệt</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleAction(r._id, 'reject')}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && !loading && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Không có review nào bị gắn cờ</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
