import type {
  RolesByGroupAssignmentI,
  RolesByGroupSummaryRowI,
  RolesByGroupStatsI,
} from "@/interfaces/security";

export const ROLES_POR_GRUPO_MOCK: RolesByGroupAssignmentI[] = [
  { id: "1", groupId: "GRP001", groupName: "Cajeros", groupStatus: "Activo", roleId: "ROL002", roleName: "CAJERO_PRINCIPAL", roleDescription: "Gestión de caja y transacciones", assignmentStatus: "Activa", assignmentDate: "2024-01-15", assignedBy: "admin" },
  { id: "2", groupId: "GRP001", groupName: "Cajeros", groupStatus: "Activo", roleId: "ROL004", roleName: "CONSULTA_REPORTES", roleDescription: "Consulta de reportes financieros", assignmentStatus: "Activa", assignmentDate: "2024-02-10", assignedBy: "admin" },
  { id: "3", groupId: "GRP002", groupName: "Administradores", groupStatus: "Activo", roleId: "ROL001", roleName: "ADMIN_SISTEMA", roleDescription: "Administración total del sistema", assignmentStatus: "Activa", assignmentDate: "2023-10-12", assignedBy: "superadmin" },
  { id: "4", groupId: "GRP002", groupName: "Administradores", groupStatus: "Activo", roleId: "ROL003", roleName: "AUDITOR_INTERNO", roleDescription: "Auditoría y revisión de operaciones", assignmentStatus: "Activa", assignmentDate: "2023-11-05", assignedBy: "superadmin" },
  { id: "5", groupId: "GRP003", groupName: "Auditores", groupStatus: "Activo", roleId: "ROL003", roleName: "AUDITOR_INTERNO", roleDescription: "Auditoría y revisión de operaciones", assignmentStatus: "Activa", assignmentDate: "2024-01-20", assignedBy: "admin" },
  { id: "6", groupId: "GRP003", groupName: "Auditores", groupStatus: "Activo", roleId: "ROL004", roleName: "CONSULTA_REPORTES", roleDescription: "Consulta de reportes financieros", assignmentStatus: "Inactiva", assignmentDate: "2023-09-01", assignedBy: "admin" },
  { id: "7", groupId: "GRP004", groupName: "Soporte Técnico", groupStatus: "Activo", roleId: "ROL005", roleName: "SOPORTE_TECNICO", roleDescription: "Soporte y mantenimiento técnico", assignmentStatus: "Activa", assignmentDate: "2024-03-01", assignedBy: "admin" },
  { id: "8", groupId: "GRP004", groupName: "Soporte Técnico", groupStatus: "Activo", roleId: "ROL004", roleName: "CONSULTA_REPORTES", roleDescription: "Consulta de reportes financieros", assignmentStatus: "Activa", assignmentDate: "2024-03-01", assignedBy: "admin" },
  { id: "9", groupId: "GRP005", groupName: "Contabilidad", groupStatus: "Inactivo", roleId: "ROL004", roleName: "CONSULTA_REPORTES", roleDescription: "Consulta de reportes financieros", assignmentStatus: "Inactiva", assignmentDate: "2023-06-15", assignedBy: "superadmin" },
  { id: "10", groupId: "GRP005", groupName: "Contabilidad", groupStatus: "Inactivo", roleId: "ROL002", roleName: "CAJERO_PRINCIPAL", roleDescription: "Gestión de caja y transacciones", assignmentStatus: "Inactiva", assignmentDate: "2023-07-20", assignedBy: "superadmin" },
];

export const ROLES_POR_GRUPO_SUMMARY_MOCK: RolesByGroupSummaryRowI[] = [
  { groupId: "GRP001", groupName: "Cajeros", groupStatus: "Activo", roles: [{ roleId: "ROL002", roleName: "CAJERO_PRINCIPAL" }, { roleId: "ROL004", roleName: "CONSULTA_REPORTES" }], totalRoles: 2 },
  { groupId: "GRP002", groupName: "Administradores", groupStatus: "Activo", roles: [{ roleId: "ROL001", roleName: "ADMIN_SISTEMA" }, { roleId: "ROL003", roleName: "AUDITOR_INTERNO" }], totalRoles: 2 },
  { groupId: "GRP003", groupName: "Auditores", groupStatus: "Activo", roles: [{ roleId: "ROL003", roleName: "AUDITOR_INTERNO" }, { roleId: "ROL004", roleName: "CONSULTA_REPORTES" }], totalRoles: 2 },
  { groupId: "GRP004", groupName: "Soporte Técnico", groupStatus: "Activo", roles: [{ roleId: "ROL005", roleName: "SOPORTE_TECNICO" }, { roleId: "ROL004", roleName: "CONSULTA_REPORTES" }], totalRoles: 2 },
  { groupId: "GRP005", groupName: "Contabilidad", groupStatus: "Inactivo", roles: [{ roleId: "ROL004", roleName: "CONSULTA_REPORTES" }, { roleId: "ROL002", roleName: "CAJERO_PRINCIPAL" }], totalRoles: 2 },
];

export const ROLES_POR_GRUPO_STATS_MOCK: RolesByGroupStatsI = {
  totalAssignments: 10,
  activeAssignments: 7,
  groupsWithRoles: 5,
  inactiveHistory: 3,
};

export const AVAILABLE_GROUPS = [
  "Cajeros",
  "Administradores",
  "Auditores",
  "Soporte Técnico",
  "Contabilidad",
];

export const AVAILABLE_ROLES_GRUPO = [
  "ADMIN_SISTEMA",
  "CAJERO_PRINCIPAL",
  "AUDITOR_INTERNO",
  "CONSULTA_REPORTES",
  "SOPORTE_TECNICO",
];

export const AVAILABLE_ASSIGNMENT_STATUSES = ["Activa", "Inactiva"];
