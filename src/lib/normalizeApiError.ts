import { AxiosError } from "axios";

type ZodFlattenError = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
};

type BackendErrorObject = {
  message?: string;
  error?: string | ZodFlattenError;
  errors?: string[];
  details?: { message?: string }[];
};

export function normalizeApiError(
  error: unknown,
  fallback = "An unexpected error occurred",
): string {
  /* ---------------- Axios errors (API responses) ---------------- */
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (!data) {
      return error.message || fallback;
    }

    // Backend returned plain string
    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object") {
      const payload = data as any;

      // If API uses success/message wrapper
      if (payload?.success && typeof payload.message === "string") {
        return payload.message;
      }

      // Top-level message
      if (typeof payload.message === "string") {
        return payload.message;
      }

      // Top-level error as string
      if (typeof payload.error === "string") {
        return payload.error;
      }

      // Top-level error as object (may contain message or Zod-like shape)
      if (payload.error && typeof payload.error === "object") {
        const errObj = payload.error as any;

        // Nested message
        if (typeof errObj.message === "string") {
          return errObj.message;
        }

        // Zod flatten() style
        const zodError = errObj as ZodFlattenError;

        if (
          Array.isArray(zodError.formErrors) &&
          zodError.formErrors.length > 0
        ) {
          return zodError.formErrors[0];
        }

        if (zodError.fieldErrors) {
          const firstField = Object.keys(zodError.fieldErrors)[0];
          const messages = zodError.fieldErrors[firstField];

          if (Array.isArray(messages) && messages.length > 0) {
            return messages[0];
          }
        }
      }

      // details array (Zod mapped to { field, message } or similar)
      if (Array.isArray(payload.details) && payload.details.length > 0) {
        const first = payload.details[0] as any;
        if (first && typeof first.message === "string") return first.message;
      }

      // errors array (strings or objects { message })
      if (Array.isArray(payload.errors) && payload.errors.length > 0) {
        const first = payload.errors[0];
        if (typeof first === "string") return first;
        if (first && typeof first.message === "string") return first.message;
      }
    }

    return fallback;
  }

  /* ---------------- Native JS errors ---------------- */
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
