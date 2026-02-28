export interface UserByRoleI {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  roleId: string;
  status: "Activo" | "Inactivo";
  assignmentDate: string;
  lastLogin: string;
}

export interface UserByRoleSummaryI {
  role: string;
  roleId: string;
  total: number;
  active: number;
  inactive: number;
}
