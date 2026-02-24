export type MainTab = 'usuarios' | 'estados';
export type SubTab = 'general' | 'history';

export interface TabIndicatorStyle {
  left: number;
  width: number;
}

export const MAIN_TABS: { id: MainTab; label: string }[] = [
  { id: 'usuarios', label: 'Gestión de Usuarios' },
  { id: 'estados', label: 'Gestión de Estados' },
];
