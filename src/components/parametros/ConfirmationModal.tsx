'use client';

import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import styles from './Modal.module.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'info' | 'danger';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ModalBody>
        <div className={`${styles.alert} ${styles[type]}`}>
          <div className={styles.alertIcon}>
            {type === 'warning' && <AlertTriangle size={20} />}
            {type === 'info' && <CheckCircle size={20} />}
            {type === 'danger' && <AlertTriangle size={20} />}
          </div>
          <div className={styles.alertContent}>
            <p className={styles.alertMessage}>{message}</p>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button 
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button 
          className={`${styles.btn} ${type === 'danger' ? styles.btnDanger : styles.btnPrimary}`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className={styles.spinner} />
              Procesando...
            </>
          ) : (
            confirmText
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
}
