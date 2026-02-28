export interface UserHistoryEntry {
  id: string;
  fecha: string;
  gestionadoPor: string;
  accion: string;
  estado: string;
  motivo: string;
}

export const mockUserHistory: UserHistoryEntry[] = [
  { id: '1', fecha: '15/03/2025 10:30', gestionadoPor: 'Admin Principal', accion: 'Cambio de estado', estado: 'Activo', motivo: 'Solicitud del usuario vía correo electrónico' },
  { id: '2', fecha: '10/03/2025 14:15', gestionadoPor: 'Soporte Nivel 2', accion: 'Desbloqueo', estado: 'Activo', motivo: 'Usuario bloqueado por intentos fallidos' },
  { id: '3', fecha: '01/03/2025 09:00', gestionadoPor: 'Admin Principal', accion: 'Bloqueo', estado: 'Bloqueado', motivo: 'Actividad sospechosa detectada' },
  { id: '4', fecha: '20/02/2025 16:45', gestionadoPor: 'Soporte Nivel 1', accion: 'Cambio de contraseña', estado: 'Activo', motivo: 'Contraseña olvidada' },
  { id: '5', fecha: '15/02/2025 11:20', gestionadoPor: 'Admin Principal', accion: 'Activación', estado: 'Activo', motivo: 'Registro completado' },
];
