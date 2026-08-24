import { z } from 'zod'
import type { Issue } from '../types/issue.js'
import type { DomainCode } from '../types/issue.js'

type ZodCode = z.ZodError['issues'][number]['code']
type ZodIssues = z.ZodError['issues']

const zodCodeToDomainCode: Record<ZodCode, DomainCode> = {
  invalid_type: 'INVALID_TYPE',
  too_small: 'MIN_LENGTH',
  too_big: 'MAX_LENGTH',
  custom: 'CUSTOM_VALIDATION',
  invalid_element: 'INVALID_ELEMENT',
  invalid_format: 'INVALID_FORMAT',
  invalid_key: 'INVALID_KEY',
  invalid_union: 'INVALID_UNION',
  invalid_value: 'INVALID_VALUE',
  not_multiple_of: 'NOT_MULTIPLE_OF',
  unrecognized_keys: 'UNRECOGNIZED_KEYS',
}

export function formatZodError(zodIssues: ZodIssues): Issue[] {
  return zodIssues.map((issue) => {
    return {
      field: issue.path.length > 0 ? issue.path.join('.') : 'root',
      message: issue.message,
      code: zodCodeToDomainCode[issue.code],
    }
  })
}
