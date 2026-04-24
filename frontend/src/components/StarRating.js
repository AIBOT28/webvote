'use client';
import styles from './StarRating.module.css';

export default function StarRating({ rating = 0, onRate, size = 14, showValue = true, totalReviews }) {
  // If interactive (for voting)
  if (onRate) {
    return (
      <div className={styles.interactiveWrapper}>
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            type="button"
            className={`${styles.rateBtn} ${Math.round(rating) === val ? styles.rateBtnActive : ''}`}
            onClick={() => onRate(val)}
          >
            {val}
          )
        </button>
        ))}
      </div>
    );
  }

  // If display only
  return (
    <div className={styles.wrapper}>
      <div className={styles.barContainer} style={{ height: size / 2, width: size * 4 }}>
        <div 
          className={styles.barFill} 
          style={{ width: `${(rating / 5) * 100}%` }}
        ></div>
      </div>
      {showValue && (
        <span className={styles.value} style={{ fontSize: size }}>
          {Number(rating).toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className={styles.count} style={{ fontSize: size * 0.8 }}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
}
