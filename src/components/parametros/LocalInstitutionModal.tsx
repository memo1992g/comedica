'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import styles from './Modal.module.css';

interface Institution {
  id?: string;
  bic: string;
  shortName: string;
  fullName: string;
  institution: string;
  status: string;
  compensation: string;
  country: string;
  products: string[];
  description: string;
}

interface InstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (institution: Institution) => Promise<void>;
  institution?: Institution | null;
  mode: 'create' | 'edit';
}

const PRODUCTS = ['Ahorro', 'Corriente', 'Credito', 'Tarjeta', 'Movil'];

function normalizeInstitutionPayload(data: Institution): Institution {
  const bic = data.bic.trim().toUpperCase();
  const institutionName = (data.institution || data.fullName).trim();
  const shortName = (data.shortName || institutionName).trim();

  return {
    ...data,
    bic,
    institution: institutionName,
    fullName: institutionName,
    shortName,
    compensation: data.compensation?.trim() || '000',
    description: (data.description || institutionName).trim(),
  };
}

export function LocalInstitutionModal({
  isOpen,
  onClose,
  onSave,
  institution,
  mode,
}: InstitutionModalProps) {
  const [formData, setFormData] = useState<Institution>({
    bic: '',
    shortName: '',
    fullName: '',
    institution: '',
    status: 'Activo',
    compensation: '',
    country: 'El Salvador',
    products: [],
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && institution) {
        setFormData(institution);
      } else {
        setFormData({
          bic: '',
          shortName: '',
          fullName: '',
          institution: '',
          status: 'Activo',
          compensation: '',
          country: 'El Salvador',
          products: [],
          description: '',
        });
      }
      setShowConfirmation(false);
      setErrorMessage('');
    }
  }, [isOpen, mode, institution]);

  const handleChange = (field: keyof Institution, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleProduct = (product: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  };

  const handleSubmit = () => {
    setErrorMessage('');
    if (!formData.bic.trim() || !(formData.institution || formData.fullName).trim()) {
      setErrorMessage('Complete los campos obligatorios para continuar.');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const payload = normalizeInstitutionPayload(formData);
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      setErrorMessage(error instanceof Error ? error.message : 'No fue posible guardar la institución.');
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
          {errorMessage && (
            <p style={{ margin: 0, color: '#b91c1c', fontSize: '13px' }}>{errorMessage}</p>
          )}
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
          <div className={styles.formGrid}>
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

            <div className={styles.formField}>
              <label className={styles.formLabel}>Compensación</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="000"
                value={formData.compensation}
                onChange={(e) => handleChange('compensation', e.target.value)}
              />
            </div>
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
              Nombre de la Institución <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Banco Ejemplo S.A."
              value={formData.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Nombre corto</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="BCO. Ej."
              value={formData.shortName}
              onChange={(e) => handleChange('shortName', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Descripción</label>
            <textarea
              className={styles.formInput}
              placeholder="Descripción de la institución"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel} style={{ marginBottom: '12px', display: 'block' }}>
            Productos Habilitados
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PRODUCTS.map((product) => (
              <label
                key={product}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.products.includes(product)}
                  onChange={() => toggleProduct(product)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                {product}
              </label>
            ))}
          </div>
        </div>
      {errorMessage && (
        <p style={{ margin: '0 0 10px 0', color: '#b91c1c', fontSize: '13px' }}>{errorMessage}</p>
      )}

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
          disabled={!formData.bic.trim() || !(formData.institution || formData.fullName).trim()}
        >
          Guardar
        </button>
      </ModalFooter>
    </Modal>
  );
}
