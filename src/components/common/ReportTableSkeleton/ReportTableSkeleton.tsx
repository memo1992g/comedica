import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from './ReportTableSkeleton.module.css';

interface ReportTableSkeletonProps {
  readonly rows?: number;
  readonly columns?: number;
  readonly showStats?: boolean;
}

export default function ReportTableSkeleton({
  rows = 8,
  columns = 6,
  showStats = true,
}: ReportTableSkeletonProps) {
  return (
    <div className={styles.wrapper}>
      {showStats && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={14} />
          </div>
          <div className={styles.statCard}>
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={14} />
          </div>
        </div>
      )}

      <div className={styles.tableArea}>
        <div className={styles.headerRow}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`h-${String(i)}`} height={14} style={{ flex: 1 }} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={`r-${String(rowIdx)}`}
            className={styles.bodyRow}
            style={{ background: rowIdx % 2 === 0 ? '#f2f2f7' : 'white' }}
          >
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton
                key={`c-${String(rowIdx)}-${String(colIdx)}`}
                height={12}
                style={{ flex: 1 }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className={styles.paginationRow}>
        <Skeleton width={120} height={14} />
        <div className={styles.paginationButtons}>
          <Skeleton width={28} height={28} borderRadius="50%" />
          <Skeleton width={28} height={28} borderRadius="50%" />
        </div>
      </div>
    </div>
  );
}
