"use server";

import type {
  ActionResult,
  BackofficeApiRequestI,
} from "@/interfaces/ApiResponse.interface";
import type {
  RecurringDetailRequestI,
  RecurringDetailItem,
} from "@/interfaces/reports";
import { throwActionError } from "@/lib/error-handle";
import { postRecurringDetailService } from "@/services/reports/recurring-detail.service";
import { getActionDefaults } from "@/utilities/action-defaults";
import { generateDynamicUUID } from "@/utilities/uuid-generator";

const REPORTS_PAGE_ID = 300;
const REPORTS_CHANNEL = "E";

export const recurringDetailAction = async (
  filters: RecurringDetailRequestI,
): Promise<ActionResult<RecurringDetailItem[]>> => {
  try {
    const { requestId } = getActionDefaults();
    const baseRequest: BackofficeApiRequestI<RecurringDetailRequestI> = {
      request: filters,
      uuid: generateDynamicUUID(),
      pageId: REPORTS_PAGE_ID,
      channel: REPORTS_CHANNEL,
      requestId,
    };

    const res = await postRecurringDetailService({
      data: baseRequest,
    });

    if (res.result?.code === 0 && res.data) {
      const items = Array.isArray(res.data) ? res.data : [];
      return { data: items, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener detalle de recurrente",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
