"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomTable from "@/components/common/CustomTable/CustomTable";
import { useCustomTable } from "@/components/common/CustomTable/hooks/use-custom-table";
import { getCustomTableColumns } from "@/components/common/CustomTable/utils/get-custom-table-columns";
import {
  MOCK_USERS_BY_ROLE,
  MOCK_USERS_BY_ROLE_SUMMARY,
} from "@/consts/security/users-by-role.consts";
import type { UserByRoleI } from "@/interfaces/security";
import UsersRoleHeader from "./components/users-role-header/UsersRoleHeader";
import UsersRoleTabs from "./components/users-role-tabs/UsersRoleTabs";
import type { UsersRoleTab } from "./components/users-role-tabs/UsersRoleTabs";
import UsersRoleKpis from "./components/users-role-kpis/UsersRoleKpis";
import UsersRolePagination from "./components/users-role-pagination/UsersRolePagination";
import RoleStatusModal from "./components/role-status-modal/RoleStatusModal";
import SummaryByRole from "./components/summary-by-role/SummaryByRole";
import { getUsersByRoleColumns } from "./users-by-role-columns";
import styles from "./styles/users-by-role.module.css";
import "./styles/CustomTableOverrides.css";

export default function UsersByRole() {
  const [activeTab, setActiveTab] = useState<UsersRoleTab>("detallada");
  const [prevTab, setPrevTab] = useState<UsersRoleTab>("detallada");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"activate" | "deactivate">(
    "deactivate",
  );
  const [modalUser, setModalUser] = useState<UserByRoleI | null>(null);

  const handleToggleStatus = useCallback((user: UserByRoleI) => {
    setModalUser(user);
    setModalMode(user.status === "Activo" ? "deactivate" : "activate");
    setModalOpen(true);
  }, []);

  const handleConfirmToggle = useCallback(() => {
    setModalOpen(false);
    setModalUser(null);
  }, []);

  const filteredData = useMemo(() => {
    let result = [...MOCK_USERS_BY_ROLE];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.fullName.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q),
      );
    }
    if (selectedRole !== "all") {
      result = result.filter((u) => u.role === selectedRole);
    }
    if (selectedStatus !== "all") {
      result = result.filter((u) => u.status === selectedStatus);
    }
    return result;
  }, [searchQuery, selectedRole, selectedStatus]);

  const columnDefs = useMemo(
    () => getUsersByRoleColumns({ onToggleStatus: handleToggleStatus }),
    [handleToggleStatus],
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

  const handleTabChange = (tab: UsersRoleTab) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const shouldAnimate = prevTab !== activeTab;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <UsersRoleHeader />
          <UsersRoleTabs activeTab={activeTab} onTabChange={handleTabChange} />

          <div className={styles.tableContainer}>
            <UsersRoleKpis data={MOCK_USERS_BY_ROLE} />
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "resumen" ? (
                <motion.div
                  key="resumen"
                  initial={shouldAnimate ? { opacity: 0, x: 40 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  exit={shouldAnimate ? { opacity: 0, x: -40 } : undefined}
                  transition={{ duration: shouldAnimate ? 0.25 : 0, ease: [0.4, 0, 0.2, 1] }}
                >
                  <SummaryByRole data={MOCK_USERS_BY_ROLE_SUMMARY} />
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
                    data-users-role-table
                    data-users-role-table-empty={
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

          <UsersRolePagination
            searchQuery={searchQuery}
            selectedRole={selectedRole}
            selectedStatus={selectedStatus}
            onSearch={setSearchQuery}
            onRoleFilter={setSelectedRole}
            onStatusFilter={setSelectedStatus}
          />
        </div>
      </div>

      <RoleStatusModal
        open={modalOpen}
        mode={modalMode}
        user={modalUser}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmToggle}
      />
    </div>
  );
}
