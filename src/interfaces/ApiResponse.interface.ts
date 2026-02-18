export interface BackofficeApiPaginationParams {
  page: number;
  size: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

export interface BackofficeApiRequestI<T> {
  request: T;
  uuid: string;
  pageId: number;
  channel: string;
  requestId: string;
  pagination?: BackofficeApiPaginationParams;
}

export interface BackofficeApiResponseResult {
  code: number;
  message: string;
}

export interface BackofficeApiResponseMetadata {
  totalCount: number;
  filteredCount: number;
  timestamp: string;
  transactionId: string;
}

export interface BackofficeApiPaginatedData<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  extras: Record<string, number | null>;
}

export interface BackofficeApiResponse<T> {
  result: BackofficeApiResponseResult;
  correlative: string;
  metadata: BackofficeApiResponseMetadata;
  data: T;
  errors: unknown;
  version: number;
  pagination: unknown;
}

export interface ActionResult<T = unknown> {
  data: T | null | undefined;
  errors?: boolean | string | string[];
  errorMessage?: string;
}
