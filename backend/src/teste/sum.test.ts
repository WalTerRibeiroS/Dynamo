import { expect, test } from 'vitest'
import { sum } from '../aprendendo_vitest/sum.js'

test('soma 1 + 2 para equalar a 3', () => {
  expect(sum(1, 2)).toBe(3)
})
