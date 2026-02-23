'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Users, 
  LogOut,
  Pencil,
  Trash2,
  Search,
  Calendar
} from 'lucide-react';
import { getGeneralLimits, getUserLimits, getRecentAudit, updateGeneralLimits, updateUserLimits, deleteUserLimits } from '@/lib/api/parameters.service';
import { TransactionLimits, UserLimits, AuditLog } from '@/types';
import { EditGeneralLimitsModal } from '@/components/parametros/EditGeneralLimitsModal';
import { EditUserLimitsModal } from '@/components/parametros/EditUserLimitsModal';
import { ConfirmationModal } from '@/components/parametros/ConfirmationModal';
import styles from './page.module.css';

type TabType = 'general' | 'users';

export default function LimitesYMontosPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  
  // Estado para límites generales
  const [generalLimits, setGeneralLimits] = useState<TransactionLimits[]>([]);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [showGeneralConfirmation, setShowGeneralConfirmation] = useState(false);
  
  // Estado para límites de usuarios
  const [userLimits, setUserLimits] = useState<UserLimits[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserLimits | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserLimits | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 20;
  
  // Estado para auditoría
  const [recentAudit, setRecentAudit] = useState<AuditLog[]>([]);
  
  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadGeneralLimits();
    loadRecentAudit();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUserLimits();
    }
  }, [activeTab, searchQuery, currentPage]);

  const loadGeneralLimits = async () => {
    try {
      const data = await getGeneralLimits();
      setGeneralLimits(data);
    } catch (error) {
      console.error('Error al cargar límites generales:', error);
    }
  };

  const loadUserLimits = async () => {
    try {
      const response = await getUserLimits({
        search: searchQuery,
        page: currentPage,
        pageSize,
      });
      setUserLimits(response.data);
      setTotalUsers(response.total);
    } catch (error) {
      console.error('Error al cargar límites de usuarios:', error);
    }
  };

  const loadRecentAudit = async () => {
    try {
      const data = await getRecentAudit(5, activeTab === 'users' ? 'LIMITS' : 'PARAMS');
      setRecentAudit(data);
    } catch (error) {
      console.error('Error al cargar auditoría:', error);
    }
  };

  const handleSaveGeneralLimits = async (limits: Partial<TransactionLimits>[]) => {
    try {
      await updateGeneralLimits(limits);
      await loadGeneralLimits();
      await loadRecentAudit();
      setIsEditingGeneral(false);
    } catch (error) {
      console.error('Error al guardar límites generales:', error);
      throw error;
    }
  };

  const handleSaveUserLimits = async (limits: UserLimits['limits']) => {
    if (!selectedUser) return;
    
    try {
      await updateUserLimits(selectedUser.userId, limits);
      await loadUserLimits();
      await loadRecentAudit();
      setIsEditingUser(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al guardar límites de usuario:', error);
      throw error;
    }
  };

  const handleDeleteUserLimits = async () => {
    if (!userToDelete) return;
    
    setIsLoading(true);
    try {
      await deleteUserLimits(userToDelete.userId);
      await loadUserLimits();
      await loadRecentAudit();
      setUserToDelete(null);
    } catch (error) {
      console.error('Error al eliminar límites personalizados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  const canalesElectronicos = generalLimits.find((l) => l.category === 'canales_electronicos');
  const puntoXpressAhorro = generalLimits.find(
    (l) => l.category === 'punto_xpress' && l.subcategory === 'cuentas_ahorro'
  );
  const puntoXpressCorriente = generalLimits.find(
    (l) => l.category === 'punto_xpress' && l.subcategory === 'cuentas_corriente'
  );

  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Límites y Montos</h1>
          <p>Administre los límites transaccionales generales y por usuario.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'general' ? styles.active : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Settings size={20} />
          Configuración general
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Límites por usuario
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.mainContent}>
          {activeTab === 'general' ? (
            <>
              {/* Canales Electrónicos */}
              {canalesElectronicos && (
                <div className={styles.panel}>
                  <h2 className={styles.sectionTitle}>Parámetros Canales Electrónicos</h2>
                  <div className={styles.limitFields}>
                    <div className={styles.fieldGroup}>
                      <span className={styles.fieldLabel}>Máximo por transacción</span>
                      <div className={styles.fieldValue}>
                        {formatCurrency(canalesElectronicos.maxPerTransaction)}
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <span className={styles.fieldLabel}>Máximo diario</span>
                      <div className={styles.fieldValue}>
                        {formatCurrency(canalesElectronicos.maxDaily)}
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <span className={styles.fieldLabel}>Máximo mensual</span>
                      <div className={styles.fieldValue}>
                        {formatCurrency(canalesElectronicos.maxMonthly)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Punto Xpress - Cuentas de Ahorro */}
              {puntoXpressAhorro && (
                <div className={styles.panel}>
                  <h2 className={styles.sectionTitle}>Parámetros Punto Xpress</h2>
                  <h3 className={styles.sectionTitle} style={{ fontSize: '16px', marginTop: '16px' }}>
                    Cuentas de Ahorro
                  </h3>
                  <div className={styles.limitFields}>
                    <div className={styles.fieldGroup}>
                      <span className={styles.fieldLabel}>Máximo por transacción</span>
                      <div className={styles.fieldValue}>
                        {formatCurrency(puntoXpressAhorro.maxPerTransaction)}
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <span className={styles.fieldLabel}>Cantidad de transacciones mensuales</span>
                      <div className={styles.fieldValue}>
                        {puntoXpressAhorro.maxMonthlyTransactions}
                      </div>
                    </div>
                  </div>

                  {/* Cuentas Corriente */}
                  {puntoXpressCorriente && (
                    <>
                      <h3 className={styles.sectionTitle} style={{ fontSize: '16px', marginTop: '24px' }}>
                        Cuentas Corriente
                      </h3>
                      <div className={styles.limitFields}>
                        <div className={styles.fieldGroup}>
                          <span className={styles.fieldLabel}>Máximo por transacción</span>
                          <div className={styles.fieldValue}>
                            {formatCurrency(puntoXpressCorriente.maxPerTransaction)}
                          </div>
                        </div>
                        <div className={styles.fieldGroup}>
                          <span className={styles.fieldLabel}>Cantidad de transacciones mensuales</span>
                          <div className={styles.fieldValue}>
                            {puntoXpressCorriente.maxMonthlyTransactions}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Búsqueda */}
              <div className={styles.searchBar}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Buscar usuario..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <button className={styles.filterBtn}>
                  <Calendar size={18} />
                  Filtrar
                </button>
              </div>

              {/* Tabla de usuarios */}
              <div className={styles.panel}>
                <table className={styles.userTable}>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>N° Asociado</th>
                      <th>Límite</th>
                      <th>Última Actualización</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLimits.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className={styles.userName}>{user.userName}</div>
                          <div className={styles.userCode}>ID {user.userCode}</div>
                        </td>
                        <td>{user.userCode}</td>
                        <td>
                          <span
                            className={`${styles.limitBadge} ${
                              user.limitType === 'personalizado'
                                ? styles.personalizado
                                : styles.general
                            }`}
                          >
                            {user.limitType === 'personalizado' ? 'Personalizado' : 'General'}
                          </span>
                        </td>
                        <td>{user.lastUpdate ? formatDate(user.lastUpdate) : '-'}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.iconBtn}
                              onClick={() => {
                                setSelectedUser(user);
                                setIsEditingUser(true);
                              }}
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </button>
                            {user.limitType === 'personalizado' && (
                              <button
                                className={`${styles.iconBtn} ${styles.danger}`}
                                onClick={() => setUserToDelete(user)}
                                title="Eliminar límites personalizados"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginación */}
                <div className={styles.pagination}>
                  <div className={styles.pageInfo}>
                    Página {currentPage} de {totalPages} · {totalUsers} usuarios
                  </div>
                  <div className={styles.pageControls}>
                    <button
                      className={styles.pageBtn}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
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
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar - Historial de Auditoría */}
        <div className={styles.sidebar}>
          <div className={styles.historialPanel}>
            <div className={styles.sidebarActions}>
              <button
                className={`${styles.btn} ${styles.btnPrimary} ${styles.sidebarActionBtn}`}
                onClick={() => setIsEditingGeneral(true)}
              >
                Guardar Cambios
              </button>
              <button
                className={`${styles.btn} ${styles.btnSecondary} ${styles.sidebarActionBtn}`}
                onClick={() => router.push('/dashboard/parametros/limites-y-montos/historial')}
              >
                Historial
              </button>
            </div>

            <h3 className={styles.historialTitle}>Historial de Auditoría</h3>

            {recentAudit.length === 0 && (
              <div className={styles.emptyAudit}>No hay registros de auditoría disponibles.</div>
            )}

            {recentAudit.map((log) => (
              <div key={log.id} className={styles.auditItem}>
                <div className={styles.auditUser}>{log.userName}</div>
                <div className={styles.auditTime}>
                  {formatDate(log.timestamp)} - {formatTime(log.timestamp)}
                </div>
                <div className={styles.auditDetails}>{log.details}</div>
                {log.changes && log.changes.length > 0 && (
                  <div className={styles.auditChangeBox}>
                    <span className={styles.oldValue}>
                      {typeof log.changes[0].oldValue === 'number'
                        ? formatCurrency(log.changes[0].oldValue)
                        : log.changes[0].oldValue}
                    </span>
                    <span>→</span>
                    <span className={styles.newValue}>
                      {typeof log.changes[0].newValue === 'number'
                        ? formatCurrency(log.changes[0].newValue)
                        : log.changes[0].newValue}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modales */}
      <EditGeneralLimitsModal
        isOpen={isEditingGeneral}
        onClose={() => setIsEditingGeneral(false)}
        onSave={handleSaveGeneralLimits}
        limits={generalLimits}
      />

      <EditUserLimitsModal
        isOpen={isEditingUser}
        onClose={() => {
          setIsEditingUser(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUserLimits}
        user={selectedUser}
      />

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUserLimits}
        title="Eliminar límites personalizados"
        message={`¿Está seguro que desea eliminar los límites personalizados de ${userToDelete?.userName}? Volverá a utilizar los límites generales.`}
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isLoading}
      />
    </div>
  );
}
