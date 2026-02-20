'use client';

import React from 'react';
import type { PendingChange } from '../../hooks/use-soft-token';
import styles from '../../styles/SoftToken.module.css';

interface AuditSidebarProps {
  groupedChanges: Map<string, PendingChange[]>;
  hasChanges: boolean;
  isLoading: boolean;
  onSave: () => void;
  onHistorial: () => void;
}

export default function AuditSidebar({
  groupedChanges,
  hasChanges,
  isLoading,
  onSave,
  onHistorial,
}: AuditSidebarProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarActions}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onSave}
          disabled={!hasChanges || isLoading}
        >
          Guardar Cambios
        </button>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={onHistorial}
        >
          Historial
        </button>
      </div>

      <h3 className={styles.auditTitle}>Cambios pendientes</h3>
      <div className={styles.auditList}>
        {/* Pending changes shown first */}
        {hasChanges && (
          <PendingChangesBlock groupedChanges={groupedChanges} />
        )}

        {!hasChanges && (
          <div className={styles.emptyAudit}>
            Sin cambios pendientes
          </div>
        )}
      </div>
    </div>
  );
}

function PendingChangesBlock({
  groupedChanges,
}: {
  groupedChanges: Map<string, PendingChange[]>;
}) {
  return (
    <>
      {Array.from(groupedChanges.entries()).map(([label, changes]) => (
        <div key={label} className={styles.auditEntry}>          
          <p className={styles.auditAction}>{label}</p>
          <div className={styles.changesBox}>
            {changes.map((c, i) => (
              <div key={i} className={styles.changeLine}>
                <span className={styles.changeLabel}>{c.field}:</span>
                {c.changed ? (
                  <>
                    <span className={styles.changeOld}>{c.oldValue}</span>
                    <span className={styles.changeNew}>→ {c.newValue}</span>
                  </>
                ) : (
                  <span className={styles.changeNew}>{c.oldValue} → {c.newValue}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
