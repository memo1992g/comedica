import { CSSProperties } from "react";

interface TableStylesParams {
  shouldExpandColumns: boolean;
  tableWidth: number;
  totalColumnsWidth: number;
  scrollY?: number | string;
  containerStyleOverride?: CSSProperties;
}

export function getScrollContainerStyle(scrollY?: number | string): CSSProperties {
  return {
    width: "100%",
    height: scrollY || "auto",
    overflow: "auto",
    scrollbarGutter: "stable",
  };
}

export function getBaseContainerStyle(): CSSProperties {
  return {
    width: "100%",
    borderRadius: "0",
    border: "1px solid hsl(var(--border))",
    backgroundColor: "hsl(var(--background))",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  };
}

export function getContainerStyle(override?: CSSProperties): CSSProperties {
  return {
    ...getBaseContainerStyle(),
    ...override,
  };
}

export function getTableStyle({
  shouldExpandColumns,
  tableWidth,
  totalColumnsWidth,
}: Omit<TableStylesParams, "scrollY" | "containerStyleOverride">): CSSProperties {
  return {
    width: shouldExpandColumns ? `${tableWidth}px` : "100%",
    minWidth: shouldExpandColumns ? `${tableWidth}px` : `${totalColumnsWidth}px`,
    maxWidth: shouldExpandColumns ? `${tableWidth}px` : "100%",
    tableLayout: "fixed",
    borderCollapse: "separate",
    borderSpacing: "0",
    borderBottom: "1px solid hsl(var(--border))",
  };
}
