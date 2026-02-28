"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import type { RolesByGroupAssignmentI } from "@/interfaces/security";

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
  onRevoke: (assignment: RolesByGroupAssignmentI) => void;
}

export const getRolesByGroupColumns = ({
  onRevoke,
}: ColumnsOptions): ColumnDef<RolesByGroupAssignmentI>[] => [
  {
    accessorKey: "groupName",
    header: h("Grupo"),
    cell: ({ row }) => {
      const { groupName, groupId } = row.original;
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ ...cellStyle, color: "#23366a" }}>{groupName}</span>
          <span style={{ ...cellStyle, color: "#bbb", fontSize: "10px" }}>
            ID: {groupId}
          </span>
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "roleName",
    header: h("Rol Asignado"),
    cell: ({ row }) => {
      const { roleName, roleDescription } = row.original;
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ ...cellStyle, color: "#23366a" }}>{roleName}</span>
          <span style={{ ...cellStyle, color: "#bbb", fontSize: "10px" }}>
            {roleDescription}
          </span>
        </div>
      );
    },
    size: 240,
  },
  {
    accessorKey: "groupStatus",
    header: h("Estado Grupo"),
    cell: ({ getValue }) => {
      const status = String(getValue());
      const isActive = status === "Activo";
      return (
        <span
          style={{
            ...cellStyle,
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "2px",
            fontSize: "10px",
            color: isActive ? "#008236" : "#4a4a4c",
            background: isActive ? "#e6f4ec" : "#f2f2f7",
          }}
        >
          {status}
        </span>
      );
    },
    size: 140,
  },
  {
    accessorKey: "assignmentStatus",
    header: h("Estado Asignación"),
    cell: ({ getValue }) => {
      const status = String(getValue());
      const isActive = status === "Activa";
      return (
        <span
          data-status={status}
          style={{
            ...cellStyle,
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "2px",
            fontSize: "10px",
            color: isActive ? "#008236" : "#4a4a4c",
            background: isActive ? "#e6f4ec" : "#f2f2f7",
          }}
        >
          {status}
        </span>
      );
    },
    size: 160,
  },
  {
    accessorKey: "assignmentDate",
    header: h("Fecha Asignación"),
    cell: ({ row }) => {
      const { assignmentDate, assignedBy } = row.original;
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={cellStyle}>{assignmentDate}</span>
          <span style={{ ...cellStyle, color: "#bbb", fontSize: "10px" }}>
            Por: {assignedBy}
          </span>
        </div>
      );
    },
    size: 160,
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
    cell: ({ row }) => (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => onRevoke(row.original)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "14px",
            color: "#d32f2f",
          }}
          title="Revocar asignación"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
    size: 120,
  },
];
