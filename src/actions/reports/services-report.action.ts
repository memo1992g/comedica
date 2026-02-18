"use server";

import type {
  ActionResult,
  BackofficeApiRequestI,
  BackofficeApiPaginationParams,
} from "@/interfaces/ApiResponse.interface";
import type {
  ServicesReportRequestI,
  ServicesReportResponseI,
} from "@/interfaces/reports";
import { throwActionError } from "@/lib/error-handle";
import { postServicesReportService } from "@/services/reports/services-report.service";
import { getActionDefaults } from "@/utilities/action-defaults";
import { generateDynamicUUID } from "@/utilities/uuid-generator";

const REPORTS_PAGE_ID = 300;
const REPORTS_CHANNEL = "E";

export const servicesReportAction = async (
  filters: ServicesReportRequestI,
  pagination?: Partial<BackofficeApiPaginationParams>,
): Promise<ActionResult<ServicesReportResponseI>> => {
  try {
    const { requestId } = getActionDefaults();
    const baseRequest: BackofficeApiRequestI<ServicesReportRequestI> = {
      request: filters,
      uuid: generateDynamicUUID(),
      pageId: REPORTS_PAGE_ID,
      channel: REPORTS_CHANNEL,
      requestId,
      pagination: {
        page: pagination?.page ?? 0,
        size: pagination?.size ?? 10,
        sortBy: pagination?.sortBy ?? "fechaTransaccion",
        sortDirection: pagination?.sortDirection ?? "DESC",
      },
    };

    const res = await postServicesReportService({
      data: baseRequest,
    });

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener reporte de servicios",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
