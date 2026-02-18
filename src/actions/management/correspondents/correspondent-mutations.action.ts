"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type {
  CorrespondentI,
  CreateCorrespondentRequestI,
  UpdateCorrespondentRequestI,
  DeleteCorrespondentRequestI,
} from "@/interfaces/management/correspondents";
import { throwActionError } from "@/lib/error-handle";
import {
  createCorrespondentService,
  updateCorrespondentService,
  deleteCorrespondentService,
} from "@/services/management/correspondents";

/**
 * Action: Create a new correspondent
 */
export const createCorrespondentAction = async (
  data: CreateCorrespondentRequestI,
): Promise<ActionResult<CorrespondentI>> => {
  try {
    const res = await createCorrespondentService(data);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al crear corresponsal",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Update an existing correspondent
 */
export const updateCorrespondentAction = async (
  data: UpdateCorrespondentRequestI,
): Promise<ActionResult<CorrespondentI>> => {
  try {
    const res = await updateCorrespondentService(data);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al actualizar corresponsal",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Delete a correspondent
 */
export const deleteCorrespondentAction = async (
  data: DeleteCorrespondentRequestI,
): Promise<ActionResult<null>> => {
  try {
    const res = await deleteCorrespondentService(data);

    if (res.result?.code === 0) {
      return { data: null, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al eliminar corresponsal",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
