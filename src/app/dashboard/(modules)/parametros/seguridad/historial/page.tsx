'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { getAuditLog } from '@/lib/api/parameters.service';
import { AuditLog } from '@/types';
import styles from './page.module.css';

export default function HistorialSeguridadPage() {
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
        module: 'Configuraciones de Seguridad',
      });
      setAuditLogs(response.data);
      setTotalLogs(response.total);
    } catch (error) {
      console.error('Error al cargar auditoría:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(totalLogs / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalLogs);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          className={styles.backBtn}
          onClick={() => router.push('/parametros/seguridad')}
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerContent}>
          <h1>Historial completo de auditoría</h1>
          <p>{totalLogs} resultados</p>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className={styles.filterBtn}>
          <Calendar size={18} />
          Filtrar por fecha
        </button>
      </div>

      {/* Table */}
      <div className={styles.panel}>
        {auditLogs.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Gestionado por</th>
                  <th>Acción</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className={styles.dateCell}>
                      <div>{formatDate(log.timestamp)} - {formatTime(log.timestamp)}</div>
                    </td>
                    <td>
                      <div className={styles.userCell}>
                        <span className={styles.userName}>{log.userName}</span>
                        <span className={styles.userRole}>{log.userRole}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.detailsCell}>
                        <div className={styles.actionText}>{log.action}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.changesCell}>
                        <div className={styles.detailsText}>{log.details}</div>
                        {log.changes && log.changes.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            {log.changes.map((change, idx) => (
                              <div key={idx} className={styles.changeItem}>
                                <div className={styles.changeLabel}>{change.field}:</div>
                                <div className={styles.changeValues}>
                                  <span className={styles.oldValue}>{change.oldValue}</span>
                                  <span className={styles.arrow}>→</span>
                                  <span className={styles.newValue}>{change.newValue}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <div className={styles.pageInfo}>
                Página {currentPage} · {startItem}-{endItem} de {totalLogs}
              </div>
              <div className={styles.pageControls}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  Primera
                </button>
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Última
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <FileText size={48} />
            <h3>No se encontraron registros</h3>
            <p>Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
