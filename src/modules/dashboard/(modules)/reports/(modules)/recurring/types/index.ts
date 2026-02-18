export type RecurringTab = 'recurrentes' | 'ejecutadas';

export interface RecurringReport {
  id: string;
  tipo: string;
  solicitud: string;
  fechaCreacion: string;
  ultimaMod: string;
  numeroAsociado: string;
  refCargo: string;
  refAbono: string;
  tipoBeneficiario: string;
  beneficiario: string;
  valor: number;
  bancoDestino: string;
  fechaInicio: string;
  frecuencia: string;
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
  finalizado: boolean;
  canal: string;
  oficina: string;
}

export interface ExecutedReport {
  id: string;
  fechaCreacion: string;
  tipo: string;
  numeroAsociado: string;
  refCargo: string;
  refAbono: string;
  valor: number;
  bancoDestino: string;
  fechaHoraOp: string;
  horaOp: string;
  fechaEjecucion: string;
  estadoEjecucion: 'Procesado' | 'Rechazado' | 'Fallido' | 'Cancelado';
  mensajeError: string | null;
  fechaProcesado: string | null;
  fechaRechazo: string | null;
  mensajeRechazo: string | null;
}

export interface HistoricalExecution {
  id: string;
  fechaModificacion: string;
  aliasRecurrente: string;
  tipo: string;
  refCargo: string;
  refAbono: string;
  tipoBeneficiario: string;
  beneficiario: string;
  valor: number;
  bancoDestino: string;
  fechaInicio: string;
  frecuencia: string;
  estado: 'Exitoso' | 'Inactivo' | 'Fallido';
  finalizado: boolean;
  canal: string;
  oficina: string;
}
