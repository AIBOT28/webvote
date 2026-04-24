'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import StarRating from '@/components/StarRating';

export default function DashTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', department: '', subjects: [] });
  const toast = useToast();

  const fetchData = () => {
    Promise.all([api.get('/teachers?limit=100&status=active,pending'), api.get('/departments'), api.get('/subjects')])
      .then(([tRes, dRes, sRes]) => {
        setTeachers(tRes.data.data);
        setDepartments(dRes.data.data);
        setSubjects(sRes.data.data);
      }).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', department: '', subjects: [] }); setModal(true); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({ name: t.name, department: t.department?._id || '', subjects: t.subjects?.map(s => s._id) || [] });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/teachers/${editing._id}`, form); toast.success('Đã cập nhật'); }
      else { await api.post('/teachers', { ...form, status: 'active' }); toast.success('Đã thêm'); }
      setModal(false); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa giảng viên này?')) return;
    try { await api.delete(`/teachers/${id}`); toast.success('Đã xóa'); fetchData(); }
    catch { toast.error('Không thể xóa'); }
  };

  const toggleSubject = (subId) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subId) ? prev.subjects.filter(id => id !== subId) : [...prev.subjects, subId]
    }));
  };

  const filteredSubjects = subjects.filter(s => !form.department || s.department?._id === form.department);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title">Quản lý Giảng viên</h1>
        <button className="btn btn-primary" onClick={openCreate}>Thêm giảng viên</button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Tên</th><th>Khoa</th><th>Rating</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t._id}>
                <td><strong>{t.name}</strong></td>
                <td style={{ color: 'var(--text-secondary)' }}>{t.department?.name}</td>
                <td><StarRating rating={t.averageRating} size={14} showValue={true} /></td>
                <td>
                  <span className={`badge ${t.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                    {t.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}>Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Sửa giảng viên' : 'Thêm giảng viên'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Khoa</label>
                <select className="form-select" value={form.department} onChange={e => setForm({...form, department: e.target.value, subjects: []})} required>
                  <option value="">-- Chọn khoa --</option>
                  {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              {form.department && filteredSubjects.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Môn giảng dạy</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {filteredSubjects.map(s => (
                      <button key={s._id} type="button" onClick={() => toggleSubject(s._id)}
                        style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, border: '1px solid', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          background: form.subjects.includes(s._id) ? 'var(--primary)' : 'var(--bg-tertiary)',
                          borderColor: form.subjects.includes(s._id) ? 'var(--primary)' : 'var(--border)',
                          color: form.subjects.includes(s._id) ? 'white' : 'var(--text-secondary)'
                        }}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
