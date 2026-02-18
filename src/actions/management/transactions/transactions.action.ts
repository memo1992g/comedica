"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type {
  UploadExcelResponseI,
  SaveTransactionsResponseI,
  TransactionPxSsfI,
} from "@/interfaces/management/transactions";
import { throwActionError } from "@/lib/error-handle";
import {
  uploadExcelService,
  saveTransactionsService,
} from "@/services/management/transactions";

/**
 * Action: Upload Excel file with transactions
 */
export const uploadExcelAction = async (
  formData: FormData,
): Promise<ActionResult<UploadExcelResponseI>> => {
  try {
    const res = await uploadExcelService(formData);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al cargar el archivo",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Save transactions to database
 */
export const saveTransactionsAction = async (
  transacciones: TransactionPxSsfI[],
): Promise<ActionResult<SaveTransactionsResponseI>> => {
  try {
    const res = await saveTransactionsService(transacciones);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage:
        res.result?.message || "Error al guardar las transacciones",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
