"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import type {
  EmployeeSearchResultI,
  CreateSecurityUserPayloadI,
  SecurityUserI,
} from "@/interfaces/security";
import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import { EMPLOYEES_MOCK } from "@/consts/security/security-users.consts";
import CreateUserForm from "./CreateUserForm";
import CreateUserConfirmModal from "./CreateUserConfirmModal";
import styles from "./styles/CreateUserModal.module.css";

interface CreateUserModalProps {
  onClose: () => void;
  onCreate: (
    data: CreateSecurityUserPayloadI,
  ) => Promise<ActionResult<SecurityUserI>>;
}

export default function CreateUserModal({
  onClose,
  onCreate,
}: Readonly<CreateUserModalProps>) {
  const [step, setStep] = useState<1 | 2>(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [employee, setEmployee] = useState<EmployeeSearchResultI | null>(null);
  const [pendingData, setPendingData] =
    useState<CreateSecurityUserPayloadI | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    setSearchError("");
    const found = EMPLOYEES_MOCK.find(
      (e) =>
        e.employeeNumber === searchValue.trim() ||
        e.numeroDocumento === searchValue.trim(),
    );
    if (!found) {
      setSearchError("Empleado no encontrado");
      return;
    }
    setEmployee(found);
    setStep(2);
  };

  const handleRequestSave = (data: CreateSecurityUserPayloadI) => {
    setPendingData(data);
    setSaveError("");
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!pendingData) return;
    setSaving(true);
    const res = await onCreate(pendingData);
    setSaving(false);
    if (res.errors) {
      setSaveError(res.errorMessage || "Error al crear usuario");
      return;
    }
    onClose();
  };

  return (
    <>
      <Dialog open onOpenChange={() => !saving && onClose()}>
        <DialogContent className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Agregar Nuevo Usuario</h2>
            <p className={styles.modalSubtitle}>
              Ingrese el número de empleado o documento (DUI/ID) para continuar
            </p>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.searchRow}>
              <div className={styles.searchField}>
                <label className={styles.fieldLabel} htmlFor='employee-search'>
                  Número de Empleado o Documento *
                </label>
                <input
                  id='employee-search'
                  type='text'
                  className={styles.fieldInput}
                  placeholder='12345 o 12345678-9'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  disabled={step === 2}
                />
                {searchError && (
                  <span className={styles.errorText}>{searchError}</span>
                )}
              </div>
              <button
                type='button'
                className={styles.searchBtn}
                onClick={handleSearch}
                disabled={!searchValue.trim() || step === 2}
              >
                Buscar
              </button>
            </div>

            {step === 2 && employee && (
              <CreateUserForm
                employee={employee}
                onCancel={onClose}
                onRequestSave={handleRequestSave}
              />
            )}
          </div>

          {step === 1 && (
            <div className={styles.modalFooter}>
              <button
                type='button'
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type='button' className={styles.saveBtn} disabled>
                Guardar
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showConfirmation && pendingData && employee && (
        <CreateUserConfirmModal
          employee={employee}
          data={pendingData}
          saving={saving}
          error={saveError}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
