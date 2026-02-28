"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import type { GroupI } from "@/interfaces/security";

const cellStyle = {
  fontFamily: "var(--font-dm-sans)",
  fontSize: "11px",
  color: "#4a4a4c",
};

const pillStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "10px",
  fontFamily: "var(--font-dm-sans)",
  color: "#23366a",
  background: "white",
  border: "0.8px solid #e2e2e7",
  marginRight: "4px",
  marginBottom: "2px",
};

const statusColors: Record<string, string> = {
  Activo: "#008236",
  Inactivo: "#8e8e93",
};

const MAX_VISIBLE_ROLES = 2;

interface GroupColumnsOptions {
  onEdit: (group: GroupI) => void;
}

export const getGroupsColumns = ({
  onEdit,
}: GroupColumnsOptions): ColumnDef<GroupI>[] => [
  {
    accessorKey: "name",
    header: () => <span className="tableHeaderTitle">Nombre</span>,
    cell: ({ row }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ ...cellStyle, color: "#23366a", fontWeight: 700 }}>
          {row.original.name}
        </span>
        <span style={{ ...cellStyle, fontSize: "10px", color: "#bbb" }}>
          ID: {row.original.id}
        </span>
      </div>
    ),
    size: 160,
  },
  {
    accessorKey: "description",
    header: () => <span className="tableHeaderTitle">Descripción</span>,
    cell: ({ getValue }) => (
      <span style={cellStyle}>{getValue() as string}</span>
    ),
    size: 220,
  },
  {
    accessorKey: "roles",
    header: () => (
      <span className="tableHeaderTitle">Roles Asignados</span>
    ),
    cell: ({ getValue }) => {
      const roles = getValue() as string[];
      const visible = roles.slice(0, MAX_VISIBLE_ROLES);
      const remaining = roles.length - MAX_VISIBLE_ROLES;
      return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {visible.map((role) => (
            <span key={role} style={pillStyle}>
              {role}
            </span>
          ))}
          {remaining > 0 && (
            <span style={{ ...pillStyle, color: "#8e8e93" }}>
              +{remaining}
            </span>
          )}
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "status",
    header: () => <span className="tableHeaderTitle">Estado</span>,
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const color = statusColors[status] || "#8e8e93";
      return (
        <span
          style={{
            ...pillStyle,
            color,
            fontWeight: 600,
            fontSize: "11px",
          }}
        >
          {status}
        </span>
      );
    },
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <span className="tableHeaderTitle">Fecha Creación</span>
    ),
    cell: ({ getValue }) => (
      <span style={cellStyle}>{getValue() as string}</span>
    ),
    size: 130,
  },
  {
    id: "actions",
    header: () => <span className="tableHeaderTitle">Acciones</span>,
    cell: ({ row }) => (
      <div style={{ display: "flex", gap: "8px" }}>
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
    size: 90,
  },
];
