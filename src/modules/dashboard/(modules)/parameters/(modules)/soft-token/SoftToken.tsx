'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ConfirmChangesModal from './components/ConfirmChangesModal/ConfirmChangesModal';
import { useSoftToken } from './hooks/use-soft-token';
import OperationCards from './components/OperationCards/OperationCards';
import AuditSidebar from './components/AuditSidebar/AuditSidebar';
import styles from './styles/SoftToken.module.css';

export default function SoftToken() {
  const router = useRouter();
  const {
    editedConfig,
    groupedChanges,
    hasChanges,
    isLoading,
    isInitialLoading,
    loadError,
    showConfirmation,
    setShowConfirmation,
    updateTransaction,
    updateAdmin,
    handleSave,
    handleConfirm,
    retryLoad,
  } = useSoftToken();

  if (isInitialLoading && !editedConfig) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>Cargando...</div>
      </div>
    );
  }

  if (!editedConfig) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <p>No se pudo inicializar la vista de Soft Token.</p>
          <button type="button" onClick={retryLoad}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Solicitud de Soft Token</h1>
          <p>Configuración de operaciones y gestiones que requieren verificación mediante Soft Token</p>
          {loadError && <p>{loadError}</p>}
        </div>

        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <OperationCards
              label="Operaciones Transaccionales:"
              items={editedConfig.transactions}
              showAmount
              onChangeAmount={(key, val) => updateTransaction(key, 'amount', val)}
              onChangeRequired={(key, val) => updateTransaction(key, 'requiresSoftToken', val)}
            />
            <OperationCards
              label="Gestiones Administrativas:"
              items={editedConfig.administrative}
              onChangeRequired={(key, val) => updateAdmin(key, val)}
            />
          </div>

          <AuditSidebar
            groupedChanges={groupedChanges}
            hasChanges={hasChanges}
            isLoading={isLoading}
            onSave={handleSave}
            onHistorial={() => router.push('/dashboard/parametros/solicitud-soft-token/historial')}
          />
        </div>
      </div>

      <ConfirmChangesModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </div>
  );
}
