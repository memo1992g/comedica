"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type { CorrespondentI } from "@/interfaces/management/correspondents";
import { throwActionError } from "@/lib/error-handle";
import { listCorrespondentsService } from "@/services/management/correspondents";

/**
 * Action: List all correspondents
 */
export const listCorrespondentsAction = async (): Promise<
  ActionResult<CorrespondentI[]>
> => {
  try {
    const res = await listCorrespondentsService();

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener corresponsales",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
