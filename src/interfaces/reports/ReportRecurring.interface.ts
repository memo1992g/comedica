

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

export interface RecurringReportDataI {
  totalTransacciones: number;
  montoTotal: number;
  listado: RecurringReportItem[];
}

export type RecurringReportResponseI = RecurringReportDataI;

/** T365 Recurrentes Ejecutadas Report */
export type RecurringExReportRequestI = RecurringReportRequestI;
export type RecurringExReportItem = RecurringReportItem;
export interface RecurringExReportDataI {
  totalTransacciones: number;
  montoTotal: number;
  listado: RecurringExReportItem[];
}

export type RecurringExReportResponseI = RecurringExReportDataI;
