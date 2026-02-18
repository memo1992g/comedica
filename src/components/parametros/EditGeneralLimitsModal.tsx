'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { TransactionLimits } from '@/types';
import styles from './Modal.module.css';

interface EditGeneralLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (limits: Partial<TransactionLimits>[]) => Promise<void>;
  limits: TransactionLimits[];
}

export function EditGeneralLimitsModal({
  isOpen,
  onClose,
  onSave,
  limits,
}: EditGeneralLimitsModalProps) {
  const [editedLimits, setEditedLimits] = useState<TransactionLimits[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditedLimits(JSON.parse(JSON.stringify(limits)));
      setShowConfirmation(false);
    }
  }, [isOpen, limits]);

  const handleChange = (id: string, field: keyof TransactionLimits, value: number) => {
    setEditedLimits((prev) =>
      prev.map((limit) =>
        limit.id === id ? { ...limit, [field]: value } : limit
      )
    );
  };

  const getChanges = () => {
    const changes: Array<{
      label: string;
      oldValue: number;
      newValue: number;
    }> = [];

    editedLimits.forEach((edited) => {
      const original = limits.find((l) => l.id === edited.id);
      if (!original) return;

      const categoryLabel = getCategoryLabel(edited.category, edited.subcategory);

      if (edited.maxPerTransaction !== original.maxPerTransaction) {
        changes.push({
          label: `${categoryLabel} - Máximo por transacción`,
          oldValue: original.maxPerTransaction,
          newValue: edited.maxPerTransaction,
        });
      }

      if (edited.maxDaily && original.maxDaily && edited.maxDaily !== original.maxDaily) {
        changes.push({
          label: `${categoryLabel} - Máximo diario`,
          oldValue: original.maxDaily,
          newValue: edited.maxDaily,
        });
      }

      if (edited.maxMonthly && original.maxMonthly && edited.maxMonthly !== original.maxMonthly) {
        changes.push({
          label: `${categoryLabel} - Máximo mensual`,
          oldValue: original.maxMonthly,
          newValue: edited.maxMonthly,
        });
      }

      if (edited.maxMonthlyTransactions && original.maxMonthlyTransactions && 
          edited.maxMonthlyTransactions !== original.maxMonthlyTransactions) {
        changes.push({
          label: `${categoryLabel} - Cantidad de transacciones mensuales`,
          oldValue: original.maxMonthlyTransactions,
          newValue: edited.maxMonthlyTransactions,
        });
      }
    });

    return changes;
  };

  const getCategoryLabel = (category: string, subcategory?: string) => {
    if (category === 'canales_electronicos') return 'Canales Electrónicos';
    if (category === 'punto_xpress' && subcategory === 'cuentas_ahorro') return 'Punto Xpress - Ahorros';
    if (category === 'punto_xpress' && subcategory === 'cuentas_corriente') return 'Punto Xpress - Corriente';
    return category;
  };

  const handleNext = () => {
    const changes = getChanges();
    if (changes.length > 0) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onSave(editedLimits);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changes = getChanges();
  const hasChanges = changes.length > 0;

  const canalesElectronicos = editedLimits.find((l) => l.category === 'canales_electronicos');
  const puntoXpressAhorro = editedLimits.find((l) => l.category === 'punto_xpress' && l.subcategory === 'cuentas_ahorro');
  const puntoXpressCorriente = editedLimits.find((l) => l.category === 'punto_xpress' && l.subcategory === 'cuentas_corriente');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={showConfirmation ? 'Confirme sus cambios' : 'Límites y Montos'}
      subtitle={!showConfirmation ? 'Administre los límites transaccionales generales y por usuario.' : undefined}
      size="large"
    >
      <ModalBody>
        {showConfirmation ? (
          <div className={styles.confirmPanel}>
            <h3 className={styles.confirmTitle}>
              {changes.length === 1 
                ? 'Se realizará el siguiente cambio:' 
                : `Se realizarán ${changes.length} cambios:`}
            </h3>
            {changes.map((change, idx) => (
              <div key={idx} className={styles.confirmItem}>
                <span className={styles.confirmLabel}>{change.label}</span>
                <div className={styles.confirmValue}>
                  <span className={styles.oldValue}>${change.oldValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <ArrowRight size={16} className={styles.arrow} />
                  <span className={styles.newValue}>${change.newValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {canalesElectronicos && (
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Parámetros Canales Electrónicos</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Máximo por transacción</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={canalesElectronicos.maxPerTransaction}
                      onChange={(e) =>
                        handleChange(canalesElectronicos.id, 'maxPerTransaction', Number(e.target.value))
                      }
                      step="0.01"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Máximo diario</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={canalesElectronicos.maxDaily}
                      onChange={(e) =>
                        handleChange(canalesElectronicos.id, 'maxDaily', Number(e.target.value))
                      }
                      step="0.01"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Máximo mensual</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={canalesElectronicos.maxMonthly}
                      onChange={(e) =>
                        handleChange(canalesElectronicos.id, 'maxMonthly', Number(e.target.value))
                      }
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            )}

            {puntoXpressAhorro && (
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Parámetros Punto Xpress - Cuentas de Ahorro</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Máximo por transacción</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={puntoXpressAhorro.maxPerTransaction}
                      onChange={(e) =>
                        handleChange(puntoXpressAhorro.id, 'maxPerTransaction', Number(e.target.value))
                      }
                      step="0.01"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Cantidad de transacciones mensuales</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={puntoXpressAhorro.maxMonthlyTransactions || 0}
                      onChange={(e) =>
                        handleChange(puntoXpressAhorro.id, 'maxMonthlyTransactions', Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {puntoXpressCorriente && (
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Parámetros Punto Xpress - Cuentas Corriente</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Máximo por transacción</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={puntoXpressCorriente.maxPerTransaction}
                      onChange={(e) =>
                        handleChange(puntoXpressCorriente.id, 'maxPerTransaction', Number(e.target.value))
                      }
                      step="0.01"
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Cantidad de transacciones mensuales</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={puntoXpressCorriente.maxMonthlyTransactions || 0}
                      onChange={(e) =>
                        handleChange(puntoXpressCorriente.id, 'maxMonthlyTransactions', Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </ModalBody>

      <ModalFooter>
        {showConfirmation ? (
          <>
            <button 
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Deshacer cambios
            </button>
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </>
        ) : (
          <>
            <button 
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleNext}
              disabled={!hasChanges}
            >
              Continuar
            </button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}
