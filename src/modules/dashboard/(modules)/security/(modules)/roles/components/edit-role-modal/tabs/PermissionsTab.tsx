"use client";

import React, { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import type { PermissionModuleI } from "@/interfaces/security/roles";
import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import {
  MOCK_PERMISSION_MODULES,
  MOCK_ROLE_PERMISSIONS,
} from "@/consts/security/roles.consts";
import styles from "./styles/PermissionsTab.module.css";

interface PermissionsTabProps {
  roleId: number;
  onSave: (roleId: number, permissions: string[]) => Promise<ActionResult<null>>;
}

export default function PermissionsTab({
  roleId,
  onSave,
}: Readonly<PermissionsTabProps>) {
  const [permissions, setPermissions] = useState<Set<string>>(
    () => new Set(MOCK_ROLE_PERMISSIONS[roleId] ?? []),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePermission = useCallback((permKey: string) => {
    setSaved(false);
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permKey)) next.delete(permKey);
      else next.add(permKey);
      return next;
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await onSave(roleId, Array.from(permissions));
    setSaving(false);
    setSaved(true);
  };

  const renderActions = (mod: PermissionModuleI) => (
    <div className={styles.actionsGrid}>
      {mod.actions.map((action) => {
        const permKey = `${mod.key}:${action.key}`;
        const checked = permissions.has(permKey);
        return (
          <label key={permKey} className={styles.checkboxLabel}>
            <Checkbox
              checked={checked}
              onCheckedChange={() => togglePermission(permKey)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>{action.label}</span>
          </label>
        );
      })}
    </div>
  );

  const renderChild = (child: PermissionModuleI) => (
    <Collapsible key={child.key} className={styles.childItem}>
      <CollapsibleTrigger className={styles.childTrigger}>
        <span className={styles.childLabel}>{child.label}</span>
        <ChevronDown size={14} className={styles.triggerIcon} />
      </CollapsibleTrigger>
      <CollapsibleContent className={styles.childContent}>
        {renderActions(child)}
      </CollapsibleContent>
    </Collapsible>
  );

  const renderModule = (mod: PermissionModuleI) => (
    <Collapsible key={mod.key} className={styles.moduleItem}>
      <CollapsibleTrigger className={styles.moduleTrigger}>
        <span className={styles.moduleLabel}>{mod.label}</span>
        <ChevronDown size={16} className={styles.triggerIcon} />
      </CollapsibleTrigger>
      <CollapsibleContent className={styles.moduleContent}>
        {mod.actions.length > 0 && renderActions(mod)}
        {mod.children?.map((child) => renderChild(child))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className={styles.tabContent}>
      <p className={styles.description}>
        Seleccione los permisos para cada módulo y submódulo del sistema.
      </p>

      <div className={styles.permissionsList}>
        {MOCK_PERMISSION_MODULES.map((mod) => renderModule(mod))}
      </div>

      <div className={styles.footer}>
        {saved && (
          <span className={styles.savedText}>Permisos guardados</span>
        )}
        <button
          type="button"
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar permisos"}
        </button>
      </div>
    </div>
  );
}
