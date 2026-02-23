'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { getAuditLog } from '@/lib/api/parameters.service';
import { AuditLog } from '@/types';
import styles from './page.module.css';

export default function HistorialAtencionSoportePage() {
  const router = useRouter();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadAuditLogs();
  }, [searchQuery, currentPage]);

  const loadAuditLogs = async () => {
    try {
      const response = await getAuditLog({
        search: searchQuery,
        page: currentPage,
        pageSize,
        module: 'Atención y Soporte',
        classificationCode: 'NOTIFICATIONS',
      });
      setAuditLogs(response.data);
      setTotalLogs(response.total);
    } catch (error) {
      console.error('Error al cargar auditoría:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const totalPages = Math.max(1, Math.ceil(totalLogs / pageSize));
  const startItem = totalLogs === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalLogs);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/dashboard/mantenimiento/atencion-soporte')} aria-label="Volver">
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerContent}>
          <h1>Historial de Auditoría</h1>
          <p>{totalLogs} resultados</p>
        </div>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar en historial..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className={styles.filterBtn}><Calendar size={18} />Filtrar por fecha</button>
      </div>

      <div className={styles.panel}>
        {auditLogs.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr><th>Fecha</th><th>Gestionado por</th><th>Acción</th><th>Detalles</th></tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className={styles.dateCell}>{formatDate(log.timestamp)} - {formatTime(log.timestamp)}</td>
                    <td><div className={styles.userCell}><span className={styles.userName}>{log.userName}</span><span className={styles.userRole}>{log.userRole}</span></div></td>
                    <td><div className={styles.actionText}>{log.action}</div></td>
                    <td><div className={styles.detailsText}>{log.details}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.pagination}>
              <div className={styles.pageInfo}>Página {currentPage} · {startItem}-{endItem} de {totalLogs}</div>
              <div className={styles.pageControls}>
                <button className={styles.pageBtn} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
                <button className={`${styles.pageBtn} ${styles.active}`}>{currentPage}</button>
                <button className={styles.pageBtn} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}><FileText size={48} /><h3>No se encontraron registros</h3><p>Intenta ajustar tus filtros de búsqueda</p></div>
        )}
      </div>
    </div>
  );
}
