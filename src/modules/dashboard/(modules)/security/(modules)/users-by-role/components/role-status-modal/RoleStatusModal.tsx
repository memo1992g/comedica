"use client";

import React from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { UserByRoleI } from "@/interfaces/security";
import styles from "./styles/role-status-modal.module.css";

interface RoleStatusModalProps {
  open: boolean;
  mode: "activate" | "deactivate";
  user: UserByRoleI | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RoleStatusModal({
  open,
  mode,
  user,
  onClose,
  onConfirm,
}: RoleStatusModalProps) {
  if (!user) return null;

  const isActivate = mode === "activate";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={styles.content}>
        <DialogHeader>
          <div
            className={`${styles.iconWrapper} ${
              isActivate ? styles.iconActivate : styles.iconDeactivate
            }`}
          >
            {isActivate ? (
              <ShieldCheck size={24} />
            ) : (
              <ShieldOff size={24} />
            )}
          </div>
          <DialogTitle className={styles.title}>
            {isActivate ? "Activar rol de usuario" : "Desactivar rol de usuario"}
          </DialogTitle>
          <DialogDescription className={styles.description}>
            {isActivate
              ? "¿Está seguro que desea activar el rol para este usuario?"
              : "¿Está seguro que desea desactivar el rol para este usuario?"}
          </DialogDescription>
          <p className={styles.description}>
            <span className={styles.userName}>{user.fullName}</span> — Rol:{" "}
            <span className={styles.userName}>{user.role}</span>
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
            className={`${styles.confirmButton} ${
              isActivate ? styles.confirmActivate : styles.confirmDeactivate
            }`}
            onClick={onConfirm}
          >
            {isActivate ? "Activar" : "Desactivar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
