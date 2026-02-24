import { Table, Row } from "@tanstack/react-table";
import { ReactNode, CSSProperties } from "react";

export interface CustomTableI<TData> {
  table: Table<TData>;
  enableRowExpansion?: boolean;
  enableColumnReordering?: boolean;
  columnOrder?: string[];
  onColumnOrderChange?: (newOrder: string[]) => void;
  renderSubComponent?: (row: Row<TData>) => ReactNode;
  //
  stickyColumns?: {
    left?: (keyof TData | "select-expand" | string)[];
    right?: (keyof TData | "select-expand" | string)[];
  };
  scroll?: {
    x?: number;
    y?: number;
  };
  containerStyle?: CSSProperties;
  showScrollIndicators?: boolean;
  stickyHeader?: boolean;
}

// Augmentación de tipos para habilitar meta.sticky en TanStack Table

declare module "@tanstack/react-table" {
  // eslint-disable-next-line no-unused-vars
  interface ColumnMeta<TData, TValue> {
    sticky?: "left" | "right";
  }
}
