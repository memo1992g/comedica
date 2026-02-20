"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type { PersonI } from "@/interfaces/management/persons";
import { throwActionError } from "@/lib/error-handle";
import {
  listPersonsService,
  exportXmlPersonsService,
} from "@/services/management/persons";

/**
 * Builds YYYY-MM-DD date range for a given 0-based month index.
 */
function buildDateRange(month: number): { fechaDesde: string; fechaHasta: string } {
  const year = new Date().getFullYear();
  const mm = String(month + 1).padStart(2, "0");
  const lastDay = new Date(year, month + 1, 0).getDate();
  return {
    fechaDesde: `${year}-${mm}-01`,
    fechaHasta: `${year}-${mm}-${String(lastDay).padStart(2, "0")}`,
  };
}

/**
 * Action: Fetch persons list for the selected month.
 */
export const listPersonsAction = async (
  month: number,
): Promise<ActionResult<PersonI[]>> => {
  try {
    const { fechaDesde, fechaHasta } = buildDateRange(month);
    const res = await listPersonsService(fechaDesde, fechaHasta);

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener personas",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Fetch persons list for the selected month and export XML.
 * Returns base64-encoded XML; reconstruct Blob on the client.
 */
export const exportXmlPersonsAction = async (
  month: number,
): Promise<ActionResult<string>> => {
  try {
    const { fechaDesde, fechaHasta } = buildDateRange(month);

    const res = await listPersonsService(fechaDesde, fechaHasta);

    if (res.result?.code !== 0 || !res.data) {
      return {
        data: null,
        errors: true,
        errorMessage: res.result?.message || "Error al obtener personas",
      };
    }

    const blob = await exportXmlPersonsService(res.data);
    const buffer = Buffer.from(await blob.arrayBuffer());
    return { data: buffer.toString("base64"), errors: false };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
