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

/**
 * Action: List all correspondents
 */
export const listCorrespondentsAction = async (): Promise<
  ActionResult<CorrespondentI[]>
> => {
  try {
    const res = await listCorrespondentsService();

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
