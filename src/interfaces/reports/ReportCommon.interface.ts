import type { BackofficeApiPaginatedData } from "../ApiResponse.interface";

/** Consolidated Report */
export interface ConsolidatedReportRequestI {
  uuid?: string;
  channel?: string;
  pageId?: number;
  requestId?: string;
  associateNumber?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface ConsolidatedReportItem {
  fecha: string;
  associateNumber: string;
  tipo: string;
  concepto: string;
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  canal: string;
}

export type ConsolidatedReportResponseI =
  BackofficeApiPaginatedData<ConsolidatedReportItem>;

/** Credits Report */
export interface CreditReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
  customerToCharge?: string;
  accountToCharge?: string;
  customerToPay?: string;
  accountToPay?: string;
  montoMin?: number;
  montoMax?: number;
}

export interface CreditReportItem {
  transactionDate: string;
  customerToCharge: string;
  accountHolderToCharge: string;
  accountToCharge: string;
  customerToPay: string;
  accountHolderToPay: string;
  accountToPay: string;
  amount: number;
  transactionConcept: string;
  channels: string;
  transactionType: string;
}

export type CreditReportResponseI =
  BackofficeApiPaginatedData<CreditReportItem>;

/** Debit Report */
export interface DebitReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
  associateNumber?: string;
  debitedAccount?: string;
  creditedAccount?: string;
  montoMin?: number;
  montoMax?: number;
}

export interface DebitReportItem {
  dateTransaction: string;
  associateNumber: string;
  debitAccountHolder: string | null;
  debitedAccount: string;
  creditAccountHolder: string | null;
  creditedAccount: string;
  amount: number;
  transactionType: string;
  channel: string | null;
  type: string | null;
}

export type DebitReportResponseI =
  BackofficeApiPaginatedData<DebitReportItem>;
