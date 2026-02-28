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
import type { CreateGroupPayloadI } from "@/interfaces/security";
import styles from "./styles/CreateGroupModal.module.css";

interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: (data: CreateGroupPayloadI) => void;
}

export default function CreateGroupModal({
  onClose,
  onCreate,
}: Readonly<CreateGroupModalProps>) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Activo" | "Inactivo">("Activo");

  const isValid = name.trim() !== "" && description.trim() !== "";

  const handleSubmit = () => {
    if (!isValid) return;
    onCreate({ name: name.trim(), description: description.trim(), status });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Nuevo Grupo</h2>
          <p className={styles.modalSubtitle}>
            Ingrese los datos del nuevo grupo
          </p>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formField}>
            <label className={styles.fieldLabel} htmlFor="group-name">
              Nombre del Grupo <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <input
              id="group-name"
              type="text"
              className={styles.fieldInput}
              placeholder="Ingrese el nombre del grupo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.fieldLabel} htmlFor="group-desc">
              Descripción <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <textarea
              id="group-desc"
              className={styles.fieldTextarea}
              placeholder="Ingrese una descripción para el grupo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.fieldLabel}>Estado</label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as "Activo" | "Inactivo")}
            >
              <SelectTrigger className={styles.selectField}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Crear Grupo
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
