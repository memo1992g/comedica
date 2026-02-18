import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/ui/Button";
import { ChevronDown, ChevronRight } from "lucide-react";
// Definición de columnas para la tabla
export function getCustomTableColumns<TData>({
  enableRowSelection = false,
  enableRowExpansion = false,
  columns,
}: {
  columns: ColumnDef<TData>[];
  enableRowSelection?: boolean;
  enableRowExpansion?: boolean;
}): ColumnDef<TData>[] {
  const leftColumns: ColumnDef<TData>[] = [];
  // Columna combinada de selección y expansión
  if (enableRowSelection || enableRowExpansion) {
    leftColumns.push({
      id: "select-expand",
      header: ({ table }) =>
        enableRowSelection ? (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Seleccionar todas las filas'
            className='translate-y-[2px]'
          />
        ) : null,
      cell: ({ row }) => (
        <div className='flex items-center space-x-2'>
          {enableRowSelection && (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label='Seleccionar fila'
              className='translate-y-[2px]'
            />
          )}
          {enableRowExpansion && row.getCanExpand() && (
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0'
              onClick={row.getToggleExpandedHandler()}
            >
              {row.getIsExpanded() ? (
                <ChevronDown className='h-3 w-3' />
              ) : (
                <ChevronRight className='h-3 w-3' />
              )}
            </Button>
          )}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: enableRowSelection && enableRowExpansion ? 80 : 50,
      meta: {
        sticky: "left",
      },
    });
  }
  const finalColumns: ColumnDef<TData>[] = [...leftColumns, ...columns];

  return finalColumns;
}
