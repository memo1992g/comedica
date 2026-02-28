"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CustomDatePicker } from "@/components/common/CustomDatePicker/CustomDatePicker";
import CustomTable from "@/components/common/CustomTable/CustomTable";
import { useCustomTable } from "@/components/common/CustomTable/hooks/use-custom-table";
import { getCustomTableColumns } from "@/components/common/CustomTable/utils/get-custom-table-columns";
import { useSecurityMenu } from "./hooks/use-security-menu";
import { getSecurityMenuColumns } from "./security-menu-columns";
import CreateMenuModal from "./components/create-menu-modal/CreateMenuModal";
import EditModuleModal from "./components/edit-module-modal/EditModuleModal";
import EditMenuItemModal from "./components/edit-menu-item-modal/EditMenuItemModal";
import styles from "./styles/security-menu.module.css";
import "./styles/CustomTableOverrides.css";

export default function SecurityMenu() {
  const router = useRouter();
  const {
    modules,
    rows,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    searchQuery,
    dateRange,
    expandedModules,
    expandedSubCats,
    createOpen,
    setCreateOpen,
    editModuleOpen,
    setEditModuleOpen,
    editItemOpen,
    setEditItemOpen,
    selectedModule,
    selectedRow,
    toggleModule,
    toggleSubCategory,
    handleSearch,
    handleDateFilter,
    handlePageChange,
    handlePageSizeChange,
    openEditModule,
    openEditItem,
    handleCreateModule,
    handleCreateCategory,
    handleCreateSubCategory,
    handleUpdateModule,
    handleUpdateCategory,
  } = useSecurityMenu();

  const columnDefs = useMemo(
    () =>
      getSecurityMenuColumns({
        expandedModules,
        expandedSubCats,
        onToggleModule: toggleModule,
        onToggleSubCat: toggleSubCategory,
        onEditModule: openEditModule,
        onEditItem: openEditItem,
      }),
    [expandedModules, expandedSubCats, toggleModule, toggleSubCategory, openEditModule, openEditItem],
  );

  const columns = useMemo(
    () => getCustomTableColumns({ columns: columnDefs }),
    [columnDefs],
  );

  const { table } = useCustomTable({
    data: rows,
    columns,
    manualPagination: false,
    pageIndex: 0,
    pageSize: rows.length || 10,
  });

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Gestión de Menús</h1>
          <p>Administración de la estructura de navegación del sistema</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={16} />
            Agregar Menú
          </button>
          <button
            type="button"
            className={styles.historyButton}
            onClick={() => router.push("/dashboard/seguridad/menu/historial")}
          >
            Historial
          </button>
        </div>
      </div>

      <div
        className={styles.tableSection}
        data-menu-table
        {...(rows.length === 0 ? { "data-menu-table-empty": true } : {})}
      >
        <CustomTable
          table={table}
          enableColumnReordering={false}
          enableRowExpansion={false}
          stickyHeader={true}
          scroll={{
            y: 500
          }}
          showScrollIndicators={false}
        />
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.leftSection}>
          <div className={styles.searchContainer}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar menú..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className={styles.dateRangeContainer}>
            <CustomDatePicker
              className={styles.dateRangeButton}
              selectionMode="range"
              disableFutureDates
              rangeValue={{
                from: dateRange.from ?? undefined,
                to: dateRange.to ?? undefined,
              }}
              onRangeChange={(range) =>
                handleDateFilter({
                  from: range?.from ?? null,
                  to: range?.to ?? null,
                })
              }
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button className={styles.filterButton} type="button">
                <Filter size={16} className={styles.filterIcon} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" style={{ padding: "4px", minWidth: "200px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {[
                  { value: "all", label: "Todos" },
                  { value: "Activo", label: "Activo" },
                  { value: "Inactivo", label: "Inactivo" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    style={{
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      color: "#4a4a4c",
                      cursor: "pointer",
                    }}
                    onClick={() => {/* filter by status if needed */}}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.pageInfo}>
            <span className={styles.pageLabel}>Items por página</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => handlePageSizeChange(Number(v))}
            >
              <SelectTrigger className={styles.pageSizeTrigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={styles.pageSizeContent}>
                <SelectItem className={styles.pageSizeItem} value="5">5</SelectItem>
                <SelectItem className={styles.pageSizeItem} value="10">10</SelectItem>
                <SelectItem className={styles.pageSizeItem} value="25">25</SelectItem>
                <SelectItem className={styles.pageSizeItem} value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={styles.itemsInfo}>
            {totalItems === 0 ? 0 : startItem}-{endItem} de {totalItems}
          </div>

          <div className={styles.navButtons}>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {createOpen && (
        <CreateMenuModal
          modules={modules}
          onClose={() => setCreateOpen(false)}
          onCreateModule={handleCreateModule}
          onCreateCategory={handleCreateCategory}
          onCreateSubCategory={handleCreateSubCategory}
        />
      )}

      {editModuleOpen && selectedModule && (
        <EditModuleModal
          module={selectedModule}
          modules={modules}
          onClose={() => setEditModuleOpen(false)}
          onSave={handleUpdateModule}
        />
      )}

      {editItemOpen && selectedRow && (
        <EditMenuItemModal
          row={selectedRow}
          modules={modules}
          onClose={() => setEditItemOpen(false)}
          onSave={handleUpdateCategory}
        />
      )}
    </div>
  );
}
