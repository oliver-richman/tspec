import { TSpecConfig } from './packages/core/src/config.js';

const config: TSpecConfig = {
  // Test discovery patterns
  testMatch: [
    '**/*.tspec.ts',
    '**/*.test.ts',
    '**/*.spec.ts'
  ],
  
  // Files/directories to ignore
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
  ],
  
  // Test execution settings
  timeout: 10000, // 10 seconds
  parallel: false, // Sequential execution for now
  maxWorkers: 1,
  
  // Output settings
  verbose: true,
  silent: false,
  
  // Setup files (for future implementation)
  setupFilesAfterEnv: [
    // '<rootDir>/test-setup.ts'
  ],
  
  // Coverage settings (for future implementation)
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // TypeScript/ESM settings
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Test environment
  testEnvironment: 'node',
  
  // Mock settings
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true
};

export default config; 