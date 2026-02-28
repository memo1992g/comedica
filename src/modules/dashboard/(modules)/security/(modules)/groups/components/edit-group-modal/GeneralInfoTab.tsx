"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GroupDetailI, UpdateGroupPayloadI } from "@/interfaces/security";
import ConfirmUpdateModal from "./ConfirmUpdateModal";
import styles from "./styles/EditGroupModal.module.css";

interface GeneralInfoTabProps {
  group: GroupDetailI;
  onUpdate: (id: string, data: UpdateGroupPayloadI) => void;
  onClose: () => void;
}

export default function GeneralInfoTab({
  group,
  onUpdate,
  onClose,
}: Readonly<GeneralInfoTabProps>) {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [status, setStatus] = useState(group.status);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasChanges =
    name !== group.name ||
    description !== group.description ||
    status !== group.status;

  const changes: { field: string; oldValue: string; newValue: string }[] = [];
  if (name !== group.name)
    changes.push({ field: "Nombre", oldValue: group.name, newValue: name });
  if (description !== group.description)
    changes.push({
      field: "Descripción",
      oldValue: group.description,
      newValue: description,
    });
  if (status !== group.status)
    changes.push({
      field: "Estado",
      oldValue: group.status,
      newValue: status,
    });

  const handleSave = () => {
    if (!hasChanges) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onUpdate(group.id, { name, description, status });
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <div className={styles.formField}>
        <label className={styles.fieldLabel} htmlFor="edit-name">
          Nombre del Grupo <span style={{ color: "#fb3748" }}>*</span>
        </label>
        <input
          id="edit-name"
          type="text"
          className={styles.fieldInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.fieldLabel} htmlFor="edit-desc">
          Descripción <span style={{ color: "#fb3748" }}>*</span>
        </label>
        <textarea
          id="edit-desc"
          className={styles.fieldTextarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.fieldLabel}>Estado del Grupo</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className={styles.roleSelectTrigger}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
        <p className={styles.statusHint}>
          Al desactivar el grupo, todos los usuarios pierden los accesos
          asociados
        </p>
      </div>

      <div className={styles.metadataGrid}>
        <span className={styles.metaItem}>
          Creado por:<span className={styles.metaValue}>{group.createdBy}</span>
        </span>
        <span className={styles.metaItem}>
          Fecha creación:<span className={styles.metaValue}>{group.createdAt}</span>
        </span>
        <span className={styles.metaItem}>
          Última actualización:<span className={styles.metaValue}>{group.updatedAt}</span>
        </span>
        <span className={styles.metaItem}>
          Actualizado por:<span className={styles.metaValue}>{group.updatedBy}</span>
        </span>
      </div>

      <div className={styles.modalFooter}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={styles.saveBtn}
          disabled={!hasChanges}
          onClick={handleSave}
        >
          Guardar Cambios
        </button>
      </div>

      {showConfirm && (
        <ConfirmUpdateModal
          changes={changes}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
