import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import CustomTableHeader from "./components/CustomTableHeader/CustomTableHeader";
import CustomTableBody from "./components/CustomTableBody/CustomTableBody";
import CustomTableBodyEmpty from "./components/CustomTableBodyEmpty/CustomTableBodyEmpty";
import { CustomTableI } from "../../interface/CustomTable.interface";
import { useStickyColumns } from "./hooks/use-sticky-columns";
import { useScrollSync } from "./hooks/use-scroll-sync";
import { useTableDimensions } from "./hooks/use-table-dimensions";
import { getScrollContainerStyle, getContainerStyle, getTableStyle } from "./utils/table-styles";

function CustomTableContent<TData>({
  table, enableColumnReordering, columnOrder, enableRowExpansion,
  renderSubComponent, stickyColumns, scroll, stickyHeader = false,
  containerStyle: containerStyleOverride,
}: Readonly<CustomTableI<TData>>) {
  const rowsLength = table.getRowModel().rows.length;
  const { containerRef, containerRealWidth, totalColumnsWidth, shouldExpandColumns, tableWidth } =
    useTableDimensions({ table, scrollX: scroll?.x });
  const { headerScrollRef, bodyScrollRef, scrollbarWidth, isScrollAtEnd, syncScroll } =
    useScrollSync({ rowsLength });
  const { getCellStickyStyle } = useStickyColumns({ table, stickyColumns, stickyHeader, scrollbarWidth, isScrollAtEnd });

  const containerStyle = getContainerStyle(containerStyleOverride);
  const scrollContainerStyle = getScrollContainerStyle(scroll?.y);
  const tableStyle = getTableStyle({ shouldExpandColumns, tableWidth, totalColumnsWidth });
  const effectiveWidth = (containerRealWidth ?? 0) < tableWidth ? `${containerRealWidth}px` : `${tableWidth}px`;
  const bodyWidth = (containerRealWidth ?? 0) < tableWidth ? `${containerRealWidth}px` : "100%";

  const headerProps = { table, enableColumnReordering, columnOrder, stickyColumns, shouldExpandColumns, tableWidth };
  const bodyProps = { table, enableRowExpansion, renderSubComponent, getCellStickyStyle, shouldExpandColumns, tableWidth, columnOrder, stickyColumns };

  if (rowsLength === 0) {
    return (
      <div ref={containerRef} className="w-full" style={{ ...containerStyle, position: "relative", overflow: "hidden" }}>
        <div ref={bodyScrollRef} style={{ ...scrollContainerStyle, width: `${containerRealWidth}px`, height: "350px", overflow: "auto" }}>
          <Table className="min-w-[100%] w-max" style={{ width: `${tableWidth}px`, overflow: "auto" }}>
            <CustomTableHeader {...headerProps} getCellStickyStyle={getCellStickyStyle} stickyHeader maxHeight={scroll?.y?.toString()} />
            <TableBody><CustomTableBodyEmpty table={table} height="280px" width={`${bodyScrollRef.current?.clientWidth}px`} /></TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (stickyHeader && scroll?.y) {
    return (
      <div ref={containerRef} className="w-full" style={containerStyle}>
        <div ref={headerScrollRef} style={{ width: "100%", overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={(e) => syncScroll("header", e.currentTarget.scrollLeft)}>
          <Table style={{ ...tableStyle, width: effectiveWidth }}>
            <CustomTableHeader {...headerProps} getCellStickyStyle={(id, meta) => getCellStickyStyle(id, meta, true)} stickyHeader maxHeight={scroll.y.toString()} />
          </Table>
        </div>
        <div ref={bodyScrollRef} style={{ flex: 1, overflow: "auto", scrollbarGutter: "stable", maxHeight: scroll.y, width: "100%" }}
          onScroll={(e) => syncScroll("body", e.currentTarget.scrollLeft)}>
          <Table style={{ ...tableStyle, width: bodyWidth }}>
            <TableBody><CustomTableBody {...bodyProps} /></TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full" style={containerStyle}>
      <div ref={bodyScrollRef} style={{ ...scrollContainerStyle, width: shouldExpandColumns ? `${tableWidth}px` : "100%" }}
        onScroll={(e) => syncScroll("body", e.currentTarget.scrollLeft)}>
        <Table style={tableStyle}>
          <CustomTableHeader {...headerProps} getCellStickyStyle={getCellStickyStyle} stickyHeader={stickyHeader} maxHeight={scroll?.y?.toString()} />
          <TableBody>
            {rowsLength ? <CustomTableBody {...bodyProps} /> : <CustomTableBodyEmpty table={table} height={scroll?.y?.toString()} />}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CustomTableContent;
