"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type { BackofficeApiResponse } from "@/interfaces/ApiResponse.interface";
import type {
  CorrespondentI,
  CorrespondentXmlItemI,
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
