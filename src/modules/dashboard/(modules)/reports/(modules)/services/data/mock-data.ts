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
    fecha: '2025-03-04T10:30:00',
    numeroAsociado: '2001',
    monto: 129,
    codEvento: 'C-91',
    nombreEvento: 'Taller',
    nombreParticipante: 'Laura Torres',
  },
  {
    fecha: '2025-06-05T14:15:00',
    numeroAsociado: '2005',
    monto: 115.96,
    codEvento: 'C-11',
    nombreEvento: 'Concierto',
    nombreParticipante: 'Ana Martínez',
  },
  {
    fecha: '2025-09-14T09:00:00',
    numeroAsociado: '2008',
    monto: 77.44,
    codEvento: 'C-41',
    nombreEvento: 'Taller',
    nombreParticipante: 'Roberto Sánchez',
  },
  {
    fecha: '2025-11-22T16:45:00',
    numeroAsociado: '2012',
    monto: 95.33,
    codEvento: 'C-65',
    nombreEvento: 'Seminario',
    nombreParticipante: 'Patricia Gómez',
  },
];

// Seguros Comédica mock data
export const mockSegurosData: SeguroTransaction[] = [
  {
    fecha: '2025-10-10T08:30:00',
    numeroAsociado: '4001',
    monto: 364.38,
    nombre: 'Empresa SA',
    cuentaOrigen: '020130000101',
    tipoCuenta: 'CUENTA CORRIENTE',
    valorPagado: 364.38,
    tipoPoliza: 'AUC',
    poliza: 'AUC-38-732',
    referencia: '74112345678)39000000000036438',
  },
  {
    fecha: '2025-03-23T11:15:00',
    numeroAsociado: '4002',
    monto: 543.85,
    nombre: 'María García',
    cuentaOrigen: '020130000202',
    tipoCuenta: 'AHORRO PERSONAL',
    valorPagado: 543.85,
    tipoPoliza: 'VID',
    poliza: 'VID-91-958',
    referencia: '74112345678)39000000000054385',
  },
  {
    fecha: '2025-07-10T09:00:00',
    numeroAsociado: '4003',
    monto: 279.44,
    nombre: 'Empresa SA',
    cuentaOrigen: '020130000303',
    tipoCuenta: 'CUENTA CORRIENTE',
    valorPagado: 279.44,
    tipoPoliza: 'AUC',
    poliza: 'AUC-61-157',
    referencia: '74112345678)39000000000027944',
  },
  {
    fecha: '2025-12-18T14:30:00',
    numeroAsociado: '4005',
    monto: 456.92,
    nombre: 'Carlos Rodríguez',
    cuentaOrigen: '020130000505',
    tipoCuenta: 'AHORRO PERSONAL',
    valorPagado: 456.92,
    tipoPoliza: 'VID',
    poliza: 'VID-74-832',
    referencia: '74112345678)39000000000045692',
  },
];

// Ministerio de Hacienda mock data
export const mockMinisterioData: MinisterioTransaction[] = [
  {
    fecha: '2025-08-09T10:49:49',
    numeroAsociado: '5000',
    monto: 868.6,
    nombre: 'BYRON WILFREDO MENJIVAR RAMIREZ',
    cuentaOrigen: '010100007492',
    tipoCuenta: 'AHORRO PERSONAL',
    mandamientoNpe: '50198768690',
    referencia: '0463000013957920260320050198768690',
    canal: 'WEB',
  },
  {
    fecha: '2025-05-18T14:30:00',
    numeroAsociado: '5001',
    monto: 1166.47,
    nombre: 'MARIA ELENA GONZALEZ LOPEZ',
    cuentaOrigen: '010100008123',
    tipoCuenta: 'CUENTA CORRIENTE',
    mandamientoNpe: '50198769001',
    referencia: '0463000013957920260320050198769001',
    canal: 'WEB',
  },
  {
    fecha: '2025-04-14T09:15:00',
    numeroAsociado: '5002',
    monto: 261.74,
    nombre: 'CARLOS ALBERTO PEREZ MARTINEZ',
    cuentaOrigen: '010100009456',
    tipoCuenta: 'AHORRO PERSONAL',
    mandamientoNpe: '50198769502',
    referencia: '0463000013957920260320050198769502',
    canal: 'APP',
  },
  {
    fecha: '2025-02-06T16:00:00',
    numeroAsociado: '5003',
    monto: 542.89,
    nombre: 'ANA PATRICIA RODRIGUEZ SANTOS',
    cuentaOrigen: '010100010789',
    tipoCuenta: 'CUENTA CORRIENTE',
    mandamientoNpe: '50198770123',
    referencia: '0463000013957920260320050198770123',
    canal: 'WEB',
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
