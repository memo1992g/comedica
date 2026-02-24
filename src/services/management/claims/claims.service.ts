"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type { BackofficeApiResponse } from "@/interfaces/ApiResponse.interface";
import type {
  ComplaintI,
  ComplaintListRequestI,
  CatalogItemI,
  ReclaimXmlItemI,
  CreateComplaintRequestI,
  UpdateComplaintRequestI,
} from "@/interfaces/management/claims";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { cookies } from "next/headers";

const API_URL = process.env.BACKOFFICE_BASE_NEW_API_URL;

function getAuthHeaders(): Record<string, string> {
  const clientTokenJSON = cookies().get(APP_COOKIES.AUTH.CLIENT_TOKEN)?.value;
  const accessToken = clientTokenJSON
    ? JSON.parse(clientTokenJSON)?.accessToken
    : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

function buildContext() {
  return {
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel: "WEB",
    requestId: crypto.randomUUID(),
  };
}

/**
 * POST /complaints-list — List complaints with filters and pagination
 */
export const listComplaintsService = async (
  request: ComplaintListRequestI,
): Promise<BackofficeApiResponse<ComplaintI[]>> => {
  const headers = getAuthHeaders();
  const body = { ...request, ...buildContext() };

  return customAuthFetch(`${API_URL}/complaints-list`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
};

/**
 * POST /channel-list — Get complaint channel catalog
 */
export const listChannelsService = async (): Promise<
  BackofficeApiResponse<CatalogItemI[]>
> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/channel-list`, {
    method: "POST",
    body: JSON.stringify(buildContext()),
    headers,
  });
};

/**
 * POST /type-list — Get complaint type catalog
 */
export const listComplaintTypesService = async (): Promise<
  BackofficeApiResponse<CatalogItemI[]>
> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/type-list`, {
    method: "POST",
    body: JSON.stringify(buildContext()),
    headers,
  });
};

/**
 * POST /status-list — Get complaint status catalog
 */
export const listComplaintStatusesService = async (): Promise<
  BackofficeApiResponse<CatalogItemI[]>
> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/status-list`, {
    method: "POST",
    body: JSON.stringify(buildContext()),
    headers,
  });
};

/**
 * POST /resolutionService-list — Get complaint resolution catalog
 */
export const listResolutionsService = async (): Promise<
  BackofficeApiResponse<CatalogItemI[]>
> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/resolutionService-list`, {
    method: "POST",
    body: JSON.stringify(buildContext()),
    headers,
  });
};

/**
 * POST /reportes/reclaim/exportar-xml — Export XML for claims
 */
export const exportXmlReclaimService = async (
  items: ReclaimXmlItemI[],
): Promise<Blob> => {
  const headers = getAuthHeaders();
  const body = {
    request: { data: items },
    requestId: "0000",
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel: "WEB",
  };

  const url = `${API_URL}/reportes/reclaim/exportar-xml`;
  console.log(`Exporting XML to ${url} with body:`, body);

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { ...headers, "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Error exportando XML reclamos: ${res.status}`);
  return res.blob();
};

/**
 * POST /complaints — Create a new complaint
 */
export const createComplaintService = async (
  request: CreateComplaintRequestI,
): Promise<BackofficeApiResponse<ComplaintI>> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/complaints`, {
    method: "POST",
    body: JSON.stringify({ ...buildContext(), request }),
    headers,
  });
};

/**
 * PUT /complaints/:id — Update complaint status/resolution
 */
export const updateComplaintService = async (
  id: number,
  request: UpdateComplaintRequestI,
): Promise<BackofficeApiResponse<ComplaintI>> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/complaints/${id}`, {
    method: "PUT",
    body: JSON.stringify({ ...buildContext(), request }),
    headers,
  });
};
