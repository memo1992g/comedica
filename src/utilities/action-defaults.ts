export function getActionDefaults(): { requestId: string } {
  return {
    requestId: crypto.randomUUID(),
  };
}
