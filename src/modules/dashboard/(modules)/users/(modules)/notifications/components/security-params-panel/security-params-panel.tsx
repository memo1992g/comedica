'use client';

import React, { useState } from 'react';
import styles from './styles/security-params.module.css';

interface ToggleState {
  verificationEmail: boolean;
  verificationSms: boolean;
  passwordEmail: boolean;
  passwordSms: boolean;
  tokenEmail: boolean;
  tokenSms: boolean;
}

interface SecurityParamsPanelProps {
  onDirtyChange?: (dirty: boolean) => void;
}

const initialState: ToggleState = {
  verificationEmail: true,
  verificationSms: true,
  passwordEmail: true,
  passwordSms: false,
  tokenEmail: false,
  tokenSms: true,
};

export default function SecurityParamsPanel({ onDirtyChange }: SecurityParamsPanelProps) {
  const [toggles, setToggles] = useState<ToggleState>(initialState);

  const handleToggle = (key: keyof ToggleState) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      onDirtyChange?.(JSON.stringify(next) !== JSON.stringify(initialState));
      return next;
    });
  };

  const renderToggle = (key: keyof ToggleState, label: string, hint: string) => {
    const isOn = toggles[key];
    return (
      <div className={styles.toggleRow}>
        <div className={styles.toggleInfo}>
          <span className={styles.toggleLabel}>{label}</span>
          <span className={styles.toggleHint}>{hint}</span>
        </div>
        <button
          type="button"
          className={`${styles.toggle} ${isOn ? styles.toggleOn : styles.toggleOff}`}
          onClick={() => handleToggle(key)}
          aria-label={`${label} ${isOn ? 'activado' : 'desactivado'}`}
        >
          <span className={`${styles.toggleKnob} ${isOn ? styles.toggleKnobOn : styles.toggleKnobOff}`} />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.paramsContainer}>
      <div className={styles.toggleSection}>
        <h3 className={styles.sectionTitle}>Código de Verificación</h3>
        <p className={styles.sectionDesc}>Métodos de envío para códigos de autenticación de dos factores</p>
        <div className={styles.toggleGroup}>
          {renderToggle('verificationEmail', 'Correo Electrónico', 'Enviar código por correo electrónico')}
          {renderToggle('verificationSms', 'SMS', 'Enviar código por mensaje de texto')}
        </div>
      </div>

      <div className={styles.toggleSection}>
        <h3 className={styles.sectionTitle}>Cambio de Contraseña</h3>
        <p className={styles.sectionDesc}>Notificaciones cuando un usuario cambia su contraseña</p>
        <div className={styles.toggleGroup}>
          {renderToggle('passwordEmail', 'Correo Electrónico', 'Notificar por correo electrónico')}
          {renderToggle('passwordSms', 'SMS', 'Notificar por mensaje de texto')}
        </div>
      </div>

      <div className={styles.toggleSection}>
        <h3 className={styles.sectionTitle}>Vinculación de Token</h3>
        <p className={styles.sectionDesc}>Confirmaciones para vincular nuevos dispositivos o tokens de seguridad</p>
        <div className={styles.toggleGroup}>
          {renderToggle('tokenEmail', 'Correo Electrónico', 'Solicitar confirmación por correo')}
          {renderToggle('tokenSms', 'SMS', 'Solicitar confirmación por SMS')}
        </div>
      </div>
    </div>
  );
}
