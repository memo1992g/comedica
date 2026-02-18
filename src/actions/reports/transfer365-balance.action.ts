"use server";

import type {
  ActionResult,
  BackofficeApiRequestI,
} from "@/interfaces/ApiResponse.interface";
import type {
  Transfer365BalanceRequestI,
  Transfer365BalanceData,
} from "@/interfaces/reports";
import { throwActionError } from "@/lib/error-handle";
import { postTransfer365BalanceService } from "@/services/reports/transfer365-balance.service";
import { getActionDefaults } from "@/utilities/action-defaults";
import { generateDynamicUUID } from "@/utilities/uuid-generator";

const REPORTS_PAGE_ID = 300;
const REPORTS_CHANNEL = "E";

export const transfer365BalanceAction = async (
  filters: Transfer365BalanceRequestI,
): Promise<ActionResult<Transfer365BalanceData>> => {
  try {
    const { requestId } = getActionDefaults();
    const baseRequest: BackofficeApiRequestI<Transfer365BalanceRequestI> = {
      request: filters,
      uuid: generateDynamicUUID(),
      pageId: REPORTS_PAGE_ID,
      channel: REPORTS_CHANNEL,
      requestId,
    };

    const res = await postTransfer365BalanceService({
      data: baseRequest,
    });

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener cuadre Transfer365",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
