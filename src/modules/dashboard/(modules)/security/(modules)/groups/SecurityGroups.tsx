"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter } from "lucide-react";
import CustomTable from "@/components/common/CustomTable/CustomTable";
import { useCustomTable } from "@/components/common/CustomTable/hooks/use-custom-table";
import { getCustomTableColumns } from "@/components/common/CustomTable/utils/get-custom-table-columns";
import { useGroupsData } from "./hooks/use-groups-data";
import { getGroupsColumns } from "./groups-columns";
import CreateGroupModal from "./components/create-group-modal/CreateGroupModal";
import EditGroupModal from "./components/edit-group-modal/EditGroupModal";
import styles from "./styles/security-groups.module.css";
import "./styles/CustomTableOverrides.css";

export default function SecurityGroups() {
  const router = useRouter();
  const hook = useGroupsData();

  const columnDefs = useMemo(
    () => getGroupsColumns({ onEdit: hook.openEdit }),
    [hook.openEdit],
  );

  const columns = useMemo(
    () => getCustomTableColumns({ columns: columnDefs }),
    [columnDefs],
  );

  const { table } = useCustomTable({
    data: hook.rows,
    columns,
    manualPagination: false,
    pageIndex: hook.currentPage - 1,
    pageSize: 10,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Gestión de Grupos</h1>
          <p>Administración de perfiles y asignación de roles</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => hook.setCreateOpen(true)}
          >
            <Plus size={16} />
            Agregar Grupo
          </button>
          <button
            type="button"
            className={styles.historyButton}
            onClick={() =>
              router.push("/dashboard/seguridad/grupos/historial")
            }
          >
            Historial
          </button>
        </div>
      </div>

      <div
        className={styles.tableSection}
        data-groups-table
      >
        <CustomTable
          table={table}
          enableColumnReordering={false}
          enableRowExpansion={false}
          stickyHeader={false}
          showScrollIndicators={false}
        />
      </div>

      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <Search size={16} />
          <input
            className={styles.searchInput}
            placeholder="Busque por ID de asociado..."
            value={hook.searchQuery}
            onChange={(e) => hook.handleSearch(e.target.value)}
          />
        </div>
        <button type="button" className={styles.filterButton}>
          <Filter size={16} />
        </button>
      </div>

      {hook.createOpen && (
        <CreateGroupModal
          onClose={() => hook.setCreateOpen(false)}
          onCreate={hook.handleCreate}
        />
      )}

      {hook.editOpen && hook.selectedGroup && (
        <EditGroupModal
          group={hook.selectedGroup}
          onClose={() => hook.setEditOpen(false)}
          onUpdate={hook.handleUpdate}
          members={hook.members}
          availableUsers={hook.availableUsers}
          onAddMember={hook.handleAddMember}
          onRemoveMember={hook.handleRemoveMember}
          groupRoles={hook.groupRoles}
          availableRoles={hook.availableRoles}
          onAssignRole={hook.handleAssignRole}
          onRemoveRole={hook.handleRemoveRole}
        />
      )}
    </div>
  );
}
