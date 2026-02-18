"use server";

import type {
  ActionResult,
  BackofficeApiRequestI,
  BackofficeApiPaginationParams,
} from "@/interfaces/ApiResponse.interface";
import type {
  Transfer365CardReportRequestI,
  Transfer365CardReportResponseI,
} from "@/interfaces/reports";
import { throwActionError } from "@/lib/error-handle";
import { postTransfer365CardReportService } from "@/services/reports/transfer365card-report.service";
import { getActionDefaults } from "@/utilities/action-defaults";
import { generateDynamicUUID } from "@/utilities/uuid-generator";

const REPORTS_PAGE_ID = 300;
const REPORTS_CHANNEL = "E";

export const transfer365CardReportAction = async (
  filters: Transfer365CardReportRequestI,
  pagination?: Partial<BackofficeApiPaginationParams>,
): Promise<ActionResult<Transfer365CardReportResponseI>> => {
  try {
    const { requestId } = getActionDefaults();
    const baseRequest: BackofficeApiRequestI<Transfer365CardReportRequestI> = {
      request: filters,
      uuid: generateDynamicUUID(),
      pageId: REPORTS_PAGE_ID,
      channel: REPORTS_CHANNEL,
      requestId,
      pagination: {
        page: pagination?.page ?? 0,
        size: pagination?.size ?? 10,
        sortBy: pagination?.sortBy ?? "fechaHora",
        sortDirection: pagination?.sortDirection ?? "DESC",
      },
    };

    const res = await postTransfer365CardReportService({
      data: baseRequest,
    });

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener reporte de transferencias 365 tarjeta",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
