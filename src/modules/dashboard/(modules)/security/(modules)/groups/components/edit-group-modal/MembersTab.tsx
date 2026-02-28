"use client";

import React, { useState, useMemo } from "react";
import { Search, Trash2, UserPlus } from "lucide-react";
import type { GroupMemberI } from "@/interfaces/security";
import ConfirmAddMemberModal from "./ConfirmAddMemberModal";
import ConfirmRemoveMemberModal from "./ConfirmRemoveMemberModal";
import styles from "./styles/EditGroupModal.module.css";

interface MembersTabProps {
  groupName: string;
  groupId: string;
  members: GroupMemberI[];
  availableUsers: GroupMemberI[];
  onAddMember: (member: GroupMemberI) => void;
  onRemoveMember: (memberId: string) => void;
  onClose: () => void;
}

type SubTab = "add" | "current";

export default function MembersTab({
  groupName,
  groupId,
  members,
  availableUsers,
  onAddMember,
  onRemoveMember,
  onClose,
}: Readonly<MembersTabProps>) {
  const [subtab, setSubtab] = useState<SubTab>("add");
  const [search, setSearch] = useState("");
  const [pendingAdd, setPendingAdd] = useState<GroupMemberI | null>(null);
  const [pendingRemove, setPendingRemove] = useState<GroupMemberI | null>(
    null,
  );

  const memberIds = useMemo(
    () => new Set(members.map((m) => m.id)),
    [members],
  );

  const filteredAvailable = useMemo(() => {
    const list = availableUsers.filter((u) => !memberIds.has(u.id));
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [availableUsers, memberIds, search]);

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members;
    const q = search.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q),
    );
  }, [members, search]);

  const getInitials = (username: string) =>
    username.slice(0, 2).toUpperCase();

  const handleConfirmAdd = () => {
    if (pendingAdd) {
      onAddMember(pendingAdd);
      setPendingAdd(null);
    }
  };

  const handleConfirmRemove = () => {
    if (pendingRemove) {
      onRemoveMember(pendingRemove.id);
      setPendingRemove(null);
    }
  };

  return (
    <>
      <div className={styles.searchRow}>
        <div className={styles.searchInputWrapper}>
          <Search size={16} />
          <input
            className={styles.searchInput}
            placeholder="Buscar por número de asociado o DUI"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.subtabs}>
        <button
          type="button"
          className={
            subtab === "add" ? styles.subtabActive : styles.subtab
          }
          onClick={() => setSubtab("add")}
        >
          Agregar Miembro
        </button>
        <button
          type="button"
          className={
            subtab === "current" ? styles.subtabActive : styles.subtab
          }
          onClick={() => setSubtab("current")}
        >
          Miembros Actuales
        </button>
      </div>

      {subtab === "add" && (
        <>
          <p className={styles.availableLabel}>
            Usuarios Disponibles{" "}
            <span className={styles.availableLabelCount}>
              ({filteredAvailable.length} resultados)
            </span>
          </p>
          <div className={styles.memberList}>
            {filteredAvailable.length === 0 && (
              <p className={styles.emptyState}>
                No se encontraron usuarios disponibles
              </p>
            )}
            {filteredAvailable.map((user) => (
              <div key={user.id} className={styles.memberItem}>
                <div className={styles.memberAvatar}>
                  {getInitials(user.username)}
                </div>
                <div className={styles.memberInfo}>
                  <p className={styles.memberName}>{user.username}</p>
                  <p className={styles.memberDetail}>{user.email}</p>
                </div>
                <button
                  type="button"
                  className={styles.addMemberAction}
                  onClick={() => setPendingAdd(user)}
                  title="Agregar miembro"
                >
                  <UserPlus size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {subtab === "current" && (
        <div className={styles.memberList}>
          {filteredMembers.length === 0 && (
            <p className={styles.emptyState}>
              No hay miembros en este grupo
            </p>
          )}
          {filteredMembers.map((member) => (
            <div key={member.id} className={styles.memberItem}>
              <div className={styles.memberAvatar}>
                {getInitials(member.username)}
              </div>
              <div className={styles.memberInfo}>
                <p className={styles.memberName}>{member.username}</p>
                <p className={styles.memberDetail}>{member.email}</p>
              </div>
              <button
                type="button"
                className={styles.memberAction}
                onClick={() => setPendingRemove(member)}
                title="Eliminar miembro"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.modalFooter}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={onClose}
        >
          Guardar Cambios
        </button>
      </div>

      {pendingAdd && (
        <ConfirmAddMemberModal
          groupName={groupName}
          member={pendingAdd}
          onCancel={() => setPendingAdd(null)}
          onConfirm={handleConfirmAdd}
        />
      )}

      {pendingRemove && (
        <ConfirmRemoveMemberModal
          groupName={groupName}
          groupId={groupId}
          member={pendingRemove}
          onCancel={() => setPendingRemove(null)}
          onConfirm={handleConfirmRemove}
        />
      )}
    </>
  );
}
