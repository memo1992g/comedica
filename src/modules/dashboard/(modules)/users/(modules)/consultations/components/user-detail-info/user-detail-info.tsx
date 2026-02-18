import React from 'react';
import { User, AlertTriangle, Phone, Mail, UserCircle, CheckCircle, Bell } from 'lucide-react';
import type { UserResult } from '../../data/mock-data';
import styles from './styles/user-detail.module.css';

interface UserDetailInfoProps {
  user: UserResult | null;
}

export default function UserDetailInfo({ user }: UserDetailInfoProps) {
  if (!user) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <User className={styles.emptyIconSvg} />
        </div>
        <p className={styles.emptyText}>
          Seleccione un usuario para ver sus datos e historial
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

      <div className={styles.infoCard}>
        <div className={styles.infoCardHeader}>
          Información General del Usuario
        </div>
        <div className={styles.infoCardBody}>
          <div className={styles.infoField}>
            <div className={styles.infoLabel}>
              <Phone size={12} className={styles.fieldIcon} />
              Teléfono
            </div>
            <p className={styles.infoValue}>{user.phone}</p>
          </div>
          <div className={styles.infoField}>
            <div className={styles.infoLabel}>
              <Mail size={12} className={styles.fieldIcon} />
              Correo Electrónico
            </div>
            <p className={styles.infoValue}>{user.email}</p>
          </div>
          <div className={styles.infoField}>
            <div className={styles.infoLabel}>
              <UserCircle size={12} className={styles.fieldIcon} />
              Nombre de Usuario
            </div>
            <p className={styles.infoValue}>{user.username}</p>
          </div>
          <div className={styles.infoField}>
            <div className={styles.infoLabel}>
              <CheckCircle size={12} className={styles.fieldIcon} />
              Estado
            </div>
            <p className={styles.infoValue}>{user.status}</p>
          </div>
          <div className={styles.infoField}>
            <div className={styles.infoLabel}>
              <Bell size={12} className={styles.fieldIcon} />
              Modalidad de Notificación
            </div>
            <p className={styles.infoValue}>{user.notificationMode}</p>
          </div>
        </div>
      </div>

      <div className={styles.warningBox}>
        <div className={styles.warningTitle}>
          <AlertTriangle size={16} className={styles.warningIcon} />
          Comentarios en gestiones previas
        </div>
        <p className={styles.warningText}>
          Actualización de datos pendientes. Falta comprobante de domicilio reciente.
        </p>
      </div>
    </div>
  );
}
