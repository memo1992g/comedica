'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import styles from './Modal.module.css';

interface CARDInstitution {
  id?: string;
  bic: string;
  fullName: string;
  status: string;
  country: string;
}

interface CARDInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (institution: CARDInstitution) => Promise<void>;
  institution?: CARDInstitution | null;
  mode: 'create' | 'edit';
}

const COUNTRIES = [
  'Guatemala',
  'Honduras',
  'Nicaragua',
  'Costa Rica',
  'Panamá',
  'República Dominicana',
];

export function CARDInstitutionModal({
  isOpen,
  onClose,
  onSave,
  institution,
  mode,
}: CARDInstitutionModalProps) {
  const [formData, setFormData] = useState<CARDInstitution>({
    bic: '',
    fullName: '',
    status: 'Activo',
    country: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && institution) {
        setFormData(institution);
      } else {
        setFormData({
          bic: '',
          fullName: '',
          status: 'Activo',
          country: '',
        });
      }
      setShowConfirmation(false);
    }
  }, [isOpen, mode, institution]);

  const handleChange = (field: keyof CARDInstitution, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Confirmación"
      >
        <ModalBody>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
            ¿Está seguro de {mode === 'create' ? 'crear' : 'actualizar'} esta nueva institución en el sistema?
          </p>
        </ModalBody>
        <ModalFooter>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => setShowConfirmation(false)}
            disabled={isLoading}
          >
            No, cancelar
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
              'Sí, guardar'
            )}
          </button>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Agregar Institución' : 'Editar Institución'}
      subtitle={mode === 'create' ? 'Ingrese los datos de la nueva institución' : 'Modifique los datos de la institución'}
    >
      <ModalBody>
        <div className={styles.formSection}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>
              Código BIC <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="ABCDSVSS"
              value={formData.bic}
              onChange={(e) => handleChange('bic', e.target.value.toUpperCase())}
              disabled={mode === 'edit'}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Estado</label>
            <select
              className={styles.formInput}
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>
              País <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              className={styles.formInput}
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
            >
              <option value="">Seleccionar país</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>
              Nombre de la Institución <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Banco Ejemplo S.A."
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmit}
          disabled={!formData.bic || !formData.fullName || !formData.country}
        >
          Guardar
        </button>
      </ModalFooter>
    </Modal>
  );
}
