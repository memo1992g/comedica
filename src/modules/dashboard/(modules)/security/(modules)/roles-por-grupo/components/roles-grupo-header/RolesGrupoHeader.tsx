"use client";

import React from "react";
import { Download } from "lucide-react";
import styles from "./styles/roles-grupo-header.module.css";

export default function RolesGrupoHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h2 className={styles.title}>Roles por Grupo</h2>
        <p className={styles.subtitle}>
          Gestión y auditoría de roles asignados por grupo
        </p>
      </div>
      <button type="button" className={styles.exportButton}>
        <Download size={16} />
        <span>Exportar Excel</span>
      </button>
    </div>
  );
}
