import { useState } from 'react';

const INITIAL_TOGGLES: Record<string, boolean> = {
  verificacion_email: true,
  password_email: true,
  token_email: true,
};

export function useUserStateForm() {
  const [action, setAction] = useState('');
  const [comment, setComment] = useState('');
  const [toggles, setToggles] = useState<Record<string, boolean>>(INITIAL_TOGGLES);

  const handleToggle = (key: string) => {
    setToggles((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  const canSave = Boolean(action && comment.trim());

  return {
    action,
    comment,
    toggles,
    canSave,
    setAction,
    setComment,
    handleToggle,
  };
}
