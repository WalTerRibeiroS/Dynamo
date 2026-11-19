import { isDeepStrictEqual } from 'node:util'

type Patch<T> = { [K in keyof T]?: T[K] | undefined }

export type Changed<P> = { [K in keyof P]?: Exclude<P[K], undefined> }

export function getChangedFields<T extends object, P extends Patch<T>>(
  current: T,
  patch: P,
): Changed<P> {
  const changed: Changed<P> = {}

  for (const key of Object.keys(patch) as Array<keyof P & keyof T>) {
    const next = patch[key]

    if (next !== undefined && !isDeepStrictEqual(next, current[key])) {
      changed[key] = next as Changed<P>[typeof key]
    }
  }

  return changed
}