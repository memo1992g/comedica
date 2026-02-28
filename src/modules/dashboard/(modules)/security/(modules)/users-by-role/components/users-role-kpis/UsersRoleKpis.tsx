"use client";

import React, { useMemo } from "react";
import type { UserByRoleI } from "@/interfaces/security";
import styles from "./styles/users-role-kpis.module.css";

interface UsersRoleKpisProps {
  data: UserByRoleI[];
}

export default function UsersRoleKpis({ data }: UsersRoleKpisProps) {
  const kpis = useMemo(() => {
    const active = data.filter((u) => u.status === "Activo").length;
    const roles = new Set(data.map((u) => u.role)).size;
    const unique = data.length;
    const inactive = data.filter((u) => u.status === "Inactivo").length;
    return [
      { value: active, label: "Asignaciones Activas" },
      { value: roles, label: "Roles Utilizados" },
      { value: unique, label: "Usuarios Únicos" },
      { value: inactive, label: "Historial (Inactivos)" },
    ];
  }, [data]);

  return (
    <div className={styles.kpisBar}>
      {kpis.map((kpi) => (
        <div key={kpi.label} className={styles.kpiCard}>
          <span className={styles.kpiValue}>{kpi.value}</span>
          <span className={styles.kpiLabel}>{kpi.label}</span>
        </div>
      ))}
    </div>
  );
}
