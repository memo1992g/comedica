"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AVAILABLE_GROUPS,
  AVAILABLE_ROLES_GRUPO,
  AVAILABLE_ASSIGNMENT_STATUSES,
} from "@/consts/security/roles-por-grupo.consts";
import styles from "./styles/roles-grupo-pagination.module.css";

interface RolesGrupoPaginationProps {
  searchQuery: string;
  selectedGroup: string;
  selectedRole: string;
  selectedStatus: string;
  onSearch: (query: string) => void;
  onGroupFilter: (group: string) => void;
  onRoleFilter: (role: string) => void;
  onStatusFilter: (status: string) => void;
}

export default function RolesGrupoPagination({
  searchQuery,
  selectedGroup,
  selectedRole,
  selectedStatus,
  onSearch,
  onGroupFilter,
  onRoleFilter,
  onStatusFilter,
}: Readonly<RolesGrupoPaginationProps>) {
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar grupo o rol..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button className={styles.filterButton} type="button">
            <Filter size={16} />
            <span>Filtros</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className={styles.filterPopover} align="start">
          <div className={styles.filterContent}>
            <div>
              <p className={styles.filterLabel}>Grupo</p>
              <Select value={selectedGroup} onValueChange={onGroupFilter}>
                <SelectTrigger className={styles.filterSelect}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  {AVAILABLE_GROUPS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className={styles.filterLabel}>Rol</p>
              <Select value={selectedRole} onValueChange={onRoleFilter}>
                <SelectTrigger className={styles.filterSelect}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {AVAILABLE_ROLES_GRUPO.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className={styles.filterLabel}>Estado</p>
              <Select value={selectedStatus} onValueChange={onStatusFilter}>
                <SelectTrigger className={styles.filterSelect}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {AVAILABLE_ASSIGNMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
