"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  RoleI,
  CreateRolePayloadI,
  UpdateRolePayloadI,
} from "@/interfaces/security/roles";
import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import { MOCK_ROLES } from "@/consts/security/roles.consts";

const PAGE_SIZE = 10;

export function useSecurityRoles() {
  const [allRoles, setAllRoles] = useState<RoleI[]>(MOCK_ROLES);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleI | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleI | null>(null);

  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return allRoles;
    const q = searchQuery.toLowerCase();
    return allRoles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [allRoles, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / PAGE_SIZE));
  const rows = filteredRoles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleCreate = useCallback(
    async (data: CreateRolePayloadI): Promise<ActionResult<RoleI>> => {
      const id = Date.now();
      const code = data.name
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
      const newRole: RoleI = {
        id,
        code,
        roleId: `ROL${String(allRoles.length + 1).padStart(3, "0")}`,
        name: data.name,
        description: data.description,
        status: data.status,
        usersCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: "admin",
        updatedAt: null,
        updatedBy: null,
      };
      setAllRoles((prev) => [...prev, newRole]);
      return { data: newRole, errors: false };
    },
    [allRoles.length],
  );

  const handleUpdate = useCallback(
    async (
      id: number,
      data: UpdateRolePayloadI,
    ): Promise<ActionResult<RoleI>> => {
      setAllRoles((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                ...data,
                updatedAt: new Date().toISOString(),
                updatedBy: "admin",
              }
            : r,
        ),
      );
      return { data: null, errors: false };
    },
    [],
  );

  const handleDelete = useCallback(
    async (id: number): Promise<ActionResult<null>> => {
      setAllRoles((prev) => prev.filter((r) => r.id !== id));
      setDeleteTarget(null);
      return { data: null, errors: false };
    },
    [],
  );

  const handleUpdatePermissions = useCallback(
    async (
      _roleId: number,
      _permissions: string[],
    ): Promise<ActionResult<null>> => {
      return { data: null, errors: false };
    },
    [],
  );

  const openEdit = useCallback((role: RoleI) => {
    setSelectedRole(role);
    setEditOpen(true);
  }, []);

  const openDelete = useCallback((role: RoleI) => {
    setDeleteTarget(role);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  return {
    rows,
    currentPage,
    totalPages,
    totalItems: filteredRoles.length,
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
    handlePrevPage,
    handleNextPage,
  };
}
