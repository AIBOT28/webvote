'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

export default function TeacherRequestPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    name: '',
    department: '',
    selectedSubjects: [],
    newSubjects: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    api.get('/departments').then(res => setDepartments(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.department) {
      api.get(`/subjects?department=${form.department}`)
        .then(res => setSubjects(res.data.data))
        .catch(() => {});
    } else {
      setSubjects([]);
    }
  }, [form.department]);

  const toggleSubject = (id) => {
    setForm(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(id)
        ? prev.selectedSubjects.filter(sid => sid !== id)
        : [...prev.selectedSubjects, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/teachers/request', {
        name: form.name,
        department: form.department,
        subjects: form.selectedSubjects,
        newSubjects: form.newSubjects
      });
      toast.success('Gửi yêu cầu thành công! Vui lòng chờ admin xét duyệt.');
      router.push('/teachers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ maxWidth: 600, padding: '60px 20px' }}>
      <h1 className="page-title">Yêu cầu thêm giảng viên</h1>
      <p className="page-subtitle" style={{ marginBottom: 32 }}>
        Nếu bạn không tìm thấy giảng viên mình muốn đánh giá, hãy gửi yêu cầu tại đây.
      </p>

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tên giảng viên</label>
          <input
            className="form-input"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            placeholder="Nhập họ và tên giảng viên"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Khoa</label>
          <select
            className="form-select"
            value={form.department}
            onChange={e => setForm({...form, department: e.target.value, selectedSubjects: []})}
            required
          >
            <option value="">-- Chọn khoa --</option>
            {departments.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        {form.department && subjects.length > 0 && (
          <div className="form-group">
            <label className="form-label">Chọn môn học đã có</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 200, overflowY: 'auto', padding: 10, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              {subjects.map(s => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => toggleSubject(s._id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 12,
                    border: '1px solid',
                    cursor: 'pointer',
                    background: form.selectedSubjects.includes(s._id) ? 'var(--primary)' : 'transparent',
                    borderColor: form.selectedSubjects.includes(s._id) ? 'var(--primary)' : 'var(--border)',
                    color: form.selectedSubjects.includes(s._id) ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Môn học mới (nếu không có ở trên)</label>
          <input
            className="form-input"
            value={form.newSubjects}
            onChange={e => setForm({...form, newSubjects: e.target.value})}
            placeholder="VD: Lập trình web, Cơ sở dữ liệu (tách bằng dấu phẩy)"
          />
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Nhập tên các môn học mới, cách nhau bằng dấu phẩy.
          </p>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <button type="button" className="btn btn-secondary" onClick={() => router.back()} style={{ flex: 1 }}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 2 }}>
            {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </div>
      </form>
    </div>
  );
}
