"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomTable from "@/components/common/CustomTable/CustomTable";
import { useCustomTable } from "@/components/common/CustomTable/hooks/use-custom-table";
import { getCustomTableColumns } from "@/components/common/CustomTable/utils/get-custom-table-columns";
import {
  ROLES_POR_GRUPO_MOCK,
  ROLES_POR_GRUPO_SUMMARY_MOCK,
  ROLES_POR_GRUPO_STATS_MOCK,
} from "@/consts/security/roles-por-grupo.consts";
import type { RolesByGroupAssignmentI } from "@/interfaces/security";
import RolesGrupoHeader from "./components/roles-grupo-header/RolesGrupoHeader";
import RolesGrupoTabs from "./components/roles-grupo-tabs/RolesGrupoTabs";
import type { RolesGrupoTab } from "./components/roles-grupo-tabs/RolesGrupoTabs";
import RolesGrupoKpis from "./components/roles-grupo-kpis/RolesGrupoKpis";
import RolesGrupoPagination from "./components/roles-grupo-pagination/RolesGrupoPagination";
import RevokeModal from "./components/revoke-modal/RevokeModal";
import SummaryByGrupo from "./components/summary-by-grupo/SummaryByGrupo";
import { getRolesByGroupColumns } from "./roles-por-grupo-columns";
import styles from "./styles/roles-por-grupo.module.css";
import "./styles/CustomTableOverrides.css";

export default function RolesByGroup() {
  const [activeTab, setActiveTab] = useState<RolesGrupoTab>("detallada");
  const [prevTab, setPrevTab] = useState<RolesGrupoTab>("detallada");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAssignment, setModalAssignment] =
    useState<RolesByGroupAssignmentI | null>(null);

  const handleRevoke = useCallback((assignment: RolesByGroupAssignmentI) => {
    setModalAssignment(assignment);
    setModalOpen(true);
  }, []);

  const handleConfirmRevoke = useCallback(() => {
    setModalOpen(false);
    setModalAssignment(null);
  }, []);

  const filteredData = useMemo(() => {
    let result = [...ROLES_POR_GRUPO_MOCK];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.groupName.toLowerCase().includes(q) ||
          r.roleName.toLowerCase().includes(q) ||
          r.groupId.toLowerCase().includes(q),
      );
    }
    if (selectedGroup !== "all") {
      result = result.filter((r) => r.groupName === selectedGroup);
    }
    if (selectedRole !== "all") {
      result = result.filter((r) => r.roleName === selectedRole);
    }
    if (selectedStatus !== "all") {
      result = result.filter((r) => r.assignmentStatus === selectedStatus);
    }
    return result;
  }, [searchQuery, selectedGroup, selectedRole, selectedStatus]);

  const columnDefs = useMemo(
    () => getRolesByGroupColumns({ onRevoke: handleRevoke }),
    [handleRevoke],
  );

  const columns = useMemo(
    () => getCustomTableColumns({ columns: columnDefs }),
    [columnDefs],
  );

  const { table } = useCustomTable({
    data: filteredData,
    columns,
    manualPagination: false,
    pageIndex: 0,
    pageSize: 50,
  });

  const handleTabChange = (tab: RolesGrupoTab) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const shouldAnimate = prevTab !== activeTab;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <RolesGrupoHeader />
          <RolesGrupoTabs activeTab={activeTab} onTabChange={handleTabChange} />

          <div className={styles.tableContainer}>
            <RolesGrupoKpis stats={ROLES_POR_GRUPO_STATS_MOCK} />
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "resumen" ? (
                <motion.div
                  key="resumen"
                  initial={shouldAnimate ? { opacity: 0, x: 40 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  exit={shouldAnimate ? { opacity: 0, x: -40 } : undefined}
                  transition={{ duration: shouldAnimate ? 0.25 : 0, ease: [0.4, 0, 0.2, 1] }}
                >
                  <SummaryByGrupo data={ROLES_POR_GRUPO_SUMMARY_MOCK} />
                </motion.div>
              ) : (
                <motion.div
                  key="detallada"
                  initial={shouldAnimate ? { opacity: 0, x: 40 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  exit={shouldAnimate ? { opacity: 0, x: -40 } : undefined}
                  transition={{ duration: shouldAnimate ? 0.25 : 0, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div
                    className={styles.tableSection}
                    data-roles-grupo-table
                    data-roles-grupo-table-empty={
                      filteredData.length === 0 || undefined
                    }
                  >
                    <CustomTable
                      table={table}
                      enableColumnReordering={false}
                      enableRowExpansion={false}
                      stickyHeader
                      showScrollIndicators={false}
                      scroll={{ y: 500 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <RolesGrupoPagination
            searchQuery={searchQuery}
            selectedGroup={selectedGroup}
            selectedRole={selectedRole}
            selectedStatus={selectedStatus}
            onSearch={setSearchQuery}
            onGroupFilter={setSelectedGroup}
            onRoleFilter={setSelectedRole}
            onStatusFilter={setSelectedStatus}
          />
        </div>
      </div>

      <RevokeModal
        open={modalOpen}
        assignment={modalAssignment}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmRevoke}
      />
    </div>
  );
}
