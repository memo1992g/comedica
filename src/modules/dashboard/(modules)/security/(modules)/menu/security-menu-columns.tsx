"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown, Pencil } from "lucide-react";
import type { MenuTableRowI } from "@/interfaces/security";

const cellStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontSize: "11px",
  color: "#4a4a4c",
};

const statusColors: Record<string, string> = {
  Activo: "#008236",
  Inactivo: "#8e8e93",
};

interface MenuColumnsOptions {
  expandedModules: Set<string>;
  expandedSubCats: Set<string>;
  onToggleModule: (id: string) => void;
  onToggleSubCat: (id: string) => void;
  onEditModule: (id: string) => void;
  onEditItem: (row: MenuTableRowI) => void;
}

export function getSecurityMenuColumns({
  expandedModules,
  expandedSubCats,
  onToggleModule,
  onToggleSubCat,
  onEditModule,
  onEditItem,
}: MenuColumnsOptions): ColumnDef<MenuTableRowI>[] {
  return [
    {
      accessorKey: "name",
      header: () => <span className="tableHeaderTitle">Nombre</span>,
      cell: ({ row }) => {
        const r = row.original;

        if (r.rowType === "category-header") {
          return (
            <div style={{ paddingLeft: "24px", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "3px", height: "14px", background: "#23366a", borderRadius: "2px" }} />
              <span style={{ ...cellStyle, fontSize: "11px", color: "#8e8e93" }}>{r.name}</span>
            </div>
          );
        }

        if (r.rowType === "module") {
          const isExpanded = expandedModules.has(r.id);
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }} onClick={() => onToggleModule(r.id)}>
              {isExpanded ? <ChevronDown size={14} color="#23366a" /> : <ChevronRight size={14} color="#23366a" />}
              <span style={{ ...cellStyle, color: "#23366a", fontWeight: 700, fontSize: "13px" }}>
                {r.name}
              </span>
              {r.childCount != null && (
                <span style={{ ...cellStyle, fontSize: "10px", color: "#8e8e93" }}>
                  ({r.childCount} elementos)
                </span>
              )}
            </div>
          );
        }

        if (r.rowType === "sub-category") {
          const isExpanded = expandedSubCats.has(r.id);
          return (
            <div style={{ paddingLeft: "32px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }} onClick={() => onToggleSubCat(r.id)}>
              {isExpanded ? <ChevronDown size={12} color="#23366a" /> : <ChevronRight size={12} color="#23366a" />}
              <span style={{ ...cellStyle, color: "#23366a", fontWeight: 600, fontSize: "12px" }}>
                {r.name}
              </span>
              {r.childCount != null && (
                <span style={{ ...cellStyle, fontSize: "10px", color: "#8e8e93" }}>
                  ({r.childCount})
                </span>
              )}
            </div>
          );
        }

        const indent = r.rowType === "sub-item" ? "56px" : "32px";
        return (
          <span style={{ ...cellStyle, paddingLeft: indent, display: "block" }}>
            {r.name}
          </span>
        );
      },
      size: 220,
    },
    {
      accessorKey: "description",
      header: () => <span className="tableHeaderTitle">Descripción</span>,
      cell: ({ row }) => {
        if (row.original.rowType === "category-header") return null;
        return <span style={cellStyle}>{row.original.description}</span>;
      },
      size: 280,
    },
    {
      accessorKey: "route",
      header: () => <span className="tableHeaderTitle">Ruta</span>,
      cell: ({ row }) => {
        if (row.original.rowType === "category-header") return null;
        if (row.original.rowType === "sub-category") return null;
        return <span style={cellStyle}>{row.original.route}</span>;
      },
      size: 200,
    },
    {
      accessorKey: "order",
      header: () => <span className="tableHeaderTitle">Orden</span>,
      cell: ({ row }) => {
        if (row.original.rowType === "category-header") return null;
        return (
          <span style={{ ...cellStyle, fontWeight: 700, color: "#23366a" }}>
            {row.original.order}
          </span>
        );
      },
      size: 70,
    },
    {
      accessorKey: "status",
      header: () => <span className="tableHeaderTitle">Estado</span>,
      cell: ({ row }) => {
        if (row.original.rowType === "category-header") return null;
        const status = row.original.status;
        const color = statusColors[status] || "#8e8e93";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontFamily: "var(--font-dm-sans)",
              color,
              background: "white",
              border: "0.8px solid #e2e2e7",
              fontWeight: 600,
            }}
          >
            {status}
          </span>
        );
      },
      size: 90,
    },
    {
      id: "actions",
      header: () => <span className="tableHeaderTitle">Acciones</span>,
      cell: ({ row }) => {
        const r = row.original;
        if (r.rowType === "category-header") return null;

        const handleClick = () => {
          if (r.rowType === "module") onEditModule(r.id);
          else onEditItem(r);
        };

        return (
          <button
            type="button"
            onClick={handleClick}
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
        );
      },
      size: 80,
    },
  ];
}
