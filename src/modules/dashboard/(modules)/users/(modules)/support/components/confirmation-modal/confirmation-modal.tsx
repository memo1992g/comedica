import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import styles from './styles/confirmation-modal.module.css';

interface ConfirmationModalProps {
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({ userName, onClose, onConfirm }: ConfirmationModalProps) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className={styles.modal}>
        <h2 className={styles.modalTitle}>Confirmación de Cambio de Estado</h2>
        <p className={styles.modalText}>
          ¿Está seguro de guardar los cambios realizados en el estado del usuario {userName}?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose} type="button">
            No, cancelar
          </button>
          <button className={styles.confirmButton} onClick={onConfirm} type="button">
            Sí, guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
