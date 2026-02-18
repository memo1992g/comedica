export type ServicesTab = 'servicios' | 'eventos' | 'seguros_comedica' | 'ministerio_hacienda';

// Base transaction type
export interface BaseTransaction {
  fecha: string;
  numeroAsociado: string;
  monto: number;
}

// Servicios (Services) tab
export interface ServicioTransaction extends BaseTransaction {
  nombre: string;
  colector: string;
  referencia: string;
}

// Eventos (Events) tab
export interface EventoTransaction extends BaseTransaction {
  codEvento: string;
  nombreEvento: string;
  nombreParticipante: string;
  numeroAsociadoParticipante: string;
}

// Seguros Comédica (Insurance) tab
export interface SeguroTransaction extends BaseTransaction {
  asegurado: string;
  numeroPoliza: string;
  tipoSeguro: string;
}

// Ministerio de Hacienda (Treasury) tab
export interface MinisterioTransaction extends BaseTransaction {
  nitDui: string;
  mandamientoNpe: string;
  tipoImpuesto: string;
}

export type ServiceTransaction = 
  | ServicioTransaction 
  | EventoTransaction 
  | SeguroTransaction 
  | MinisterioTransaction;
