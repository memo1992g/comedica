import type {
  GroupI,
  GroupMemberI,
  GroupRoleI,
  GroupDetailI,
} from "@/interfaces/security";

export const GROUPS_MOCK: GroupI[] = [
  {
    id: "GRP001",
    name: "Cajeros",
    description: "Personal de ventanilla y atención al cliente",
    status: "Activo",
    roles: ["Consulta Transacciones", "Crear Reclamo", "Ver Dashboard"],
    createdAt: "2024-01-15",
    createdBy: "admin",
    updatedAt: "2024-02-10",
    updatedBy: "admin",
  },
  {
    id: "GRP002",
    name: "Auditores",
    description: "Equipo de auditoría interna",
    status: "Activo",
    roles: ["Ver Reportes", "Exportar Datos", "Ver Dashboard"],
    createdAt: "2024-01-20",
    createdBy: "admin",
    updatedAt: "2024-01-20",
    updatedBy: "admin",
  },
  {
    id: "GRP003",
    name: "Seguridad",
    description: "Administración de usuarios y permisos",
    status: "Activo",
    roles: ["Admin Usuarios", "Admin Roles", "Ver Dashboard"],
    createdAt: "2024-01-10",
    createdBy: "admin",
    updatedAt: "2024-01-10",
    updatedBy: "admin",
  },
  {
    id: "GRP004",
    name: "Reportes",
    description: "Generación y consulta de reportes",
    status: "Activo",
    roles: ["Ver Dashboard", "Crear Reportes", "Exportar Datos"],
    createdAt: "2024-02-01",
    createdBy: "admin",
    updatedAt: "2024-02-01",
    updatedBy: "admin",
  },
  {
    id: "GRP005",
    name: "Gerentes",
    description: "Personal gerencial con acceso completo",
    status: "Activo",
    roles: ["Todos los permisos"],
    createdAt: "2024-02-05",
    createdBy: "admin",
    updatedAt: "2024-02-05",
    updatedBy: "admin",
  },
  {
    id: "GRP006",
    name: "Soporte",
    description: "Equipo de soporte técnico",
    status: "Inactivo",
    roles: ["Ver Dashboard", "Consulta Transacciones"],
    createdAt: "2024-01-25",
    createdBy: "admin",
    updatedAt: "2024-01-25",
    updatedBy: "admin",
  },
];

export const AVAILABLE_USERS_MOCK: GroupMemberI[] = [
  {
    id: "usr001",
    username: "mfernandez",
    name: "María Fernández",
    email: "mfernandez@banco.com",
  },
  {
    id: "usr002",
    username: "aalvarez",
    name: "Andrés Álvarez",
    email: "aalvarez@banco.com",
  },
  {
    id: "usr003",
    username: "rmedina",
    name: "Rosa Medina",
    email: "rmedina@banco.com",
  },
  {
    id: "usr004",
    username: "lmartinez",
    name: "Laura Martínez",
    email: "lmartinez@banco.com",
  },
  {
    id: "usr005",
    username: "cgomez",
    name: "Carlos Gómez",
    email: "cgomez@banco.com",
  },
];

export const GROUP_MEMBERS_MOCK: GroupMemberI[] = [
  {
    id: "usr010",
    username: "jperez",
    name: "José Pérez",
    email: "jperez@banco.com",
  },
  {
    id: "usr011",
    username: "mrodriguez",
    name: "Miguel Rodríguez",
    email: "mrodriguez@banco.com",
  },
  {
    id: "usr012",
    username: "lmartinez",
    name: "Laura Martínez",
    email: "lmartinez@banco.com",
  },
  {
    id: "usr013",
    username: "flopez",
    name: "Fernando López",
    email: "flopez@banco.com",
  },
];

export const AVAILABLE_ROLES_MOCK: GroupRoleI[] = [
  {
    id: "rol001",
    name: "Consulta Transacciones",
    description: "Permite consultar transacciones",
  },
  {
    id: "rol002",
    name: "Crear Reclamo",
    description: "Permite crear reclamos",
  },
  {
    id: "rol003",
    name: "Ver Dashboard",
    description: "Acceso al dashboard principal",
  },
  {
    id: "rol004",
    name: "Ver Reportes",
    description: "Permite ver reportes del sistema",
  },
  {
    id: "rol005",
    name: "Exportar Datos",
    description: "Permite exportar datos del sistema",
  },
  {
    id: "rol006",
    name: "Admin Usuarios",
    description: "Administración de usuarios del sistema",
  },
  {
    id: "rol007",
    name: "Admin Roles",
    description: "Administración de roles del sistema",
  },
  {
    id: "rol008",
    name: "Crear Reportes",
    description: "Permite crear nuevos reportes",
  },
];

export function buildGroupDetail(group: GroupI): GroupDetailI {
  return {
    ...group,
    members: GROUP_MEMBERS_MOCK,
    groupRoles: AVAILABLE_ROLES_MOCK.filter((r) =>
      group.roles.includes(r.name),
    ),
    memberCount: GROUP_MEMBERS_MOCK.length,
    roleCount: group.roles.length,
  };
}
