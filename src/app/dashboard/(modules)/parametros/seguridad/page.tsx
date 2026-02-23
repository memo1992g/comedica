'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSecurityConfig, getRecentAudit, updateSecurityConfig } from '@/lib/api/parameters.service';
import { AuditLog } from '@/types';
import { ConfirmationModal } from '@/components/parametros/ConfirmationModal';
import styles from './page.module.css';

interface SecurityConfig {
  id: string;
  passwordExpiration: number;
  sessionTimeout: number;
  minUsernameLength: number;
  maxUsernameLength: number;
  minPasswordLength: number;
  maxPasswordLength: number;
  codeExpiration: number;
  softTokenExpiration: number;
  updatedAt: string;
  updatedBy: string;
}

type SecurityEditableField =
  | 'passwordExpiration'
  | 'sessionTimeout'
  | 'minUsernameLength'
  | 'maxUsernameLength'
  | 'minPasswordLength'
  | 'maxPasswordLength'
  | 'codeExpiration'
  | 'softTokenExpiration';

const editableFields: SecurityEditableField[] = [
  'passwordExpiration',
  'sessionTimeout',
  'minUsernameLength',
  'maxUsernameLength',
  'minPasswordLength',
  'maxPasswordLength',
  'codeExpiration',
  'softTokenExpiration',
];

export default function ConfiguracionesSeguridadPage() {
  const router = useRouter();

  const [config, setConfig] = useState<SecurityConfig | null>(null);
  const [editedConfig, setEditedConfig] = useState<SecurityConfig | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentAudit, setRecentAudit] = useState<AuditLog[]>([]);

  useEffect(() => {
    loadConfig();
    loadRecentAudit();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await getSecurityConfig();
      setConfig(data);
      setEditedConfig(data);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  const loadRecentAudit = async () => {
    try {
      const data = await getRecentAudit(5, 'PARAMS');
      setRecentAudit(data);
    } catch (error) {
      console.error('Error al cargar auditoría:', error);
    }
  };

  const handleChange = (field: SecurityEditableField, value: string) => {
    if (!editedConfig) return;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    setEditedConfig({
      ...editedConfig,
      [field]: parsed,
    });
  };

  const pendingChanges = useMemo(() => {
    if (!config || !editedConfig) return {} as Record<SecurityEditableField, { old: number; new: number }>;

    return editableFields.reduce((acc, field) => {
      if (config[field] !== editedConfig[field]) {
        acc[field] = {
          old: config[field],
          new: editedConfig[field],
        };
      }
      return acc;
    }, {} as Record<SecurityEditableField, { old: number; new: number }>);
  }, [config, editedConfig]);

  const hasChanges = Object.keys(pendingChanges).length > 0;

  const handleSave = () => {
    if (!hasChanges) return;
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!editedConfig) return;

    setIsLoading(true);
    try {
      await updateSecurityConfig(editedConfig);
      await loadConfig();
      await loadRecentAudit();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setEditedConfig(config);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const getFieldLabel = (field: SecurityEditableField): string => {
    const labels: Record<SecurityEditableField, string> = {
      passwordExpiration: 'Vigencia de Contraseña (días)',
      sessionTimeout: 'Tiempo de sesión (segundos)',
      minUsernameLength: 'Longitud mínima de usuario',
      maxUsernameLength: 'Longitud máxima de usuario',
      minPasswordLength: 'Longitud mínima de contraseña',
      maxPasswordLength: 'Longitud máxima de contraseña',
      codeExpiration: 'Vigencia de códigos (segundos)',
      softTokenExpiration: 'Vigencia Soft-Token (segundos)',
    };
    return labels[field];
  };

  const firstPendingChange = useMemo(() => {
    const [field] = Object.keys(pendingChanges) as SecurityEditableField[];
    if (!field) return null;

    return {
      label: getFieldLabel(field),
      oldValue: pendingChanges[field].old,
      newValue: pendingChanges[field].new,
    };
  }, [pendingChanges]);

  if (!config || !editedConfig) {
    return (
      <div className={styles.container}>
        <div className={styles.mainCard}>Cargando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        <div className={styles.content}>
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <h1>Configuraciones de Seguridad</h1>
                <p>En esta pantalla se llevará a cabo la configuración de parámetros de usuarios de BEL</p>
              </div>
            </div>

            <div className={styles.panel}>
              <h2 className={styles.sectionTitle}>Parámetros Generales</h2>
              <div className={styles.limitFields}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Vigencia de Contraseñas (Días)</label>
                  <input
                    type="number"
                    className={styles.fieldValue}
                    value={String(editedConfig.passwordExpiration)}
                    onChange={(e) => handleChange('passwordExpiration', e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Tiempo de Sesión (Segundos)</label>
                  <input
                    type="number"
                    className={styles.fieldValue}
                    value={String(editedConfig.sessionTimeout)}
                    onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <h2 className={styles.sectionTitle}>Longitud de Usuarios</h2>
              <div className={styles.limitFields}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Valor mínimo (caracteres)</label>
                  <input
                    type="number"
                    className={styles.fieldValue}
                    value={String(editedConfig.minUsernameLength)}
                    onChange={(e) => handleChange('minUsernameLength', e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Valor máximo (caracteres)</label>
                  <input
                    type="number"
                    className={styles.fieldValue}
                    value={String(editedConfig.maxUsernameLength)}
                    onChange={(e) => handleChange('maxUsernameLength', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <h2 className={styles.sectionTitle}>Longitud de Contraseña</h2>
              <div className={styles.limitFields}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Valor mínimo (caracteres)</label>
                  <input
                    type="number"
                    className={styles.fieldValue}
                    value={String(editedConfig.minPasswordLength)}
                    onChange={(e) => handleChange('minPasswordLength', e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Valor máximo (caracteres)</label>
                  <input
                    type="number"
                    className={styles.fieldValue}
                    value={String(editedConfig.maxPasswordLength)}
                    onChange={(e) => handleChange('maxPasswordLength', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <h2 className={styles.sectionTitle}>Vigencia de Códigos</h2>
              <div className={styles.limitFields}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Vigencia de códigos (Segundos)</label>
                  <input
                    type="number"
                    className={styles.fieldValue}
                    value={String(editedConfig.codeExpiration)}
                    onChange={(e) => handleChange('codeExpiration', e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Vigencia Soft-Token (Segundos)</label>
                  <input
                    type="number"
                    className={styles.fieldValue}
                    value={String(editedConfig.softTokenExpiration)}
                    onChange={(e) => handleChange('softTokenExpiration', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.historialPanel}>
              <div className={styles.sidebarActions}>
                <button className={`${styles.btn} ${styles.btnPrimary} ${styles.sidebarActionBtn}`} onClick={handleSave} disabled={!hasChanges}>
                  Guardar Cambios
                </button>
                <button
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.sidebarActionBtn}`}
                  onClick={() => {
                    if (hasChanges) {
                      handleDiscard();
                      return;
                    }
                    router.push('/dashboard/parametros/seguridad/historial');
                  }}
                >
                  {hasChanges ? 'Deshacer cambios' : 'Historial'}
                </button>
              </div>

              {firstPendingChange ? (
                <>
                  <h3 className={styles.historialTitle}>Confirme sus cambios</h3>
                  <div className={styles.auditDetails}>{firstPendingChange.label}</div>
                  <div className={styles.auditChangeBox}>
                    <span style={{ color: '#9ca3af' }}>Valor:</span>
                    <span className={styles.oldValue}>{firstPendingChange.oldValue}</span>
                    <span>→</span>
                    <span className={styles.newValue}>{firstPendingChange.newValue}</span>
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
                          <span className={styles.oldValue}>{log.changes[0].oldValue}</span>
                          <span>→</span>
                          <span className={styles.newValue}>{log.changes[0].newValue}</span>
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

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        title="Confirmar actualización"
        message="¿Está seguro de guardar los cambios realizados en los parámetros de seguridad del sistema?"
        type="warning"
        confirmText="Confirmar"
        cancelText="Cancelar"
        isLoading={isLoading}
      />
    </div>
  );
}
