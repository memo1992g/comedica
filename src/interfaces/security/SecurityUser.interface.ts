export interface EmployeeSearchResultI {
  employeeNumber: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  oficina: string;
  centroCostos: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface SecurityUserI {
  id: string;
  employeeNumber: string;
  fullName: string;
  email: string;
  username: string;
  office: string;
  costCenter: string;
  roles: string[];
  groups: string[];
  lastLogin: string;
  status: string;
  phone: string;
  documentType: string;
  documentNumber: string;
}

export interface SecurityUserListResultI {
  data: SecurityUserI[];
  total: number;
}

export interface GetSecurityUsersParamsI {
  page: number;
  size: number;
  search?: string;
}

export interface CreateSecurityUserPayloadI {
  employeeNumber: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
  status: string;
}

export interface UpdateSecurityUserPayloadI {
  email: string;
  username: string;
  password?: string;
  phone?: string;
  status: string;
}
