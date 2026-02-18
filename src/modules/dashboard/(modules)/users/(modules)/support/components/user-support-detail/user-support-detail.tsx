import React from 'react';
import { Search, Shield } from 'lucide-react';
import StateManagementForm from '../state-management-form/state-management-form';
import type { SupportUser } from '../../data/mock-data';
import styles from './styles/user-support-detail.module.css';

interface UserSupportDetailProps {
  user: SupportUser | null;
  verificationState: 'pending' | 'completed';
  onSave: () => void;
}

export default function UserSupportDetail({ user, verificationState, onSave }: UserSupportDetailProps) {
  if (!user) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Search className={styles.emptyIconSvg} />
        </div>
        <p className={styles.emptyTitle}>Seleccione un usuario</p>
        <p className={styles.emptyText}>
          Realice una búsqueda para gestionar el estado del usuario
        </p>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      <div className={styles.bannerSection}>
        <div className={styles.banner} />
        <div className={styles.bannerInner}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>{user.initials}</div>
          </div>
          <h3 className={styles.userName}>{user.name}</h3>
          <p className={styles.userMeta}>
            ID: {user.id} <span className={styles.dot}>•</span> DUI: {user.dui}
          </p>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formCardHeader}>Gestión de Estado</div>
        {verificationState === 'completed' ? (
          <StateManagementForm user={user} onSave={onSave} />
        ) : (
          <div className={styles.verificationRequired}>
            <div className={styles.verificationIcon}>
              <Shield size={28} />
            </div>
            <p className={styles.verificationTitle}>
              Verificación de seguridad requerida
            </p>
            <p className={styles.verificationText}>
              Debe completar la verificación de seguridad seleccionando un tipo
              de atención y respondiendo las preguntas de seguridad antes de
              poder gestionar este usuario.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
