"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type { BackofficeApiResponse } from "@/interfaces/ApiResponse.interface";
import type {
  SoftTokenFlowI,
  SaveSoftTokenConfigRequestI,
} from "@/interfaces/management/soft-token";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { generateDynamicUUID } from "@/utilities/uuid-generator";
import { cookies } from "next/headers";

const API_URL = process.env.BACKOFFICE_BASE_NEW_API_URL;

function getAuthHeaders(): Record<string, string> {
  const clientTokenJSON = cookies().get(APP_COOKIES.AUTH.CLIENT_TOKEN)?.value;
  const accessToken = clientTokenJSON
    ? JSON.parse(clientTokenJSON)?.accessToken
    : null;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

/**
 * POST /sft/get-flows — Obtener flujos de soft token
 */
export const getFlowsService = async (): Promise<
  BackofficeApiResponse<SoftTokenFlowI[]>
> => {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams({ category: "" });

  return customAuthFetch(`${API_URL}/sft/get-flows`, {
    method: "POST",
    body: body.toString(),
    headers,
  });
};

/**
 * POST /sft/saveConfig — Guardar configuración de soft token
 */
export const saveConfigService = async (
  request: SaveSoftTokenConfigRequestI,
): Promise<BackofficeApiResponse<unknown>> => {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  return customAuthFetch(`${API_URL}/sft/saveConfig`, {
    method: "POST",
    body: JSON.stringify({
      request,
      requestId: "0000",
      uuid: generateDynamicUUID(),
      pageId: 1,
      channel: "WEB",
    }),
    headers,
  });
};
