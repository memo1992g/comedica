"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type {
  SoftTokenFlowI,
  SaveSoftTokenConfigRequestI,
} from "@/interfaces/management/soft-token";
import { throwActionError } from "@/lib/error-handle";
import { getFlowsService, saveConfigService } from "@/services/parameters/soft-token";

/**
 * Action: Obtener flujos de soft token
 */
export const getFlowsAction = async (): Promise<
  ActionResult<SoftTokenFlowI[]>
> => {
  try {
    const res = await getFlowsService();

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener flujos",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Guardar configuración de soft token
 */
export const saveConfigAction = async (
  request: SaveSoftTokenConfigRequestI,
): Promise<ActionResult<unknown>> => {
  try {
    const res = await saveConfigService(request);

    if (res.result?.code === 0) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al guardar configuración",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
