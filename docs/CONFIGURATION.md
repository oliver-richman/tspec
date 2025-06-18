# TSpec Configuration Guide

This guide covers all configuration options available in TSpec, from basic setup to advanced customizations.

## Configuration Overview

TSpec can be configured in two ways:
1. **Configuration Files** - `tspec.config.ts` (recommended) or `tspec.config.js`
2. **CLI Options** - Command-line arguments that override config files

## Configuration Files

### Basic Configuration

Create `tspec.config.ts` in your project root:

```typescript
import { TSpecConfig } from '@tspec/core';

const config: TSpecConfig = {
  testMatch: ['**/*.tspec.ts'],
  testIgnore: ['**/node_modules/**'],
  timeout: 5000,
  verbose: false
};

export default config;
```

### Full Configuration Example

```typescript
import { TSpecConfig } from '@tspec/core';

const config: TSpecConfig = {
  // Test Discovery
  testMatch: [
    '**/*.tspec.ts',
    '**/*.test.ts',
    '**/*.spec.ts',
    'src/**/__tests__/**/*.ts'
  ],
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.d.ts'
  ],

  // Execution Settings
  timeout: 10000,           // 10 second default timeout
  parallel: false,          // Sequential execution (parallel coming soon)
  maxWorkers: 1,            // Number of worker processes

  // Output Control
  verbose: false,           // Detailed output
  silent: false,            // Suppress non-error output

  // Setup and Teardown (Future)
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
  globalSetup: '<rootDir>/src/globalSetup.ts',
  globalTeardown: '<rootDir>/src/globalTeardown.ts',

  // Coverage (Future)
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/components/': {
      branches: 90,
      statements: 90
    }
  },

  // TypeScript and Module Handling
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': 'tsx'
  },

  // Environment
  testEnvironment: 'node',  // or 'jsdom' for browser-like environment

  // Mock Settings
  clearMocks: true,         // Clear mock calls between tests
  resetMocks: false,        // Reset mock implementations between tests
  restoreMocks: true,       // Restore original implementations after tests

  // Path Mapping (mirrors tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  },

  // Custom Configuration
  rootDir: process.cwd(),
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  watchPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/coverage/']
};

export default config;
```

## Configuration Options Reference

### Test Discovery

#### `testMatch: string[]`
**Default:** `['**/*.tspec.ts']`

Glob patterns for finding test files.

```typescript
// Common patterns
testMatch: [
  '**/*.tspec.ts',          // TSpec convention
  '**/*.test.ts',           // Jest convention
  '**/*.spec.ts',           // Jasmine convention
  'src/**/__tests__/**/*.ts' // Tests in __tests__ folders
]
```

#### `testIgnore: string[]`
**Default:** `['**/node_modules/**', '**/dist/**']`

Glob patterns for ignoring files during test discovery.

```typescript
testIgnore: [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/*.d.ts',
  '**/vendor/**'
]
```

#### `rootDir: string`
**Default:** `process.cwd()`

Root directory for resolving paths.

```typescript
rootDir: './src'  // Look for tests relative to src directory
```

### Test Execution

#### `timeout: number`
**Default:** `5000` (5 seconds)

Default timeout for all tests in milliseconds.

```typescript
timeout: 30000  // 30 seconds for slow integration tests
```

#### `parallel: boolean`
**Default:** `false`

Enable parallel test execution (future feature).

```typescript
parallel: true  // Run tests in parallel
```

#### `maxWorkers: number`
**Default:** `1`

Maximum number of worker processes for parallel execution.

```typescript
maxWorkers: 4           // Use 4 workers
maxWorkers: '50%'       // Use 50% of available cores
```

### Output Control

#### `verbose: boolean`
**Default:** `false`

Enable verbose output with detailed test information.

```typescript
verbose: true  // Show detailed test execution info
```

#### `silent: boolean`
**Default:** `false`

Suppress all output except errors.

```typescript
silent: true  // Quiet mode for CI/CD
```

### Setup and Teardown (Future)

#### `setupFilesAfterEnv: string[]`
**Default:** `[]`

Files to run after the test environment is set up.

```typescript
setupFilesAfterEnv: [
  '<rootDir>/src/setupTests.ts',    // Global test setup
  '<rootDir>/src/setupMatchers.ts'  // Custom matchers
]
```

#### `globalSetup: string`
**Default:** `undefined`

Path to global setup script.

```typescript
globalSetup: '<rootDir>/src/globalSetup.ts'  // Database setup, etc.
```

#### `globalTeardown: string`
**Default:** `undefined`

Path to global teardown script.

```typescript
globalTeardown: '<rootDir>/src/globalTeardown.ts'  // Cleanup resources
```

### Coverage (Future)

#### `collectCoverage: boolean`
**Default:** `false`

Enable coverage collection.

```typescript
collectCoverage: true
```

#### `coverageDirectory: string`
**Default:** `'coverage'`

Directory for coverage reports.

```typescript
coverageDirectory: 'test-coverage'
```

#### `coverageReporters: string[]`
**Default:** `['text']`

Coverage report formats.

```typescript
coverageReporters: ['text', 'lcov', 'html', 'json']
```

#### `collectCoverageFrom: string[]`
**Default:** `['**/*.ts']`

Files to include in coverage.

```typescript
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/*.test.{ts,tsx}',
  '!src/**/__tests__/**'
]
```

#### `coverageThreshold: object`
**Default:** `undefined`

Coverage thresholds that cause tests to fail.

```typescript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  // Per-directory thresholds
  './src/utils/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  }
}
```

### TypeScript and Module Handling

#### `extensionsToTreatAsEsm: string[]`
**Default:** `['.ts']`

File extensions to treat as ES modules.

```typescript
extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts']
```

#### `moduleFileExtensions: string[]`
**Default:** `['ts', 'js', 'json']`

File extensions for module resolution.

```typescript
moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
```

#### `transform: Record<string, string>`
**Default:** `{ '^.+\\.tsx?$': 'tsx' }`

File transformation rules.

```typescript
transform: {
  '^.+\\.tsx?$': 'tsx',           // TypeScript files
  '^.+\\.jsx?$': 'babel-jest',    // JavaScript files
  '^.+\\.css$': 'css-jest'        // CSS files
}
```

### Environment

#### `testEnvironment: string`
**Default:** `'node'`

Test environment to use.

```typescript
testEnvironment: 'node'     // Node.js environment
testEnvironment: 'jsdom'    // Browser-like environment (future)
```

### Mock Settings

#### `clearMocks: boolean`
**Default:** `true`

Clear mock call history between tests.

```typescript
clearMocks: false  // Keep mock history across tests
```

#### `resetMocks: boolean`
**Default:** `false`

Reset mock implementations between tests.

```typescript
resetMocks: true  // Reset all mocks to original state
```

#### `restoreMocks: boolean`
**Default:** `true`

Restore original function implementations automatically.

```typescript
restoreMocks: false  // Don't auto-restore mocks
```

### Path Mapping

#### `moduleNameMapper: Record<string, string>`
**Default:** `{}`

Map module names to file locations (similar to TypeScript path mapping).

```typescript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@components/(.*)$': '<rootDir>/src/components/$1',
  '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  '^@api/(.*)$': '<rootDir>/src/api/$1',
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
}
```

## CLI Options

Command-line options override configuration file settings.

### Basic Options

```bash
# Help and version
tspec --help              # Show help
tspec --version           # Show version

# Configuration
tspec --config custom.config.ts    # Use custom config file
tspec -c custom.config.ts          # Short form
```

### Test Selection

```bash
# Test patterns
tspec --testMatch "**/*.unit.ts"           # Single pattern
tspec --testMatch "**/*.unit.ts" "**/*.integration.ts"  # Multiple patterns

# Positional arguments (test file patterns)
tspec "src/**/*.test.ts"                   # Run specific pattern
tspec "user.test.ts" "auth.test.ts"        # Run specific files
```

### Output Control

```bash
# Verbosity
tspec --verbose           # Detailed output
tspec --silent            # Suppress output

# Combination
tspec --config custom.ts --verbose --testMatch "**/*.unit.ts"
```

### Execution Options

```bash
# Timeout override
tspec --timeout 30000     # 30 second timeout

# Future options
tspec --watch             # Watch mode (planned)
tspec --coverage          # Enable coverage (planned)
```

## Configuration Examples

### Unit Tests Only

```typescript
// unit-tests.config.ts
import { TSpecConfig } from '@tspec/core';

const config: TSpecConfig = {
  testMatch: ['**/*.unit.tspec.ts'],
  timeout: 5000,
  verbose: false
};

export default config;
```

```bash
tspec --config unit-tests.config.ts
```

### Integration Tests

```typescript
// integration-tests.config.ts
import { TSpecConfig } from '@tspec/core';

const config: TSpecConfig = {
  testMatch: ['**/*.integration.tspec.ts'],
  timeout: 30000,  // Longer timeout for integration tests
  verbose: true,   // More detailed output
  setupFilesAfterEnv: ['<rootDir>/src/setupIntegration.ts']
};

export default config;
```

### E2E Tests

```typescript
// e2e-tests.config.ts
import { TSpecConfig } from '@tspec/core';

const config: TSpecConfig = {
  testMatch: ['**/*.e2e.tspec.ts'],
  timeout: 60000,  // Very long timeout for E2E
  testEnvironment: 'jsdom',  // Browser-like environment
  globalSetup: '<rootDir>/src/e2eSetup.ts',
  globalTeardown: '<rootDir>/src/e2eTeardown.ts'
};

export default config;
```

### CI/CD Configuration

```typescript
// ci.config.ts
import { TSpecConfig } from '@tspec/core';

const config: TSpecConfig = {
  testMatch: ['**/*.tspec.ts'],
  timeout: 10000,
  silent: true,    // Quiet output for CI
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

export default config;
```

## Configuration Validation

TSpec validates configuration and provides helpful error messages:

```typescript
// Invalid configuration
const config: TSpecConfig = {
  timeout: -1000,  // Invalid: negative timeout
  testMatch: [],   // Invalid: empty test patterns
};
```

Error output:
```
Configuration Error:
- timeout must be a positive number (got -1000)
- testMatch cannot be empty
```

## Environment Variables

Some configuration can be controlled via environment variables:

```bash
# Override config file
export TSPEC_CONFIG=./custom.config.ts

# Set verbosity
export TSPEC_VERBOSE=true

# Set timeout
export TSPEC_TIMEOUT=30000
```

## Configuration Loading Order

TSpec loads configuration in this order (later overrides earlier):

1. **Default configuration** - Built-in defaults
2. **Configuration file** - `tspec.config.ts` or specified file
3. **Environment variables** - `TSPEC_*` variables
4. **CLI options** - Command-line arguments

## Best Practices

### 1. Multiple Configuration Files

Use different configs for different test types:

```bash
npm scripts in package.json:
{
  "scripts": {
    "test": "tspec",
    "test:unit": "tspec --config unit.config.ts",
    "test:integration": "tspec --config integration.config.ts",
    "test:e2e": "tspec --config e2e.config.ts",
    "test:ci": "tspec --config ci.config.ts"
  }
}
```

### 2. Shared Configuration

```typescript
// shared.config.ts
export const sharedConfig = {
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

// unit.config.ts
import { TSpecConfig } from '@tspec/core';
import { sharedConfig } from './shared.config';

const config: TSpecConfig = {
  ...sharedConfig,
  testMatch: ['**/*.unit.tspec.ts'],
  timeout: 5000
};

export default config;
```

### 3. Dynamic Configuration

```typescript
// dynamic.config.ts
import { TSpecConfig } from '@tspec/core';

const isCI = process.env.CI === 'true';

const config: TSpecConfig = {
  testMatch: ['**/*.tspec.ts'],
  timeout: isCI ? 30000 : 10000,  // Longer timeout in CI
  verbose: !isCI,                 // Verbose locally, quiet in CI
  collectCoverage: isCI           // Coverage in CI only
};

export default config;
```

## Troubleshooting Configuration

### Common Issues

**Tests not found**
- Check `testMatch` patterns
- Verify files aren't in `testIgnore` patterns
- Use `--verbose` to see file discovery

**Configuration not loading**
- Verify config file path and name
- Check for TypeScript compilation errors
- Use `--config` to specify custom path

**Path resolution issues**
- Check `moduleNameMapper` settings
- Verify `rootDir` is correct
- Ensure TypeScript paths match TSpec paths

### Debug Configuration

```bash
# Show effective configuration
tspec --config debug.config.ts --verbose

# Test specific patterns
tspec --testMatch "specific/pattern/**/*.ts" --verbose
```

For more help, see our [FAQ](FAQ.md) or open an issue on GitHub. 