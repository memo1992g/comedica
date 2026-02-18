import React from 'react';
import { FileDown } from 'lucide-react';
import styles from './ServicesHeader.module.css';

interface ServicesHeaderProps {
  onExport: () => void;
}

export default function ServicesHeader({ onExport }: ServicesHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h2 className={styles.title}>Reportes de Servicios/Eventos</h2>
        <p className={styles.subtitle}>
          Gestión y seguimiento de reportes de servicios y eventos
        </p>
      </div>
      <button className={styles.exportButton} onClick={onExport}>
        <FileDown size={16} />
        <span>Exportar Excel</span>
      </button>
    </div>
  );
}
