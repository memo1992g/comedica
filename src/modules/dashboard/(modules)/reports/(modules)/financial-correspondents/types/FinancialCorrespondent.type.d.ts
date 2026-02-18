export interface FinancialCorrespondentTransaction {
  id: string;
  fecha: string;
  numeroAsociado: string;
  nombre: string;
  monto: number;
  cuenta: string;
  referencia: string;
  tipo: 'TC' | 'Prestamos' | 'Abonos';
}
