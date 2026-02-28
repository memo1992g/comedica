"use client";

import React from "react";
import { Download } from "lucide-react";
import styles from "./styles/users-role-header.module.css";

export default function UsersRoleHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h2 className={styles.title}>Reporte de Usuarios por Rol</h2>
        <p className={styles.subtitle}>
          Auditoría y matriz de acceso de usuarios por rol asignado
        </p>
      </div>
      <button type="button" className={styles.exportButton}>
        <Download size={16} />
        <span>Exportar Excel</span>
      </button>
    </div>
  );
}
