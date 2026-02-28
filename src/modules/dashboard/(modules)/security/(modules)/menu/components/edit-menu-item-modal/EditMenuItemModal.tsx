"use client";

import React, { useState, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MenuModuleI, MenuTableRowI, UpdateCategoryPayloadI, MenuStatusType } from "@/interfaces/security";
import ConfirmDetailsModal from "../confirm-details-modal/ConfirmDetailsModal";
import SidebarPreview from "../sidebar-preview/SidebarPreview";
import styles from "./styles/EditMenuItemModal.module.css";

interface EditMenuItemModalProps {
  row: MenuTableRowI;
  modules: MenuModuleI[];
  onClose: () => void;
  onSave: (categoryId: string, data: UpdateCategoryPayloadI) => void;
}

export default function EditMenuItemModal({
  row,
  modules,
  onClose,
  onSave,
}: Readonly<EditMenuItemModalProps>) {
  const parentModuleId = row.parentModuleId ?? modules[0]?.id ?? "";

  const [moduleId, setModuleId] = useState(parentModuleId);
  const [name, setName] = useState(row.name);
  const [description, setDescription] = useState(row.description);
  const [route, setRoute] = useState(row.route);
  const [order, setOrder] = useState(row.order);
  const [status, setStatus] = useState<MenuStatusType>(row.status);
  const [subCategoryId, setSubCategoryId] = useState(row.subCategoryId ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedModule = modules.find((m) => m.id === moduleId);
  const subCategories = useMemo(
    () => selectedModule?.subCategories ?? [],
    [selectedModule],
  );

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
    onSave(row.id, {
      name: name.trim(),
      description: description.trim(),
      route: route.trim(),
      order,
      status,
      moduleId,
      subCategoryId: subCategoryId && subCategoryId !== "none" ? subCategoryId : undefined,
    });
    onClose();
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Editar Menú: {row.name}</h2>
            <p className={styles.modalSubtitle}>Modifique los campos necesarios</p>
          </div>

          <div className={styles.bodyRow}>
            <div className={styles.formSide}>
              <div className={styles.formFull}>
                <label className={styles.fieldLabel}>Módulo (Categoría) <span style={{ color: "#fb3748" }}>*</span></label>
                <Select value={moduleId} onValueChange={(v) => { setModuleId(v); setSubCategoryId(""); }}>
                  <SelectTrigger className={styles.selectTrigger}><SelectValue /></SelectTrigger>
                  <SelectContent className={styles.selectContent}>
                    {modules.map((m) => (
                      <SelectItem key={m.id} className={styles.selectItem} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.formFull}>
                <label className={styles.fieldLabel}>Nombre *</label>
                <input className={styles.fieldInput} value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.formFull}>
                <label className={styles.fieldLabel}>Descripción *</label>
                <textarea className={styles.fieldTextarea} value={description} onChange={(e) => setDescription(e.target.value)} />
                {errors.description && <span className={styles.errorText}>{errors.description}</span>}
              </div>

              {subCategories.length > 0 && (
                <div className={styles.formFull}>
                  <label className={styles.fieldLabel}>Sub-categoría (opcional)</label>
                  <Select value={subCategoryId} onValueChange={setSubCategoryId}>
                    <SelectTrigger className={styles.selectTrigger}><SelectValue placeholder="Sin sub-categoría" /></SelectTrigger>
                    <SelectContent className={styles.selectContent}>
                      <SelectItem className={styles.selectItem} value="none">Sin sub-categoría</SelectItem>
                      {subCategories.map((sc) => (
                        <SelectItem key={sc.id} className={styles.selectItem} value={sc.id}>{sc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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

            <SidebarPreview modules={modules} mode="category" selectedModuleId={moduleId} newItemName={name} />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="button" className={styles.saveBtn} onClick={handleSubmit}>Guardar Cambios</button>
          </div>
        </DialogContent>
      </Dialog>

      {showConfirm && (
        <ConfirmDetailsModal
          title={`Confirmar cambios en "${row.name}"`}
          subtitle="Revise los datos antes de confirmar"
          successMessage="Se actualizará el menú en el sistema"
          details={[
            { label: "Módulo", value: selectedModule?.name ?? moduleId },
            { label: "Nombre", value: name },
            { label: "Descripción", value: description },
            { label: "Ruta", value: route },
            { label: "Orden", value: String(order) },
            { label: "Estado", value: status },
            ...(subCategoryId ? [{ label: "Sub-categoría", value: subCategories.find((s) => s.id === subCategoryId)?.name ?? subCategoryId }] : []),
          ]}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
