import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    // Test environment
    environment: 'node',
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.*', '**/coverage/**'],
    },
    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      'test/**/*.{test,spec}.{js,ts}',
      '**/__tests__/**/*.{js,ts}',
    ],
    // Exclude patterns
    exclude: ['node_modules/', 'dist/', '.idea/', '.git/', '.cache/'],
    // Global test setup
    globals: true,
    // Watch mode configuration
    watch: false,
    // Timeout for tests
    testTimeout: 10000,
    // Reporter configuration
    // Use supported reporters in Vitest v3: 'default' and 'junit' (optional) or 'json'. 'html' is not a valid test reporter; it's for coverage only.
    reporters: ['default', 'json'],
    // Output files for reporters. Keys must match reporter names.
    outputFile: {
      json: './coverage/test-results.json',
    },
  },
})
//# sourceMappingURL=vitest.config.js.map
