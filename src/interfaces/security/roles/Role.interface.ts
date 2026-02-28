export type RoleStatusType = "activo" | "inactivo";

export interface RoleI {
  id: number;
  code: string;
  roleId: string;
  name: string;
  description: string;
  status: RoleStatusType;
  usersCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface PermissionActionI {
  key: string;
  label: string;
}

export interface PermissionModuleI {
  key: string;
  label: string;
  actions: PermissionActionI[];
  children?: PermissionModuleI[];
}

export interface CreateRolePayloadI {
  name: string;
  description: string;
  status: RoleStatusType;
}

export interface UpdateRolePayloadI {
  name: string;
  description: string;
  status: RoleStatusType;
}

export interface GetSecurityRolesParamsI {
  page: number;
  size: number;
  search?: string;
}
