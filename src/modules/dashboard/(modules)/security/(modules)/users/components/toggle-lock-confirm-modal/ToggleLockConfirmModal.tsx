"use client";

import React from "react";
import { Lock, Unlock } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { SecurityUserI } from "@/interfaces/security";
import styles from "./ToggleLockConfirmModal.module.css";

interface ToggleLockConfirmModalProps {
  user: SecurityUserI;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ToggleLockConfirmModal({
  user,
  saving,
  onCancel,
  onConfirm,
}: Readonly<ToggleLockConfirmModalProps>) {
  const isLocked = user.status === "Bloqueado" || user.status === "bloqueado";
  const actionLabel = isLocked ? "Desbloquear" : "Bloquear";

  return (
    <Dialog open onOpenChange={() => !saving && onCancel()}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>Confirmación de Cambio de Estado</h2>
          <p className={styles.modalSubtitle}>Revise la información antes de confirmar</p>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Datos del Usuario</h3>
            <div className={styles.grid}>
              <div>
                <span className={styles.label}>Nombre</span>
                <span className={styles.value}>{user.fullName}</span>
              </div>
              <div>
                <span className={styles.label}>Username</span>
                <span className={styles.value}>{user.username}</span>
              </div>
              <div>
                <span className={styles.label}>Estado Actual</span>
                <span className={styles.value}>{user.status}</span>
              </div>
              <div>
                <span className={styles.label}>Nuevo Estado</span>
                <span className={isLocked ? styles.valueSuccess : styles.valueDanger}>
                  {isLocked ? "Activo" : "Bloqueado"}
                </span>
              </div>
            </div>
          </div>

          <div className={isLocked ? styles.successBox : styles.warningBox}>
            {isLocked
              ? <Unlock size={18} className={styles.successIcon} />
              : <Lock size={18} className={styles.warningIcon} />
            }
            <div>
              <p className={isLocked ? styles.successTitle : styles.warningTitle}>
                {isLocked
                  ? "El usuario recuperará acceso al sistema"
                  : "El usuario será bloqueado del sistema"}
              </p>
              <p className={isLocked ? styles.successText : styles.warningText}>
                {isLocked
                  ? "Podrá iniciar sesión nuevamente con sus credenciales"
                  : "No podrá iniciar sesión hasta que sea desbloqueado"}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={saving}>
            No, cancelar
          </button>
          <button
            type="button"
            className={styles.confirmBtnSuccess}
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? "Guardando..." : `Confirmar`}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
