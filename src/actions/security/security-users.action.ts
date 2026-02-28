"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type {
  SecurityUserI,
  SecurityUserListResultI,
  EmployeeSearchResultI,
  GetSecurityUsersParamsI,
  CreateSecurityUserPayloadI,
  UpdateSecurityUserPayloadI,
} from "@/interfaces/security";
import { throwActionError } from "@/lib/error-handle";
import {
  listSecurityUsersService,
  searchEmployeeService,
  createSecurityUserService,
  updateSecurityUserService,
  toggleLockSecurityUserService,
} from "@/services/security";

export const listSecurityUsersAction = async (
  params: GetSecurityUsersParamsI,
): Promise<ActionResult<SecurityUserListResultI>> => {
  try {
    const res = await listSecurityUsersService(params);

    if (res.result?.code === 0 && res.data) {
      return {
        data: {
          data: res.data,
          total: res.pagination?.totalElements ?? res.data.length,
        },
        errors: false,
      };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener usuarios",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

export const searchEmployeeAction = async (
  query: string,
): Promise<ActionResult<EmployeeSearchResultI>> => {
  try {
    const res = await searchEmployeeService(query);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Empleado no encontrado",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

export const createSecurityUserAction = async (
  data: CreateSecurityUserPayloadI,
): Promise<ActionResult<SecurityUserI>> => {
  try {
    const res = await createSecurityUserService(data);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al crear usuario",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

export const updateSecurityUserAction = async (
  id: string,
  data: UpdateSecurityUserPayloadI,
): Promise<ActionResult<SecurityUserI>> => {
  try {
    const res = await updateSecurityUserService(id, data);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al actualizar usuario",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

export const toggleLockSecurityUserAction = async (
  id: string,
): Promise<ActionResult<SecurityUserI>> => {
  try {
    const res = await toggleLockSecurityUserService(id);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al cambiar estado",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
