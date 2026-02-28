"use client";

import React from "react";
import { Info } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { GroupMemberI } from "@/interfaces/security";
import styles from "./styles/EditGroupModal.module.css";

interface ConfirmAddMemberModalProps {
  groupName: string;
  member: GroupMemberI;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmAddMemberModal({
  groupName,
  member,
  onCancel,
  onConfirm,
}: Readonly<ConfirmAddMemberModalProps>) {
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className={styles.confirmModal}>
        <div className={styles.confirmHeader}>
          <h2 className={styles.confirmTitle}>Confirmar Agregar Miembro</h2>
          <p className={styles.confirmSubtitle}>
            Se agregará el siguiente usuario al grupo
          </p>
        </div>

        <div className={styles.confirmBody}>
          <table className={styles.confirmTable}>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Grupo</td>
                <td>{groupName}</td>
              </tr>
              <tr>
                <td>Nombre</td>
                <td>{member.name}</td>
              </tr>
              <tr>
                <td>Usuario</td>
                <td>{member.username}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{member.email}</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.confirmNoteInfo}>
            <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>El usuario recibirá los permisos del grupo</span>
          </div>
        </div>

        <div className={styles.confirmFooter}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={onConfirm}
          >
            Sí, agregar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
