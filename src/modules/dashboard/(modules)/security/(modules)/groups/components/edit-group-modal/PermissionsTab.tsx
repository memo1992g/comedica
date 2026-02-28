"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GroupRoleI } from "@/interfaces/security";
import styles from "./styles/EditGroupModal.module.css";

interface PermissionsTabProps {
  groupRoles: GroupRoleI[];
  availableRoles: GroupRoleI[];
  onAssignRole: (role: GroupRoleI) => void;
  onRemoveRole: (roleId: string) => void;
  onClose: () => void;
}

export default function PermissionsTab({
  groupRoles,
  availableRoles,
  onAssignRole,
  onRemoveRole,
  onClose,
}: Readonly<PermissionsTabProps>) {
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const assignedIds = new Set(groupRoles.map((r) => r.id));
  const unassigned = availableRoles.filter((r) => !assignedIds.has(r.id));

  const handleAssign = () => {
    const role = unassigned.find((r) => r.id === selectedRoleId);
    if (role) {
      onAssignRole(role);
      setSelectedRoleId("");
    }
  };

  return (
    <>
      <div className={styles.roleAssignRow}>
        <div className={styles.roleSelect}>
          <label className={styles.roleSelectLabel}>Seleccionar Rol</label>
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger className={styles.roleSelectTrigger}>
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
              {unassigned.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          type="button"
          className={styles.assignBtn}
          disabled={!selectedRoleId}
          onClick={handleAssign}
        >
          <Plus size={14} />
          Asignar
        </button>
      </div>

      <h3 className={styles.rolesTitle}>Roles Actuales</h3>

      {groupRoles.length === 0 && (
        <p className={styles.emptyState}>
          No hay roles asignados a este grupo
        </p>
      )}

      {groupRoles.map((role) => (
        <div key={role.id} className={styles.roleItem}>
          <div className={styles.roleInfo}>
            <p className={styles.roleName}>{role.name}</p>
            <p className={styles.roleDesc}>{role.description}</p>
          </div>
          <button
            type="button"
            className={styles.roleRemoveBtn}
            onClick={() => onRemoveRole(role.id)}
            title="Eliminar rol"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

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
    </>
  );
}
