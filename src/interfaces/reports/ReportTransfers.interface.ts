import type { BackofficeApiPaginatedData } from "../ApiResponse.interface";

/** Payment Account Report */
export interface PaymentAccountReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
  creditCustomerId?: string;
  debitCustomerId?: string;
  creditAccount?: string;
  debitAccount?: string;
  montoMin?: number;
  montoMax?: number;
}

export interface PaymentAccountReportItem {
  transactionDate: string;
  creditCustomerId: string;
  creditAccount: string;
  creditAccountHolder: string;
  debitCustomerId: string;
  debitAccount: string;
  debitAccountHolder: string;
  amount: number;
  channel: string;
  transactionConcept: string;
  transactionType: string;
}

export type PaymentAccountReportResponseI =
  BackofficeApiPaginatedData<PaymentAccountReportItem>;

/** Transfer 365 Card Report */
export interface Transfer365CardReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
  cuentaOrigen?: string;
  tipoTransferencia?: string;
  codigo?: string;
  bancoOrigen?: string;
  paisDestino?: string;
  montoMin?: number;
  montoMax?: number;
}

export interface Transfer365CardReportItem {
  fechaHora: string;
  tipoTransferencia: string;
  cuentaOrigen: string;
  remitente: string;
  cuentaDestino: string;
  destinatario: string;
  bancoOrigen: string;
  paisOrigen: string;
  bancoDestino: string;
  paisDestino: string;
  montoEntrante: number;
  montoSaliente: number;
  codigo: string;
}

export type Transfer365CardReportResponseI =
  BackofficeApiPaginatedData<Transfer365CardReportItem>;

/** Transfer 365 Report */
export interface Transfer365ReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
  tipoTransferencia?: string;
  codigo?: string;
  cuentaOrigen?: string;
  cuentaDestino?: string;
}

export interface Transfer365ReportItem {
  fechaHora: string;
  cuentaOrigen: string;
  entidadOrigen: string;
  nombreOrigen: string;
  montoSaliente: number;
  montoEntrante: number;
  productoDestino: string;
  cuentaDestino: string;
  entidadDestino: string;
  nombreDestino: string;
  codigo: string;
  tipoTransferencia: string;
}

export type Transfer365ReportResponseI =
  BackofficeApiPaginatedData<Transfer365ReportItem>;
