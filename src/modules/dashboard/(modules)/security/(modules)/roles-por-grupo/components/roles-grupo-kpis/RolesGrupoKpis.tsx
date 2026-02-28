"use client";

import React from "react";
import type { RolesByGroupStatsI } from "@/interfaces/security";
import styles from "./styles/roles-grupo-kpis.module.css";

interface RolesGrupoKpisProps {
  stats: RolesByGroupStatsI;
}

export default function RolesGrupoKpis({ stats }: RolesGrupoKpisProps) {
  const kpis = [
    { value: stats.totalAssignments, label: "Total Asignaciones" },
    { value: stats.activeAssignments, label: "Asignaciones Activas" },
    { value: stats.groupsWithRoles, label: "Grupos con Roles" },
    { value: stats.inactiveHistory, label: "Historial Inactivos" },
  ];

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
