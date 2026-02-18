// Types para autenticación
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  associateNumber?: string;
  dui?: string;
  phone?: string;
  createdAt: string;
  lastPasswordChange?: string;
  requiresPasswordChange: boolean;
  status: UserStatus;
}

export enum UserRole {
  ADMIN = 'admin',
  PARAMETER_ADMIN = 'parameter_admin',
  USER_ADMIN = 'user_admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  PENDING_ACTIVATION = 'pending_activation',
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface PasswordChangeRequest {
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

// Types para sesión y auth
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  requiresPasswordChange?: boolean;
}

// Types para parámetros del sistema
export interface SystemParameter {
  id: string;
  key: string;
  value: string | number | boolean;
  description: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUpperCase: boolean;
  requireLowerCase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
  expirationDays: number;
}

// Types para límites y montos
export interface TransactionLimits {
  id: string;
  category: string; // 'canales_electronicos' | 'punto_xpress'
  subcategory?: string; // 'cuentas_ahorro' | 'cuentas_corriente' | etc
  maxPerTransaction: number;
  maxDaily: number;
  maxMonthly: number;
  maxMonthlyTransactions?: number;
  updatedAt: string;
  updatedBy: string;
}

export interface UserLimits {
  id: string;
  userId: string;
  userName: string;
  userCode: string;
  limitType: 'general' | 'personalizado';
  limits: {
    canalesElectronicos?: {
      maxPerTransaction: number;
      maxDaily: number;
      maxMonthly: number;
    };
    puntoXpress?: {
      cuentasAhorro?: {
        maxPerTransaction: number;
        maxMonthlyTransactions: number;
      };
      cuentasCorriente?: {
        maxPerTransaction: number;
        maxMonthlyTransactions: number;
      };
    };
    transfer365?: {
      maxAmount: number;
    };
  };
  lastUpdate?: string;
}

// Types para auditoría
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  affectedUser?: string;
  action: string;
  module: string;
  details: string;
  changes?: {
    field: string;
    oldValue: string | number;
    newValue: string | number;
  }[];
  timestamp: string;
  ipAddress?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// UI Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  children?: MenuItem[];
  roles?: UserRole[];
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
