"use client";

import React from "react";
import { ShieldOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { RolesByGroupAssignmentI } from "@/interfaces/security";
import styles from "./styles/revoke-modal.module.css";

interface RevokeModalProps {
  open: boolean;
  assignment: RolesByGroupAssignmentI | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RevokeModal({
  open,
  assignment,
  onClose,
  onConfirm,
}: RevokeModalProps) {
  if (!assignment) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={styles.content}>
        <DialogHeader>
          <div className={styles.iconWrapper}>
            <ShieldOff size={24} />
          </div>
          <DialogTitle className={styles.title}>
            Revocar Asignación
          </DialogTitle>
          <DialogDescription className={styles.description}>
            ¿Está seguro que desea revocar el rol{" "}
            <span className={styles.highlight}>{assignment.roleName}</span>{" "}
            del grupo{" "}
            <span className={styles.highlight}>{assignment.groupName}</span>?
          </DialogDescription>
          <p className={styles.warning}>
            Esta acción desactivará la asignación y quedará registrada en el
            historial de auditoría.
          </p>
        </DialogHeader>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            Revocar Permisos
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
