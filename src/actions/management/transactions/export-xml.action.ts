"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import { throwActionError } from "@/lib/error-handle";
import type { TransactionPxSsfI } from "@/interfaces/management/transactions";
import {
  exportXmlFromBodyService,
  exportXmlFromDbService,
} from "@/services/management/transactions";

/**
 * Action: Export XML from body (list of transactions)
 */
export const exportXmlFromBodyAction = async (
  transacciones: TransactionPxSsfI[],
): Promise<ActionResult<Blob>> => {
  try {
    const blob = await exportXmlFromBodyService(transacciones);
    return { data: blob, errors: false };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Export XML from DB filtered by date
 */
export const exportXmlFromDbAction = async (
  fechaPresentacion?: string,
): Promise<ActionResult<Blob>> => {
  try {
    const blob = await exportXmlFromDbService(fechaPresentacion);
    return { data: blob, errors: false };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
