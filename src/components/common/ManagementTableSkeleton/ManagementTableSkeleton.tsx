import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from './ManagementTableSkeleton.module.css';

interface ManagementTableSkeletonProps {
  readonly rows?: number;
  readonly columns?: number;
}

export default function ManagementTableSkeleton({
  rows = 8,
  columns = 5,
}: ManagementTableSkeletonProps) {
  return (
    <div className={styles.wrapper}>
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
              <Skeleton key={`c-${String(rowIdx)}-${String(colIdx)}`} height={12} style={{ flex: 1 }} />
            ))}
          </div>
        ))}
      </div>

      <div className={styles.footerRow}>
        <Skeleton width={100} height={32} borderRadius={4} />
        <div className={styles.paginationArea}>
          <Skeleton width={100} height={14} />
          <div className={styles.paginationButtons}>
            <Skeleton width={28} height={28} borderRadius="50%" />
            <Skeleton width={28} height={28} borderRadius="50%" />
          </div>
        </div>
      </div>
    </div>
  );
}
