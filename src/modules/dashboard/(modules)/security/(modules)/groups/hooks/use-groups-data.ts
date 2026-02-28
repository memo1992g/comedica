"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  GroupI,
  GroupMemberI,
  GroupRoleI,
  GroupDetailI,
  CreateGroupPayloadI,
  UpdateGroupPayloadI,
} from "@/interfaces/security";
import {
  GROUPS_MOCK,
  GROUP_MEMBERS_MOCK,
  AVAILABLE_USERS_MOCK,
  AVAILABLE_ROLES_MOCK,
  buildGroupDetail,
} from "@/consts/security/security-groups.consts";

const PAGE_SIZE = 10;

export function useGroupsData() {
  const [allGroups, setAllGroups] = useState<GroupI[]>(GROUPS_MOCK);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupDetailI | null>(null);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return allGroups;
    const q = searchQuery.toLowerCase();
    return allGroups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q),
    );
  }, [allGroups, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / PAGE_SIZE));
  const rows = filteredGroups.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleCreate = useCallback(
    (data: CreateGroupPayloadI) => {
      const newGroup: GroupI = {
        id: `GRP${String(allGroups.length + 1).padStart(3, "0")}`,
        name: data.name,
        description: data.description,
        status: data.status,
        roles: [],
        createdAt: new Date().toISOString().split("T")[0],
        createdBy: "admin",
        updatedAt: new Date().toISOString().split("T")[0],
        updatedBy: "admin",
      };
      setAllGroups((prev) => [...prev, newGroup]);
    },
    [allGroups.length],
  );

  const handleUpdate = useCallback(
    (id: string, data: UpdateGroupPayloadI) => {
      setAllGroups((prev) =>
        prev.map((g) =>
          g.id === id
            ? {
                ...g,
                ...data,
                updatedAt: new Date().toISOString().split("T")[0],
                updatedBy: "admin",
              }
            : g,
        ),
      );
    },
    [],
  );

  const openEdit = useCallback(
    (group: GroupI) => {
      setSelectedGroup(buildGroupDetail(group));
      setEditOpen(true);
    },
    [],
  );

  // Members
  const [members, setMembers] = useState<GroupMemberI[]>(GROUP_MEMBERS_MOCK);
  const availableUsers = AVAILABLE_USERS_MOCK;

  const handleAddMember = useCallback((member: GroupMemberI) => {
    setMembers((prev) => [...prev, member]);
  }, []);

  const handleRemoveMember = useCallback((memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }, []);

  // Roles
  const [groupRoles, setGroupRoles] = useState<GroupRoleI[]>([]);
  const availableRoles = AVAILABLE_ROLES_MOCK;

  const handleAssignRole = useCallback((role: GroupRoleI) => {
    setGroupRoles((prev) => {
      if (prev.some((r) => r.id === role.id)) return prev;
      return [...prev, role];
    });
  }, []);

  const handleRemoveRole = useCallback((roleId: string) => {
    setGroupRoles((prev) => prev.filter((r) => r.id !== roleId));
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
    searchQuery,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    selectedGroup,
    handleSearch,
    handleCreate,
    handleUpdate,
    openEdit,
    handlePrevPage,
    handleNextPage,
    members,
    availableUsers,
    handleAddMember,
    handleRemoveMember,
    groupRoles,
    availableRoles,
    handleAssignRole,
    handleRemoveRole,
    setMembers,
    setGroupRoles,
  };
}
