import { AxiosError } from "axios";

interface ErrorLike {
  message?: string;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string; error?: string | unknown[] }
      | undefined;
    if (data?.message) return data.message;
    if (Array.isArray(data?.error) && data.error.length > 0) {
      // zod error array: [{ message, path, ... }]
      const first = data.error[0] as ErrorLike & { path?: string };
      return first?.message ?? "Invalid input";
    }
    if (error.code === "ERR_NETWORK") {
      return "Unable to reach the server. Please try again.";
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}