'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function DashUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const fetchData = () => {
    const params = {};
    if (search) params.search = search;
    api.get('/users', { params }).then(res => setUsers(res.data.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, [search]);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      toast.success('Đã cập nhật quyền');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa user này?')) return;
    try { await api.delete(`/users/${id}`); toast.success('Đã xóa'); fetchData(); }
    catch { toast.error('Không thể xóa'); }
  };

  const roleBadge = (role) => {
    const map = { admin: 'badge-danger', manager: 'badge-warning', student: 'badge-primary' };
    const labels = { admin: 'Admin', manager: 'Quản trị viên', student: 'Sinh viên' };
    return <span className={`badge ${map[role]}`}>{labels[role]}</span>;
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Quản lý Người dùng</h1>
      <input className="form-input" placeholder="Tìm theo tên hoặc email..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320, marginBottom: 20 }} />

      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Tên</th><th>Email</th><th>Role</th><th>Thao tác</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td><strong>{u.name}</strong></td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td>{roleBadge(u.role)}</td>
                <td>
                  {u.role !== 'admin' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      {u.role === 'student' && <button className="btn btn-success btn-sm" onClick={() => handleRoleChange(u._id, 'manager')}>Lên QTV</button>}
                      {u.role === 'manager' && <button className="btn btn-secondary btn-sm" onClick={() => handleRoleChange(u._id, 'student')}>Xuống SV</button>}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Xóa</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
