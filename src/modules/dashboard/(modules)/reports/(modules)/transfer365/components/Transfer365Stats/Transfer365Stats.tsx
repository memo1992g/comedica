'use client';

import React from 'react';
import styles from './Transfer365Stats.module.css';

interface Transfer365StatsProps {
  totalTransactions: number;
  totalAmount: number;
}

export default function Transfer365Stats({ totalTransactions, totalAmount }: Transfer365StatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

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
