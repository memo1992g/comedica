"use server";

import type { ActionResult } from "@/interfaces/ApiResponse.interface";
import type {
  ComplaintI,
  ComplaintFilterI,
  CatalogItemI,
  ReclaimXmlItemI,
} from "@/interfaces/management/claims";
import { throwActionError } from "@/lib/error-handle";
import {
  listComplaintsService,
  listChannelsService,
  listComplaintTypesService,
  listComplaintStatusesService,
  listResolutionsService,
  exportXmlReclaimService,
} from "@/services/management/claims";

/**
 * Action: List complaints with optional filters and pagination
 */
export const listComplaintsAction = async (
  filters?: ComplaintFilterI,
  pagination?: { page: number; size: number },
): Promise<ActionResult<ComplaintI[]>> => {
  try {
    const res = await listComplaintsService({
      filters: filters ?? {},
      pagination: pagination ?? { page: 1, size: 10 },
    });

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener reclamos",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Get channel catalog
 */
export const listChannelsAction = async (): Promise<
  ActionResult<CatalogItemI[]>
> => {
  try {
    const res = await listChannelsService();

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener canales",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Get complaint type catalog
 */
export const listComplaintTypesAction = async (): Promise<
  ActionResult<CatalogItemI[]>
> => {
  try {
    const res = await listComplaintTypesService();

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener tipos de reclamo",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Get complaint status catalog
 */
export const listComplaintStatusesAction = async (): Promise<
  ActionResult<CatalogItemI[]>
> => {
  try {
    const res = await listComplaintStatusesService();

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener estados",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Get resolution catalog
 */
export const listResolutionsAction = async (): Promise<
  ActionResult<CatalogItemI[]>
> => {
  try {
    const res = await listResolutionsService();

    if (res.result?.code === 0 && res.data) {
      return { data: res.data, errors: false };
    }

    return {
      data: null,
      errors: true,
      errorMessage: res.result?.message || "Error al obtener resoluciones",
    };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};

/**
 * Action: Export XML for claims
 * Returns base64-encoded XML; reconstruct Blob on the client.
 */
export const exportXmlReclaimAction = async (
  complaints: ComplaintI[],
): Promise<ActionResult<string>> => {
  try {
    const items: ReclaimXmlItemI[] = complaints.map((c) => ({
      codigoCorresponsal: "",
      administrador: "1",
      tipoTransaccion: c.tipo,
      numeroControl: String(c.idReclamo),
      fecha: c.fechaPresenta,
      tipoDocumento: "1",
      numeroDocumento: c.dui,
      motivo: c.tipo,
      descripcion: c.descripcion,
      estado: c.estadoReclamo,
      resultadoResolucion: c.estadoResolucion,
      fechaResolucion: c.fechaPresenta,
      montoReclamado: c.monto,
    }));

    const blob = await exportXmlReclaimService(items);
    const buffer = Buffer.from(await blob.arrayBuffer());
    return { data: buffer.toString("base64"), errors: false };
  } catch (error: unknown) {
    return throwActionError(error);
  }
};
