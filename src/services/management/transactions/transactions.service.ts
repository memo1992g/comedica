"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type { BackofficeApiResponse } from "@/interfaces/ApiResponse.interface";
import type {
  UploadExcelResponseI,
  SaveTransactionsResponseI,
  TransactionPxSsfI,
} from "@/interfaces/management/transactions";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
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
 * 1. POST /transacciones/cargar — Upload Excel file (FormData)
 */
export const uploadExcelService = async (
  formData: FormData,
): Promise<BackofficeApiResponse<UploadExcelResponseI>> => {
  const headers = getAuthHeaders();

  return customAuthFetch(`${API_URL}/transacciones/cargar`, {
    method: "POST",
    body: formData,
    headers,
  });
};

/**
 * 2. POST /transacciones/guardar — Save transactions to DB
 */
export const saveTransactionsService = async (
  transacciones: TransactionPxSsfI[],
): Promise<BackofficeApiResponse<SaveTransactionsResponseI>> => {
  const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };

  return customAuthFetch(`${API_URL}/transacciones/guardar`, {
    method: "POST",
    body: JSON.stringify(transacciones),
    headers,
  });
};

/**
 * 3. POST /transacciones/exportar-xml — Generate XML from body
 */
export const exportXmlFromBodyService = async (
  transacciones: TransactionPxSsfI[],
): Promise<Blob> => {
  const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };

  const res = await fetch(`${API_URL}/transacciones/exportar-xml`, {
    method: "POST",
    body: JSON.stringify(transacciones),
    headers,
  });

  if (!res.ok) {
    throw new Error(`Error exportando XML: ${res.status}`);
  }

  return res.blob();
};

/**
 * 4. GET /transacciones/exportar-xml?fechaPresentacion= — Generate XML from DB
 */
export const exportXmlFromDbService = async (
  fechaPresentacion?: string,
): Promise<Blob> => {
  const headers = getAuthHeaders();
  const params = fechaPresentacion
    ? `?fechaPresentacion=${encodeURIComponent(fechaPresentacion)}`
    : "";

  const res = await fetch(
    `${API_URL}/transacciones/exportar-xml${params}`,
    { method: "GET", headers },
  );

  if (!res.ok) {
    throw new Error(`Error exportando XML: ${res.status}`);
  }

  return res.blob();
};
