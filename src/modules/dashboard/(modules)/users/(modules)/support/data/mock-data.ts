export interface SupportUser {
  id: string;
  name: string;
  dui: string;
  initials: string;
  username?: string;
  status: 'Activo' | 'Inactivo' | 'Bloqueado';
}

export interface AttentionType {
  id: string;
  code: string;
  name: string;
  questions: number;
  maxFailures: number;
  icon: string;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface PreviousManagement {
  id: string;
  userName: string;
  userId: string;
  userDui: string;
  managementType: string;
  date: string;
  securityQuestions: { question: string; result: 'Correcta' | 'Incorrecta' }[];
  totalCorrect: number;
  totalQuestions: number;
  comment: string;
}

export interface SupportHistoryEntry {
  id: string;
  fecha: string;
  gestionadoPor: string;
  asociado: string;
  accion: string;
  estado: string;
  estadoPrevio: string;
  motivo: string;
}

export const mockSupportUsers: SupportUser[] = [
  { id: '12345', name: 'Juan Sánchez', dui: '12345789-1', initials: 'JS', status: 'Activo' },
  { id: '67890', name: 'María López', dui: '98765432-0', initials: 'ML', status: 'Bloqueado' },
  { id: '11223', name: 'Carlos Gómez', dui: '55667788-3', initials: 'CG', status: 'Inactivo' },
];

export const attentionTypes: AttentionType[] = [
  { id: '1', code: 'SOP003', name: 'Creación de usuario', questions: 4, maxFailures: 1, icon: 'UserPlus' },
  { id: '2', code: 'SOP005', name: 'Bloqueo', questions: 3, maxFailures: 2, icon: 'Lock' },
  { id: '3', code: 'SOP004', name: 'Desbloqueo', questions: 4, maxFailures: 1, icon: 'Unlock' },
  { id: '4', code: 'SOP006', name: 'Consulta de usuario', questions: 3, maxFailures: 1, icon: 'Search' },
  { id: '5', code: 'SOP007', name: 'Actualización de datos', questions: 4, maxFailures: 1, icon: 'RefreshCw' },
  { id: '6', code: 'SOP009', name: 'Recuperación de contraseña', questions: 3, maxFailures: 1, icon: 'Key' },
  { id: '7', code: 'SOP010', name: 'Soporte de aplicación', questions: 3, maxFailures: 1, icon: 'Smartphone' },
  { id: '8', code: 'SOP011', name: 'Consulta de transacciones', questions: 3, maxFailures: 1, icon: 'FileSearch' },
  { id: '9', code: 'SOP012', name: 'Soporte con token', questions: 3, maxFailures: 1, icon: 'Shield' },
  { id: '10', code: 'SOP013', name: 'Soporte general', questions: 3, maxFailures: 1, icon: 'Settings' },
  { id: '11', code: 'SOP008', name: 'Cambio de parámetros', questions: 4, maxFailures: 1, icon: 'SlidersHorizontal' },
];

export const securityQuestions: SecurityQuestion[] = [
  { id: '1', question: 'Últimos 5 dígitos de su DUI', answer: '5789-1' },
  { id: '2', question: 'Fecha de nacimiento', answer: '15/03/1990' },
  { id: '3', question: 'Nombre de su mascota', answer: 'Rex' },
  { id: '4', question: 'Ciudad de nacimiento', answer: 'San Salvador' },
];

export const mockPreviousManagements: PreviousManagement[] = [
  {
    id: '1', userName: 'Juan Sánchez', userId: '12345', userDui: '12345789-1',
    managementType: 'Consulta de usuario', date: '11/02/2026 10:30',
    securityQuestions: [
      { question: 'Últimos 5 dígitos de su DUI', result: 'Correcta' },
      { question: 'Fecha de nacimiento', result: 'Correcta' },
    ],
    totalCorrect: 2, totalQuestions: 2,
    comment: 'Usuario consultó sobre estado de cuenta y transacciones recientes. Se proporcionó información completa.',
  },
  {
    id: '2', userName: 'María López', userId: '67890', userDui: '98765432-0',
    managementType: 'Desbloqueo', date: '10/02/2026 14:15',
    securityQuestions: [
      { question: 'Últimos 5 dígitos de su DUI', result: 'Correcta' },
      { question: 'Fecha de nacimiento', result: 'Incorrecta' },
      { question: 'Nombre de su mascota', result: 'Correcta' },
    ],
    totalCorrect: 2, totalQuestions: 3,
    comment: 'Se realizó desbloqueo de cuenta por solicitud del usuario.',
  },
  {
    id: '3', userName: 'Juan Sánchez', userId: '12345', userDui: '12345789-1',
    managementType: 'Recuperación de contraseña', date: '08/02/2026 09:00',
    securityQuestions: [
      { question: 'Fecha de nacimiento', result: 'Correcta' },
      { question: 'Ciudad de nacimiento', result: 'Correcta' },
    ],
    totalCorrect: 2, totalQuestions: 2,
    comment: 'Se envió enlace de recuperación de contraseña al correo registrado.',
  },
  {
    id: '4', userName: 'Carlos Gómez', userId: '11223', userDui: '55667788-3',
    managementType: 'Soporte de aplicación', date: '07/02/2026 16:45',
    securityQuestions: [
      { question: 'Últimos 5 dígitos de su DUI', result: 'Correcta' },
      { question: 'Nombre de su mascota', result: 'Correcta' },
    ],
    totalCorrect: 2, totalQuestions: 2,
    comment: 'Usuario reportó problemas con la aplicación móvil. Se brindó asistencia técnica.',
  },
  {
    id: '5', userName: 'Juan Sánchez', userId: '12345', userDui: '12345789-1',
    managementType: 'Actualización de datos', date: '05/02/2026 11:20',
    securityQuestions: [
      { question: 'Fecha de nacimiento', result: 'Correcta' },
      { question: 'Ciudad de nacimiento', result: 'Correcta' },
      { question: 'Nombre de su mascota', result: 'Correcta' },
    ],
    totalCorrect: 3, totalQuestions: 3,
    comment: 'Actualización de correo electrónico y número de teléfono del usuario.',
  },
];

export const mockSupportHistory: SupportHistoryEntry[] = Array.from({ length: 50 }, (_, i) => {
  const actions = ['Inactivación de Usuario', 'Desbloqueo de Usuario', 'Bloqueo Definitivo', 'Activación de Usuario', 'Bloqueo Preventivo'];
  const managers = ['Sistema', 'Carlos Fuentes', 'Ana Martínez', 'Roberto Gómez'];
  const associates = ['Juan Pérez López', 'Ana Martínez Flores', 'Carlos Hernández Cruz', 'María González Ramírez', 'Pedro Rodríguez Silva'];
  const states = ['Inactivo', 'Activo', 'Bloqueado (Definitivo)', 'Bloqueado (Preventivo)'];
  const prevStates = ['Activo', 'Bloqueado', 'Inactivo'];
  const reasons = ['Solicitud de baja temporal', 'Validación de identidad exitosa', 'Reporte de robo de identidad', 'Intentos fallidos de acceso', 'Solicitud del cliente completada'];

  const day = String(11 - Math.floor(i / 5)).padStart(2, '0');
  const hour = String(8 + (i % 12)).padStart(2, '0');
  const min = String((i * 7) % 60).padStart(2, '0');

  return {
    id: String(i + 1),
    fecha: `${day}/02/2026 - ${hour}:${min}`,
    gestionadoPor: managers[i % managers.length],
    asociado: associates[i % associates.length],
    accion: actions[i % actions.length],
    estado: states[i % states.length],
    estadoPrevio: prevStates[i % prevStates.length],
    motivo: reasons[i % reasons.length],
  };
});
