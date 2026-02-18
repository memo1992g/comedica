import React from 'react';
import { Download } from 'lucide-react';
import styles from './styles/ReportsHeader.module.css';

interface ReportsHeaderProps {
  onExport: () => void;
}

export default function ReportsHeader({ onExport }: ReportsHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h2 className={styles.title}>Reportes Internos</h2>
        <p className={styles.subtitle}>
          Generación y consulta de reportes operativos internos
        </p>
      </div>
      
      <button 
        className={styles.exportButton}
        onClick={onExport}
      >
        <Download size={16} className={styles.icon} />
        <span>Exportar Excel</span>
      </button>
    </div>
  );
}
