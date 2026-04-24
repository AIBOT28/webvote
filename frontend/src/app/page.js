'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import TeacherCard from '@/components/TeacherCard';
import StarRating from '@/components/StarRating';
import styles from './page.module.css';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [topTeachers, setTopTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, rankingRes] = await Promise.all([
          api.get('/stats/overview'),
          api.get('/stats/ranking?limit=6')
        ]);
        setStats(statsRes.data.data);
        setTopTeachers(rankingRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Hệ thống đánh giá giảng viên</div>
          <h1 className={styles.heroTitle}>
            Đánh giá & Xếp hạng
            <span className={styles.heroHighlight}> Giảng Viên</span>
          </h1>
          <p className={styles.heroDesc}>
            Cùng sinh viên đánh giá chất lượng giảng dạy, xếp hạng giảng viên và giúp nâng cao chất lượng đào tạo.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/teachers" className="btn btn-primary btn-lg">
              Giảng viên
            </Link>
            <Link href="/ranking" className="btn btn-secondary btn-lg">
              Xếp hạng
            </Link>
            <Link href="/teachers/request" className="btn btn-secondary btn-lg">
              Yêu cầu thêm
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className={styles.stats}>
          <div className="container">
            <div className={styles.statsGrid}>
              {[
                { label: 'Khoa', value: stats.departments },
                { label: 'Môn học', value: stats.subjects },
                { label: 'Giảng viên', value: stats.teachers },
                { label: 'Sinh viên', value: stats.students },
                { label: 'Đánh giá', value: stats.reviews },
              ].map((s, i) => (
                <div key={i} className={styles.statCard}>
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Teachers */}
      {topTeachers.length > 0 && (
        <section className={styles.topSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Giảng viên tiêu biểu</h2>
              <Link href="/ranking" className={styles.sectionLink}>
                Xem tất cả
              </Link>
            </div>
            <div className={styles.teacherGrid}>
              {topTeachers.map((teacher, idx) => (
                <TeacherCard key={teacher._id} teacher={teacher} rank={idx + 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Cổng sinh viên</h2>
            <p className={styles.ctaDesc}>
              Đăng ký tài khoản Google để tham gia đánh giá giảng viên ngay.
            </p>
            <Link href="/register" className="btn btn-primary btn-lg">
              Bắt đầu ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
