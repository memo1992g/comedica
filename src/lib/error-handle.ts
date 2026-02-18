import type { ActionResult } from "@/interfaces/ApiResponse.interface";

export function throwActionError(error: unknown): ActionResult<never> {
  const message =
    error instanceof Error ? error.message : "Error desconocido";
  return { data: null, errors: true, errorMessage: message };
}
