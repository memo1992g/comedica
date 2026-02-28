"use client";

import React, { useState, useRef } from "react";
import { Upload, Code, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  MenuModuleI,
  CreateModulePayloadI,
  MenuStatusType,
} from "@/interfaces/security";
import SidebarPreview from "../sidebar-preview/SidebarPreview";
import styles from "./styles/CreateMenuModal.module.css";

interface CreateModuleTabProps {
  modules: MenuModuleI[];
  onSave: (data: CreateModulePayloadI) => void;
  onCancel: () => void;
}

export default function CreateModuleTab({
  modules,
  onSave,
  onCancel,
}: Readonly<CreateModuleTabProps>) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconSvg, setIconSvg] = useState("");
  const [order, setOrder] = useState(modules.length + 1);
  const [status, setStatus] = useState<MenuStatusType>("Activo");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSvgCode, setShowSvgCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "El nombre es requerido";
    if (!description.trim()) e.description = "La descripción es requerida";
    if (order < 1) e.order = "El orden debe ser mayor a 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      iconSvg: iconSvg.trim() || undefined,
      order,
      status,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith(".svg")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") setIconSvg(text);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className={styles.bodyRow}>
        <div className={styles.formSide}>
          <div className={styles.formFull}>
            <label className={styles.fieldLabel}>
              Nombre del Módulo <span style={{ color: "#fb3748" }}>*</span>
            </label>
            <input
              className={styles.fieldInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Ej: Parámetros, Reportes, Gestiones...'
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
              placeholder='Describe el propósito de este módulo...'
            />
            {errors.description && (
              <span className={styles.errorText}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formFull}>
            <label className={styles.fieldLabel}>
              Ícono SVG <span style={{ color: "#fb3748" }}>*</span>
              <span style={{ fontSize: 11, color: "#bbb", marginLeft: 8 }}>
                (20x20px, color blanco)
              </span>
            </label>
            <input
              ref={fileInputRef}
              type='file'
              accept='.svg'
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <div
              className={styles.svgUploadZone}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={20} />
              <span className={styles.svgUploadText}>Cargar archivo SVG</span>
            </div>
            <div className={styles.svgDivider}>
              <div className={styles.svgDividerLine} />
              <span className={styles.svgDividerText}>o pegar código SVG</span>
              <div className={styles.svgDividerLine} />
            </div>
            <button
              type='button'
              className={styles.svgCodeToggle}
              onClick={() => setShowSvgCode(!showSvgCode)}
            >
              <Code size={14} />
              <span className={styles.svgCodeLabel}>Escribir código SVG</span>
              {showSvgCode ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
            {showSvgCode && (
              <textarea
                className={styles.fieldTextarea}
                value={iconSvg}
                onChange={(e) => setIconSvg(e.target.value)}
                placeholder='<svg>...</svg>'
                style={{
                  minHeight: 60,
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginTop: 4,
                }}
              />
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
        </div>
        <SidebarPreview
          modules={modules}
          mode='module'
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
