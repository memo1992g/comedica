"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import styles from "./styles/EditGroupModal.module.css";

interface Change {
  field: string;
  oldValue: string;
  newValue: string;
}

interface ConfirmUpdateModalProps {
  changes: Change[];
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmUpdateModal({
  changes,
  onCancel,
  onConfirm,
}: Readonly<ConfirmUpdateModalProps>) {
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className={styles.confirmModal}>
        <div className={styles.confirmHeader}>
          <h2 className={styles.confirmTitle}>Confirmar Actualización</h2>
          <p className={styles.confirmSubtitle}>
            Se realizarán los siguientes cambios
          </p>
        </div>

        <div className={styles.confirmBody}>
          <table className={styles.confirmTable}>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Valor Anterior</th>
                <th>Nuevo Valor</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((c) => (
                <tr key={c.field}>
                  <td>{c.field}</td>
                  <td>
                    <span className={styles.oldValue}>{c.oldValue}</span>
                  </td>
                  <td>
                    <span className={styles.newValue}>{c.newValue}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.confirmFooter}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={onConfirm}
          >
            Sí, actualizar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
