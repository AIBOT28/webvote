'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function DashRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchData = () => {
    api.get('/teachers?status=pending')
      .then(res => { setRequests(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/teachers/${id}`, { status: 'active' });
        toast.success('Đã duyệt giảng viên');
      } else {
        await api.delete(`/teachers/${id}`);
        toast.success('Đã từ chối và xóa yêu cầu');
      }
      fetchData();
    } catch (err) {
      toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Yêu cầu thêm giảng viên</h1>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Giảng viên</th>
              <th>Khoa</th>
              <th>Môn học</th>
              <th>Người yêu cầu</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r._id}>
                <td><strong>{r.name}</strong></td>
                <td>{r.department?.name}</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {r.subjects?.map(s => (
                      <span key={s._id} style={{ fontSize: 11, background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 4 }}>{s.name}</span>
                    ))}
                  </div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.requestedBy?.name || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-success btn-sm" onClick={() => handleAction(r._id, 'approve')}>Duyệt</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleAction(r._id, 'reject')}>Từ chối</button>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && !loading && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Không có yêu cầu nào đang chờ</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
