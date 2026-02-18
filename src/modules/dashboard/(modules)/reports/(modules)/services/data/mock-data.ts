import {
  ServicioTransaction,
  EventoTransaction,
  SeguroTransaction,
  MinisterioTransaction,
} from '../types/service-types';

// Servicios mock data
export const mockServiciosData: ServicioTransaction[] = [
  {
    fecha: '11/01/2025',
    numeroAsociado: '1000',
    nombre: 'María García',
    monto: 228.6,
    colector: 'AES',
    referencia: '351949533',
  },
  {
    fecha: '13/09/2025',
    numeroAsociado: '1001',
    nombre: 'Servicios Globales',
    monto: 175.57,
    colector: 'DelSur',
    referencia: '850908833',
  },
  {
    fecha: '21/04/2025',
    numeroAsociado: '1002',
    nombre: 'Carlos López',
    monto: 277.44,
    colector: 'Movistar',
    referencia: '311964192',
  },
  {
    fecha: '28/03/2025',
    numeroAsociado: '1003',
    nombre: 'Ana Martínez',
    monto: 198.75,
    colector: 'Claro',
    referencia: '428571963',
  },
  {
    fecha: '05/07/2025',
    numeroAsociado: '1004',
    nombre: 'Tech Solutions',
    monto: 342.18,
    colector: 'AES',
    referencia: '567123849',
  },
];

// Eventos mock data
export const mockEventosData: EventoTransaction[] = [
  {
    fecha: '04/03/2025',
    numeroAsociado: '2001',
    monto: 129,
    codEvento: 'C-91',
    nombreEvento: 'Taller',
    nombreParticipante: 'Laura Torres',
    numeroAsociadoParticipante: 'PART-5001',
  },
  {
    fecha: '05/06/2025',
    numeroAsociado: '2005',
    monto: 115.96,
    codEvento: 'C-11',
    nombreEvento: 'Concierto',
    nombreParticipante: 'Ana Martínez',
    numeroAsociadoParticipante: 'PART-5005',
  },
  {
    fecha: '14/09/2025',
    numeroAsociado: '2008',
    monto: 77.44,
    codEvento: 'C-41',
    nombreEvento: 'Taller',
    nombreParticipante: 'Roberto Sánchez',
    numeroAsociadoParticipante: 'PART-5008',
  },
  {
    fecha: '22/11/2025',
    numeroAsociado: '2012',
    monto: 95.33,
    codEvento: 'C-65',
    nombreEvento: 'Seminario',
    nombreParticipante: 'Patricia Gómez',
    numeroAsociadoParticipante: 'PART-5012',
  },
];

// Seguros Comédica mock data
export const mockSegurosData: SeguroTransaction[] = [
  {
    fecha: '10/10/2025',
    numeroAsociado: '4001',
    asegurado: 'Empresa SA',
    monto: 364.38,
    numeroPoliza: 'POL-38732',
    tipoSeguro: 'Médico',
  },
  {
    fecha: '23/03/2025',
    numeroAsociado: '4002',
    asegurado: 'María García',
    monto: 543.85,
    numeroPoliza: 'POL-91958',
    tipoSeguro: 'Médico',
  },
  {
    fecha: '10/07/2025',
    numeroAsociado: '4003',
    asegurado: 'Empresa SA',
    monto: 279.44,
    numeroPoliza: 'POL-61157',
    tipoSeguro: 'Vida',
  },
  {
    fecha: '18/12/2025',
    numeroAsociado: '4005',
    asegurado: 'Carlos Rodríguez',
    monto: 456.92,
    numeroPoliza: 'POL-74832',
    tipoSeguro: 'Auto',
  },
];

// Ministerio de Hacienda mock data
export const mockMinisterioData: MinisterioTransaction[] = [
  {
    fecha: '09/08/2025',
    numeroAsociado: '5000',
    monto: 868.6,
    nitDui: '110-31365-18-2',
    mandamientoNpe: 'NPE-6378721545',
    tipoImpuesto: 'Renta',
  },
  {
    fecha: '18/05/2025',
    numeroAsociado: '5001',
    monto: 1166.47,
    nitDui: '473-65981-63-2',
    mandamientoNpe: 'NPE-5152063476',
    tipoImpuesto: 'Renta',
  },
  {
    fecha: '14/04/2025',
    numeroAsociado: '5002',
    monto: 261.74,
    nitDui: '7887-46184-99-0',
    mandamientoNpe: 'NPE-1219849487',
    tipoImpuesto: 'Pago a Cuenta',
  },
  {
    fecha: '06/02/2025',
    numeroAsociado: '5003',
    monto: 542.89,
    nitDui: '234-98765-43-1',
    mandamientoNpe: 'NPE-9876543210',
    tipoImpuesto: 'IVA',
  },
];

// Summary stats
export const mockStatsData = {
  servicios: {
    totalTransactions: 50,
    totalAmount: 13698.75,
  },
  eventos: {
    totalTransactions: 22,
    totalAmount: 3223.48,
  },
  seguros_comedica: {
    totalTransactions: 32,
    totalAmount: 13000.58,
  },
  ministerio_hacienda: {
    totalTransactions: 46,
    totalAmount: 33526.09,
  },
};
