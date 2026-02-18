'use client';

import React from 'react';
import { Download } from 'lucide-react';
import styles from './Transfer365Header.module.css';

interface Transfer365HeaderProps {
  onExport: () => void;
}

export default function Transfer365Header({ onExport }: Transfer365HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div>
          <h2 className={styles.title}>Reportes Transfer365</h2>
          <p className={styles.subtitle}>Consultas y reportes de la red Transfer365</p>
        </div>
        <button onClick={onExport} className={styles.exportButton}>
          <Download size={16} />
          <span>Exportar Excel</span>
        </button>
      </div>
    </div>
  );
}
