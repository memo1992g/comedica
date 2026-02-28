export type MainTab = 'usuarios' | 'estados';
export type SubTab = 'general' | 'history';

export interface TabIndicatorStyle {
  left: number;
  width: number;
}

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

export const MAIN_TABS: { id: MainTab; label: string }[] = [
  { id: 'usuarios', label: 'Gestión de Usuarios' },
  { id: 'estados', label: 'Gestión de Estados' },
];
