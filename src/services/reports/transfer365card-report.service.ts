"use server";

import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import type {
  BackofficeApiRequestI,
  BackofficeApiResponse,
} from "@/interfaces/ApiResponse.interface";
import type {
  Transfer365CardReportRequestI,
  Transfer365CardReportResponseI,
} from "@/interfaces/reports";
import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { cookies } from "next/headers";

const API_URL = process.env.BACKOFFICE_BASE_NEW_API_URL;

export const postTransfer365CardReportService = async ({
  data,
  noToken = true,
}: {
  data: BackofficeApiRequestI<Transfer365CardReportRequestI>;
  noToken?: boolean;
}): Promise<BackofficeApiResponse<Transfer365CardReportResponseI>> => {
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
    `${API_URL}/reportes/transfer365card-report`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    },
  );

  return res as BackofficeApiResponse<Transfer365CardReportResponseI>;
};
