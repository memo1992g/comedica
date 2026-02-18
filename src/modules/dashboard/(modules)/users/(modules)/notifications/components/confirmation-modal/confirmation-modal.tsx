'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import styles from './styles/confirmation-modal.module.css';

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({ onClose, onConfirm }: ConfirmationModalProps) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Confirmación</h2>
          <p className={styles.modalSubtitle}>
            ¿Está seguro que desea enviar esta notificación a los destinatarios seleccionados? Esta acción no se puede deshacer.
          </p>
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            No, cancelar
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            Sí, enviar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
