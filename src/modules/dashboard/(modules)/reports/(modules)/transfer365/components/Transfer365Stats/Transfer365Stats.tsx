'use client';

import React from 'react';
import styles from './Transfer365Stats.module.css';

interface Transfer365StatsProps {
  totalTransacciones: number;
  totalEntrante: number;
  totalSaliente: number;
}

export default function Transfer365Stats({ totalTransacciones, totalEntrante, totalSaliente }: Readonly<Transfer365StatsProps>) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{totalTransacciones.toLocaleString('es-SV')}</div>
        <div className={styles.statLabel}>Total Transacciones</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{formatCurrency(totalEntrante)}</div>
        <div className={styles.statLabel}>Total Entrante</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{formatCurrency(totalSaliente)}</div>
        <div className={styles.statLabel}>Total Saliente</div>
      </div>
    </div>
  );
}
