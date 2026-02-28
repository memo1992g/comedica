"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EmployeeSearchResultI,
  CreateSecurityUserPayloadI,
} from "@/interfaces/security";
import styles from "./styles/CreateUserModal.module.css";

interface CreateUserFormProps {
  employee: EmployeeSearchResultI;
  onCancel: () => void;
  onRequestSave: (data: CreateSecurityUserPayloadI) => void;
}

export default function CreateUserForm({
  employee,
  onCancel,
  onRequestSave,
}: Readonly<CreateUserFormProps>) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Activo");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSaveClick = () => {
    if (!email || !username || !password || !confirmPassword) {
      setError("Complete todos los campos obligatorios");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseÃ±as no coinciden");
      return;
    }
    setError("");
    onRequestSave({
      employeeNumber: employee.employeeNumber,
      email,
      username,
      password,
      phone: phone || undefined,
      status,
    });
  };

  return (
    <>
      <h3 className={styles.sectionTitle}>Datos del Empleado</h3>
      <div className={styles.formRow}>
        <ReadonlyField label="Nombres" value={employee.nombres} />
        <ReadonlyField label="Apellidos" value={employee.apellidos} />
      </div>
      <div className={styles.formFull}>
        <ReadonlyField label="Cargo" value={employee.cargo} />
      </div>
      <div className={styles.formRow}>
        <ReadonlyField label="Oficina" value={employee.oficina} />
        <ReadonlyField label="Centro de Costos" value={employee.centroCostos} />
      </div>
      <div className={styles.formRow}>
        <ReadonlyField label="Tipo de Documento" value={employee.tipoDocumento} />
        <ReadonlyField label="Número de Documento" value={employee.numeroDocumento} />
      </div>

      <h3 className={styles.sectionTitle}>Datos de Usuario</h3>
      <div className={styles.formRow}>
        <Field label="Correo *" value={email} onChange={setEmail} />
        <Field label="Usuario *" value={username} onChange={setUsername} />
      </div>
      <div className={styles.formRow}>
        <PasswordField label="Contraseña *" value={password} onChange={setPassword} show={showPwd} onToggle={() => setShowPwd(!showPwd)} />
        <PasswordField label="Confirmar Contraseña *" value={confirmPassword} onChange={setConfirmPassword} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
      </div>
      <div className={styles.formFull}>
        <Field label="Teléfono" value={phone} onChange={setPhone} />
      </div>
      <div className={styles.formFull}>
        <label className={styles.fieldLabel} htmlFor="create-status">Estado *</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="create-status" className={styles.selectField}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <span className={styles.errorText}>{error}</span>}

      <div className={styles.modalFooter}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
        <button type="button" className={styles.saveBtn} onClick={handleSaveClick}>
          Guardar
        </button>
      </div>
    </>
  );
}

interface ReadonlyFieldProps {
  readonly label: string;
  readonly value: string;
}

function ReadonlyField({ label, value }: ReadonlyFieldProps) {
  const id = `readonly-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
      <input id={id} type="text" className={styles.fieldInputReadonly} value={value} readOnly tabIndex={-1} />
    </div>
  );
}

interface FieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
}

function Field({ label, value, onChange }: FieldProps) {
  const id = `field-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
      <input id={id} type="text" className={styles.fieldInput} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

interface PasswordFieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly show: boolean;
  readonly onToggle: () => void;
}

function PasswordField({ label, value, onChange, show, onToggle }: PasswordFieldProps) {
  const id = `pwd-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
      <div className={styles.passwordWrapper}>
        <input id={id} type={show ? "text" : "password"} className={styles.fieldInput} value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" className={styles.passwordToggle} onClick={onToggle}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
      </div>
    </div>
  );
}

