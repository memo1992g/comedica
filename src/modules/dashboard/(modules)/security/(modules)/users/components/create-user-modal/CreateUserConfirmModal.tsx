"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type {
  EmployeeSearchResultI,
  CreateSecurityUserPayloadI,
} from "@/interfaces/security";
import styles from "./styles/CreateUserModal.module.css";

interface CreateUserConfirmModalProps {
  employee: EmployeeSearchResultI;
  data: CreateSecurityUserPayloadI;
  saving: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CreateUserConfirmModal({
  employee,
  data,
  saving,
  error,
  onCancel,
  onConfirm,
}: Readonly<CreateUserConfirmModalProps>) {
  return (
    <Dialog open onOpenChange={() => !saving && onCancel()}>
      <DialogContent className={styles.confirmModal}>
        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>Confirmación de creación de usuario</h2>
          <p className={styles.modalSubtitle}>Revise los datos antes de confirmar</p>

          <div className={styles.confirmSection}>
            <h3 className={styles.confirmSectionTitle}>Información de Empleado</h3>
            <div className={styles.confirmGrid}>
              <div>
                <span className={styles.confirmLabel}>Nombre</span>
                <span className={styles.confirmValue}>{employee.nombres} {employee.apellidos}</span>
              </div>
              <div>
                <span className={styles.confirmLabel}>Cargo</span>
                <span className={styles.confirmValue}>{employee.cargo}</span>
              </div>
              <div>
                <span className={styles.confirmLabel}>Oficina</span>
                <span className={styles.confirmValue}>{employee.oficina}</span>
              </div>
              <div>
                <span className={styles.confirmLabel}>Documento</span>
                <span className={styles.confirmValue}>{employee.tipoDocumento}: {employee.numeroDocumento}</span>
              </div>
            </div>
          </div>

          <div className={styles.confirmSection}>
            <h3 className={styles.confirmSectionTitle}>Credenciales de Acceso</h3>
            <div className={styles.confirmGrid}>
              <div>
                <span className={styles.confirmLabel}>Username</span>
                <span className={styles.confirmValue}>{data.username}</span>
              </div>
              <div>
                <span className={styles.confirmLabel}>Email</span>
                <span className={styles.confirmValue}>{data.email}</span>
              </div>
              <div>
                <span className={styles.confirmLabel}>Estado</span>
                <span className={styles.confirmValue}>{data.status}</span>
              </div>
              {data.phone && (
                <div>
                  <span className={styles.confirmLabel}>Teléfono</span>
                  <span className={styles.confirmValue}>{data.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.confirmSuccessBox}>
            <CheckCircle size={18} className={styles.confirmSuccessIcon} />
            <div>
              <p className={styles.confirmSuccessTitle}>Se creará un nuevo usuario en el sistema</p>
              <p className={styles.confirmSuccessText}>El usuario podrá acceder con las credenciales especificadas</p>
            </div>
          </div>

          {error && <span className={styles.errorText}>{error}</span>}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={saving}>
            No, cancelar
          </button>
          <button type="button" className={styles.saveBtn} onClick={onConfirm} disabled={saving}>
            {saving ? "Guardando..." : "Sí, guardar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
