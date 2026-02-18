import { Table } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

function CustomTableBodyEmpty<TData>({
  table,
  height,
  width,
}: Readonly<{
  table: Table<TData>;
  height?: string;
  width?: string;
}>) {  
  return (
    <TableRow className="empty-state-row">
      <TableCell colSpan={table.getAllColumns().length} className="p-0">
        <div
          className={`text-center sticky left-0 flex flex-col items-center justify-center `}
          style={{
            height: height ?? "min-content",
            width: width ?? "100px",
          }}
        >
          <Search size={32} className="opacity-[0.2] text-[#bbbbbb]" />
          <h3 className="text-lg font-semibold text-[#bbbbbb]">No hay resultados</h3>
          <p className="text-sm text-[#bbbbbb]">
            Intenta cambiar los filtros o el nombre del filtro.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default CustomTableBodyEmpty;
