'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { parametersService } from '@/lib/api/parameters.service';
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

export default function ConfiguracionesSeguridadPage() {
  const router = useRouter();
  
  // Estado para configuración
  const [config, setConfig] = useState<SecurityConfig | null>(null);
  const [editedConfig, setEditedConfig] = useState<SecurityConfig | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para auditoría
  const [recentAudit, setRecentAudit] = useState<AuditLog[]>([]);

  useEffect(() => {
    loadConfig();
    loadRecentAudit();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await parametersService.getSecurityConfig();
      setConfig(data);
      setEditedConfig(data);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  const loadRecentAudit = async () => {
    try {
      const data = await parametersService.getRecentAudit(5);
      setRecentAudit(data);
    } catch (error) {
      console.error('Error al cargar auditoría:', error);
    }
  };

  const handleChange = (field: keyof SecurityConfig, value: number) => {
    if (!editedConfig) return;
    setEditedConfig({
      ...editedConfig,
      [field]: value,
    });
  };

  const getChanges = () => {
    if (!config || !editedConfig) return {};
    
    const changes: any = {};
    const fields = [
      'passwordExpiration',
      'sessionTimeout',
      'minUsernameLength',
      'maxUsernameLength',
      'minPasswordLength',
      'maxPasswordLength',
      'codeExpiration',
      'softTokenExpiration',
    ];

    fields.forEach((field) => {
      const key = field as keyof SecurityConfig;
      if (config[key] !== editedConfig[key]) {
        changes[field] = {
          old: config[key],
          new: editedConfig[key],
        };
      }
    });

    return changes;
  };

  const hasChanges = () => {
    return Object.keys(getChanges()).length > 0;
  };

  const handleSave = () => {
    const changes = getChanges();
    setPendingChanges(changes);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!editedConfig) return;
    
    setIsLoading(true);
    try {
      await parametersService.updateSecurityConfig(editedConfig);
      await loadConfig();
      await loadRecentAudit();
      setShowConfirmation(false);
      setPendingChanges({});
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

  const getFieldLabel = (field: string): string => {
    const labels: any = {
      passwordExpiration: 'Vigencia de Contraseña (días)',
      sessionTimeout: 'Tiempo de sesión (segundos)',
      minUsernameLength: 'Longitud mínima de usuario',
      maxUsernameLength: 'Longitud máxima de usuario',
      minPasswordLength: 'Longitud mínima de contraseña',
      maxPasswordLength: 'Longitud máxima de contraseña',
      codeExpiration: 'Vigencia de códigos (segundos)',
      softTokenExpiration: 'Vigencia Soft-Token (segundos)',
    };
    return labels[field] || field;
  };

  if (!config || !editedConfig) {
    return (
      <div className={styles.container}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <a href="/parametros">Parámetros</a>
        <ChevronRight size={16} />
        <span>Configuraciones de Seguridad</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Configuraciones de Seguridad</h1>
          <p>En esta pantalla se llevará a cabo la configuración de parámetros de usuarios de BEL</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => router.push('/parametros/seguridad/historial')}
          >
            Historial
          </button>
          <button 
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSave}
            disabled={!hasChanges()}
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.mainContent}>
          {/* Parámetros Generales */}
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Parámetros Generales</h2>
            <div className={styles.limitFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Vigencia de Contraseñas (Días)</label>
                <input
                  type="number"
                  className={styles.fieldValue}
                  value={editedConfig.passwordExpiration}
                  onChange={(e) => handleChange('passwordExpiration', Number(e.target.value))}
                  style={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    cursor: 'text',
                  }}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Tiempo de Sesión (Segundos)</label>
                <input
                  type="number"
                  className={styles.fieldValue}
                  value={editedConfig.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', Number(e.target.value))}
                  style={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    cursor: 'text',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Longitud de Usuarios */}
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Longitud de Usuarios</h2>
            <div className={styles.limitFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Valor mínimo (caracteres)</label>
                <input
                  type="number"
                  className={styles.fieldValue}
                  value={editedConfig.minUsernameLength}
                  onChange={(e) => handleChange('minUsernameLength', Number(e.target.value))}
                  style={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    cursor: 'text',
                  }}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Valor máximo (caracteres)</label>
                <input
                  type="number"
                  className={styles.fieldValue}
                  value={editedConfig.maxUsernameLength}
                  onChange={(e) => handleChange('maxUsernameLength', Number(e.target.value))}
                  style={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    cursor: 'text',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Longitud de Contraseña */}
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Longitud de Contraseña</h2>
            <div className={styles.limitFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Valor mínimo (caracteres)</label>
                <input
                  type="number"
                  className={styles.fieldValue}
                  value={editedConfig.minPasswordLength}
                  onChange={(e) => handleChange('minPasswordLength', Number(e.target.value))}
                  style={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    cursor: 'text',
                  }}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Valor máximo (caracteres)</label>
                <input
                  type="number"
                  className={styles.fieldValue}
                  value={editedConfig.maxPasswordLength}
                  onChange={(e) => handleChange('maxPasswordLength', Number(e.target.value))}
                  style={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    cursor: 'text',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Vigencia de Códigos */}
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Vigencia de Códigos</h2>
            <div className={styles.limitFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Vigencia de códigos (Segundos)</label>
                <input
                  type="number"
                  className={styles.fieldValue}
                  value={editedConfig.codeExpiration}
                  onChange={(e) => handleChange('codeExpiration', Number(e.target.value))}
                  style={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    cursor: 'text',
                  }}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Vigencia Soft-Token (Segundos)</label>
                <input
                  type="number"
                  className={styles.fieldValue}
                  value={editedConfig.softTokenExpiration}
                  onChange={(e) => handleChange('softTokenExpiration', Number(e.target.value))}
                  style={{ 
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    cursor: 'text',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Historial de Auditoría */}
        <div className={styles.sidebar}>
          <div className={styles.historialPanel}>
            <div className={styles.historialHeader}>
              <h3 className={styles.historialTitle}>Historial de Auditoría</h3>
              <button 
                className={styles.viewAllBtn}
                onClick={() => router.push('/parametros/seguridad/historial')}
              >
                Ver todo
              </button>
            </div>

            {recentAudit.map((log) => (
              <div key={log.id} className={styles.auditItem}>
                <div className={styles.auditUser}>{log.userName}</div>
                <div className={styles.auditTime}>
                  {formatDate(log.timestamp)} - {formatTime(log.timestamp)}
                </div>
                <div className={styles.auditDetails}>{log.details}</div>
                {log.changes && log.changes.length > 0 && (
                  <div className={styles.auditChange}>
                    <span className={styles.oldValue}>{log.changes[0].oldValue}</span>
                    <span>→</span>
                    <span className={styles.newValue}>{log.changes[0].newValue}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        title="Confirmación"
        message="¿Está seguro de guardar los cambios realizados en los parámetros de seguridad del sistema?"
        type="info"
        confirmText="Sí, guardar"
        cancelText="No, cancelar"
        isLoading={isLoading}
      />
    </div>
  );
}
