import { useState } from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ExpandedState,
  ColumnSizingState,
  ColumnOrderState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";

const coreRowModel = getCoreRowModel();
const paginationRowModel = getPaginationRowModel();
const sortedRowModel = getSortedRowModel();
const filteredRowModel = getFilteredRowModel();
const expandedRowModel = getExpandedRowModel();

export function useCustomTable<TData>({
  data,
  columns,
  enableColumnResizing = true,
  manualPagination = false,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableColumnResizing?: boolean;
  manualPagination?: boolean;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: coreRowModel,
    getPaginationRowModel: paginationRowModel,
    getSortedRowModel: sortedRowModel,
    getFilteredRowModel: filteredRowModel,
    getExpandedRowModel: expandedRowModel,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    enableColumnResizing: enableColumnResizing,
    columnResizeMode: "onEnd",
    getRowCanExpand: () => true,
    manualPagination,
    pageCount: pageCount ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      columnSizing,
      columnOrder,
      pagination: {
        pageIndex: pageIndex ?? 0,
        pageSize: pageSize ?? 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({
          pageIndex: pageIndex ?? 0,
          pageSize: pageSize ?? 10,
        });
        onPageChange?.(newPagination.pageIndex + 1);
        onPageSizeChange?.(newPagination.pageSize);
      }
    },
  });

  return {
    table,
    columnOrder,
    setColumnOrder,
  };
}
