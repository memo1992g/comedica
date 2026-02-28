"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import CustomTable from "@/components/common/CustomTable/CustomTable";
import { useCustomTable } from "@/components/common/CustomTable/hooks/use-custom-table";
import { getCustomTableColumns } from "@/components/common/CustomTable/utils/get-custom-table-columns";
import { useSecurityRoles } from "./hooks/use-security-roles";
import { getSecurityRolesColumns } from "./security-roles-columns";
import CreateRoleModal from "./components/create-role-modal/CreateRoleModal";
import EditRoleModal from "./components/edit-role-modal/EditRoleModal";
import DeleteRoleModal from "./components/delete-role-modal/DeleteRoleModal";
import styles from "./styles/security-roles.module.css";
import "./styles/CustomTableOverrides.css";

export default function SecurityRoles() {
  const router = useRouter();
  const {
    rows,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    selectedRole,
    deleteTarget,
    setDeleteTarget,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleUpdatePermissions,
    openEdit,
    openDelete,
  } = useSecurityRoles();

  const columnDefs = useMemo(
    () => getSecurityRolesColumns({ onEdit: openEdit }),
    [openEdit],
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
    pageSize: 50,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Gestión de Roles</h1>
          <p>Configuración de permisos y accesos del sistema</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={16} />
            Agregar Rol
          </button>
          <button
            type="button"
            className={styles.historyButton}
            onClick={() =>
              router.push("/dashboard/seguridad/roles/historial")
            }
          >
            Historial
          </button>
        </div>
      </div>

      <div
        className={styles.tableSection}
        data-roles-table
        data-roles-table-empty={rows.length === 0 || undefined}
      >
        <CustomTable
          table={table}
          enableColumnReordering={false}
          enableRowExpansion={false}
          stickyHeader={false}
          showScrollIndicators={false}
        />
      </div>

      <div className={styles.searchBarContainer}>
        <div className={styles.searchInputWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por nombre o descripción..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <button type="button" className={styles.filterButton}>
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {createOpen && (
        <CreateRoleModal
          onClose={() => setCreateOpen(false)}
          onCreate={handleCreate}
        />
      )}

      {editOpen && selectedRole && (
        <EditRoleModal
          role={selectedRole}
          onClose={() => setEditOpen(false)}
          onUpdate={handleUpdate}
          onUpdatePermissions={handleUpdatePermissions}
        />
      )}

      {deleteTarget && (
        <DeleteRoleModal
          role={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
