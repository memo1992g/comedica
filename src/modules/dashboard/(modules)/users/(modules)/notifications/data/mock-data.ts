export interface NotificationHistoryEntry {
  id: string;
  fecha: string;
  usuarioAdmin: string;
  modalidades: string;
  destinatarios: string;
}

export interface SegmentOption {
  value: string;
  label: string;
}

export interface ChannelOption {
  value: string;
  label: string;
}

export const segmentOptions: SegmentOption[] = [
  { value: 'todos', label: 'Todos los usuarios' },
  { value: 'tarjetas', label: 'Usuarios con Tarjetas' },
  { value: 'creditos', label: 'Usuarios con Créditos' },
];

export const channelOptions: ChannelOption[] = [
  { value: 'todos', label: 'Todos los canales' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Correo Electrónico' },
  { value: 'push', label: 'Notificación Push' },
  { value: 'interno', label: 'Canal Interno' },
];

export const mockNotificationHistory: NotificationHistoryEntry[] = [
  { id: '1', fecha: '12/01/2026 - 16:29', usuarioAdmin: 'Admin. Sistema', modalidades: 'SMS', destinatarios: '51 usuarios individuales' },
  { id: '2', fecha: '12/01/2026 - 16:27', usuarioAdmin: 'Admin. Sistema', modalidades: 'SMS', destinatarios: 'Usuarios con Tarjetas' },
  { id: '3', fecha: '15/11/2023 - 14:30', usuarioAdmin: 'Admin. Sistema', modalidades: 'SMS, Correo Electrónico', destinatarios: 'Usuarios con Tarjetas' },
  { id: '4', fecha: '14/11/2023 - 09:15', usuarioAdmin: 'Admin. Sistema', modalidades: 'Todos los canales', destinatarios: 'Juan Pérez (12345)' },
  { id: '5', fecha: '12/11/2023 - 11:20', usuarioAdmin: 'Admin. Sistema', modalidades: 'Notificación Push', destinatarios: 'Usuarios con Créditos' },
  { id: '6', fecha: '10/11/2023 - 16:45', usuarioAdmin: 'Admin. Sistema', modalidades: 'Canal Interno, Promociones', destinatarios: 'Todos los usuarios' },
  { id: '7', fecha: '05/11/2023 - 10:00', usuarioAdmin: 'Admin. Sistema', modalidades: 'SMS', destinatarios: 'Usuarios con Tarjetas' },
];
