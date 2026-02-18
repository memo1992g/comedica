import { CheckCircle, Info } from 'lucide-react';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import UserStateEmpty from './components/user-state-empty';
import UserStateHeader from './components/user-state-header';
import ToggleSections from './components/toggle-sections';
import { useUserStateForm } from './hooks/use-user-state-form';
import type { UserStatePanelProps } from './interfaces/UserStatePanel.types';
import styles from './styles/state-management.module.css';

export default function UserStatePanel({ user, onSave }: UserStatePanelProps) {
  const {
    action,
    comment,
    canSave,
    toggles,
    setAction,
    setComment,
    handleToggle,
  } = useUserStateForm();

  if (!user) {
    return <UserStateEmpty />;
  }

  return (
    <div className={styles.stateContainer}>
      <UserStateHeader user={user} />
      <div className={styles.formCard}>
        <div className={styles.formCardHeader}>Gestión de Estado</div>
        <div className={styles.formCardBody}>
          <div className={styles.statusBadge}>
            <div className={styles.statusIcon}>
              <CheckCircle size={20} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Activo</span>
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

          <ToggleSections toggles={toggles} onToggle={handleToggle} />

          <div className={styles.fieldGroup}>
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
      </div>
    </div>
  );
}
