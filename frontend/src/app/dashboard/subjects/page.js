'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function DashSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', department: '', description: '' });
  const toast = useToast();

  const fetchData = () => {
    Promise.all([api.get('/subjects'), api.get('/departments')])
      .then(([sRes, dRes]) => { setSubjects(sRes.data.data); setDepartments(dRes.data.data); })
      .catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', code: '', department: '', description: '' }); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, code: s.code, department: s.department?._id || '', description: s.description || '' }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/subjects/${editing._id}`, form); toast.success('Đã cập nhật'); }
      else { await api.post('/subjects', form); toast.success('Đã thêm'); }
      setModal(false); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa môn học này?')) return;
    try { await api.delete(`/subjects/${id}`); toast.success('Đã xóa'); fetchData(); }
    catch { toast.error('Không thể xóa'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title">Quản lý Môn học</h1>
        <button className="btn btn-primary" onClick={openCreate}>Thêm môn học</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Mã</th><th>Tên môn</th><th>Khoa</th><th>Thao tác</th></tr></thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s._id}>
                <td><span className="badge badge-primary">{s.code}</span></td>
                <td><strong>{s.name}</strong></td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.department?.name}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Xóa</button>
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
              <h3 className="modal-title">{editing ? 'Sửa môn học' : 'Thêm môn học'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Mã môn học</label>
                <input className="form-input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required placeholder="VD: CS101" />
              </div>
              <div className="form-group">
                <label className="form-label">Tên môn</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Khoa</label>
                <select className="form-select" value={form.department} onChange={e => setForm({...form, department: e.target.value})} required>
                  <option value="">-- Chọn khoa --</option>
                  {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
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
