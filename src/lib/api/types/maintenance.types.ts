export interface SupportReason {
  id: string;
  code: string;
  description: string;
  hasQuestionnaire: boolean;
  questions: number;
  failures: number;
  status: 'Activo' | 'Inactivo';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SecurityQuestion {
  id: string;
  code: string;
  question: string;
  fields: string;
  status: 'Activo' | 'Inactivo';
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface SecurityImage {
  id: string;
  name: string;
  type: 'mobile' | 'desktop';
  clazz?: 'APP' | 'WEB';
  filename: string;
  uploadedAt: string;
  uploadedBy: string;
  size: string;
  dimensions: string;
  url: string;
  status?: 'Activo' | 'Inactivo';
  description?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'Activo' | 'Inactivo';
  category: string;
  publicUrl?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface MaintenanceAuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  changes: Array<{
    field: string;
    oldValue: string | number;
    newValue: string | number;
  }>;
  timestamp: string;
}
