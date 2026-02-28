"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { RoleI } from "@/interfaces/security/roles";
import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import styles from "./styles/DeleteRoleModal.module.css";

interface DeleteRoleModalProps {
  role: RoleI;
  onClose: () => void;
  onDelete: (id: number) => Promise<ActionResult<null>>;
}

export default function DeleteRoleModal({
  role,
  onClose,
  onDelete,
}: Readonly<DeleteRoleModalProps>) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setDeleting(true);
    const res = await onDelete(role.id);
    setDeleting(false);
    if (res.errors) {
      setError(res.errorMessage ?? "Error al eliminar el rol");
      return;
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={() => !deleting && onClose()}>
      <DialogContent className={styles.modal}>
        <div className={styles.body}>
          <h2 className={styles.title}>Eliminar Rol</h2>
          <p className={styles.message}>
            ¿Está seguro de que desea eliminar el rol{" "}
            <strong>{role.name}</strong>? Esta acción no se puede deshacer.
          </p>

          {error && <span className={styles.errorText}>{error}</span>}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={deleting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
