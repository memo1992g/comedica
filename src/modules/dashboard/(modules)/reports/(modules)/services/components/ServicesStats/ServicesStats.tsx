import React from 'react';
import { formatCurrency } from '@/lib/utils';
import styles from './ServicesStats.module.css';

interface ServicesStatsProps {
  totalTransactions: number;
  totalAmount: number;
}

export default function ServicesStats({ totalTransactions, totalAmount }: ServicesStatsProps) {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{totalTransactions}</div>
        <div className={styles.statLabel}>Total Transacciones</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{formatCurrency(totalAmount)}</div>
        <div className={styles.statLabel}>Monto Total</div>
      </div>
    </div>
  );
}
