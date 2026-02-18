import React from 'react';
import styles from './RecurringStats.module.css';

interface RecurringStatsProps {
  totalTransactions: number;
  totalAmount: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function RecurringStats({ totalTransactions, totalAmount }: RecurringStatsProps) {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statCard}>
        <span className={styles.statValue}>{totalTransactions}</span>
        <span className={styles.statLabel}>Total Transacciones</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statValue}>{formatCurrency(totalAmount)}</span>
        <span className={styles.statLabel}>Monto Total</span>
      </div>
    </div>
  );
}
