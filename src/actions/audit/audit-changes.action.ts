"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type {
  AuditChangeItemI,
  AuditHistoryResultI,
  AuditHistoryRowI,
  GetAuditChangesParamsI,
} from "@/interfaces/audit";
import { throwActionError } from "@/lib/error-handle";
import { getAuditChangesService } from "@/services/audit";

function mapAuditItem(item: AuditChangeItemI): AuditHistoryRowI {
  return {
    id: String(item.id),
    fecha: item.fecha,
    gestionadoPor: item.gestionadoPor || item.createdByHeader || "N/A",
    usuario: item.usuario || "N/A",
    accion:
      item.accion ||
      `${item.classificationName || item.classificationCode} - ${item.endpointPath}`,
    detalles: item.detalles || item.requestBodySnapshot || "{}",
    createdAt: item.createdAt,
  };
}

export const getAuditChangesAction = async (
  params: GetAuditChangesParamsI,
): Promise<ActionResult<AuditHistoryResultI>> => {
  try {
    const res = await getAuditChangesService(params);

    if (res.result?.code === 0 && res.data) {
      return {
        data: {
          data: res.data.map(mapAuditItem),
          total:
            res.pagination?.totalElements ??
            res.metadata?.filteredCount ??
            res.data.length,
          totalPages: res.pagination?.totalPages ?? 1,
          pageNumber: (res.pagination?.pageNumber ?? 0) + 1,
        },
        errors: false,
      };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener historial de cambios",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
