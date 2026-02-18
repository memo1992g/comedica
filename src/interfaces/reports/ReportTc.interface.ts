import type { BackofficeApiPaginatedData } from "../ApiResponse.interface";

/** Pagos TC (Tarjeta de Crédito) Report */
export interface TcReportRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface TcReportItem {
  fecha: string;
  cuentaOrigen: string;
  idOrigen: string;
  nombreOrigen: string;
  tarjetaDestino: string;
  idDestino: string;
  nombreDestino: string;
  canal: string;
  monto: number;
}

export type TcReportResponseI = BackofficeApiPaginatedData<TcReportItem>;
