export interface GroupI {
  id: string;
  name: string;
  description: string;
  status: string;
  roles: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface GroupMemberI {
  id: string;
  username: string;
  name: string;
  email: string;
}

export interface GroupRoleI {
  id: string;
  name: string;
  description: string;
}

export interface GroupDetailI extends GroupI {
  members: GroupMemberI[];
  groupRoles: GroupRoleI[];
  memberCount: number;
  roleCount: number;
}

export interface CreateGroupPayloadI {
  name: string;
  description: string;
  status: string;
}

export interface UpdateGroupPayloadI {
  name?: string;
  description?: string;
  status?: string;
}
