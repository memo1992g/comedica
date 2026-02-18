'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { UserLimits } from '@/types';
import styles from './Modal.module.css';

interface EditUserLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (limits: UserLimits['limits']) => Promise<void>;
  user: UserLimits | null;
}

export function EditUserLimitsModal({
  isOpen,
  onClose,
  onSave,
  user,
}: EditUserLimitsModalProps) {
  const [limits, setLimits] = useState<UserLimits['limits']>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setLimits(JSON.parse(JSON.stringify(user.limits)));
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(limits);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar límites de usuario"
      subtitle={`Configurando límites para ${user.userName} (${user.userCode})`}
    >
      <ModalBody>
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Parámetros Canales Electrónicos</h3>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Máximo por transacción</label>
              <input
                type="number"
                className={styles.formInput}
                value={limits.canalesElectronicos?.maxPerTransaction || 0}
                onChange={(e) =>
                  setLimits({
                    ...limits,
                    canalesElectronicos: {
                      ...limits.canalesElectronicos,
                      maxPerTransaction: Number(e.target.value),
                      maxDaily: limits.canalesElectronicos?.maxDaily || 0,
                      maxMonthly: limits.canalesElectronicos?.maxMonthly || 0,
                    },
                  })
                }
                step="0.01"
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Máximo diario</label>
              <input
                type="number"
                className={styles.formInput}
                value={limits.canalesElectronicos?.maxDaily || 0}
                onChange={(e) =>
                  setLimits({
                    ...limits,
                    canalesElectronicos: {
                      ...limits.canalesElectronicos,
                      maxPerTransaction: limits.canalesElectronicos?.maxPerTransaction || 0,
                      maxDaily: Number(e.target.value),
                      maxMonthly: limits.canalesElectronicos?.maxMonthly || 0,
                    },
                  })
                }
                step="0.01"
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Máximo mensual</label>
              <input
                type="number"
                className={styles.formInput}
                value={limits.canalesElectronicos?.maxMonthly || 0}
                onChange={(e) =>
                  setLimits({
                    ...limits,
                    canalesElectronicos: {
                      ...limits.canalesElectronicos,
                      maxPerTransaction: limits.canalesElectronicos?.maxPerTransaction || 0,
                      maxDaily: limits.canalesElectronicos?.maxDaily || 0,
                      maxMonthly: Number(e.target.value),
                    },
                  })
                }
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Transfer 365</h3>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Monto máximo</label>
              <input
                type="number"
                className={styles.formInput}
                value={limits.transfer365?.maxAmount || 0}
                onChange={(e) =>
                  setLimits({
                    ...limits,
                    transfer365: {
                      maxAmount: Number(e.target.value),
                    },
                  })
                }
                step="0.01"
              />
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button 
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button 
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className={styles.spinner} />
              Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
}
