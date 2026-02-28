"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Lock, Unlock } from "lucide-react";
import type { SecurityUserI } from "@/interfaces/security";

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
  Bloqueado: "#d32f2f",
};

interface SecurityColumnsOptions {
  onEdit: (user: SecurityUserI) => void;
  onToggleLock: (user: SecurityUserI) => void;
}

export const getSecurityUsersColumns = ({
  onEdit,
  onToggleLock,
}: SecurityColumnsOptions): ColumnDef<SecurityUserI>[] => [
  {
    accessorKey: "fullName",
    header: () => <span className="tableHeaderTitle">Usuario</span>,
    cell: ({ row }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ ...cellStyle, color: "#23366a", fontWeight: 700 }}>
          {row.original.fullName}
        </span>
        <span style={{ ...cellStyle, fontSize: "10px", color: "#bbb" }}>
          ID: {row.original.employeeNumber}
        </span>
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: "email",
    header: () => <span className="tableHeaderTitle">Email</span>,
    cell: ({ getValue }) => (
      <span style={cellStyle}>{getValue() as string}</span>
    ),
    size: 200,
  },
  {
    id: "officeCostCenter",
    header: () => (
      <span className="tableHeaderTitle">Oficina / Centro Costos</span>
    ),
    cell: ({ row }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ ...cellStyle, color: "#23366a", fontWeight: 700 }}>
          {row.original.office}
        </span>
        <span style={{ ...cellStyle, fontSize: "10px", color: "#bbb" }}>
          {row.original.costCenter}
        </span>
      </div>
    ),
    size: 170,
  },
  {
    accessorKey: "roles",
    header: () => <span className="tableHeaderTitle">Roles</span>,
    cell: ({ getValue }) => (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {(getValue() as string[]).map((role) => (
          <span key={role} style={pillStyle}>
            {role}
          </span>
        ))}
      </div>
    ),
    size: 160,
  },
  {
    accessorKey: "groups",
    header: () => <span className="tableHeaderTitle">Grupos</span>,
    cell: ({ getValue }) => (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {(getValue() as string[]).map((group) => (
          <span key={group} style={pillStyle}>
            {group}
          </span>
        ))}
      </div>
    ),
    size: 170,
  },
  {
    accessorKey: "lastLogin",
    header: () => <span className="tableHeaderTitle">Último Login</span>,
    cell: ({ getValue }) => (
      <span style={cellStyle}>{getValue() as string}</span>
    ),
    size: 140,
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
    id: "actions",
    header: () => <span className="tableHeaderTitle">Acciones</span>,
    cell: ({ row }) => {
      const user = row.original;
      const isLocked = user.status === "Bloqueado";
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => onEdit(user)}
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
          <button
            type="button"
            onClick={() => onToggleLock(user)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "14px",
              color: isLocked ? "#d32f2f" : "#23366a",
            }}
            title={isLocked ? "Desbloquear" : "Bloquear"}
          >
            {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
          </button>
        </div>
      );
    },
    size: 90,
  },
];
