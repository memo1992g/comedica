'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Users,
  Pencil,
  Trash2,
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

  const [generalLimits, setGeneralLimits] = useState<TransactionLimits[]>([]);
  const [originalGeneralLimits, setOriginalGeneralLimits] = useState<TransactionLimits[] | null>(null);
  const [pendingGeneralLimits, setPendingGeneralLimits] = useState<Partial<TransactionLimits>[] | null>(null);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [showGeneralConfirmation, setShowGeneralConfirmation] = useState(false);

  const [userLimits, setUserLimits] = useState<UserLimits[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserLimits | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserLimits | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 20;

  const [recentAudit, setRecentAudit] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGeneralLimits();
    loadRecentAudit();
  }, []);

  useEffect(() => {
    loadRecentAudit();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUserLimits();
    }
  }, [activeTab, searchQuery, currentPage]);

  const loadGeneralLimits = async () => {
    try {
      const data = await getGeneralLimits();
      setGeneralLimits(data);
      if (!pendingGeneralLimits) {
        setOriginalGeneralLimits(data);
      }
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
    const snapshot = originalGeneralLimits ?? generalLimits;

    const preview = snapshot.map((item) => {
      const edited = limits.find((l) => l.id === item.id);
      return edited ? { ...item, ...edited } : item;
    });

    setGeneralLimits(preview);
    setPendingGeneralLimits(limits);
    setIsEditingGeneral(false);
  };

  const handleConfirmGeneralLimits = async () => {
    if (!pendingGeneralLimits) return;

    try {
      await updateGeneralLimits(pendingGeneralLimits);
      await loadGeneralLimits();
      await loadRecentAudit();
      setPendingGeneralLimits(null);
      setOriginalGeneralLimits(null);
      setShowGeneralConfirmation(false);
    } catch (error) {
      console.error('Error al guardar límites generales:', error);
      throw error;
    }
  };

  const handleUndoGeneralChanges = () => {
    if (originalGeneralLimits) {
      setGeneralLimits(originalGeneralLimits);
    }
    setPendingGeneralLimits(null);
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

  const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

  const pendingSummary = useMemo(() => {
    if (!pendingGeneralLimits || !originalGeneralLimits) return null;

    const edited = pendingGeneralLimits[0];
    if (!edited?.id) return null;

    const original = originalGeneralLimits.find((l) => l.id === edited.id);
    if (!original) return null;

    if (edited.maxMonthly !== undefined) {
      return {
        label: 'Canales Electrónicos - Máximo mensual',
        oldValue: original.maxMonthly,
        newValue: edited.maxMonthly,
      };
    }

    if (edited.maxDaily !== undefined) {
      return {
        label: 'Canales Electrónicos - Máximo diario',
        oldValue: original.maxDaily,
        newValue: edited.maxDaily,
      };
    }

    if (edited.maxPerTransaction !== undefined) {
      const section = original.category === 'punto_xpress' ? 'Punto Xpress' : 'Canales Electrónicos';
      return {
        label: `${section} - Máximo por transacción`,
        oldValue: original.maxPerTransaction,
        newValue: edited.maxPerTransaction,
      };
    }

    if (edited.maxMonthlyTransactions !== undefined) {
      const section = original.subcategory === 'cuentas_corriente' ? 'Punto Xpress - Cuentas Corriente' : 'Punto Xpress - Cuentas Ahorro';
      return {
        label: `${section} - Cantidad de transacciones mensuales`,
        oldValue: original.maxMonthlyTransactions ?? 0,
        newValue: edited.maxMonthlyTransactions,
      };
    }

    return null;
  }, [pendingGeneralLimits, originalGeneralLimits]);

  const canalesElectronicos = generalLimits.find((l) => l.category === 'canales_electronicos');
  const puntoXpressAhorro = generalLimits.find((l) => l.category === 'punto_xpress' && l.subcategory === 'cuentas_ahorro');
  const puntoXpressCorriente = generalLimits.find((l) => l.category === 'punto_xpress' && l.subcategory === 'cuentas_corriente');

  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        <div className={styles.content}>
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <h1>Límites y Montos</h1>
                <p>Administre los límites transaccionales generales y por usuario.</p>
              </div>
            </div>

            <div className={styles.tabs}>
              <button className={`${styles.tab} ${activeTab === 'general' ? styles.active : ''}`} onClick={() => setActiveTab('general')}>
                <Settings size={18} />
                Configuración general
              </button>
              <button className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => setActiveTab('users')}>
                <Users size={18} />
                Límites por usuario
              </button>
            </div>

            {activeTab === 'general' ? (
              <>
                {canalesElectronicos && (
                  <div className={styles.panel}>
                    <h2 className={styles.sectionTitle}>Parámetros Canales Electrónicos</h2>
                    <div className={styles.limitFields}>
                      <div className={styles.fieldGroup}>
                        <span className={styles.fieldLabel}>Máximo por transacción</span>
                        <div className={styles.fieldValue}>{formatCurrency(canalesElectronicos.maxPerTransaction)}</div>
                      </div>
                      <div className={styles.fieldGroup}>
                        <span className={styles.fieldLabel}>Máximo diario</span>
                        <div className={styles.fieldValue}>{formatCurrency(canalesElectronicos.maxDaily)}</div>
                      </div>
                      <div className={styles.fieldGroup}>
                        <span className={styles.fieldLabel}>Máximo mensual</span>
                        <div className={styles.fieldValue}>{formatCurrency(canalesElectronicos.maxMonthly)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {puntoXpressAhorro && (
                  <div className={styles.panel}>
                    <h2 className={styles.sectionTitle}>Parámetros Punto Xpress</h2>
                    <h3 className={styles.subSectionTitle}>Cuentas de Ahorro</h3>
                    <div className={styles.limitFields}>
                      <div className={styles.fieldGroup}>
                        <span className={styles.fieldLabel}>Máximo por transacción</span>
                        <div className={styles.fieldValue}>{formatCurrency(puntoXpressAhorro.maxPerTransaction)}</div>
                      </div>
                      <div className={styles.fieldGroup}>
                        <span className={styles.fieldLabel}>Cantidad de transacciones mensuales</span>
                        <div className={styles.fieldValue}>{puntoXpressAhorro.maxMonthlyTransactions}</div>
                      </div>
                    </div>

                    {puntoXpressCorriente && (
                      <>
                        <h3 className={styles.subSectionTitle}>Cuentas Corriente</h3>
                        <div className={styles.limitFields}>
                          <div className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Máximo por transacción</span>
                            <div className={styles.fieldValue}>{formatCurrency(puntoXpressCorriente.maxPerTransaction)}</div>
                          </div>
                          <div className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Cantidad de transacciones mensuales</span>
                            <div className={styles.fieldValue}>{puntoXpressCorriente.maxMonthlyTransactions}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.panel}>
                <table className={styles.userTable}>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Número de Asociado</th>
                      <th>Tipo Límite</th>
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
                          <span className={`${styles.limitBadge} ${user.limitType === 'personalizado' ? styles.personalizado : styles.general}`}>
                            {user.limitType === 'personalizado' ? 'Personalizado' : 'General'}
                          </span>
                        </td>
                        <td>{user.lastUpdate ? formatDate(user.lastUpdate) : '-'}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button className={styles.iconBtn} onClick={() => { setSelectedUser(user); setIsEditingUser(true); }} title="Editar">
                              <Pencil size={16} />
                            </button>
                            {user.limitType === 'personalizado' && (
                              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setUserToDelete(user)} title="Eliminar límites personalizados">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.pagination}>
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
                  <div className={styles.pageInfo}>Página {currentPage} · {Math.min(currentPage * pageSize, totalUsers)} de {totalUsers}</div>
                  <div className={styles.pageControls}>
                    <button className={styles.pageBtn} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
                    <button className={`${styles.pageBtn} ${styles.active}`}>{currentPage}</button>
                    <button className={styles.pageBtn} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.sidebar}>
            <div className={styles.historialPanel}>
              <div className={styles.sidebarActions}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.sidebarActionBtn}`}
                  onClick={() => {
                    if (pendingGeneralLimits) {
                      setShowGeneralConfirmation(true);
                      return;
                    }
                    setOriginalGeneralLimits(generalLimits);
                    setIsEditingGeneral(true);
                  }}
                >
                  Guardar Cambios
                </button>
                <button
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.sidebarActionBtn}`}
                  onClick={() => {
                    if (pendingGeneralLimits) {
                      handleUndoGeneralChanges();
                      return;
                    }
                    router.push('/dashboard/parametros/limites-y-montos/historial');
                  }}
                >
                  {pendingGeneralLimits ? 'Deshacer cambios' : 'Historial'}
                </button>
              </div>

              {pendingSummary ? (
                <>
                  <h3 className={styles.historialTitle}>Confirme sus cambios</h3>
                  <div className={styles.auditDetails}>{pendingSummary.label}</div>
                  <div className={styles.auditChangeBox}>
                    <span style={{ color: '#9ca3af' }}>Valor:</span>
                    <span className={styles.oldValue}>{formatCurrency(pendingSummary.oldValue)}</span>
                    <span>→</span>
                    <span className={styles.newValue}>{formatCurrency(pendingSummary.newValue)}</span>
                  </div>
                </>
              ) : (
                <>
                  <h3 className={styles.historialTitle}>Historial de Auditoría</h3>
                  {recentAudit.length === 0 && <div className={styles.emptyAudit}>No hay registros de auditoría disponibles.</div>}

                  {recentAudit.map((log) => (
                    <div key={log.id} className={styles.auditItem}>
                      <div className={styles.auditUser}>{log.userName}</div>
                      <div className={styles.auditTime}>{formatDate(log.timestamp)} - {formatTime(log.timestamp)}</div>
                      <div className={styles.auditDetails}>{log.details}</div>
                      {log.changes && log.changes.length > 0 && (
                        <div className={styles.auditChangeBox}>
                          <span className={styles.oldValue}>{typeof log.changes[0].oldValue === 'number' ? formatCurrency(log.changes[0].oldValue) : log.changes[0].oldValue}</span>
                          <span>→</span>
                          <span className={styles.newValue}>{typeof log.changes[0].newValue === 'number' ? formatCurrency(log.changes[0].newValue) : log.changes[0].newValue}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
        isOpen={showGeneralConfirmation}
        onClose={() => setShowGeneralConfirmation(false)}
        onConfirm={handleConfirmGeneralLimits}
        title="Confirmar actualización"
        message="¿Está seguro que desea actualizar los límites generales? Esta acción afectará a todos los usuarios que no tengan límites personalizados."
        type="warning"
        confirmText="Confirmar"
        cancelText="Cancelar"
        isLoading={isLoading}
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
