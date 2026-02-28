import type { UserByRoleI, UserByRoleSummaryI } from "@/interfaces/security";

export const MOCK_USERS_BY_ROLE: UserByRoleI[] = [
  { id: "1", username: "vperez", fullName: "Víctor Pérez", email: "vperez@comedica.com", role: "ADMIN_SISTEMA", roleId: "ROL001", status: "Activo", assignmentDate: "2023-10-12", lastLogin: "2026-02-20 08:30" },
  { id: "2", username: "jramirez", fullName: "Juan Ramírez", email: "jramirez@comedica.com", role: "ADMIN_SISTEMA", roleId: "ROL001", status: "Inactivo", assignmentDate: "2023-01-01", lastLogin: "2025-12-01 09:15" },
  { id: "3", username: "mlopez", fullName: "María López", email: "mlopez@comedica.com", role: "CAJERO_PRINCIPAL", roleId: "ROL002", status: "Activo", assignmentDate: "2023-11-05", lastLogin: "2026-02-19 14:22" },
  { id: "4", username: "carlosr", fullName: "Carlos Rodríguez", email: "carlosr@comedica.com", role: "CAJERO_PRINCIPAL", roleId: "ROL002", status: "Activo", assignmentDate: "2024-01-10", lastLogin: "2026-02-18 16:45" },
  { id: "5", username: "lmartinez", fullName: "Laura Martínez", email: "lmartinez@comedica.com", role: "AUDITOR_INTERNO", roleId: "ROL003", status: "Activo", assignmentDate: "2023-09-20", lastLogin: "2026-02-21 10:00" },
  { id: "6", username: "pruiz", fullName: "Pedro Ruiz", email: "pruiz@comedica.com", role: "CONSULTA_REPORTES", roleId: "ROL004", status: "Activo", assignmentDate: "2024-02-01", lastLogin: "2026-02-20 13:10" },
  { id: "7", username: "ana.g", fullName: "Ana García", email: "ana.g@comedica.com", role: "CONSULTA_REPORTES", roleId: "ROL004", status: "Inactivo", assignmentDate: "2023-12-01", lastLogin: "2025-08-20 08:00" },
  { id: "8", username: "rfernandez", fullName: "Roberto Fernández", email: "rfernandez@comedica.com", role: "SOPORTE_TECNICO", roleId: "ROL005", status: "Activo", assignmentDate: "2024-01-20", lastLogin: "2026-02-22 09:40" },
];

export const MOCK_USERS_BY_ROLE_SUMMARY: UserByRoleSummaryI[] = [
  { role: "ADMIN_SISTEMA", roleId: "ROL001", total: 2, active: 1, inactive: 1 },
  { role: "CAJERO_PRINCIPAL", roleId: "ROL002", total: 2, active: 2, inactive: 0 },
  { role: "AUDITOR_INTERNO", roleId: "ROL003", total: 1, active: 1, inactive: 0 },
  { role: "CONSULTA_REPORTES", roleId: "ROL004", total: 2, active: 1, inactive: 1 },
  { role: "SOPORTE_TECNICO", roleId: "ROL005", total: 1, active: 1, inactive: 0 },
];

export const AVAILABLE_ROLES = [
  "ADMIN_SISTEMA",
  "CAJERO_PRINCIPAL",
  "AUDITOR_INTERNO",
  "CONSULTA_REPORTES",
  "SOPORTE_TECNICO",
];

export const AVAILABLE_STATUSES = ["Activo", "Inactivo"];
