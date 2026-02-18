'use client';

import { Download } from 'lucide-react';
import styles from './RecurringHeader.module.css';

interface RecurringHeaderProps {
  onExport: () => void;
}

export default function RecurringHeader({ onExport }: RecurringHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h2 className={styles.title}>Reportes Recurrentes</h2>
        <p className={styles.subtitle}>
          Gestión de reportes recurrentes
        </p>
      </div>
      <button onClick={onExport} className={styles.exportButton}>
        <Download size={16} />
        <span>Exportar Excel</span>
      </button>
    </div>
  );
}
