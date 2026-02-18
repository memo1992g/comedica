import { ReactNode, Fragment, CSSProperties } from "react";
import { Table, Cell, Row, flexRender } from "@tanstack/react-table";
import { TableRow, TableCell } from "@/components/ui/table";
import { AnimatePresence, motion } from "motion/react";

interface CustomTableBodyI<TData> {
  table: Table<TData>;
  enableRowExpansion?: boolean;
  renderSubComponent?: (row: Row<TData>) => ReactNode;
  getCellStickyStyle: (
    columnId: keyof TData | "select-expand",
    columnMeta?: { sticky?: "left" | "right" }
  ) => CSSProperties;
  shouldExpandColumns?: boolean;
  tableWidth?: number;
  columnOrder?: string[];
  enableColumnReordering?: boolean;
  stickyColumns?: {
    left?: (keyof TData | "select-expand" | string)[];
    right?: (keyof TData | "select-expand" | string)[];
  };
}

function CustomTableBody<TData>({
  table,
  enableRowExpansion,
  renderSubComponent,
  getCellStickyStyle,
  shouldExpandColumns = false,
  columnOrder = [],
  stickyColumns = {},
}: CustomTableBodyI<TData>) {
  // Calcular el ancho total de las columnas para distribución proporcional
  const totalColumnsWidth = table.getAllColumns().reduce((sum, column) => {
    return sum + column.getSize();
  }, 0);

  // Asegurar que columnOrder tenga los IDs de las columnas si está vacío
  const effectiveColumnOrder =
    columnOrder && columnOrder.length > 0
      ? columnOrder
      : table.getAllColumns().map((col) => col.id);

  // Función para obtener celdas reordenadas
  const getOrderedCells = (cells: Cell<TData, unknown>[]) => {
    // Siempre reordenar si hay un columnOrder definido
    if (effectiveColumnOrder.length === 0) {
      return cells;
    }

    // Crear un mapa de cells por column id para acceso rápido
    const cellMap = new Map(cells.map((c) => [c.column.id, c]));

    // Reordenar según effectiveColumnOrder, manteniendo cells que no estén en el orden
    const orderedCells = [];
    const usedIds = new Set();

    // Primero agregar en el orden especificado
    for (const columnId of effectiveColumnOrder) {
      if (cellMap.has(columnId)) {
        orderedCells.push(cellMap.get(columnId));
        usedIds.add(columnId);
      }
    }

    // Luego agregar cualquier cell restante
    for (const cell of cells) {
      if (!usedIds.has(cell.column.id)) {
        orderedCells.push(cell);
      }
    }

    return orderedCells;
  };

  return table.getRowModel().rows.map((row) => {
    const orderedCells = getOrderedCells(row.getVisibleCells());

    // Obtener color de fila según el estado si existe
    const getRowClassName = () => {
      const rowData = row.original as Record<string, unknown>;
      if (rowData?.estado) {
        const statusColors: Record<string, string> = {          
          S: "bg-gray-50/50 hover:bg-gray-100/50", // Saldado
          M: "bg-red-100/50 hover:bg-red-150/50", // Mora
          P: "bg-green-50/50 hover:bg-green-100/50", // Pagado
        };
        return statusColors[rowData.estado as string] || "hover:bg-muted/50";
      }
      return "hover:bg-muted/50";
    };

    return (
      <Fragment key={row.id}>
        <TableRow
          data-state={row.getIsSelected() && "selected"}
          className={`min-h-[50px] h-[50px] min-w-full ${getRowClassName()}`}
        >
          {orderedCells.map((cell) => {
            if (!cell) return null;

            // Verificar si es columna sticky
            const isStickyLeft = stickyColumns?.left?.includes(
              cell.column.id as keyof TData | "select-expand"
            ) || cell.column.columnDef.meta?.sticky === "left";
            const isStickyRight = stickyColumns?.right?.includes(
              cell.column.id as keyof TData | "select-expand"
            ) || cell.column.columnDef.meta?.sticky === "right";
            const isSticky = isStickyLeft || isStickyRight;

            // Las columnas sticky siempre usan ancho fijo en píxeles
            const columnWidth = isSticky
              ? `${cell.column.getSize()}px`
              : shouldExpandColumns
                ? `${(cell.column.getSize() / totalColumnsWidth) * 100}%`
                : `${cell.column.getSize()}px`;

            return (
              <TableCell
                key={cell?.id}
                className='min-h-[50px] h-[50px] px-2 py-3'
                style={{
                  width: columnWidth,
                  minWidth: `${cell?.column.getSize()}px`,
                  maxWidth: isSticky
                    ? `${cell?.column.getSize()}px`
                    : shouldExpandColumns
                      ? "none"
                      : `${cell?.column.getSize()}px`,
                  ...getCellStickyStyle(
                    cell?.column.id as keyof TData | "select-expand",
                    cell?.column.columnDef.meta
                  ),
                }}
              >
                {flexRender(cell?.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
        <AnimatePresence mode='sync'>
          {enableRowExpansion && row.getIsExpanded() && renderSubComponent && (
            <motion.tr key={`${row.id}-expanded`}>
              <TableCell colSpan={orderedCells.length} className='p-0'>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className='bg-muted/20 border-t'
                >
                  {renderSubComponent(row)}
                </motion.div>
              </TableCell>
            </motion.tr>
          )}
        </AnimatePresence>
      </Fragment>
    );
  });
}

export default CustomTableBody;
