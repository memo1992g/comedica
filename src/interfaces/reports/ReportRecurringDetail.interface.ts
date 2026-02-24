export interface RecurringDetailRequestI {
  numeroAsociado: string;
  tipo: string;
  frecuencia: string;
  refAbono: string;
  refCargo: string;
}

export interface RecurringDetailItem {
  alias: string;
  tipo: string;
  numeroSolicitud: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
  numeroAsociado: string;
  numeroMiembro: string;
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
