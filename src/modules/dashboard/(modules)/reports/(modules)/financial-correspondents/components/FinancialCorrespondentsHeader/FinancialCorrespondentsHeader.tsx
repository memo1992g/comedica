'use client';

import React from 'react';
import { Download } from 'lucide-react';
import styles from './FinancialCorrespondentsHeader.module.css';

interface FinancialCorrespondentsHeaderProps {
  onExport: () => void;
}

export default function FinancialCorrespondentsHeader({ 
  onExport 
}: FinancialCorrespondentsHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div>
          <h2 className={styles.title}>Corresponsales Financieros</h2>
          <p className={styles.subtitle}>
            Gestión y seguimiento de corresponsales financieros
          </p>
        </div>
        <button onClick={onExport} className={styles.exportButton}>
          <Download size={16} />
          <span>Exportar Excel</span>
        </button>
      </div>
    </div>
  );
}
