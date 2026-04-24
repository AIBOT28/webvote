'use client';
import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import StarRating from '@/components/StarRating';
import styles from './page.module.css';

export default function TeacherDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const toast = useToast();
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [teacherRes, reviewsRes, statsRes] = await Promise.all([
        api.get(`/teachers/${id}`),
        api.get(`/reviews?teacher=${id}&limit=50`),
        api.get(`/stats/teacher/${id}`)
      ]);
      setTeacher(teacherRes.data.data);
      setReviews(reviewsRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Vui lòng chọn mức điểm'); return; }
    setSubmitting(true);
    try {
      await api.post('/reviews', { teacher: id, rating, comment });
      toast.success('Đánh giá thành công!');
      setRating(0); setComment('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Đã xóa đánh giá');
      fetchData();
    } catch (err) {
      toast.error('Không thể xóa đánh giá');
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" style={{ width: 40, height: 40 }}></div></div>;
  if (!teacher) return <div className="empty-state"><p className="empty-state-text">Không tìm thấy giảng viên</p></div>;

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Teacher Info */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          {teacher.avatar ? <img src={teacher.avatar} alt={teacher.name} /> : <span>{teacher.name?.charAt(0)}</span>}
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>{teacher.name}</h1>
          <p className={styles.dept}>{teacher.department?.name}</p>
          <div className={styles.ratingRow}>
            <StarRating rating={teacher.averageRating} size={20} totalReviews={teacher.totalReviews} />
          </div>
          {teacher.subjects?.length > 0 && (
            <div className={styles.tags}>
              {teacher.subjects.map(s => (
                <span key={s._id} className={styles.tag}>{s.name} ({s.code})</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {/* Rating Distribution */}
        {stats && (
          <div className={styles.sidebar}>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Phân bổ</h3>
              {stats.distribution?.map(d => (
                <div key={d.rating} className={styles.distRow}>
                  <span className={styles.distLabel}>{d.rating} điểm</span>
                  <div className={styles.distBar}>
                    <div className={styles.distFill} style={{ width: `${teacher.totalReviews ? (d.count / teacher.totalReviews) * 100 : 0}%` }}></div>
                  </div>
                  <span className={styles.distCount}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.main}>
          {/* Review Form */}
          {user && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Viết đánh giá</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label className="form-label">Chọn mức điểm (1-5)</label>
                  <StarRating rating={rating} onRate={setRating} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nhận xét</label>
                  <textarea className="form-textarea" value={comment} onChange={e => setComment(e.target.value)} placeholder="Chia sẻ trải nghiệm..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <span className="spinner"></span> : 'Gửi'}
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Danh sách đánh giá ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <div className="empty-state"><p className="empty-state-text">Chưa có đánh giá nào</p></div>
          ) : (
            reviews.map(r => (
              <div key={r._id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUser}>
                    <div className={styles.reviewAvatar}>{r.student?.name?.charAt(0)}</div>
                    <div>
                      <div className={styles.reviewName}>{r.student?.name}</div>
                      <div className={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating rating={r.rating} size={14} showValue={true} />
                    {user && (r.student?._id === user._id || ['admin', 'manager'].includes(user.role)) && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(r._id)}>Xóa</button>
                    )}
                  </div>
                </div>
                {r.comment && <p className={styles.reviewComment}>{r.comment}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
