"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  SecurityUserI,
  CreateSecurityUserPayloadI,
  UpdateSecurityUserPayloadI,
} from "@/interfaces/security";
import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import {
  SECURITY_USERS_MOCK,
  EMPLOYEES_MOCK,
} from "@/consts/security/security-users.consts";

const PAGE_SIZE = 10;

export function useSecurityUsers() {
  const [allUsers, setAllUsers] = useState<SecurityUserI[]>(SECURITY_USERS_MOCK);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SecurityUserI | null>(null);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return allUsers;
    const q = searchQuery.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.employeeNumber.toLowerCase().includes(q),
    );
  }, [allUsers, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const rows = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHasSearched(true);
  }, []);

  const handleCreate = useCallback(
    async (data: CreateSecurityUserPayloadI): Promise<ActionResult<SecurityUserI>> => {
      const emp = EMPLOYEES_MOCK.find(
        (e) => e.employeeNumber === data.employeeNumber,
      );
      const newUser: SecurityUserI = {
        id: `u${Date.now()}`,
        employeeNumber: data.employeeNumber,
        fullName: emp ? `${emp.nombres} ${emp.apellidos}` : data.employeeNumber,
        email: data.email,
        username: data.username,
        office: emp?.oficina ?? "—",
        costCenter: emp?.centroCostos ?? "—",
        roles: [],
        groups: [],
        lastLogin: "—",
        status: data.status,
        phone: data.phone ?? "—",
        documentType: emp?.tipoDocumento ?? "—",
        documentNumber: emp?.numeroDocumento ?? "—",
      };
      setAllUsers((prev) => [...prev, newUser]);
      setHasSearched(true);
      return { data: newUser, errors: false };
    },
    [],
  );

  const handleUpdate = useCallback(
    async (
      id: string,
      data: UpdateSecurityUserPayloadI,
    ): Promise<ActionResult<SecurityUserI>> => {
      setAllUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...data } : u)),
      );
      return { data: null, errors: false };
    },
    [],
  );

  const handleToggleLock = useCallback(
    async (user: SecurityUserI): Promise<ActionResult<SecurityUserI>> => {
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: u.status === "activo" ? "bloqueado" : "activo" }
            : u,
        ),
      );
      return { data: null, errors: false };
    },
    [],
  );

  const openEdit = useCallback((user: SecurityUserI) => {
    setSelectedUser(user);
    setEditOpen(true);
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
  };
}
