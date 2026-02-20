'use client';

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import styles from './ReportsContentSkeleton.module.css';

/* Column flex proportions matching reportColumns sizes */
const COL_FLEX = [120, 110, 150, 110, 150, 100, 120];
const COL_WIDTHS = ['78%', '85%', '70%', '85%', '70%', '60%', '65%'];

interface Props {
  readonly rows?: number;
  readonly showStats?: boolean;
}

function StatsSkeletonCards() {
  return (
    <>
      <div className={styles.statCard}>
        <Skeleton width="55%" height={20} />
        <Skeleton width="40%" height={14} />
      </div>
      <div className={styles.statCard}>
        <Skeleton width="55%" height={20} />
        <Skeleton width="40%" height={14} />
      </div>
    </>
  );
}

function TableSkeletonRows({ rows }: { readonly rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <div key={`sk-row-${String(i)}`} className={styles.bodyRow}>
          {COL_FLEX.map((flex, c) => (
            <Skeleton
              key={`sk-${String(i)}-${String(c)}`}
              height={14}
              width={COL_WIDTHS[c]}
              style={{ flex }}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function ReportsContentSkeleton({
  rows = 8,
  showStats = true,
}: Props) {
  return (
    <div className={styles.wrapper}>
      {showStats && (
        <div className={styles.statsRow}>
          <StatsSkeletonCards />
        </div>
      )}
      <div className={styles.tableArea}>
        <div className={styles.headerRow}>
          {COL_FLEX.map((flex, i) => (
            <Skeleton key={`h-${String(i)}`} height={12} style={{ flex }} />
          ))}
        </div>
        <TableSkeletonRows rows={rows} />
      </div>
    </div>
  );
}
