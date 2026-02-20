"use server";

import type {
  ActionResult,
  BackofficeApiRequestI,
  BackofficeApiPaginationParams,
} from "@/interfaces/ApiResponse.interface";
import type {
  FinancialCorrespondentsReportRequestI,
  FinancialCorrespondentsReportResponseI,
} from "@/interfaces/reports";
import { throwActionError } from "@/lib/error-handle";
import { postFinancialCorrespondentsReportService } from "@/services/reports/financial-correspondents-report.service";
import { getActionDefaults } from "@/utilities/action-defaults";
import { generateDynamicUUID } from "@/utilities/uuid-generator";

const REPORTS_PAGE_ID = 300;
const REPORTS_CHANNEL = "E";

export const financialCorrespondentsReportAction = async (
  filters: FinancialCorrespondentsReportRequestI,
  pagination?: Partial<BackofficeApiPaginationParams>,
): Promise<ActionResult<FinancialCorrespondentsReportResponseI>> => {
  try {
    const { requestId } = getActionDefaults();
    const baseRequest: BackofficeApiRequestI<FinancialCorrespondentsReportRequestI> =
      {
        request: filters,
        uuid: generateDynamicUUID(),
        pageId: REPORTS_PAGE_ID,
        channel: REPORTS_CHANNEL,
        requestId,
        pagination: {
          page: pagination?.page ?? 0,
          size: pagination?.size ?? 1000,
          sortBy: pagination?.sortBy ?? "fecha",
          sortDirection: pagination?.sortDirection ?? "DESC",
        },
      };

    const res = await postFinancialCorrespondentsReportService({
      data: baseRequest,
    });

    if (res.result?.code === 0 && res.data) {
      return { data: res.data as FinancialCorrespondentsReportResponseI, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage:
        res.result?.message ||
        "Error al obtener reporte de corresponsales financieros",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
