import type { BackofficeApiPaginatedData } from "../ApiResponse.interface";

/** T365 Recurrentes Report */
export interface RecurringReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface RecurringReportItem {
  tipo: string;
  numeroSolicitud: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
  numeroAsociado: string;
  refCargo: string;
  refAbono: string;
  beneficiario: string;
  tipoBeneficiario: string;
  fechaInicio: string;
  frecuencia: string;
  valor: number;
  bancoDestino: string;
  estado: string;
  finalizado: string;
  canal: string | null;
  oficina: string | null;
}

export type RecurringReportResponseI =
  BackofficeApiPaginatedData<RecurringReportItem>;

/** T365 Recurrentes Ejecutadas Report */
export type RecurringExReportRequestI = RecurringReportRequestI;
export type RecurringExReportItem = RecurringReportItem;
export type RecurringExReportResponseI =
  BackofficeApiPaginatedData<RecurringExReportItem>;
