"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { GroupMemberI } from "@/interfaces/security";
import styles from "./styles/EditGroupModal.module.css";

interface ConfirmRemoveMemberModalProps {
  groupName: string;
  groupId: string;
  member: GroupMemberI;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmRemoveMemberModal({
  groupName,
  groupId,
  member,
  onCancel,
  onConfirm,
}: Readonly<ConfirmRemoveMemberModalProps>) {
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className={styles.confirmModal}>
        <div className={styles.confirmHeader}>
          <h2 className={styles.confirmTitle}>
            Confirmar Eliminación de Miembro
          </h2>
          <p className={styles.confirmSubtitle}>
            Revise la acción que está por realizar:
          </p>
        </div>

        <div className={styles.confirmBody}>
          <div className={styles.detailTable}>
            <div className={styles.detailRowAlt}>
              <div className={styles.detailLabel}>Grupo</div>
              <div className={styles.detailValue}>
                {groupName}
                <div className={styles.detailSubtext}>ID: {groupId}</div>
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Nombre</div>
              <div className={styles.detailValue}>{member.name}</div>
            </div>
            <div className={styles.detailRowAlt}>
              <div className={styles.detailLabel}>Usuario</div>
              <div className={styles.detailValue}>{member.username}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Email</div>
              <div className={styles.detailValue}>{member.email}</div>
            </div>
            <div className={styles.warningBox}>
              <p className={styles.warningMain}>
                ⚠ El usuario perderá los permisos de este grupo
              </p>
              <p className={styles.warningSub}>
                Se eliminarán todos los roles asociados a través de este
                grupo
              </p>
            </div>
          </div>
        </div>

        <div className={styles.confirmFooter}>
          <button
            type="button"
            className={styles.confirmCancelBtn}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.confirmActionBtn}
            onClick={onConfirm}
          >
            Sí, eliminar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
