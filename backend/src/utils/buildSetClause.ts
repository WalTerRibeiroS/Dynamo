export function buildSetClause<K extends string>(
  changes: Partial<Record<K, unknown>>,
  columnMap: Record<K, string>,
  startIndex = 1,
): { assignments: string[]; values: unknown[]} {
  const assignments: string[] = []
  const values: unknown[] = []

  for (const key of Object.keys(columnMap) as K[]) {
    const value = changes[key]
    if (value === undefined) continue

    values.push(value)
    assignments.push(`${columnMap[key]} = $${startIndex + values.length - 1}`)
  }

  return { assignments, values }
}