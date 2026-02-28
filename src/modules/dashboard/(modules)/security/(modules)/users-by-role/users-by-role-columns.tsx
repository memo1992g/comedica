"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Ban, RotateCcw } from "lucide-react";
import type { UserByRoleI } from "@/interfaces/security";

const cellStyle = {
  fontFamily: "var(--font-dm-sans)",
  fontSize: "11px",
  color: "#4a4a4c",
};

const h = (label: string) => {
  const Header = () => <span className="tableHeaderTitle">{label}</span>;
  Header.displayName = `Header_${label}`;
  return Header;
};

interface ColumnsOptions {
  onToggleStatus: (user: UserByRoleI) => void;
}

export const getUsersByRoleColumns = ({
  onToggleStatus,
}: ColumnsOptions): ColumnDef<UserByRoleI>[] => [
  {
    accessorKey: "role",
    header: h("Rol"),
    cell: ({ row }) => {
      const { role, roleId } = row.original;
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ ...cellStyle, color: "#23366a" }}>{role}</span>
          <span style={{ ...cellStyle, color: "#bbb", fontSize: "10px" }}>
            ID: {roleId}
          </span>
        </div>
      );
    },
    size: 280,
  },
  {
    accessorKey: "username",
    header: h("Usuario"),
    cell: ({ row }) => {
      const { username, fullName } = row.original;
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ ...cellStyle, color: "#23366a" }}>{username}</span>
          <span style={{ ...cellStyle, color: "#bbb", fontSize: "10px" }}>
            {fullName}
          </span>
        </div>
      );
    },
    size: 280,
  },
  {
    accessorKey: "assignmentDate",
    header: h("Fecha Asignación"),
    cell: ({ getValue }) => (
      <span style={cellStyle}>{String(getValue())}</span>
    ),
    size: 180,
  },
  {
    accessorKey: "status",
    header: h("Estado"),
    cell: ({ getValue }) => {
      const status = String(getValue());
      const isActive = status === "Activo";
      return (
        <span
          data-status={status}
          style={{
            ...cellStyle,
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "2px",
            fontSize: "10px",
            color: "#4a4a4c",
            background: isActive ? "white" : "#f2f2f7",
          }}
        >
          {status}
        </span>
      );
    },
    size: 180,
  },
  {
    id: "actions",
    header: () => (
      <span
        className="tableHeaderTitle"
        style={{ textAlign: "right", display: "block" }}
      >
        Acciones
      </span>
    ),
    cell: ({ row }) => {
      const user = row.original;
      const isActive = user.status === "Activo";
      return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => onToggleStatus(user)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "14px",
              color: isActive ? "#d32f2f" : "#008236",
            }}
            title={isActive ? "Desactivar" : "Activar"}
          >
            {isActive ? <Ban size={16} /> : <RotateCcw size={16} />}
          </button>
        </div>
      );
    },
    size: 180,
  },
];
