'use client';

import React from 'react';
import { Image, Upload } from 'lucide-react';
import styles from './styles/notification-message.module.css';

interface NotificationMessageProps {
  message: string;
  onMessageChange: (message: string) => void;
}

export default function NotificationMessage({
  message,
  onMessageChange,
}: NotificationMessageProps) {
  return (
    <>
      <label className={styles.messageLabel} htmlFor="notification-message">
        Mensaje
      </label>
      <textarea
        id="notification-message"
        className={styles.messageTextarea}
        placeholder="Escriba el contenido de la notificación aquí..."
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
      />

      <div className={styles.imageSection}>
        <div className={styles.imageLabelRow}>
          <Image size={14} className={styles.imageLabelIcon} />
          <span className={styles.imageLabel}>Adjuntar imágenes</span>
        </div>
        <div className={styles.imageUploadBox} role="button" tabIndex={0}>
          <Upload size={18} className={styles.imageUploadIcon} />
          <span className={styles.imageUploadText}>Subir</span>
        </div>
      </div>
    </>
  );
}
