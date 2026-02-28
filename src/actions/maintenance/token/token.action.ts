"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type { AssociateIdentityWithDevicesDataI } from "@/interfaces/maintenance/token";
import { throwActionError } from "@/lib/error-handle";
import { associateIdentityWithDevicesService } from "@/services/maintenance/token";

export const associateIdentityWithDevicesAction = async (
  associateNumber: string,
): Promise<ActionResult<AssociateIdentityWithDevicesDataI>> => {
  try {
    const res = await associateIdentityWithDevicesService(associateNumber);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "No fue posible consultar el asociado.",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
