import { z } from "zod"
import type { Issue } from "../types/issue.js"

export function formatZodError(zodError: z.ZodError): Issue[]{
  return zodError.issues.map((issue) => {
    return {
      field: issue.path.length > 0 ? issue.path.join(".") : "root",
      message: issue.message,
      /* code? */
    }
  })
}