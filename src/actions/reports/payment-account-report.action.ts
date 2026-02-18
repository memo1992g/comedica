"use server";

import type {
  ActionResult,
  BackofficeApiRequestI,
  BackofficeApiPaginationParams,
} from "@/interfaces/ApiResponse.interface";
import type {
  PaymentAccountReportRequestI,
  PaymentAccountReportResponseI,
} from "@/interfaces/reports";
import { throwActionError } from "@/lib/error-handle";
import { postPaymentAccountReportService } from "@/services/reports/payment-account-report.service";
import { getActionDefaults } from "@/utilities/action-defaults";
import { generateDynamicUUID } from "@/utilities/uuid-generator";

const REPORTS_PAGE_ID = 300;
const REPORTS_CHANNEL = "E";

export const paymentAccountReportAction = async (
  filters: PaymentAccountReportRequestI,
  pagination?: Partial<BackofficeApiPaginationParams>,
): Promise<ActionResult<PaymentAccountReportResponseI>> => {
  try {
    const { requestId } = getActionDefaults();
    const baseRequest: BackofficeApiRequestI<PaymentAccountReportRequestI> = {
      request: filters,
      uuid: generateDynamicUUID(),
      pageId: REPORTS_PAGE_ID,
      channel: REPORTS_CHANNEL,
      requestId,
      pagination: {
        page: pagination?.page ?? 0,
        size: pagination?.size ?? 10,
        sortBy: pagination?.sortBy ?? "transactionDate",
        sortDirection: pagination?.sortDirection ?? "DESC",
      },
    };

    const res = await postPaymentAccountReportService({
      data: baseRequest,
    });

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener reporte de pagos de cuenta",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
