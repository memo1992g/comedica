'use client';

import React from 'react';
import styles from './ConfirmChangesModal.module.css';

interface ConfirmChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function ConfirmChangesModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h2 className={styles.title}>Confirmar cambios</h2>
          <p className={styles.message}>
            ¿Está seguro que desea guardar los cambios realizados?
          </p>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.btnCancel}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className={styles.btnConfirm}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
