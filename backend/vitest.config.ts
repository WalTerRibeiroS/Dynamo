import { defineConfig } from 'vitest/config'

// como eu coloquei no tsconfig.json um include explicito para o compilador apenas
// olhar para o src/ esse arquivo aqui perder tipagem, o que n muda muito coisa
// pq eu ja nem usava muito esse arquivo aqui 

export default defineConfig({
  test: {

    typecheck: {
      enabled: true,
      include: ['./src/tests/types/**/*.test-d.ts'],
    },

    projects: [
      {
        test: {
          name: 'unit',
          include: ['./src/tests/unit/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'type',
          include: ['./src/tests/types/**/*.test-d.ts'],
          typecheck: {
            enabled: true,
            only: true,
          },
        },
      },
      {
        test: {
          name: 'integration',
          include: ['./src/tests/integration/**/*.test.ts'],
          testTimeout: 10000, // I/O real demora mais que unit
          // setupFiles: ['./testes/integration/setup.ts'], // quando for conectar num banco de teste
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['./src/tests/e2e/**/*.test.ts'],
          testTimeout: 15000,
        },
      },
    ],
  },
})
