import React, { useState } from 'react';
import { CheckCircle, Info } from 'lucide-react';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import type { SupportUser } from '../../data/mock-data';
import styles from './styles/state-form.module.css';

interface ToggleSection {
  title: string;
  description: string;
  options: { label: string; hint: string; key: string }[];
}

const TOGGLE_SECTIONS: ToggleSection[] = [
  {
    title: 'Código de Verificación',
    description: 'Métodos de envío para códigos de autenticación de dos factores',
    options: [
      { label: 'Correo Electrónico', hint: 'Enviar código por correo electrónico', key: 'verificacion_email' },
      { label: 'SMS', hint: 'Enviar código por mensaje de texto', key: 'verificacion_sms' },
    ],
  },
  {
    title: 'Cambio de Contraseña',
    description: 'Notificaciones cuando un usuario cambia su contraseña',
    options: [
      { label: 'Correo Electrónico', hint: 'Notificar por correo electrónico', key: 'password_email' },
      { label: 'SMS', hint: 'Notificar por mensaje de texto', key: 'password_sms' },
    ],
  },
  {
    title: 'Vinculación de Token',
    description: 'Confirmaciones para vincular nuevos dispositivos o tokens de seguridad',
    options: [
      { label: 'Correo Electrónico', hint: 'Solicitar confirmación por correo', key: 'token_email' },
      { label: 'SMS', hint: 'Solicitar confirmación por SMS', key: 'token_sms' },
    ],
  },
];

interface StateManagementFormProps {
  user: SupportUser;
  onSave: () => void;
}

export default function StateManagementForm({ user, onSave }: StateManagementFormProps) {
  const [action, setAction] = useState('');
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    verificacion_email: true,
    password_email: true,
    token_email: true,
  });
  const [comment, setComment] = useState('');

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const canSave = action && comment.trim();

  return (
    <div className={styles.formCardBody}>
      <div className={styles.statusBadge}>
        <div className={styles.statusIcon}>
          <CheckCircle size={20} />
        </div>
        <div className={styles.statusInfo}>
          <span className={styles.statusLabel}>{user.status}</span>
          <span className={styles.statusDesc}>
            El usuario puede acceder normalmente al sistema
          </span>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <p className={styles.fieldLabel}>Acción a Realizar</p>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className={styles.selectField}>
            <SelectValue placeholder="Seleccione una acción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activar">Activar</SelectItem>
            <SelectItem value="desactivar">Desactivar</SelectItem>
            <SelectItem value="bloquear">Bloquear</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={styles.sectionsWrapper}>
        {TOGGLE_SECTIONS.map((section) => (
          <div key={section.title} className={styles.toggleSection}>
            <p className={styles.sectionTitle}>{section.title}</p>
            <p className={styles.sectionDesc}>{section.description}</p>
            <div className={styles.toggleGroup}>
              {section.options.map((opt) => (
                <div key={opt.key} className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>{opt.label}</span>
                    <span className={styles.toggleHint}>{opt.hint}</span>
                  </div>
                  <button
                    className={`${styles.toggle} ${toggles[opt.key] ? styles.toggleOn : styles.toggleOff}`}
                    onClick={() => handleToggle(opt.key)}
                    type="button"
                    aria-label={`${opt.label} ${toggles[opt.key] ? 'activado' : 'desactivado'}`}
                  >
                    <span className={`${styles.toggleKnob} ${toggles[opt.key] ? styles.toggleKnobOn : styles.toggleKnobOff}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.fieldGroup} style={{ marginTop: 24 }}>
        <p className={styles.fieldLabel}>
          Motivo / Comentario <span className={styles.required}>*</span>
        </p>
        <textarea
          className={styles.textarea}
          placeholder="Ingrese el motivo de la acción. El asociado debe comunicarse a comédica vía telefónica."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className={styles.helpText}>
          <Info size={12} className={styles.helpIcon} />
          <span>El asociado debe comunicarse vía telefónica para realizar esta operación</span>
        </div>
      </div>

      <div className={styles.footerDivider}>
        <button
          className={styles.saveButton}
          onClick={onSave}
          disabled={!canSave}
          type="button"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
