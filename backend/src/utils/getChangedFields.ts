import { isDeepStrictEqual } from 'node:util'

export function getChangedFields<T extends object, P extends Partial<T>>(
  current: T,
  patch: P,
): Partial<P> {
  const changed: Partial<P> = {}

  for (const key of Object.keys(patch) as Array<keyof P & keyof T>) {
    const next = patch[key]

    if (next !== undefined && !isDeepStrictEqual(next, current[key])) {
      changed[key] = next
    }
  }

  return changed
}