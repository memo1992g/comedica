import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { AttentionType } from '../../data/mock-data';
import { securityQuestions } from '../../data/mock-data';
import styles from './styles/security-modal.module.css';

interface SecurityVerificationModalProps {
  attentionType: AttentionType;
  onClose: () => void;
  onVerified: () => void;
}

export default function SecurityVerificationModal({
  attentionType, onClose, onVerified,
}: SecurityVerificationModalProps) {
  const questions = securityQuestions.slice(0, attentionType.questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [failures, setFailures] = useState(0);
  const [exceeded, setExceeded] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleVerify = () => {
    if (!answer.trim()) return;

    if (answer.trim().toLowerCase() !== currentQuestion.answer.toLowerCase()) {
      const newFailures = failures + 1;
      setFailures(newFailures);
      if (newFailures >= attentionType.maxFailures) {
        setExceeded(true);
        return;
      }
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
    } else {
      onVerified();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !exceeded) {
      handleVerify();
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Verificación de Seguridad</h2>
          <p className={styles.modalSubtitle}>
            Tipo de atención: {attentionType.name}
          </p>
          <p className={styles.modalProgress}>
            Pregunta {currentIndex + 1} de {questions.length}
          </p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="security-answer">
            {currentQuestion.question}
          </label>
          <input
            id="security-answer"
            className={styles.fieldInput}
            type="text"
            placeholder="Ingrese su respuesta"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={exceeded}
          />
          <p className={styles.fieldHint}>Presione Enter para continuar</p>
        </div>

        {exceeded && (
          <p className={styles.errorMessage}>
            Ha excedido el límite de {attentionType.maxFailures} respuestas incorrectas. Intente nuevamente más tarde.
          </p>
        )}

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className={styles.verifyButton}
            onClick={handleVerify}
            type="button"
            disabled={exceeded || !answer.trim()}
          >
            Verificar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
