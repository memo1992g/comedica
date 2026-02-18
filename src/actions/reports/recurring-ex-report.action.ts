"use server";

import type {
  ActionResult,
  BackofficeApiRequestI,
  BackofficeApiPaginationParams,
} from "@/interfaces/ApiResponse.interface";
import type {
  RecurringExReportRequestI,
  RecurringExReportResponseI,
} from "@/interfaces/reports";
import { throwActionError } from "@/lib/error-handle";
import { postRecurringExReportService } from "@/services/reports/recurring-ex-report.service";
import { getActionDefaults } from "@/utilities/action-defaults";
import { generateDynamicUUID } from "@/utilities/uuid-generator";

const REPORTS_PAGE_ID = 300;
const REPORTS_CHANNEL = "E";

export const recurringExReportAction = async (
  filters: RecurringExReportRequestI,
  pagination?: Partial<BackofficeApiPaginationParams>,
): Promise<ActionResult<RecurringExReportResponseI>> => {
  try {
    const { requestId } = getActionDefaults();
    const baseRequest: BackofficeApiRequestI<RecurringExReportRequestI> = {
      request: filters,
      uuid: generateDynamicUUID(),
      pageId: REPORTS_PAGE_ID,
      channel: REPORTS_CHANNEL,
      requestId,
      pagination: {
        page: pagination?.page ?? 0,
        size: pagination?.size ?? 10,
        sortBy: pagination?.sortBy ?? "fechaCreacion",
        sortDirection: pagination?.sortDirection ?? "DESC",
      },
    };

    const res = await postRecurringExReportService({
      data: baseRequest,
    });

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener reporte de recurrentes ejecutadas",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
