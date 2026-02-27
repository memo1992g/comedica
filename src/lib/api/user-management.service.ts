"use server";

import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { cookies } from "next/headers";
import { APP_COOKIES } from "@/consts/cookies/cookies.consts";

export type { UserManagementProfile } from './types/user-management.types';
import type { UserManagementProfile } from './types/user-management.types';

const API_URL = process.env.BACKOFFICE_BASE_NEW_API_URL ?? 'https://bo-comedica-service-dev.echotechs.net/api';

interface BackofficeResult {
  code: number;
  message: string;
}

interface BackofficeEnvelope<T> {
  result?: BackofficeResult;
  data?: T;
}

interface UserManagementUser {
  associatedNumber?: number;
  associatedClientId?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  identification?: string;
  email?: string;
  phoneNumber?: string;
  ebankingStatus?: string;
  username?: string;
}

interface QuestionnaireQuestionItem {
  id: number;
  questionText: string;
}

interface QuestionnaireQuestionsResponse {
  reasonCode: string;
  description: string;
  questionCount: number;
  failureCount: number;
  requiresQuestionnaire: boolean;
  questions: QuestionnaireQuestionItem[];
}

interface QuestionnaireValidationResponse {
  token?: string;
  valid?: boolean;
}

export interface QuestionnaireQuestion {
  id: number;
  text: string;
}

export interface QuestionnaireQuestions {
  reasonCode: string;
  description: string;
  questionCount: number;
  failureCount: number;
  requiresQuestionnaire: boolean;
  questions: QuestionnaireQuestion[];
}

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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}

function buildContext() {
  return {
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel: 'W',
  };
}

function assertSuccess<T>(response: BackofficeEnvelope<T>, fallbackMessage: string): T {
  if (response?.result && response.result.code !== 0) {
    throw new Error(response.result.message || fallbackMessage);
  }

  if (response?.data === undefined || response?.data === null) {
    throw new Error(fallbackMessage);
  }

  return response.data;
}

function normalizeStatus(status?: string): 'Activo' | 'Inactivo' | 'Bloqueado' {
  const value = (status || '').toUpperCase();
  if (value.includes('BLOCK')) {
    return 'Bloqueado';
  }
  if (value.includes('INACTIVE') || value === 'I') {
    return 'Inactivo';
  }
  return 'Activo';
}

function normalizeProfile(raw: UserManagementUser): UserManagementProfile {
  const name = raw.fullName || [raw.firstName, raw.lastName].filter(Boolean).join(' ').trim() || 'Sin nombre';

  return {
    id: String(raw.associatedClientId ?? raw.associatedNumber ?? raw.username ?? ''),
    associatedNumber: String(raw.associatedNumber ?? ''),
    name,
    dui: raw.identification ?? '-',
    phone: raw.phoneNumber ?? '-',
    email: raw.email ?? '-',
    username: raw.username ?? '',
    status: normalizeStatus(raw.ebankingStatus),
  };
}

function normalizeQuestionnaire(data: QuestionnaireQuestionsResponse): QuestionnaireQuestions {
  return {
    reasonCode: data.reasonCode,
    description: data.description,
    questionCount: Number(data.questionCount ?? 0),
    failureCount: Number(data.failureCount ?? 0),
    requiresQuestionnaire: Boolean(data.requiresQuestionnaire),
    questions: Array.isArray(data.questions)
      ? data.questions.map((item) => ({ id: Number(item.id), text: item.questionText }))
      : [],
  };
}

export async function consultUser(associatedNumber: number): Promise<UserManagementProfile> {
  try {
    const headers = getAuthHeaders();
    const response = await customAuthFetch<BackofficeEnvelope<UserManagementUser>>(
      `${API_URL}/user-management/consult-basic`,
      {
        method: "POST",
        body: JSON.stringify({
          ...buildContext(),
          request: { associatedNumber },
        }),
        headers,
      },
    );

    const data = assertSuccess(response, 'No se encontró información del usuario');
    return normalizeProfile(data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getQuestionnaireQuestions(reasonCode: string): Promise<QuestionnaireQuestions> {
  try {
    const headers = getAuthHeaders();
    const response = await customAuthFetch<BackofficeEnvelope<QuestionnaireQuestionsResponse>>(
      `${API_URL}/user-management/questionnaire/questions`,
      {
        method: "POST",
        body: JSON.stringify({
          ...buildContext(),
          request: { reasonCode },
        }),
        headers,
      },
    );

    const data = assertSuccess(response, 'No fue posible obtener las preguntas de seguridad');
    return normalizeQuestionnaire(data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function validateQuestionnaire(params: {
  reasonCode: string;
  clientIdentifier: number;
  answers: Array<{ questionId: number; answer: string }>;
}): Promise<{ token: string; valid: boolean }> {
  try {
    const headers = getAuthHeaders();
    const response = await customAuthFetch<BackofficeEnvelope<QuestionnaireValidationResponse>>(
      `${API_URL}/user-management/questionnaire/validate`,
      {
        method: "POST",
        body: JSON.stringify({
          ...buildContext(),
          request: {
            reasonCode: params.reasonCode,
            clientIdentifier: params.clientIdentifier,
            answers: params.answers,
          },
        }),
        headers,
      },
    );

    const data = assertSuccess(response, 'No fue posible validar el cuestionario');
    return {
      token: data.token ?? '',
      valid: Boolean(data.valid),
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function blockUser(username: string): Promise<void> {
  try {
    const headers = getAuthHeaders();
    await customAuthFetch<BackofficeEnvelope<string>>(
      `${API_URL}/user-management/block`,
      {
        method: "POST",
        body: JSON.stringify({
          ...buildContext(),
          request: { username },
        }),
        headers,
      },
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function unblockUser(username: string): Promise<void> {
  try {
    const headers = getAuthHeaders();
    await customAuthFetch<BackofficeEnvelope<string>>(
      `${API_URL}/user-management/unblock`,
      {
        method: "POST",
        body: JSON.stringify({
          ...buildContext(),
          request: { username },
        }),
        headers,
      },
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function inactivateUser(username: string): Promise<void> {
  try {
    const headers = getAuthHeaders();
    await customAuthFetch<BackofficeEnvelope<string>>(
      `${API_URL}/user-management/inactivate`,
      {
        method: "POST",
        body: JSON.stringify({
          ...buildContext(),
          request: { username },
        }),
        headers,
      },
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
