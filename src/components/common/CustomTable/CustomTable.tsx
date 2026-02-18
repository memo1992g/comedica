import { useState, useMemo, useRef, ReactNode, useCallback } from "react";
import { CustomTableI } from "./interface/CustomTable.interface";
import CustomTableContent from "./components/CustomTableContent/CustomTableContent";
import CustomTableDrag from "./components/CustomTableDrag/CustomTableDrag";

const NOOP = () => {};

function CustomTable<TData>({
  table,
  enableRowExpansion = false,
  enableColumnReordering = false,
  onColumnOrderChange,
  renderSubComponent,
  stickyColumns,
  scroll,
  showScrollIndicators = true,
  stickyHeader = false,
  containerStyle,
}: CustomTableI<TData> & { children?: ReactNode }) {
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const stableOnColumnOrderChange = onColumnOrderChange ?? NOOP;

  const stickyLeft = stickyColumns?.left;
  const stickyRight = stickyColumns?.right;
  const stickyLeftKey = stickyLeft?.join(",") ?? "";
  const stickyRightKey = stickyRight?.join(",") ?? "";

  const memoStickyColumns = useMemo(
    () => stickyColumns ?? {},
    [stickyLeftKey, stickyRightKey]
  );
  const scrollX = scroll?.x;
  const scrollY = scroll?.y;
  const memoScroll = useMemo(
    () => (scrollX || scrollY ? { x: scrollX, y: scrollY } : undefined),
    [scrollX, scrollY]
  );

  const prevComputedRef = useRef<string[]>([]);
  const computedColumnOrder = useMemo(() => {
    const allColumns = table.getAllColumns().map((col) => col.id);
    const left = stickyLeft || [];
    const right = stickyRight || [];

    if (left.length === 0 && right.length === 0) {
      return columnOrder.length > 0 ? columnOrder : allColumns;
    }

    const middleColumns = allColumns.filter(
      (colId) =>
        !left.includes(colId as keyof TData | "select-expand") &&
        !right.includes(colId as keyof TData | "select-expand")
    );

    const newOrder = [
      ...left.filter((col) => allColumns.includes(col as string)),
      ...middleColumns,
      ...right.filter((col) => allColumns.includes(col as string)),
    ] as string[];

    const prev = prevComputedRef.current;
    if (
      prev.length === newOrder.length &&
      prev.every((id, i) => id === newOrder[i])
    ) {
      return prev;
    }
    prevComputedRef.current = newOrder;
    return newOrder;
  }, [table, stickyLeftKey, stickyRightKey, columnOrder]);

  const handleColumnOrderChange = useCallback((newOrder: string[]) => {
    setColumnOrder((prev) => {
      if (
        prev.length === newOrder.length &&
        prev.every((id, i) => id === newOrder[i])
      ) {
        return prev;
      }
      return newOrder;
    });
    stableOnColumnOrderChange(newOrder);
  }, [stableOnColumnOrderChange]);

  const tableContent = (
    <CustomTableContent
      table={table}
      enableColumnReordering={enableColumnReordering}
      columnOrder={computedColumnOrder}
      enableRowExpansion={enableRowExpansion}
      renderSubComponent={renderSubComponent}
      stickyColumns={memoStickyColumns}
      scroll={memoScroll}
      showScrollIndicators={showScrollIndicators}
      stickyHeader={stickyHeader}
      containerStyle={containerStyle}
    />
  );

  return enableColumnReordering ? (
    <CustomTableDrag
      table={table}
      columnOrder={columnOrder}
      onColumnOrderChange={handleColumnOrderChange}
    >
      {tableContent}
    </CustomTableDrag>
  ) : (
    tableContent
  );
}

export default CustomTable;
