"use client";

import React from "react";
import { Plus, LayoutGrid, ChevronDown } from "lucide-react";
import type { MenuModuleI } from "@/interfaces/security";
import styles from "./SidebarPreview.module.css";

type PreviewMode = "module" | "category" | "subcategory";

interface SidebarPreviewProps {
  modules: MenuModuleI[];
  mode: PreviewMode;
  selectedModuleId?: string;
  newItemName?: string;
}

export default function SidebarPreview({
  modules,
  mode,
  selectedModuleId,
  newItemName,
}: Readonly<SidebarPreviewProps>) {
  const selectedModule = modules.find((m) => m.id === selectedModuleId);
  const showEmpty = mode !== "module" && !selectedModuleId;

  return (
    <div className={styles.preview}>
      <p className={styles.previewTitle}>Menú</p>
      {showEmpty ? (
        <div className={styles.emptyState}>
          <span>Seleccione un módulo para ver la vista previa</span>
        </div>
      ) : mode === "module" ? (
        <ModulePreview modules={modules} newName={newItemName} />
      ) : selectedModule ? (
        <ExpandedPreview module={selectedModule} mode={mode} newName={newItemName} />
      ) : null}
    </div>
  );
}

function ModulePreview({ modules, newName }: Readonly<{ modules: MenuModuleI[]; newName?: string }>) {
  const isNew = newName && !modules.some((m) => m.name.toLowerCase() === newName.toLowerCase());
  return (
    <ul className={styles.moduleList}>
      {isNew && (
        <li className={styles.moduleItemActive}>
          <Plus size={14} /> <span>{newName || "Nuevo Módulo"}</span>
        </li>
      )}
      {modules.map((m) => {
        const match = newName && m.name.toLowerCase() === newName.toLowerCase();
        return (
          <li key={m.id} className={match ? styles.moduleItemActive : styles.moduleItem}>
            <LayoutGrid size={14} /> <span>{m.name}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ExpandedPreview({
  module: mod,
  mode,
  newName,
}: Readonly<{ module: MenuModuleI; mode: "category" | "subcategory"; newName?: string }>) {
  const directItems = mod.categories.filter((c) => !c.subCategoryId);

  return (
    <ul className={styles.moduleList}>
      <li className={styles.moduleItemExpanded}>
        <LayoutGrid size={14} />
        <span className={styles.expandedName}>{mod.name}</span>
        <ChevronDown size={12} className={styles.chevron} />
      </li>
      <ul className={styles.categoryList}>
        {mode === "category" && newName && (
          <li className={styles.categoryItemActive}>
            <span className={styles.dotActive} />
            {newName || "Nuevo Menú"}
          </li>
        )}
        {directItems.map((c) => (
          <li key={c.id} className={styles.categoryItem}>
            <span className={styles.dot} /> {c.name}
          </li>
        ))}
        {mod.subCategories.map((sc) => (
          <li key={sc.id} className={styles.subCatGroup}>
            <div className={styles.subCatLabel}>
              <ChevronDown size={10} /> {sc.name}
            </div>
            <ul className={styles.subCatItems}>
              {mod.categories.filter((c) => c.subCategoryId === sc.id).map((c) => (
                <li key={c.id} className={styles.subCatItem}>{c.name}</li>
              ))}
            </ul>
          </li>
        ))}
        {mode === "subcategory" && newName && (
          <li className={styles.categoryItemActive}>
            <span className={styles.dotActive} />
            {newName || "Nueva Sub-Categoría"}
          </li>
        )}
      </ul>
    </ul>
  );
}
