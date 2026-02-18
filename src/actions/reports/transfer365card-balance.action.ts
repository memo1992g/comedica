"use server";

import type {
  ActionResult,
  BackofficeApiRequestI,
} from "@/interfaces/ApiResponse.interface";
import type {
  Transfer365CardBalanceRequestI,
  Transfer365CardBalanceData,
} from "@/interfaces/reports";
import { throwActionError } from "@/lib/error-handle";
import { postTransfer365CardBalanceService } from "@/services/reports/transfer365card-balance.service";
import { getActionDefaults } from "@/utilities/action-defaults";
import { generateDynamicUUID } from "@/utilities/uuid-generator";

const REPORTS_PAGE_ID = 300;
const REPORTS_CHANNEL = "E";

export const transfer365CardBalanceAction = async (
  filters: Transfer365CardBalanceRequestI,
): Promise<ActionResult<Transfer365CardBalanceData>> => {
  try {
    const { requestId } = getActionDefaults();
    const baseRequest: BackofficeApiRequestI<Transfer365CardBalanceRequestI> = {
      request: filters,
      uuid: generateDynamicUUID(),
      pageId: REPORTS_PAGE_ID,
      channel: REPORTS_CHANNEL,
      requestId,
    };

    const res = await postTransfer365CardBalanceService({
      data: baseRequest,
    });

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener cuadre Transfer365 CA-RD",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
