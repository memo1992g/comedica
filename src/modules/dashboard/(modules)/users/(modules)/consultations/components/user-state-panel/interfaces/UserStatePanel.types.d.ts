export interface UserStatePanelProps {
  user: import('../../../data/mock-data').UserResult | null;
  onSave: () => void;
}

export interface ToggleOption {
  label: string;
  hint: string;
  key: string;
}

export interface ToggleSection {
  title: string;
  description: string;
  options: ToggleOption[];
}
