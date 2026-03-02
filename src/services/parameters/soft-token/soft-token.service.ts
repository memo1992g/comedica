"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type { BackofficeApiResponse } from "@/interfaces/ApiResponse.interface";
import type {
  SoftTokenFlowI,
  SoftTokenConfigI,
  SaveSoftTokenConfigRequestI,
} from "@/interfaces/management/soft-token";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { generateDynamicUUID } from "@/utilities/uuid-generator";
import { cookies, headers } from "next/headers";

const ENV_API_URL =
  process.env.BACKOFFICE_BASE_NEW_API_URL ??
  process.env.NEXT_PUBLIC_API_URL;

const DEFAULT_API_URL = "https://bo-comedica-service-dev.echotechs.net/api";

function resolveApiUrl(): string {
  if (ENV_API_URL) {
    return ENV_API_URL;
  }

  if (DEFAULT_API_URL) {
    return DEFAULT_API_URL;
  }

  const requestHeaders = headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${protocol}://${host}/api`;
  }

  throw new Error(
    "Missing API base URL. Define BACKOFFICE_BASE_NEW_API_URL or NEXT_PUBLIC_API_URL.",
  );
}

function buildApiUrl(path: string): string {
  const apiUrl = resolveApiUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${apiUrl}${normalizedPath}`;
}

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

  return customAuthFetch(buildApiUrl("/sft/get-flows"), {
    method: "POST",
    body: body.toString(),
    headers,
  });
};

/**
 * POST /sft/list-configs — Obtener configuraciones de soft token
 */
export const listConfigsService = async (): Promise<
  BackofficeApiResponse<SoftTokenConfigI[]>
> => {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams({ category: "" });

  return customAuthFetch(buildApiUrl("/sft/list-configs"), {
    method: "POST",
    headers,
    body: body.toString(),
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

  return customAuthFetch(buildApiUrl("/sft/saveConfig"), {
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
