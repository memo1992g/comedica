"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type {
  ComplaintI,
  CreateComplaintRequestI,
  UpdateComplaintRequestI,
} from "@/interfaces/management/claims";
import { throwActionError } from "@/lib/error-handle";
import {
  createComplaintService,
  updateComplaintService,
} from "@/services/management/claims";

/**
 * Action: Create a new complaint
 */
export const createComplaintAction = async (
  data: CreateComplaintRequestI,
): Promise<ActionResult<ComplaintI>> => {
  try {
    const res = await createComplaintService(data);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al crear el reclamo",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Update complaint status/resolution
 */
export const updateComplaintAction = async (
  id: number,
  data: UpdateComplaintRequestI,
): Promise<ActionResult<ComplaintI>> => {
  try {
    const res = await updateComplaintService(id, data);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al actualizar el reclamo",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
