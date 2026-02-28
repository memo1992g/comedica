"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RoleI, RoleStatusType, UpdateRolePayloadI } from "@/interfaces/security/roles";
import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import ConfirmUpdateModal from "../../confirm-update-modal/ConfirmUpdateModal";
import styles from "./styles/GeneralInfoTab.module.css";

interface GeneralInfoTabProps {
  role: RoleI;
  onUpdate: (id: number, data: UpdateRolePayloadI) => Promise<ActionResult<RoleI>>;
  onClose: () => void;
}

export default function GeneralInfoTab({
  role,
  onUpdate,
  onClose,
}: Readonly<GeneralInfoTabProps>) {
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);
  const [status, setStatus] = useState<RoleStatusType>(role.status);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  const handleSaveClick = () => {
    if (!name.trim()) {
      setError("El nombre del rol es obligatorio");
      return;
    }
    setError("");
    setSaveError("");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setSaving(true);
    const res = await onUpdate(role.id, { name, description, status });
    setSaving(false);
    if (res.errors) {
      setSaveError(res.errorMessage || "Error al actualizar rol");
      return;
    }
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <div className={styles.tabContent}>
        <div className={styles.formFull}>
          <label className={styles.fieldLabel} htmlFor="edit-role-name">
            Nombre del Rol *
          </label>
          <input
            id="edit-role-name"
            type="text"
            className={styles.fieldInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formFull}>
          <label className={styles.fieldLabel} htmlFor="edit-role-desc">
            Descripción
          </label>
          <textarea
            id="edit-role-desc"
            className={styles.fieldTextarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className={styles.formFull}>
          <label className={styles.fieldLabel} htmlFor="edit-role-status">
            Estado *
          </label>
          <Select value={status} onValueChange={(v) => setStatus(v as RoleStatusType)}>
            <SelectTrigger id="edit-role-status" className={styles.selectField}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={styles.infoRow}>
          <div>
            <span className={styles.infoLabel}>Creado por</span>
            <span className={styles.infoValue}>{role.createdBy}</span>
          </div>
          <div>
            <span className={styles.infoLabel}>Fecha creación</span>
            <span className={styles.infoValue}>
              {new Date(role.createdAt).toLocaleDateString("es-SV")}
            </span>
          </div>
          <div>
            <span className={styles.infoLabel}>Última modificación</span>
            <span className={styles.infoValue}>
              {role.updatedAt
                ? new Date(role.updatedAt).toLocaleDateString("es-SV")
                : "—"}
            </span>
          </div>
        </div>

        {error && <span className={styles.errorText}>{error}</span>}

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSaveClick}
            disabled={saving}
          >
            Actualizar
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmUpdateModal
          roleName={name}
          saving={saving}
          error={saveError}
          onCancel={() => {
            setShowConfirm(false);
            setSaveError("");
          }}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
