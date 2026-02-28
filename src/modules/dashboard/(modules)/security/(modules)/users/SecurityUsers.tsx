"use client";

import React, { useCallback, useMemo, useState } from "react";
import type { SecurityUserI } from "@/interfaces/security";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import CustomTable from "@/components/common/CustomTable/CustomTable";
import { useCustomTable } from "@/components/common/CustomTable/hooks/use-custom-table";
import { getCustomTableColumns } from "@/components/common/CustomTable/utils/get-custom-table-columns";
import { useSecurityUsers } from "./hooks/use-security-users";
import { getSecurityUsersColumns } from "./security-users-columns";
import SecurityUsersSearchBar from "./components/security-users-search-bar/SecurityUsersSearchBar";
import CreateUserModal from "./components/create-user-modal/CreateUserModal";
import EditUserModal from "./components/edit-user-modal/EditUserModal";
import ToggleLockConfirmModal from "./components/toggle-lock-confirm-modal/ToggleLockConfirmModal";
import styles from "./styles/security-users.module.css";
import "./styles/CustomTableOverrides.css";

export default function SecurityUsers() {
  const router = useRouter();
  const {
    rows,
    currentPage,
    totalPages,
    hasSearched,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    selectedUser,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleToggleLock,
    openEdit,
    handlePrevPage,
    handleNextPage,
  } = useSecurityUsers();

  const [lockPendingUser, setLockPendingUser] = useState<SecurityUserI | null>(null);
  const [lockSaving, setLockSaving] = useState(false);

  const onToggleLock = useCallback(
    (user: SecurityUserI) => {
      setLockPendingUser(user);
    },
    [],
  );

  const handleConfirmLock = useCallback(async () => {
    if (!lockPendingUser) return;
    setLockSaving(true);
    await handleToggleLock(lockPendingUser);
    setLockSaving(false);
    setLockPendingUser(null);
  }, [lockPendingUser, handleToggleLock]);

  const columnDefs = useMemo(
    () =>
      getSecurityUsersColumns({
        onEdit: openEdit,
        onToggleLock,
      }),
    [openEdit, onToggleLock],
  );

  const columns = useMemo(
    () => getCustomTableColumns({ columns: columnDefs }),
    [columnDefs],
  );

  const { table } = useCustomTable({
    data: rows,
    columns,
    manualPagination: false,
    pageIndex: currentPage - 1,
    pageSize: 10,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema y sus permisos</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={16} />
            Agregar Usuario
          </button>
          <button
            type="button"
            className={styles.historyButton}
            onClick={() =>
              router.push("/dashboard/seguridad/usuarios/historial")
            }
          >
            Historial
          </button>
        </div>
      </div>

      {hasSearched ? (
        <>
          <div
            className={styles.tableSection}
            data-security-table
            data-security-table-empty={rows.length === 0 || undefined}
          >
            <CustomTable
              table={table}
              enableColumnReordering={false}
              enableRowExpansion={false}
              stickyHeader={false}
              showScrollIndicators={false}
            />
          </div>

          <div className={styles.paginationContainer}>
            <div className={styles.navButtons}>
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className={styles.navButton}
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState />
      )}

      <SecurityUsersSearchBar onSearch={handleSearch} />

      {createOpen && (
        <CreateUserModal
          onClose={() => setCreateOpen(false)}
          onCreate={handleCreate}
        />
      )}

      {editOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setEditOpen(false)}
          onUpdate={handleUpdate}
        />
      )}

      {lockPendingUser && (
        <ToggleLockConfirmModal
          user={lockPendingUser}
          saving={lockSaving}
          onCancel={() => setLockPendingUser(null)}
          onConfirm={handleConfirmLock}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <Search size={48} className={styles.emptyIcon} />
      <p className={styles.emptyTitle}>Realice una búsqueda</p>
      <p className={styles.emptySubtitle}>
        Utilice los filtros para ver los resultados
      </p>
    </div>
  );
}
