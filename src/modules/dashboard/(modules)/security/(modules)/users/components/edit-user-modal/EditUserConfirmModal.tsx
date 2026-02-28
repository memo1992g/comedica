"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import styles from "./styles/EditUserModal.module.css";

interface EditUserConfirmModalProps {
  username: string;
  email: string;
  phone: string;
  status: string;
  hasNewPassword: boolean;
  saving: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function EditUserConfirmModal({
  username,
  email,
  phone,
  status,
  hasNewPassword,
  saving,
  error,
  onCancel,
  onConfirm,
}: Readonly<EditUserConfirmModalProps>) {
  return (
    <Dialog open onOpenChange={() => !saving && onCancel()}>
      <DialogContent className={styles.confirmModal}>
        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>Confirmación</h2>
          <p className={styles.modalSubtitle}>Revise los datos antes de confirmar</p>

          <div className={styles.confirmSection}>
            <h3 className={styles.confirmSectionTitle}>Datos del Usuario</h3>
            <div className={styles.confirmGrid}>
              <div>
                <span className={styles.confirmLabel}>Username</span>
                <span className={styles.confirmValue}>{username}</span>
              </div>
              <div>
                <span className={styles.confirmLabel}>Email</span>
                <span className={styles.confirmValue}>{email}</span>
              </div>
              {phone && (
                <div>
                  <span className={styles.confirmLabel}>Teléfono</span>
                  <span className={styles.confirmValue}>{phone}</span>
                </div>
              )}
              <div>
                <span className={styles.confirmLabel}>Estado</span>
                <span className={styles.confirmValue}>{status}</span>
              </div>
              {hasNewPassword && (
                <div>
                  <span className={styles.confirmLabel}>Contraseña</span>
                  <span className={styles.confirmValue}>••••••••</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.confirmSuccessBox}>
            <CheckCircle size={18} className={styles.confirmSuccessIcon} />
            <div>
              <p className={styles.confirmSuccessTitle}>Se guardarán los cambios del usuario</p>
              <p className={styles.confirmSuccessText}>Los cambios se aplicarán de inmediato</p>
            </div>
          </div>

          {error && <span className={styles.errorText}>{error}</span>}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={saving}>
            No, cancelar
          </button>
          <button type="button" className={styles.saveBtn} onClick={onConfirm} disabled={saving}>
            {saving ? "Guardando..." : "Sí, guardar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
