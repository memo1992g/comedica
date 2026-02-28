"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import styles from "./styles/ConfirmUpdateModal.module.css";

interface ConfirmUpdateModalProps {
  roleName: string;
  saving: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmUpdateModal({
  roleName,
  saving,
  error,
  onCancel,
  onConfirm,
}: Readonly<ConfirmUpdateModalProps>) {
  return (
    <Dialog open onOpenChange={() => !saving && onCancel()}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>Confirmar Actualización</h2>
          <p className={styles.modalSubtitle}>
            ¿Está seguro de que desea actualizar el rol{" "}
            <strong>{roleName}</strong>?
          </p>
          <p className={styles.modalDescription}>
            Los cambios se aplicarán inmediatamente a todos los usuarios
            asignados a este rol.
          </p>
          {error && <span className={styles.errorText}>{error}</span>}
        </div>
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={saving}
          >
            No, cancelar
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? "Actualizando..." : "Sí, actualizar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
