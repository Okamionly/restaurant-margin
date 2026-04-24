import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      // Coverage target = pure utility modules + middleware. Route files
      // are covered indirectly by integration / E2E tests (Playwright)
      // and currently exempt from the 70% threshold; we'll raise scope
      // as we extract more pure logic.
      include: [
        'api-lib/utils/haccp.ts',
        'api-lib/utils/marginCalculator.ts',
        'api-lib/utils/unitConversion.ts',
        'api-lib/middleware.ts',
      ],
      exclude: [
        'api-lib/**/*.test.ts',
        'api-lib/routes/ai.ts',
        '**/node_modules/**',
      ],
      thresholds: {
        functions: 70,
        branches: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
});
