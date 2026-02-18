import { CSSProperties } from "react";
import { TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Table, flexRender } from "@tanstack/react-table";
import type { Header } from "@tanstack/react-table";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import CustomTableDraggableHeader from "./components/CustomTableDraggableHeader";

function CustomTableHeader<TData>({
  table,
  enableColumnReordering,
  columnOrder,
  getCellStickyStyle,
  stickyHeader = false,
  maxHeight,
  stickyColumns,
  shouldExpandColumns = false,
  tableWidth,
}: Readonly<{
  table: Table<TData>;
  enableColumnReordering?: boolean;
  columnOrder?: string[];
  getCellStickyStyle: (
    columnId: keyof TData | "select-expand",
    columnMeta?: { sticky?: "left" | "right" }
  ) => CSSProperties;
  stickyHeader?: boolean;
  maxHeight?: string;
  stickyColumns?: {
    left?: (keyof TData | "select-expand" | string)[];
    right?: (keyof TData | "select-expand" | string)[];
  };
  shouldExpandColumns?: boolean;
  tableWidth?: number;
}>) {
  // Calcular el ancho total de las columnas
  const totalColumnsWidth = table.getAllColumns().reduce((sum, column) => {
    return sum + column.getSize();
  }, 0);

  // Asegurar que columnOrder tenga los IDs de las columnas si está vacío
  const effectiveColumnOrder = columnOrder && columnOrder.length > 0
    ? columnOrder
    : table.getAllColumns().map(col => col.id);



  // Función para obtener headers reordenados
  const getOrderedHeaders = (headers: Header<TData, unknown>[]) => {
    // Siempre reordenar si hay un columnOrder definido
    if (effectiveColumnOrder.length === 0) {
      return headers;
    }

    // Crear un mapa de headers por id para acceso rápido
    const headerMap = new Map(headers.map(h => [h.id, h]));

    // Reordenar según effectiveColumnOrder, manteniendo headers que no estén en el orden
    const orderedHeaders: Header<TData, unknown>[] = [];
    const usedIds = new Set();

    // Primero agregar en el orden especificado
    for (const columnId of effectiveColumnOrder) {
      if (headerMap.has(columnId)) {
        const headerItem = headerMap.get(columnId)!;
        orderedHeaders.push(headerItem);
        usedIds.add(columnId);
      }
    }

    // Luego agregar cualquier header restante
    for (const header of headers) {
      if (!usedIds.has(header.id)) {
        orderedHeaders.push(header);
      }
    }

    return orderedHeaders;
  };

  return (
    <TableHeader
      style={{
        ...(stickyHeader && maxHeight
          ? {
            position: "sticky",
            top: 0,
            zIndex: 15,
            backgroundColor: "hsl(var(--background))",
            borderBottom: "1px solid hsl(var(--border))",
            flexShrink: 0,
          }
          : {}),
        width: shouldExpandColumns ? `${tableWidth}px` : "100%",
        minWidth: `${totalColumnsWidth}px`,
      }}
    >
      {table.getHeaderGroups().map((headerGroup, headerGroupIndex) => {
        const orderedHeaders = getOrderedHeaders(headerGroup.headers);
        const headerGroupCount = table.getHeaderGroups().length;

        return (
          <TableRow key={headerGroup.id} className='h-[50px]'>
            {enableColumnReordering ? (
              <SortableContext
                items={effectiveColumnOrder}
                strategy={horizontalListSortingStrategy}
              >
                {orderedHeaders.map((header) => (
                  <CustomTableDraggableHeader
                    key={header.id}
                    header={header}
                    enableColumnReordering={enableColumnReordering}
                    getCellStickyStyle={getCellStickyStyle}
                    shouldExpandColumns={shouldExpandColumns}
                    tableWidth={tableWidth}
                    stickyHeader={stickyHeader}
                    stickyColumns={stickyColumns}
                    columnOrder={effectiveColumnOrder}
                  />
                ))}
              </SortableContext>
            ) : (
              orderedHeaders.map((header) => {
                // Placeholder handling for grouped headers:
                // - Group placeholders: skip (covered by parent colSpan)
                // - Leaf placeholders (top-level leaf columns): render with rowSpan
                if (header.isPlaceholder && header.column.columns.length > 0) {
                  return null;
                }

                // In child rows, skip duplicate leaf headers already rendered via rowSpan in parent row
                if (
                  !header.isPlaceholder
                  && headerGroupIndex > 0
                  && headerGroupCount > 1
                  && header.column.columns.length === 0
                  && header.column.depth === 0
                ) {
                  return null;
                }

                const isStickyLeft = stickyColumns?.left?.includes(
                  header.id as keyof TData
                ) || header.column.columnDef.meta?.sticky === "left";
                const isStickyRight = stickyColumns?.right?.includes(
                  header.id as keyof TData
                ) || header.column.columnDef.meta?.sticky === "right";

                const stickyStyle = getCellStickyStyle(
                  header.id as keyof TData | "select-expand",
                  header.column.columnDef.meta
                );

                // Ocultar handle de redimensionamiento en columnas sticky
                const isSticky = isStickyLeft || isStickyRight;

                // Las columnas sticky siempre usan ancho fijo en píxeles
                const columnWidth = isSticky
                  ? `${header.getSize()}px`
                  : shouldExpandColumns
                    ? `${(header.getSize() / totalColumnsWidth) * 100}%`
                    : `${header.getSize()}px`;

                // Grouped header support:
                // - rowSpan for top-level leaf placeholders
                // - colSpan for group columns
                const isLeafInParentRow =
                  header.isPlaceholder && header.column.columns.length === 0;
                const rowSpan = isLeafInParentRow ? headerGroupCount - headerGroupIndex : undefined;
                const colSpan = header.colSpan > 1 ? header.colSpan : undefined;

                return (
                  <TableHead
                    key={header.id}
                    colSpan={colSpan}
                    rowSpan={rowSpan}
                    className='min-h-[45px] h-[45px] px-2 py-3 relative group'
                    style={{
                      width: colSpan ? undefined : columnWidth,
                      minWidth: colSpan ? undefined : `${header.getSize()}px`,
                      maxWidth: isSticky
                        ? `${header.getSize()}px`
                        : shouldExpandColumns
                          ? "none"
                          : colSpan ? undefined : `${header.getSize()}px`,
                      ...stickyStyle,
                      zIndex: stickyHeader && stickyStyle.position === "sticky" &&
                        (isStickyLeft || isStickyRight) ? 20 :
                        stickyHeader ? 15 : (stickyStyle.position === "sticky" ? 10 : 1),
                    }}
                  >
                    <div className='flex items-center h-full bg-background'>
                      <div className='flex-1'>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>

                      {/* Handle de redimensionamiento - oculto en columnas sticky y grouped */}
                      {header.column.getCanResize() && !isSticky && !colSpan && (
                        <div
                          className='absolute right-0 top-0 h-full w-2 cursor-col-resize group/resize z-30'
                          style={{
                            right: 0,
                            position: "absolute",
                          }}
                          {...{
                            onMouseDown: (e) => {
                              e.stopPropagation();
                              header.getResizeHandler()(e);
                            },
                            onTouchStart: (e) => {
                              e.stopPropagation();
                              header.getResizeHandler()(e);
                            },
                          }}
                        >
                          <div className='absolute right-0 top-0 h-full w-0.5 bg-border opacity-0 group-hover/resize:opacity-100 hover:bg-primary transition-all' />
                        </div>
                      )}
                    </div>
                  </TableHead>
                );
              })
            )}
          </TableRow>
        );
      })}
    </TableHeader>
  );
}

export default CustomTableHeader;
