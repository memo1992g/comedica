"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type {
  GroupDetailI,
  GroupMemberI,
  GroupRoleI,
  UpdateGroupPayloadI,
} from "@/interfaces/security";
import GeneralInfoTab from "./GeneralInfoTab";
import MembersTab from "./MembersTab";
import PermissionsTab from "./PermissionsTab";
import styles from "./styles/EditGroupModal.module.css";

interface EditGroupModalProps {
  group: GroupDetailI;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateGroupPayloadI) => void;
  members: GroupMemberI[];
  availableUsers: GroupMemberI[];
  onAddMember: (member: GroupMemberI) => void;
  onRemoveMember: (memberId: string) => void;
  groupRoles: GroupRoleI[];
  availableRoles: GroupRoleI[];
  onAssignRole: (role: GroupRoleI) => void;
  onRemoveRole: (roleId: string) => void;
}

type TabKey = "info" | "members" | "permissions";

export default function EditGroupModal({
  group,
  onClose,
  onUpdate,
  members,
  availableUsers,
  onAddMember,
  onRemoveMember,
  groupRoles,
  availableRoles,
  onAssignRole,
  onRemoveRole,
}: Readonly<EditGroupModalProps>) {
  const [activeTab, setActiveTab] = useState<TabKey>("info");

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: "info", label: "Información General" },
    { key: "members", label: "Miembros", badge: members.length },
    { key: "permissions", label: "Permisos", badge: groupRoles.length },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Gestionar Grupo: {group.name}
          </h2>
          <p className={styles.modalSubtitle}>
            Editar información, miembros y permisos del grupo
          </p>
        </div>

        <div className={styles.tabsList}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={
                activeTab === tab.key
                  ? styles.tabTriggerActive
                  : styles.tabTrigger
              }
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span className={styles.tabBadge}> ({tab.badge})</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === "info" && (
            <GeneralInfoTab
              group={group}
              onUpdate={onUpdate}
              onClose={onClose}
            />
          )}
          {activeTab === "members" && (
            <MembersTab
              groupName={group.name}
              groupId={group.id}
              members={members}
              availableUsers={availableUsers}
              onAddMember={onAddMember}
              onRemoveMember={onRemoveMember}
              onClose={onClose}
            />
          )}
          {activeTab === "permissions" && (
            <PermissionsTab
              groupRoles={groupRoles}
              availableRoles={availableRoles}
              onAssignRole={onAssignRole}
              onRemoveRole={onRemoveRole}
              onClose={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
