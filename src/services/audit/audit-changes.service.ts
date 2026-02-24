"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type {
  AuditChangesResponseI,
  AuditChangesRequestI,
  GetAuditChangesParamsI,
} from "@/interfaces/audit";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { generateDynamicUUID } from "@/utilities/uuid-generator";
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

function buildRequestBody(
  params: GetAuditChangesParamsI,
): AuditChangesRequestI {
  return {
    uuid: generateDynamicUUID(),
    channel: "W",
    pageId: 1,
    request: {
      classificationCode: params.classificationCode,
      createdAtFrom: params.createdAtFrom,
      createdAtTo: params.createdAtTo,
    },
    pagination: {
      page: params.page ?? 1,
      size: params.size ?? 20,
      sortBy: params.sortBy ?? "createdAt",
      sortDirection: params.sortDirection ?? "DESC",
    },
  };
}

export const getAuditChangesService = async (
  params: GetAuditChangesParamsI,
): Promise<AuditChangesResponseI> => {
  return customAuthFetch(`${API_URL}/audit/changes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(buildRequestBody(params)),
  });
};
