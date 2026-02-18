"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type { BackofficeApiResponse } from "@/interfaces/ApiResponse.interface";
import type {
  CorrespondentI,
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
 * GET /corresponsal-list — List all correspondents
 */
export const listCorrespondentsService = async (): Promise<
  BackofficeApiResponse<CorrespondentI[]>
> => {
  const headers = getAuthHeaders();
  return customAuthFetch(`${API_URL}/corresponsal-list`, {
    method: "GET",
    headers,
  });
};

/**
 * POST /create — Create a new correspondent
 */
export const createCorrespondentService = async (
  data: CreateCorrespondentRequestI,
): Promise<BackofficeApiResponse<CorrespondentI>> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/create`, {
    method: "POST",
    body: JSON.stringify(buildRequestBody(data)),
    headers,
  });
};

/**
 * PUT /update — Update an existing correspondent
 */
export const updateCorrespondentService = async (
  data: UpdateCorrespondentRequestI,
): Promise<BackofficeApiResponse<CorrespondentI>> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/update`, {
    method: "PUT",
    body: JSON.stringify(buildRequestBody(data)),
    headers,
  });
};

/**
 * DELETE /delete — Delete a correspondent
 */
export const deleteCorrespondentService = async (
  data: DeleteCorrespondentRequestI,
): Promise<BackofficeApiResponse<null>> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/delete`, {
    method: "DELETE",
    body: JSON.stringify(buildRequestBody(data)),
    headers,
  });
};
