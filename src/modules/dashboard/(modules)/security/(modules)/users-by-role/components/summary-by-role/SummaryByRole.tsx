"use client";

import React from "react";
import type { UserByRoleSummaryI } from "@/interfaces/security";
import styles from "./styles/summary-by-role.module.css";

interface SummaryByRoleProps {
  data: UserByRoleSummaryI[];
}

export default function SummaryByRole({ data }: SummaryByRoleProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>Rol</th>
            <th>Usuarios Activos</th>
            <th>Usuarios Inactivos</th>
            <th>Total Histórico</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.role}
              className={i % 2 === 0 ? styles.oddRow : styles.evenRow}
            >
              <td className={styles.cellRole}>
                <div className={styles.roleInfo}>
                  <span className={styles.roleName}>{row.role}</span>
                  <span className={styles.roleId}>ID: {row.roleId}</span>
                </div>
              </td>
              <td className={styles.cellActive}>{row.active}</td>
              <td className={styles.cellInactive}>{row.inactive}</td>
              <td className={styles.cellTotal}>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
