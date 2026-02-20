"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type { BackofficeApiResponse } from "@/interfaces/ApiResponse.interface";
import type { PersonI } from "@/interfaces/management/persons";
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

/**
 * POST /persons-list — Fetch persons filtered by date range
 */
export const listPersonsService = async (
  fechaDesde: string | null,
  fechaHasta: string | null,
): Promise<BackofficeApiResponse<PersonI[]>> => {
  const headers = getAuthHeaders();
  const body = {
    request: { fechaDesde, fechaHasta },
    requestId: "0000",
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel: "WEB",
  };

  return customAuthFetch(`${API_URL}/persons-list`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
};

/**
 * POST /reportes/persons/exportar-xml — Export persons XML
 */
export const exportXmlPersonsService = async (
  persons: PersonI[],
): Promise<Blob> => {
  const headers = getAuthHeaders();
  const body = {
    request: { data: persons },
    requestId: "0000",
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel: "WEB",
  };

  const res = await fetch(`${API_URL}/reportes/persons/exportar-xml`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });

  if (!res.ok) throw new Error(`Error exportando XML personas: ${res.status}`);
  return res.blob();
};
