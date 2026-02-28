"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import styles from "./ConfirmDetailsModal.module.css";

export interface ConfirmDetailRow {
  label: string;
  value: string;
}

interface ConfirmDetailsModalProps {
  title: string;
  subtitle?: string;
  successMessage?: string;
  details: ConfirmDetailRow[];
  saving?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDetailsModal({
  title,
  subtitle,
  successMessage,
  details,
  saving = false,
  onCancel,
  onConfirm,
}: Readonly<ConfirmDetailsModalProps>) {
  return (
    <Dialog open onOpenChange={() => !saving && onCancel()}>
      <DialogContent className={styles.overlay}>
        <div className={styles.body}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          <table className={styles.table}>
            <tbody>
              {details.map((d) => (
                <tr key={d.label}>
                  <td className={styles.labelCell}>{d.label}</td>
                  <td className={styles.valueCell}>{d.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {successMessage && (
            <div className={styles.successBox}>
              <CheckCircle size={18} className={styles.successIcon} />
              <div>
                <p className={styles.successTitle}>{successMessage}</p>
                <p className={styles.successText}>
                  Los cambios se reflejarán en el sistema
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
