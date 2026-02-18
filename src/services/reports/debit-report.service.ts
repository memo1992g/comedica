"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type {
  BackofficeApiRequestI,
  BackofficeApiResponse,
} from "@/interfaces/ApiResponse.interface";
import type {
  DebitReportRequestI,
  DebitReportResponseI,
} from "@/interfaces/reports";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { cookies } from "next/headers";

const API_URL = process.env.BACKOFFICE_BASE_NEW_API_URL;

export const postDebitReportService = async ({
  data,
  noToken = true,
}: {
  data: BackofficeApiRequestI<DebitReportRequestI>;
  noToken?: boolean;
}): Promise<BackofficeApiResponse<DebitReportResponseI>> => {
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

  const res = await customAuthFetch(`${API_URL}/reportes/debit`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });

  return res as BackofficeApiResponse<DebitReportResponseI>;
};
