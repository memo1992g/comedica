export interface RolesByGroupAssignmentI {
  id: string;
  groupId: string;
  groupName: string;
  groupStatus: "Activo" | "Inactivo";
  roleId: string;
  roleName: string;
  roleDescription: string;
  assignmentStatus: "Activa" | "Inactiva";
  assignmentDate: string;
  assignedBy: string;
}

export interface RoleBadgeI {
  roleId: string;
  roleName: string;
}

export interface RolesByGroupSummaryRowI {
  groupId: string;
  groupName: string;
  groupStatus: "Activo" | "Inactivo";
  roles: RoleBadgeI[];
  totalRoles: number;
}

export interface RolesByGroupStatsI {
  totalAssignments: number;
  activeAssignments: number;
  groupsWithRoles: number;
  inactiveHistory: number;
}
