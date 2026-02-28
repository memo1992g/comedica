"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  SecurityUserI,
  UpdateSecurityUserPayloadI,
} from "@/interfaces/security";
import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import EditUserConfirmModal from "./EditUserConfirmModal";
import styles from "./styles/EditUserModal.module.css";

interface EditUserModalProps {
  user: SecurityUserI;
  onClose: () => void;
  onUpdate: (
    id: string,
    data: UpdateSecurityUserPayloadI,
  ) => Promise<ActionResult<SecurityUserI>>;
}

export default function EditUserModal({
  user,
  onClose,
  onUpdate,
}: Readonly<EditUserModalProps>) {
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(user.phone);
  const [status, setStatus] = useState(user.status);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSaveClick = () => {
    if (!email || !username) {
      setError("Complete todos los campos obligatorios");
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    setSaveError("");
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setSaving(true);
    const res = await onUpdate(user.id, {
      email,
      username,
      password: password || undefined,
      phone: phone || undefined,
      status,
    });
    setSaving(false);
    if (res.errors) {
      setSaveError(res.errorMessage || "Error al actualizar usuario");
      return;
    }
    onClose();
  };

  return (
    <>
      <Dialog open onOpenChange={() => !saving && !showConfirmation && onClose()}>
        <DialogContent className={styles.modal}>
          <div className={styles.modalBody}>
            <h2 className={styles.modalTitle}>Editar Usuario</h2>
            <p className={styles.modalSubtitle}>
              Modifica la información del usuario
            </p>

            <div className={styles.formRow}>
              <div>
                <label className={styles.fieldLabel} htmlFor="edit-email">Email *</label>
                <input id="edit-email" type="text" className={styles.fieldInput} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className={styles.fieldLabel} htmlFor="edit-username">Username *</label>
                <input id="edit-username" type="text" className={styles.fieldInput} value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div>
                <label className={styles.fieldLabel} htmlFor="edit-password">Contraseña</label>
                <div className={styles.passwordWrapper}>
                  <input id="edit-password" type={showPwd ? "text" : "password"} className={styles.fieldInput} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowPwd(!showPwd)}>{showPwd ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
              <div>
                <label className={styles.fieldLabel} htmlFor="edit-confirm-password">Confirmar Contraseña</label>
                <div className={styles.passwordWrapper}>
                  <input id="edit-confirm-password" type={showConfirm ? "text" : "password"} className={styles.fieldInput} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>
            </div>

            <div className={styles.formFull}>
              <label className={styles.fieldLabel} htmlFor="edit-phone">Teléfono</label>
              <input id="edit-phone" type="text" className={styles.fieldInput} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className={styles.formFull}>
              <label className={styles.fieldLabel} htmlFor="edit-status">Estado *</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="edit-status" className={styles.selectField}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <span className={styles.errorText}>{error}</span>}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="button" className={styles.saveBtn} onClick={handleSaveClick} disabled={saving}>
              Guardar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {showConfirmation && (
        <EditUserConfirmModal
          username={username}
          email={email}
          phone={phone}
          status={status}
          hasNewPassword={!!password}
          saving={saving}
          error={saveError}
          onCancel={() => { setShowConfirmation(false); setSaveError(""); }}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

