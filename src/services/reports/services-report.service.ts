"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type {
  BackofficeApiRequestI,
  BackofficeApiResponse,
} from "@/interfaces/ApiResponse.interface";
import type {
  ServicesReportRequestI,
  ServicesReportResponseI,
} from "@/interfaces/reports";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { cookies } from "next/headers";

const API_URL = process.env.BACKOFFICE_BASE_NEW_API_URL;

export const postServicesReportService = async ({
  data,
  noToken = true,
}: {
  data: BackofficeApiRequestI<ServicesReportRequestI>;
  noToken?: boolean;
}): Promise<BackofficeApiResponse<ServicesReportResponseI>> => {
  const clientTokenJSON = cookies().get(APP_COOKIES.AUTH.CLIENT_TOKEN)?.value;
  const accessToken = clientTokenJSON
    ? JSON.parse(clientTokenJSON)?.accessToken
    : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!noToken && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await customAuthFetch(`${API_URL}/reportes/services-report`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });

  return res as BackofficeApiResponse<ServicesReportResponseI>;
};
