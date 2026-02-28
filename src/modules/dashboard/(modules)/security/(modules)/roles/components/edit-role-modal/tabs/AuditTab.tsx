"use client";

import React, { useMemo } from "react";
import {
  MOCK_PERMISSION_MODULES,
  MOCK_ROLE_PERMISSIONS,
} from "@/consts/security/roles.consts";
import type { PermissionModuleI } from "@/interfaces/security/roles";
import styles from "./styles/AuditTab.module.css";

interface AuditTabProps {
  roleId: number;
  onClose: () => void;
}

interface PermissionRow {
  module: string;
  screen: string;
  actions: string[];
}

const ACTION_LABELS: Record<string, string> = {
  view: "Lectura",
  create: "Escritura",
  edit: "Edición",
  delete: "Eliminación",
  export: "Exportación",
};

function buildRows(
  modules: PermissionModuleI[],
  activePerms: Set<string>,
): PermissionRow[] {
  const rows: PermissionRow[] = [];

  for (const mod of modules) {
    const modActions = mod.actions
      .filter((a) => activePerms.has(`${mod.key}:${a.key}`))
      .map((a) => ACTION_LABELS[a.key] ?? a.label);

    if (modActions.length > 0) {
      rows.push({ module: mod.label, screen: "—", actions: modActions });
    }

    if (mod.children) {
      for (const child of mod.children) {
        const childActions = child.actions
          .filter((a) => activePerms.has(`${child.key}:${a.key}`))
          .map((a) => ACTION_LABELS[a.key] ?? a.label);

        if (childActions.length > 0) {
          rows.push({
            module: mod.label,
            screen: child.label,
            actions: childActions,
          });
        }
      }
    }
  }
  return rows;
}

export default function AuditTab({
  roleId,
  onClose,
}: Readonly<AuditTabProps>) {
  const rows = useMemo(() => {
    const perms = new Set(MOCK_ROLE_PERMISSIONS[roleId] ?? []);
    return buildRows(MOCK_PERMISSION_MODULES, perms);
  }, [roleId]);

  return (
    <div className={styles.tabContent}>
      <p className={styles.description}>
        Vista resumida de todos los permisos activos para este rol. Utilice
        esta vista para auditoría o validación rápida.
      </p>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Módulo</th>
              <th className={styles.th}>Pantalla</th>
              <th className={styles.th}>Acciones Permitidas</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={`${row.module}-${row.screen}-${idx}`} className={styles.tr}>
                <td className={styles.tdModule}>{row.module}</td>
                <td className={styles.td}>{row.screen}</td>
                <td className={styles.td}>
                  <div className={styles.badgesWrapper}>
                    {row.actions.map((action) => (
                      <span key={action} className={styles.badge}>
                        {action}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.emptyRow}>
                  No hay permisos activos para este rol.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onClose}
        >
          Cancelar
        </button>
        <button type="button" className={styles.saveBtn}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
