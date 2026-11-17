import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['./tests/unit/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          include: ['./tests/integration/**/*.test.ts'],
          testTimeout: 10000, // I/O real demora mais que unit
          // setupFiles: ['./testes/integration/setup.ts'], // quando for conectar num banco de teste
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['./tests/e2e/**/*.test.ts'],
          testTimeout: 15000,
        },
      },
    ],
  },
})
