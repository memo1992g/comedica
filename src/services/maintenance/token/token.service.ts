"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type { BackofficeApiResponse } from "@/interfaces/ApiResponse.interface";
import type { AssociateIdentityWithDevicesDataI } from "@/interfaces/maintenance/token";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { cookies } from "next/headers";

const API_URL =
  process.env.BACKOFFICE_BASE_NEW_API_URL ??
  process.env.NEXT_PUBLIC_API_URL;

function buildApiUrl(path: string): string {
  if (!API_URL) {
    throw new Error(
      "Missing API base URL. Define BACKOFFICE_BASE_NEW_API_URL or NEXT_PUBLIC_API_URL.",
    );
  }

  return `${API_URL}${path}`;
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
 * POST /sft/associateIdentityWithDevices — Buscar identidades y dispositivos de un asociado
 */
export const associateIdentityWithDevicesService = async (
  associateNumber: string,
): Promise<BackofficeApiResponse<AssociateIdentityWithDevicesDataI>> => {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams({ associateNumber });

  return customAuthFetch(buildApiUrl("/sft/associateIdentityWithDevices"), {
    method: "POST",
    headers,
    body: body.toString(),
  });
};
