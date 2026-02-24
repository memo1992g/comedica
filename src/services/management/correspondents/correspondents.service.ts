"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type { BackofficeApiResponse } from "@/interfaces/ApiResponse.interface";
import type {
  CorrespondentI,
  CorrespondentListRequestI,
  CorrespondentXmlItemI,
  CreateCorrespondentRequestI,
  UpdateCorrespondentRequestI,
  DeleteCorrespondentRequestI,
} from "@/interfaces/management/correspondents";
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

function buildRequestBody<T>(data: T) {
  return {
    uuid: crypto.randomUUID(),
    requestId: crypto.randomUUID(),
    channel: "WEB",
    pageId: 1,
    data,
  };
}

/**
 * POST /corresponsal-list — List correspondents with filters and pagination
 */
export const listCorrespondentsService = async (
  payload: CorrespondentListRequestI,
): Promise<BackofficeApiResponse<CorrespondentI[]>> => {
  const headers = getAuthHeaders();
  const body = {
    ...payload,
    request: {
      uuid: crypto.randomUUID(),
      pageId: 1,
      channel: "WEB",
      requestId: crypto.randomUUID(),
    },
  };

  return customAuthFetch(`${API_URL}/corresponsal-list`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
};

/**
 * POST /reportes/correspondent/exportar-xml — Export XML for correspondents
 */
export const exportXmlCorrespondentService = async (
  items: CorrespondentXmlItemI[],
): Promise<Blob> => {
  const headers = getAuthHeaders();
  const body = {
    request: { data: items },
    requestId: "0000",
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel: "WEB",
  };

  const res = await fetch(`${API_URL}/reportes/correspondent/exportar-xml`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { ...headers, "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Error exportando XML corresponsal: ${res.status}`);
  return res.blob();
};

/**
 * POST /corresponsal — Create a new correspondent
 */
export const createCorrespondentService = async (
  request: CreateCorrespondentRequestI,
): Promise<BackofficeApiResponse<CorrespondentI>> => {
  const headers = getAuthHeaders();
  return customAuthFetch(`${API_URL}/corresponsal`, {
    method: "POST",
    body: JSON.stringify(buildRequestBody(request)),
    headers,
  });
};

/**
 * PUT /corresponsal — Update an existing correspondent
 */
export const updateCorrespondentService = async (
  request: UpdateCorrespondentRequestI,
): Promise<BackofficeApiResponse<CorrespondentI>> => {
  const headers = getAuthHeaders();
  return customAuthFetch(`${API_URL}/corresponsal`, {
    method: "PUT",
    body: JSON.stringify(buildRequestBody(request)),
    headers,
  });
};

/**
 * DELETE /corresponsal — Delete a correspondent
 */
export const deleteCorrespondentService = async (
  request: DeleteCorrespondentRequestI,
): Promise<BackofficeApiResponse<null>> => {
  const headers = getAuthHeaders();
  return customAuthFetch(`${API_URL}/corresponsal`, {
    method: "DELETE",
    body: JSON.stringify(buildRequestBody(request)),
    headers,
  });
};
