"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import { throwActionError } from "@/lib/error-handle";
import type { TransactionPxSsfI } from "@/interfaces/management/transactions";
import {
  exportXmlFromBodyService,
  exportXmlFromDbService,
} from "@/services/management/transactions";

// Blob cannot cross the Server Action boundary — serialize to base64 instead
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return buffer.toString("base64");
}

/**
 * Action: Export XML from body (list of transactions)
 * Returns base64-encoded XML; reconstruct Blob on the client.
 */
export const exportXmlFromBodyAction = async (
  transacciones: TransactionPxSsfI[],
): Promise<ActionResult<string>> => {
  try {
    const blob = await exportXmlFromBodyService(transacciones);
    return { data: await blobToBase64(blob), errors: false };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Export XML from DB filtered by date
 * Returns base64-encoded XML; reconstruct Blob on the client.
 */
export const exportXmlFromDbAction = async (
  fechaPresentacion?: string,
): Promise<ActionResult<string>> => {
  try {
    const blob = await exportXmlFromDbService(fechaPresentacion);
    return { data: await blobToBase64(blob), errors: false };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
