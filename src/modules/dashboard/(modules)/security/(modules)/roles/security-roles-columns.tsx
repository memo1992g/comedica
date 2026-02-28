"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Shield } from "lucide-react";
import type { RoleI } from "@/interfaces/security/roles";
import { MOCK_ROLE_PERMISSIONS, MOCK_PERMISSION_MODULES } from "@/consts/security/roles.consts";

const cellStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontSize: "11px",
  color: "#4a4a4c",
};

const statusColors: Record<string, { color: string; bg: string; border: string }> = {
  activo: { color: "#008236", bg: "#f0faf4", border: "#a3d9b5" },
  inactivo: { color: "#4a5565", bg: "#f2f2f7", border: "#d1d1d6" },
};

function countPermissions(roleId: number) {
  const perms = MOCK_ROLE_PERMISSIONS[roleId] ?? [];
  const moduleKeys = new Set<string>();
  perms.forEach((p) => {
    const dotIdx = p.indexOf(":");
    if (dotIdx > -1) moduleKeys.add(p.substring(0, dotIdx));
  });
  const topModules = new Set<string>();
  moduleKeys.forEach((k) => {
    const root = k.split(".")[0];
    const isTop = MOCK_PERMISSION_MODULES.some((m) => m.key === root);
    if (isTop) topModules.add(root);
  });
  return { actions: perms.length, modules: topModules.size };
}

interface RolesColumnsOptions {
  onEdit: (role: RoleI) => void;
}

export const getSecurityRolesColumns = ({
  onEdit,
}: RolesColumnsOptions): ColumnDef<RoleI>[] => [
  {
    accessorKey: "code",
    header: () => <span className="tableHeaderTitle">Nombre del Rol</span>,
    cell: ({ row }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ ...cellStyle, color: "#23366a", fontWeight: 700, fontSize: "12px" }}>
          {row.original.code}
        </span>
        <span style={{ ...cellStyle, fontSize: "10px", color: "#bbb" }}>
          ID: {row.original.roleId}
        </span>
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: "description",
    header: () => <span className="tableHeaderTitle">Descripción</span>,
    cell: ({ getValue }) => (
      <span style={cellStyle}>{getValue() as string}</span>
    ),
    size: 280,
  },
  {
    id: "permissions",
    header: () => <span className="tableHeaderTitle">Permisos</span>,
    cell: ({ row }) => {
      const { actions, modules } = countPermissions(row.original.id);
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={14} style={{ color: "#23366a", flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <span style={{ ...cellStyle, fontWeight: 600 }}>{actions} acciones</span>
            <span style={{ ...cellStyle, fontSize: "10px", color: "#bbb" }}>{modules} módulos</span>
          </div>
        </div>
      );
    },
    size: 140,
  },
  {
    accessorKey: "usersCount",
    header: () => <span className="tableHeaderTitle">Usuarios</span>,
    cell: ({ getValue }) => {
      const count = getValue() as number;
      if (count === 0) {
        return <span style={{ ...cellStyle, color: "#bbb" }}>Sin asignar</span>;
      }
      return (
        <span
          style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: "4px",
            fontSize: "11px",
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 500,
            background: "#f2f2f7",
            color: "#4a4a4c",
          }}
        >
          {count} asignados
        </span>
      );
    },
    size: 120,
  },
  {
    accessorKey: "status",
    header: () => <span className="tableHeaderTitle">Estado</span>,
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const colors = statusColors[status] || statusColors.inactivo;
      return (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "11px",
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 600,
            border: "0.8px solid",
            borderColor: colors.border,
            color: colors.color,
            background: colors.bg,
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
    size: 100,
  },
  {
    id: "actions",
    header: () => (
      <span className="tableHeaderTitle" style={{ textAlign: "right", display: "block" }}>
        Acciones
      </span>
    ),
    cell: ({ row }) => (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "14px",
            color: "#23366a",
          }}
          title="Editar"
        >
          <Pencil size={16} />
        </button>
      </div>
    ),
    size: 80,
  },
];
