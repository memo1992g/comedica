import type { BackofficeApiPaginationParams } from "@/interfaces/ApiResponse.interface";

export type AuditClassificationCode =
  | "USER_MANAGEMENT"
  | "LIMITS"
  | "PARAMS"
  | "NOTIFICATIONS"
  | "LOGIN_HISTORY"
  | "REPORTS"
  | "TRANSACTIONS"
  | "SOFTTOKEN"
  | "OTHER";

export interface AuditChangesFilterI {
  classificationCode: AuditClassificationCode;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export interface AuditChangesRequestI {
  uuid: string;
  channel: "W";
  pageId: number;
  request: AuditChangesFilterI;
  pagination: BackofficeApiPaginationParams;
}

export interface AuditChangeItemI {
  id: number;
  classificationCode: AuditClassificationCode;
  classificationName: string;
  endpointHttpMethod: string;
  endpointPath: string;
  requestIdentifier: string | null;
  requestBodySnapshot: string | null;
  responseStatus: number;
  userIdentifier: string | null;
  createdByHeader: string | null;
  ipAddress: string | null;
  createdAt: string;
  fecha: string;
  gestionadoPor: string;
  usuario: string;
  accion: string;
  detalles: string;
}

export interface AuditChangesPaginationI {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface AuditChangesResponseI {
  result?: {
    code: number;
    message: string;
  };
  metadata?: {
    totalCount?: number;
    filteredCount?: number;
    timestamp?: string;
    transactionId?: string;
  };
  data?: AuditChangeItemI[];
  pagination?: AuditChangesPaginationI;
}

export interface GetAuditChangesParamsI {
  classificationCode: AuditClassificationCode;
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface AuditHistoryRowI {
  id: string;
  fecha: string;
  gestionadoPor: string;
  usuario: string;
  accion: string;
  detalles: string;
  createdAt: string;
}

export interface AuditHistoryResultI {
  data: AuditHistoryRowI[];
  total: number;
  totalPages: number;
  pageNumber: number;
}
