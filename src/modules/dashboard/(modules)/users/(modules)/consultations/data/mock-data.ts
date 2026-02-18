export interface UserResult {
  id: string;
  name: string;
  dui: string;
  phone: string;
  email: string;
  username: string;
  status: 'Activo' | 'Inactivo' | 'Bloqueado';
  notificationMode: string;
  initials: string;
  avatarColor: string;
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  timestamp: string;
}

export interface UserHistoryEntry {
  id: string;
  fecha: string;
  gestionadoPor: string;
  accion: string;
  estado: string;
  motivo: string;
}

export const mockUsers: UserResult[] = [
  { id: 'USR-001', name: 'Francisco Andrés Flores García', dui: '04976825-1', phone: '7890-1234', email: 'francisco.flores@email.com', username: 'fflores01', status: 'Activo', notificationMode: 'Email', initials: 'FF', avatarColor: '#23366a' },
  { id: 'USR-002', name: 'María Elena Rodríguez López', dui: '05123456-7', phone: '7856-4321', email: 'maria.rodriguez@email.com', username: 'mrodriguez', status: 'Activo', notificationMode: 'SMS', initials: 'MR', avatarColor: '#6d93d2' },
  { id: 'USR-003', name: 'Carlos Alberto Martínez', dui: '06234567-8', phone: '7712-5678', email: 'carlos.martinez@email.com', username: 'cmartinez', status: 'Bloqueado', notificationMode: 'Email', initials: 'CM', avatarColor: '#e74c3c' },
  { id: 'USR-004', name: 'Ana Lucía Hernández Vega', dui: '07345678-9', phone: '7645-8765', email: 'ana.hernandez@email.com', username: 'ahernandez', status: 'Inactivo', notificationMode: 'SMS', initials: 'AH', avatarColor: '#2ecc71' },
];

export const mockSearchHistory: SearchHistoryEntry[] = [
  { id: '1', query: 'Francisco Flores', timestamp: '10:30 AM' },
  { id: '2', query: '04976825-1', timestamp: '10:15 AM' },
  { id: '3', query: 'María Rodríguez', timestamp: '09:45 AM' },
  { id: '4', query: 'fflores01', timestamp: '09:20 AM' },
  { id: '5', query: 'Carlos Martínez', timestamp: 'Ayer' },
];

export const mockUserHistory: UserHistoryEntry[] = [
  { id: '1', fecha: '15/03/2025 10:30', gestionadoPor: 'Admin Principal', accion: 'Cambio de estado', estado: 'Activo', motivo: 'Solicitud del usuario vía correo electrónico' },
  { id: '2', fecha: '10/03/2025 14:15', gestionadoPor: 'Soporte Nivel 2', accion: 'Desbloqueo', estado: 'Activo', motivo: 'Usuario bloqueado por intentos fallidos' },
  { id: '3', fecha: '01/03/2025 09:00', gestionadoPor: 'Admin Principal', accion: 'Bloqueo', estado: 'Bloqueado', motivo: 'Actividad sospechosa detectada' },
  { id: '4', fecha: '20/02/2025 16:45', gestionadoPor: 'Soporte Nivel 1', accion: 'Cambio de contraseña', estado: 'Activo', motivo: 'Contraseña olvidada' },
  { id: '5', fecha: '15/02/2025 11:20', gestionadoPor: 'Admin Principal', accion: 'Activación', estado: 'Activo', motivo: 'Registro completado' },
];
