/** Transfer365 Balance (Cuadre) */
export interface Transfer365BalanceRequestI {
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface Transfer365BalanceData {
  totalSalientes: number;
  totalEntrantes: number;
  montoNeto: number;
}

/** Transfer365 Card Balance (Cuadre CA-RD) */
export interface Transfer365CardBalanceRequestI {
  fechaHoraDesde?: string;
  fechaHoraHasta?: string;
}

export type Transfer365CardBalanceData = Transfer365BalanceData;
