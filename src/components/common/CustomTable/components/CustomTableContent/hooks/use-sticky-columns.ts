import { CSSProperties, useCallback } from "react";
import { Table as TanstackTable } from "@tanstack/react-table";

interface UseStickyColumnsParams<TData> {
  table: TanstackTable<TData>;
  stickyColumns?: {
    left?: (keyof TData | "select-expand" | string)[];
    right?: (keyof TData | "select-expand" | string)[];
  };
  stickyHeader: boolean;
  scrollbarWidth: number;
  isScrollAtEnd: boolean;
}

export function useStickyColumns<TData>({
  table,
  stickyColumns,
  stickyHeader,
  scrollbarWidth,
  isScrollAtEnd,
}: UseStickyColumnsParams<TData>) {
  const calculateStickyRightPosition = useCallback(
    (targetColumnId: string, isHeaderContext: boolean = false): number => {
      const rightColumns = stickyColumns?.right || [];
      if (rightColumns.length === 0) return 0;

      const targetIndex = rightColumns.indexOf(targetColumnId as keyof TData | "select-expand" | string);
      if (targetIndex === -1) return 0;

      let rightOffset = 0;
      const allColumns = table.getAllColumns();

      for (let i = targetIndex + 1; i < rightColumns.length; i++) {
        const column = allColumns.find((col) => col.id === rightColumns[i]);
        if (column) {
          rightOffset += column.getSize();
        }
      }

      if (isHeaderContext && stickyHeader && scrollbarWidth > 0 && !isScrollAtEnd) {
        rightOffset += scrollbarWidth;
      }

      return rightOffset;
    },
    [stickyColumns, table, scrollbarWidth, isScrollAtEnd, stickyHeader]
  );

  const getCellStickyStyle = useCallback(
    (
      columnId: keyof TData | "select-expand",
      columnMeta?: { sticky?: "left" | "right" },
      isHeaderContext: boolean = false
    ): CSSProperties => {
      const isSticky = columnMeta?.sticky;

      if (isSticky === "left" || stickyColumns?.left?.includes(columnId)) {
        const leftColumns = stickyColumns?.left || [];
        const isLastLeftColumn =
          leftColumns.length > 0 ? leftColumns.at(-1) === columnId : isSticky === "left";

        return {
          position: "sticky" as const,
          left: 0,
          zIndex: 5,
          backgroundColor: "hsl(var(--background))",
          ...(isLastLeftColumn && {
            borderRight: "1px solid hsl(var(--border))",
          }),
        };
      }

      if (isSticky === "right" || stickyColumns?.right?.includes(columnId)) {
        const rightPosition = calculateStickyRightPosition(
          columnId as string,
          isHeaderContext
        );
        const rightColumns = stickyColumns?.right || [];
        const isFirstRightColumn =
          rightColumns.length > 0
            ? rightColumns[0] === columnId
            : isSticky === "right";

        return {
          position: "sticky" as const,
          right: rightPosition,
          zIndex: 5,
          backgroundColor: "hsl(var(--background))",
          ...(isFirstRightColumn && {
            borderLeft: "1px solid hsl(var(--border))",
          }),
        };
      }

      return {};
    },
    [stickyColumns, calculateStickyRightPosition]
  );

  return { getCellStickyStyle };
}
