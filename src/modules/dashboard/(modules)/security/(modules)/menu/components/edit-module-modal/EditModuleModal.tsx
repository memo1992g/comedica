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
import type { MenuModuleI, UpdateModulePayloadI, MenuStatusType } from "@/interfaces/security";
import ConfirmDetailsModal from "../confirm-details-modal/ConfirmDetailsModal";
import SidebarPreview from "../sidebar-preview/SidebarPreview";
import styles from "./styles/EditModuleModal.module.css";

interface EditModuleModalProps {
  module: MenuModuleI;
  modules: MenuModuleI[];
  onClose: () => void;
  onSave: (moduleId: string, data: UpdateModulePayloadI) => void;
}

export default function EditModuleModal({
  module: mod,
  modules,
  onClose,
  onSave,
}: Readonly<EditModuleModalProps>) {
  const [name, setName] = useState(mod.name);
  const [description, setDescription] = useState(mod.description);
  const [iconSvg, setIconSvg] = useState(mod.iconSvg ?? "");
  const [route, setRoute] = useState(mod.route);
  const [order, setOrder] = useState(mod.order);
  const [status, setStatus] = useState<MenuStatusType>(mod.status);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "El nombre es requerido";
    if (!description.trim()) e.description = "La descripción es requerida";
    if (!route.trim()) e.route = "La ruta es requerida";
    if (order < 1) e.order = "El orden debe ser mayor a 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onSave(mod.id, {
      name: name.trim(),
      description: description.trim(),
      iconSvg: iconSvg.trim() || undefined,
      route: route.trim(),
      order,
      status,
    });
    onClose();
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Editar Módulo: {mod.name}</h2>
            <p className={styles.modalSubtitle}>Modifique los campos necesarios</p>
          </div>

          <div className={styles.bodyRow}>
            <div className={styles.formSide}>
              <div className={styles.formFull}>
                <label className={styles.fieldLabel}>Nombre del Módulo *</label>
                <input className={styles.fieldInput} value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.formFull}>
                <label className={styles.fieldLabel}>Descripción *</label>
                <textarea className={styles.fieldTextarea} value={description} onChange={(e) => setDescription(e.target.value)} />
                {errors.description && <span className={styles.errorText}>{errors.description}</span>}
              </div>

              <div className={styles.formFull}>
                <label className={styles.fieldLabel}>Ícono SVG (código)</label>
                <textarea className={styles.fieldTextarea} value={iconSvg} onChange={(e) => setIconSvg(e.target.value)} style={{ minHeight: 50, fontFamily: "monospace", fontSize: 12 }} />
                {iconSvg.trim() && (
                  <div className={styles.svgPreview} dangerouslySetInnerHTML={{ __html: iconSvg }} />
                )}
              </div>

              <div className={styles.formFull}>
                <label className={styles.fieldLabel}>Ruta *</label>
                <input className={styles.fieldInput} value={route} onChange={(e) => setRoute(e.target.value)} />
                {errors.route && <span className={styles.errorText}>{errors.route}</span>}
              </div>

              <div className={styles.formRow}>
                <div>
                  <label className={styles.fieldLabel}>Orden *</label>
                  <input className={styles.fieldInput} type="number" min={1} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                  {errors.order && <span className={styles.errorText}>{errors.order}</span>}
                </div>
                <div>
                  <label className={styles.fieldLabel}>Estado</label>
                  <Select value={status} onValueChange={(v) => setStatus(v as MenuStatusType)}>
                    <SelectTrigger className={styles.selectTrigger}><SelectValue /></SelectTrigger>
                    <SelectContent className={styles.selectContent}>
                      <SelectItem className={styles.selectItem} value="Activo">Activo</SelectItem>
                      <SelectItem className={styles.selectItem} value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <SidebarPreview modules={modules} mode="module" newItemName={name} />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="button" className={styles.saveBtn} onClick={handleSubmit}>Guardar Cambios</button>
          </div>
        </DialogContent>
      </Dialog>

      {showConfirm && (
        <ConfirmDetailsModal
          title={`Confirmar cambios en "${mod.name}"`}
          subtitle="Revise los datos antes de confirmar"
          successMessage="Se actualizará el módulo en el sistema"
          details={[
            { label: "Nombre", value: name },
            { label: "Descripción", value: description },
            { label: "Ruta", value: route },
            { label: "Orden", value: String(order) },
            { label: "Estado", value: status },
          ]}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
