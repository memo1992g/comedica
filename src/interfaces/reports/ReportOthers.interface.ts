import type { BackofficeApiPaginatedData } from "../ApiResponse.interface";

/** Services Report */
export interface ServicesReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
  colector?: string;
  nombreCliente?: string;
}

export interface ServicesReportItem {
  fechaTransaccion: string;
  cuentaOrigen: string;
  tipoCuenta: string;
  idCliente: string;
  nombreCliente: string;
  montoTransaccion: number;
  colector: string;
  documentoReferencia: string;
}

export type ServicesReportResponseI =
  BackofficeApiPaginatedData<ServicesReportItem>;

/** Events Report */
export interface EventsReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface EventsReportItem {
  fecha: string;
  cuentaOrigen: string;
  nombre: string;
  numeroAsociado: string;
  monto: number;
  codigoEvento: string;
  nombreEvento: string;
  nombreParticipante: string;
}

export type EventsReportResponseI =
  BackofficeApiPaginatedData<EventsReportItem>;

/** Insurance Report */
export interface InsuranceReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
  poliza?: string;
  numeroAsociado?: string;
}

export interface InsuranceReportItem {
  fecha: string;
  poliza: string;
  numeroAsociado: string;
  monto: number;
}

export type InsuranceReportResponseI =
  BackofficeApiPaginatedData<InsuranceReportItem>;

/** MH Report */
export interface MhReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
  cuentaOrigen?: string;
  numeroMandamiento?: string;
  asociado?: string;
  montoMin?: number;
  montoMax?: number;
}

export interface MhReportItem {
  fecha: string;
  cuentaOrigen: string;
  tipoCuenta: string;
  nombre: string;
  asociado: string;
  monto: number;
  numeroMandamiento: string;
  referencia: string;
  canal: string;
}

export type MhReportResponseI =
  BackofficeApiPaginatedData<MhReportItem>;
