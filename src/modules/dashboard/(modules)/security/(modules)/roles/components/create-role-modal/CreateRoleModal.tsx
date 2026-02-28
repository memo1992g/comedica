"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  RoleI,
  RoleStatusType,
  CreateRolePayloadI,
} from "@/interfaces/security/roles";
import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import styles from "./styles/CreateRoleModal.module.css";

interface CreateRoleModalProps {
  onClose: () => void;
  onCreate: (data: CreateRolePayloadI) => Promise<ActionResult<RoleI>>;
}

export default function CreateRoleModal({
  onClose,
  onCreate,
}: Readonly<CreateRoleModalProps>) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<RoleStatusType>("activo");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("El nombre del rol es obligatorio");
      return;
    }
    if (!description.trim()) {
      setError("La descripción es obligatoria");
      return;
    }
    setError("");
    setSaving(true);
    const res = await onCreate({ name, description, status });
    setSaving(false);
    if (res.errors) {
      setError(res.errorMessage || "Error al crear rol");
      return;
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={() => !saving && onClose()}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>Crear Nuevo Rol</h2>
          <p className={styles.modalSubtitle}>
            Complete la información para crear un nuevo rol
          </p>

          <div className={styles.formFull}>
            <label className={styles.fieldLabel} htmlFor="role-name">
              Nombre del Rol *
            </label>
            <input
              id="role-name"
              type="text"
              className={styles.fieldInput}
              placeholder="Ej: Administrador General"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formFull}>
            <label className={styles.fieldLabel} htmlFor="role-description">
              Descripción *
            </label>
            <textarea
              id="role-description"
              className={styles.fieldTextarea}
              placeholder="Describe las responsabilidades de este rol"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.formFull}>
            <label className={styles.fieldLabel} htmlFor="role-status">
              Estado *
            </label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as RoleStatusType)}
            >
              <SelectTrigger id="role-status" className={styles.selectField}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <span className={styles.errorText}>{error}</span>}
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Creando..." : "Crear Rol"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
