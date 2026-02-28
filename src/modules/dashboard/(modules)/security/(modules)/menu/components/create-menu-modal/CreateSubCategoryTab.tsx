"use client";

import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  MenuModuleI,
  CreateSubCategoryPayloadI,
  MenuStatusType,
} from "@/interfaces/security";
import SidebarPreview from "../sidebar-preview/SidebarPreview";
import styles from "./styles/CreateMenuModal.module.css";

interface CreateSubCategoryTabProps {
  modules: MenuModuleI[];
  onSave: (data: CreateSubCategoryPayloadI) => void;
  onCancel: () => void;
}

export default function CreateSubCategoryTab({
  modules,
  onSave,
  onCancel,
}: Readonly<CreateSubCategoryTabProps>) {
  const [moduleId, setModuleId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState<MenuStatusType>("Activo");
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedModule = modules.find((m) => m.id === moduleId);

  const availableMenus = useMemo(() => {
    if (!selectedModule) return [];
    return selectedModule.categories;
  }, [selectedModule]);

  const handleCheckedMenu = (menuId: string, checked: boolean | "indeterminate") => {
    if (checked !== true) {
      setSelectedMenuIds((prev) => prev.filter((id) => id !== menuId));
      return;
    }
    setSelectedMenuIds((prev) => (prev.includes(menuId) ? prev : [...prev, menuId]));
  };

  const getSubCatName = (catSubCatId?: string) => {
    if (!catSubCatId || !selectedModule) return null;
    return (
      selectedModule.subCategories.find((s) => s.id === catSubCatId)?.name ??
      null
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!moduleId) e.moduleId = "Seleccione un módulo";
    if (!name.trim()) e.name = "El nombre es requerido";
    if (!description.trim()) e.description = "La descripción es requerida";
    if (order < 1) e.order = "El orden debe ser mayor a 0";
    if (selectedMenuIds.length === 0) e.menuIds = "Seleccione al menos un menú";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      moduleId,
      name: name.trim(),
      description: description.trim(),
      order,
      status,
      menuIds: selectedMenuIds,
    });
  };

  return (
    <>
      <div className={styles.bodyRow}>
        <div className={styles.formSide}>
          <div className={styles.formFull}>
            <label htmlFor='subcat-module' className={styles.fieldLabel}>
              Categoría <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <Select
              value={moduleId}
              onValueChange={(v) => {
                setModuleId(v);
                setSelectedMenuIds([]);
              }}
            >
              <SelectTrigger id='subcat-module' className={styles.selectTrigger}>
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
            <label htmlFor='subcat-name' className={styles.fieldLabel}>
              Nombre de la Sub-Categoría{" "}
              <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <input
              id='subcat-name'
              className={styles.fieldInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Ej: Seguridad y soporte'
            />
            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formFull}>
            <label htmlFor='subcat-description' className={styles.fieldLabel}>
              Descripción <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <textarea
              id='subcat-description'
              className={styles.fieldTextarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Descripción de la sub-categoría'
            />
            {errors.description && (
              <span className={styles.errorText}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div>
              <label htmlFor='subcat-status' className={styles.fieldLabel}>Estado</label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as MenuStatusType)}
              >
                <SelectTrigger id='subcat-status' className={styles.selectTrigger}>
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
              <label htmlFor='subcat-order' className={styles.fieldLabel}>Orden</label>
              <input
                id='subcat-order'
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
              Asignar menús a esta sub-categoría{" "}
              <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <div className={styles.checkboxList}>
              {availableMenus.length === 0 && (
                <span style={{ fontSize: 12, color: "#bbb", padding: "8px 0" }}>
                  {moduleId
                    ? "No hay menús disponibles"
                    : "Seleccione un módulo primero"}
                </span>
              )}
              {availableMenus.map((menu) => {
                const existingSub = getSubCatName(menu.subCategoryId);
                const checkboxId = `subcat-menu-${menu.id}`;
                return (
                  <div key={menu.id} className={styles.checkboxItemEnhanced}>
                    <Checkbox
                      id={checkboxId}
                      className={styles.checkboxControl}
                      checked={selectedMenuIds.includes(menu.id)}
                      onCheckedChange={(checked) => handleCheckedMenu(menu.id, checked)}
                    />
                    <div className={styles.checkboxItemInfo}>
                      <label htmlFor={checkboxId} className={styles.checkboxItemName}>
                        {menu.name}
                      </label>
                      <p className={styles.checkboxItemDesc}>
                        {menu.description}
                      </p>
                    </div>
                    {existingSub && (
                      <span className={styles.checkboxBadge}>
                        {existingSub}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {errors.menuIds && (
              <span className={styles.errorText}>{errors.menuIds}</span>
            )}
          </div>
        </div>

        <SidebarPreview
          modules={modules}
          mode='subcategory'
          selectedModuleId={moduleId || undefined}
          newItemName={name || undefined}
        />
      </div>
      <div className={styles.footer} style={{ padding: "16px", width: "100%" }}>
        <button type='button' className={styles.cancelBtn} onClick={onCancel}>
          Cancelar
        </button>
        <button type='button' className={styles.saveBtn} onClick={handleSubmit}>
          Crear Sub-Categoría
        </button>
      </div>
    </>
  );
}
