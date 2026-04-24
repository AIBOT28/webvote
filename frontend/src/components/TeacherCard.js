'use client';
import Link from 'next/link';
import StarRating from './StarRating';
import styles from './TeacherCard.module.css';

export default function TeacherCard({ teacher, rank }) {
  return (
    <Link href={`/teachers/${teacher._id}`} className={styles.card}>
      {rank && (
        <div className={`${styles.rank} ${rank <= 3 ? styles[`rank${rank}`] : ''}`}>
          #{rank}
        </div>
      )}
      <div className={styles.avatar}>
        {teacher.avatar ? (
          <img src={teacher.avatar} alt={teacher.name} />
        ) : (
          <span>{teacher.name?.charAt(0)}</span>
        )}
      </div>
      <h3 className={styles.name}>{teacher.name}</h3>
      <p className={styles.department}>
        {teacher.department?.name || 'Chưa xác định'}
      </p>
      <div className={styles.rating}>
        <StarRating rating={teacher.averageRating} size={16} totalReviews={teacher.totalReviews} />
      </div>
      {teacher.subjects?.length > 0 && (
        <div className={styles.subjects}>
          {teacher.subjects.slice(0, 3).map(s => (
            <span key={s._id} className={styles.subjectTag}>{s.name}</span>
          ))}
          {teacher.subjects.length > 3 && (
            <span className={styles.subjectMore}>+{teacher.subjects.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  );
}
