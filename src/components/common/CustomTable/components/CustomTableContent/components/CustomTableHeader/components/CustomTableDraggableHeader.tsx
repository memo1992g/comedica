import { CSSProperties } from "react";
import { Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { TableHead } from "@/components/ui/table";
import { Menu } from "lucide-react";

function CustomTableDraggableHeader<TData>({
  header,
  enableColumnReordering,
  getCellStickyStyle,
  shouldExpandColumns = false,
  stickyHeader = false,
  stickyColumns,
}: Readonly<{
  header: Header<TData, unknown>;
  enableColumnReordering: boolean;
  getCellStickyStyle: (
    columnId: keyof TData | "select-expand",
    columnMeta?: { sticky?: "left" | "right" }
  ) => CSSProperties;
  shouldExpandColumns?: boolean;
  tableWidth?: number;
  stickyHeader?: boolean;
  stickyColumns?: {
    left?: (keyof TData | "select-expand" | string)[];
    right?: (keyof TData | "select-expand" | string)[];
  };
  columnOrder?: string[];
}>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: header.id,
    disabled: !enableColumnReordering || header.isPlaceholder,
  });

  // Calcular el ancho total de las columnas para distribución proporcional
  const totalColumnsWidth = header.getContext().table.getAllColumns().reduce((sum, column) => {
    return sum + column.getSize();
  }, 0);

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Usar la misma lógica de ancho que el header normal
    width: shouldExpandColumns
      ? `${(header.getSize() / totalColumnsWidth) * 100}%`
      : `${header.getSize()}px`,
    minWidth: `${header.getSize()}px`,
    maxWidth: shouldExpandColumns
      ? "none"
      : `${header.getSize()}px`,
    ...stickyStyle,
    zIndex: stickyHeader && stickyStyle.position === "sticky" &&
      (isStickyLeft || isStickyRight) ? 20 :
      stickyHeader ? 15 : (stickyStyle.position === "sticky" ? 10 : 1),
    // Prevenir distorsión visual durante el drag
    ...(isDragging && {
      overflow: "hidden",
      whiteSpace: "nowrap" as const,
    }),
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={cn(
        "select-none min-h-[50px] h-[50px] px-2 py-3 relative group",
        isDragging && "opacity-50 z-50"
      )}
    >
      <div className='flex items-center h-full bg-background'>
        {/* Contenido del header */}
        <div className='flex-1'>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </div>

        {/* Handle de drag - visible si está habilitado */}
        {enableColumnReordering && (
          <div
            className='ml-2 cursor-grab active:cursor-grabbing z-10'
            {...attributes}
            {...listeners}
          >
            <Menu className='w-4 h-4 text-muted-foreground hover:text-foreground transition-colors' />
          </div>
        )}

        {/* Handle de redimensionamiento */}
        {header.column.getCanResize() && (
          <div
            className='absolute right-0 top-0 h-full w-2 cursor-col-resize group/resize z-30'
            style={{
              right: 0,
              position: "absolute",
            }}
            {...{
              onMouseDown: (e) => {
                // Prevenir interferencia con drag
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
}

export default CustomTableDraggableHeader;
