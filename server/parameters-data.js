// ==================== PARAMETERS ENDPOINTS ====================

// Límites generales
let generalLimits = [
  {
    id: 'limit-1',
    category: 'canales_electronicos',
    maxPerTransaction: 1000.00,
    maxDaily: 2000.00,
    maxMonthly: 10000.00,
    updatedAt: '2026-01-12T14:57:00Z',
    updatedBy: 'Administrador',
  },
  {
    id: 'limit-2',
    category: 'punto_xpress',
    subcategory: 'cuentas_ahorro',
    maxPerTransaction: 500.00,
    maxMonthlyTransactions: 30,
    updatedAt: '2026-01-12T18:45:00Z',
    updatedBy: 'Administrador',
  },
  {
    id: 'limit-3',
    category: 'punto_xpress',
    subcategory: 'cuentas_corriente',
    maxPerTransaction: 800.00,
    maxMonthlyTransactions: 50,
    updatedAt: '2026-01-10T10:30:00Z',
    updatedBy: 'Administrador',
  },
];

// Límites de usuarios
let userLimits = [
  {
    id: 'ul-1',
    userId: '12345',
    userName: 'Roberto Gómez',
    userCode: '12345',
    limitType: 'personalizado',
    limits: {
      canalesElectronicos: {
        maxPerTransaction: 1000.00,
        maxDaily: 2000.00,
        maxMonthly: 11000.00,
      },
    },
    lastUpdate: '2024-12-12',
  },
  {
    id: 'ul-2',
    userId: '78912',
    userName: 'Ana Silva',
    userCode: '78912',
    limitType: 'personalizado',
    limits: {
      canalesElectronicos: {
        maxPerTransaction: 1000.00,
        maxDaily: 2000.00,
        maxMonthly: 10000.00,
      },
      transfer365: {
        maxAmount: 2010.00,
      },
    },
    lastUpdate: undefined,
  },
  {
    id: 'ul-3',
    userId: '31711',
    userName: 'Lucía Torres',
    userCode: '31711',
    limitType: 'general',
    limits: {},
    lastUpdate: undefined,
  },
  {
    id: 'ul-4',
    userId: '45678',
    userName: 'Carlos Pérez',
    userCode: '45678',
    limitType: 'personalizado',
    limits: {
      transfer365: {
        maxAmount: 2020.00,
      },
    },
    lastUpdate: '2024-11-20',
  },
  {
    id: 'ul-5',
    userId: '98765',
    userName: 'María Rodríguez',
    userCode: '98765',
    limitType: 'general',
    limits: {},
    lastUpdate: undefined,
  },
];

// Configuración de Seguridad
let securityConfig = {
  id: 'security-1',
  passwordExpiration: 150, // días
  sessionTimeout: 180, // segundos
  minUsernameLength: 6,
  maxUsernameLength: 20,
  minPasswordLength: 8,
  maxPasswordLength: 20,
  codeExpiration: 300, // segundos
  softTokenExpiration: 60, // segundos
  updatedAt: '2026-01-12T11:37:49Z',
  updatedBy: 'Administrador',
};

// Instituciones Transfer365
let transfer365Institutions = [
  {
    id: 'inst-1',
    bic: 'BAAGSVSS',
    shortName: 'Bco. Agrícola',
    fullName: 'Banco Agrícola',
    institution: 'Banco Agrícola S.A.',
    status: 'Activo',
    compensation: '001',
    country: 'El Salvador',
    products: ['Ahorro', 'Corriente', 'Credito', 'Tarjeta', 'Movil'],
    description: 'Banco Agrícola de El Salvador',
  },
  {
    id: 'inst-2',
    bic: 'CUSCASSV',
    shortName: 'Bco. Cuscatlan',
    fullName: 'Banco Cuscatlan',
    institution: 'Banco Cuscatlan de El Salvador',
    status: 'Activo',
    compensation: '002',
    country: 'El Salvador',
    products: ['Ahorro', 'Corriente', 'Credito', 'Tarjeta', 'Movil'],
    description: 'Banco Cuscatlán',
  },
  {
    id: 'inst-3',
    bic: 'BAMSVSS',
    shortName: 'BAC',
    fullName: 'Banco de America Central',
    institution: 'Banco de America Central S.A.',
    status: 'Activo',
    compensation: '003',
    country: 'El Salvador',
    products: ['Ahorro', 'Corriente', 'Credito', 'Tarjeta', 'Movil'],
    description: 'BAC Credomatic',
  },
];

// Instituciones CA-RD (Centroamérica y República Dominicana)
let transfer365CARDInstitutions = [
  {
    id: 'inst-ca-1',
    bic: 'BAMGT',
    fullName: 'Banco Agromercantil',
    status: 'Activo',
    country: 'Guatemala',
  },
  {
    id: 'inst-ca-2',
    bic: 'BACCR',
    fullName: 'BAC Credomatic',
    status: 'Activo',
    country: 'Costa Rica',
  },
  {
    id: 'inst-ca-3',
    bic: 'FICOHN',
    fullName: 'Banco Ficohsa',
    status: 'Activo',
    country: 'Honduras',
  },
  {
    id: 'inst-ca-4',
    bic: 'LAFISEN',
    fullName: 'Banco Lafise',
    status: 'Inactivo',
    country: 'Nicaragua',
  },
  {
    id: 'inst-ca-5',
    bic: 'BANGENPA',
    fullName: 'Banco General',
    status: 'Activo',
    country: 'Panamá',
  },
];

// Auditoría - datos iniciales
let auditLog = [
  {
    id: 'audit-1',
    userId: 'admin-1',
    userName: 'Administrador',
    userRole: 'Administrador',
    affectedUser: null,
    action: 'Modificación de límites generales: Canales Electrónicos',
    module: 'Límites y Montos',
    details: 'Canales Electrónicos - Monto transacción día',
    changes: [
      { field: 'Máximo diario', oldValue: '1,000.00', newValue: '2,000.00' },
    ],
    timestamp: '2026-01-12T14:57:00Z',
  },
  {
    id: 'audit-2',
    userId: 'gerente-ti-1',
    userName: 'Gerente TI',
    userRole: 'Gerente TI',
    affectedUser: 'Ana Silva',
    action: 'Actualización de límites de usuario: Ana Silva',
    module: 'Límites y Montos',
    details: 'Canales Electrónicos - Monto transacción',
    changes: [
      { field: 'Máximo mensual', oldValue: '1,010.00', newValue: '2,010.00' },
    ],
    timestamp: '2026-01-12T04:22:00Z',
  },
  {
    id: 'audit-3',
    userId: 'gerente-ti-1',
    userName: 'Gerente TI',
    userRole: 'Gerente TI',
    affectedUser: 'Carlos Perez',
    action: 'Actualización de límites de usuario: Carlos Perez',
    module: 'Límites y Montos',
    details: 'Transfer 365 - Monto',
    changes: [
      { field: 'Monto máximo', oldValue: '1,010.00', newValue: '2,020.00' },
    ],
    timestamp: '2026-01-12T01:38:00Z',
  },
  {
    id: 'audit-4',
    userId: 'admin-1',
    userName: 'Administrador',
    userRole: 'Administrador',
    affectedUser: null,
    action: 'Actualización de parámetros Punto Xpress',
    module: 'Límites y Montos',
    details: 'Punto Xpress - Ahorros - Monto Transacción',
    changes: [
      { field: 'Máximo por transacción', oldValue: '450.00', newValue: '500.00' },
    ],
    timestamp: '2026-01-12T18:45:00Z',
  },
];

module.exports = { 
  generalLimits, 
  userLimits, 
  auditLog, 
  securityConfig,
  transfer365Institutions,
  transfer365CARDInstitutions,
};
