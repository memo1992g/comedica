"use client";

import React from "react";
import type { RolesByGroupSummaryRowI } from "@/interfaces/security";
import styles from "./styles/summary-by-grupo.module.css";

interface SummaryByGrupoProps {
  data: RolesByGroupSummaryRowI[];
}

export default function SummaryByGrupo({ data }: SummaryByGrupoProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>Grupo</th>
            <th>Estado</th>
            <th>Roles Asignados</th>
            <th>Total Roles</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.groupId}
              className={i % 2 === 0 ? styles.oddRow : styles.evenRow}
            >
              <td className={styles.cellGroup}>
                <div className={styles.groupInfo}>
                  <span className={styles.groupName}>{row.groupName}</span>
                  <span className={styles.groupId}>ID: {row.groupId}</span>
                </div>
              </td>
              <td className={styles.cellStatus}>
                <span
                  className={
                    row.groupStatus === "Activo"
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }
                >
                  {row.groupStatus}
                </span>
              </td>
              <td className={styles.cellRoles}>
                <div className={styles.badgeContainer}>
                  {row.roles.map((role) => (
                    <span key={role.roleId} className={styles.roleBadge}>
                      {role.roleName}
                    </span>
                  ))}
                </div>
                <span className={styles.rolesCount}>
                  {row.totalRoles} roles asignados
                </span>
              </td>
              <td className={styles.cellTotal}>{row.totalRoles}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
