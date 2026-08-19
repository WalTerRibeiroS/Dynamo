import type { Issue } from "./issue.js"

export type ValidationErrorOptions = {
  issues?: Issue[];
  details?: unknown;
  publicDetails?: Record<string, unknown>;
  message?: string;
};