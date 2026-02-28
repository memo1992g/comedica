"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type {
  GetSecurityUsersParamsI,
  CreateSecurityUserPayloadI,
  UpdateSecurityUserPayloadI,
} from "@/interfaces/security";
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

export const listSecurityUsersService = async (
  params: GetSecurityUsersParamsI,
) => {
  return customAuthFetch(`${API_URL}/security/users/list`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
};

export const searchEmployeeService = async (query: string) => {
  return customAuthFetch(
    `${API_URL}/security/employees/search?query=${encodeURIComponent(query)}`,
    { method: "GET", headers: getAuthHeaders() },
  );
};

export const createSecurityUserService = async (
  data: CreateSecurityUserPayloadI,
) => {
  return customAuthFetch(`${API_URL}/security/users/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const updateSecurityUserService = async (
  id: string,
  data: UpdateSecurityUserPayloadI,
) => {
  return customAuthFetch(`${API_URL}/security/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const toggleLockSecurityUserService = async (id: string) => {
  return customAuthFetch(
    `${API_URL}/security/users/toggle-lock/${encodeURIComponent(id)}`,
    { method: "POST", headers: getAuthHeaders() },
  );
};
