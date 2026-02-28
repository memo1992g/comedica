"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  MenuModuleI,
  CreateCategoryPayloadI,
  MenuStatusType,
} from "@/interfaces/security";
import SidebarPreview from "../sidebar-preview/SidebarPreview";
import styles from "./styles/CreateMenuModal.module.css";

interface CreateCategoryTabProps {
  modules: MenuModuleI[];
  onSave: (data: CreateCategoryPayloadI) => void;
  onCancel: () => void;
}

export default function CreateCategoryTab({
  modules,
  onSave,
  onCancel,
}: Readonly<CreateCategoryTabProps>) {
  const [moduleId, setModuleId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [route, setRoute] = useState("");
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState<MenuStatusType>("Activo");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!moduleId) e.moduleId = "Seleccione un módulo";
    if (!name.trim()) e.name = "El nombre es requerido";
    if (!description.trim()) e.description = "La descripción es requerida";
    if (!route.trim()) e.route = "La ruta es requerida";
    if (order < 1) e.order = "El orden debe ser mayor a 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      moduleId,
      name: name.trim(),
      description: description.trim(),
      route: route.trim(),
      order,
      status,
    });
  };

  return (
    <>
      <div className={styles.bodyRow}>
        <div className={styles.formSide}>
          <div className={styles.formFull}>
            <label className={styles.fieldLabel}>
              Categoría <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <Select value={moduleId} onValueChange={setModuleId}>
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder='Seleccione un módulo' />
              </SelectTrigger>
              <SelectContent className={styles.selectContent}>
                {modules.map((m) => (
                  <SelectItem
                    key={m.id}
                    className={styles.selectItem}
                    value={m.id}
                  >
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.moduleId && (
              <span className={styles.errorText}>{errors.moduleId}</span>
            )}
          </div>

          <div className={styles.formFull}>
            <label className={styles.fieldLabel}>
              Nombre del Menú <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <input
              className={styles.fieldInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Ej: Gestión de Usuarios'
            />
            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formFull}>
            <label className={styles.fieldLabel}>
              Descripción <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <textarea
              className={styles.fieldTextarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Describe el propósito de esta opción de menú...'
            />
            {errors.description && (
              <span className={styles.errorText}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div>
              <label className={styles.fieldLabel}>Estado</label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as MenuStatusType)}
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={styles.selectContent}>
                  <SelectItem className={styles.selectItem} value='Activo'>
                    Activo
                  </SelectItem>
                  <SelectItem className={styles.selectItem} value='Inactivo'>
                    Inactivo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={styles.fieldLabel}>Orden</label>
              <input
                className={styles.fieldInput}
                type='number'
                min={1}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder='Ej: 1'
              />
              {errors.order && (
                <span className={styles.errorText}>{errors.order}</span>
              )}
            </div>
          </div>

          <div className={styles.formFull}>
            <label className={styles.fieldLabel}>
              Ruta <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <input
              className={styles.fieldInput}
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder='/modulo/pagina'
            />
            {errors.route && (
              <span className={styles.errorText}>{errors.route}</span>
            )}
          </div>
        </div>

        <SidebarPreview
          modules={modules}
          mode='category'
          selectedModuleId={moduleId || undefined}
          newItemName={name || undefined}
        />
      </div>
      <div className={styles.footer} style={{ padding: "16px", width: "100%" }}>
        <button type='button' className={styles.cancelBtn} onClick={onCancel}>
          Cancelar
        </button>
        <button type='button' className={styles.saveBtn} onClick={handleSubmit}>
          Crear Módulo
        </button>
      </div>
    </>
  );
}
