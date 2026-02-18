"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type {
  BackofficeApiRequestI,
  BackofficeApiResponse,
} from "@/interfaces/ApiResponse.interface";
import type {
  RecurringExReportRequestI,
  RecurringExReportResponseI,
} from "@/interfaces/reports";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { cookies } from "next/headers";

const API_URL = process.env.BACKOFFICE_BASE_NEW_API_URL;

export const postRecurringExReportService = async ({
  data,
  noToken = true,
}: {
  data: BackofficeApiRequestI<RecurringExReportRequestI>;
  noToken?: boolean;
}): Promise<BackofficeApiResponse<RecurringExReportResponseI>> => {
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

  const res = await customAuthFetch(
    `${API_URL}/reportes/recurrent-ex`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    },
  );

  return res as BackofficeApiResponse<RecurringExReportResponseI>;
};
