import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import styles from './styles/security-modal.module.css';

interface SecurityModalProps {
  onClose: () => void;
  onVerify: (answer: string) => void;
}

export default function SecurityModal({ onClose, onVerify }: SecurityModalProps) {
  const [answer, setAnswer] = useState('');

  const handleVerify = () => {
    if (!answer.trim()) return;
    onVerify(answer);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Verificación de Seguridad</h2>
          <p className={styles.modalSubtitle}>
            Por favor, responda a la siguiente pregunta de seguridad para confirmar los cambios.
          </p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="security-answer">
            ¿En qué escuela estudiaste la primaria?
          </label>
          <input
            id="security-answer"
            className={styles.fieldInput}
            type="text"
            placeholder="Ingrese su respuesta"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            type="button"
          >
            No, cancelar
          </button>
          <button
            className={styles.verifyButton}
            onClick={handleVerify}
            type="button"
          >
            Verificar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
