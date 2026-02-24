"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type {
  CorrespondentI,
  CorrespondentXmlItemI,
} from "@/interfaces/management/correspondents";
import { throwActionError } from "@/lib/error-handle";
import {
  listCorrespondentsService,
  exportXmlCorrespondentService,
} from "@/services/management/correspondents";

function buildDateRange(month: number, year: number): {
  from: string;
  to: string;
} {
  const mm = String(month + 1).padStart(2, "0");
  const lastDay = new Date(year, month + 1, 0).getDate();

  return {
    from: `${year}-${mm}-01`,
    to: `${year}-${mm}-${String(lastDay).padStart(2, "0")}`,
  };
}

/**
 * Action: List all correspondents
 */
export const listCorrespondentsAction = async (
  month: number,
  year: number,
): Promise<ActionResult<CorrespondentI[]>> => {
  try {
    const { from, to } = buildDateRange(month, year);
    const res = await listCorrespondentsService({
      filters: {
        etcxCreationDateFrom: from,
        etcxCreationDateTo: to,
      },
      pagination: {
        page: 1,
        pageSize: 10,
      },
    });

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener corresponsales",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Export XML for correspondents
 * Returns base64-encoded XML; reconstruct Blob on the client.
 */
export const exportXmlCorrespondentAction = async (
  correspondents: CorrespondentI[],
): Promise<ActionResult<string>> => {
  try {
    const items: CorrespondentXmlItemI[] = correspondents.map((c) => ({
      codigoCorresponsal: c.codeSsf,
      codigoInterno: c.internalCode,
      administrador: "1",
      fechaContratacion: c.assignmentDate,
      fechaInicio: c.assignmentDate,
      estado: c.status,
      fechaFinContrato: c.terminationDate ?? "",
      causaTerminacion: c.terminationFlow ?? "",
    }));

    const blob = await exportXmlCorrespondentService(items);
    const buffer = Buffer.from(await blob.arrayBuffer());
    return { data: buffer.toString("base64"), errors: false };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
