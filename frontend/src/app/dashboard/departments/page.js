'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function DashDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const toast = useToast();

  const fetchData = () => {
    api.get('/departments').then(res => { setDepartments(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '' }); setModal(true); };
  const openEdit = (d) => { setEditing(d); setForm({ name: d.name, description: d.description || '' }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/departments/${editing._id}`, form);
        toast.success('Đã cập nhật khoa');
      } else {
        await api.post('/departments', form);
        toast.success('Đã thêm khoa');
      }
      setModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa khoa này?')) return;
    try {
      await api.delete(`/departments/${id}`);
      toast.success('Đã xóa khoa');
      fetchData();
    } catch (err) {
      toast.error('Không thể xóa');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title">Quản lý Khoa</h1>
        <button className="btn btn-primary" onClick={openCreate}>Thêm khoa</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr><th>Tên khoa</th><th>Mô tả</th><th>GV</th><th>Môn</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {departments.map(d => (
              <tr key={d._id}>
                <td><strong>{d.name}</strong></td>
                <td style={{ color: 'var(--text-secondary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.description}</td>
                <td>{d.teacherCount || 0}</td>
                <td>{d.subjectCount || 0}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}>Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d._id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Sửa khoa' : 'Thêm khoa'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên khoa</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
