# TSpec - TypeScript Testing Framework

![TSpec Logo](https://img.shields.io/badge/TSpec-TypeScript%20Testing-blue?style=for-the-badge&logo=typescript)

**TSpec** is a modern, TypeScript-first testing framework designed for seamless testing of TypeScript applications. With zero-config setup, native TypeScript support, and a comprehensive feature set, TSpec makes testing TypeScript code intuitive and powerful.

## 🚀 Quick Start for Users

### Installation

```bash
# Install TSpec in your project
npm install --save-dev @tspec/core @tspec/assert @tspec/mock @tspec/cli

# Or install globally
npm install -g @tspec/cli
```

### Your First Test

Create a test file `math.tspec.ts`:

```typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

describe('Math Operations', () => {
  test('addition works correctly', () => {
    expect(2 + 2).toBe(4);
    expect(10 + 5).toBe(15);
  });

  test('handles floating point precision', () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });
});
```

Run your tests:

```bash
# If installed locally
npx tspec

# If installed globally
tspec
```

> **Note:** TSpec is currently in development. For now, you'll need to build from source (see [Contributing](#-contributing) section).

## 📋 Table of Contents

- [Features](#-features)
- [Installation & Setup](#️-installation--setup)
- [Basic Usage](#-basic-usage)
- [API Reference](#-api-reference)
- [Configuration](#️-configuration)
- [CLI Reference](#️-cli-reference)
- [Examples](#-examples)
- [Architecture](#️-architecture)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 **TypeScript-First Design**
- Native TypeScript support with full type safety
- Zero configuration required for basic usage
- Automatic TypeScript compilation with tsx
- IntelliSense support for all APIs

### 🧪 **Comprehensive Testing APIs**
- **Test Organization**: `describe()`, `test()`, `it()` for structuring tests
- **Rich Assertions**: 16+ assertion methods covering all use cases
- **Async Support**: Full Promise testing with `resolves`/`rejects`
- **Mocking System**: Function mocks, spies, and object method replacement

### ⚡ **Developer Experience**
- **Fast Execution**: Optimized test runner with minimal overhead
- **Clear Output**: Detailed test results with timing information
- **Flexible CLI**: Multiple options for different workflows
- **Configuration**: TypeScript config files with intelligent defaults

### 🔧 **Enterprise Features**
- **File Discovery**: Automatic test file detection with customizable patterns
- **Error Handling**: Comprehensive error reporting and stack traces
- **Exit Codes**: Proper process exit codes for CI/CD integration
- **Verbose Modes**: Detailed logging for debugging test issues

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 20+ 
- TypeScript knowledge
- npm or yarn

### Project Structure

After setup, your project will have:

```
your-project/
├── tests/
│   ├── unit.tspec.ts
│   ├── integration.tspec.ts
│   └── e2e.tspec.ts
├── tspec.config.ts          # Optional configuration
└── package.json
```

### TypeScript Configuration

TSpec works with your existing `tsconfig.json`. For optimal experience:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## 📝 Basic Usage

### Test Structure

```typescript
import { describe, test, it } from '@tspec/core';
import { expect } from '@tspec/assert';

describe('User Service', () => {
  test('creates user successfully', () => {
    const user = { id: 1, name: 'Alice' };
    expect(user.name).toBe('Alice');
    expect(user.id).toBe(1);
  });

  it('validates user data', () => {
    const invalidUser = { name: '' };
    expect(() => validateUser(invalidUser)).toThrow('Name is required');
  });
});
```

### Async Testing

```typescript
describe('API Client', () => {
  test('fetches user data', async () => {
    const userPromise = fetchUser('123');
    await expect(userPromise).resolves.toEqual({
      id: '123',
      name: 'John Doe'
    });
  });

  test('handles network errors', async () => {
    const failedRequest = fetchUser('invalid-id');
    await expect(failedRequest).rejects.toThrow('User not found');
  });
});
```

### Mocking

```typescript
import { fn, spyOn } from '@tspec/mock';

describe('Service with Dependencies', () => {
  test('mocks external dependencies', () => {
    const mockApiCall = fn().mockResolvedValue({ data: 'mocked' });
    const service = new UserService(mockApiCall);
    
    service.getUser('123');
    expect(mockApiCall).toHaveBeenCalledWith('123');
  });

  test('spies on existing methods', () => {
    const service = new UserService();
    const logSpy = spyOn(console, 'log');
    
    service.logUser({ name: 'Alice' });
    expect(logSpy).toHaveBeenCalledWith('User: Alice');
    
    logSpy.mockRestore();
  });
});
```

## 📚 API Reference

### @tspec/core

#### Test Definition

```typescript
describe(name: string, fn: () => void): void
```
Groups related tests together.

```typescript
test(name: string, fn: () => void | Promise<void>, timeout?: number): void
it(name: string, fn: () => void | Promise<void>, timeout?: number): void
```
Defines individual test cases. `it` is an alias for `test`.

#### Test Management

```typescript
getSuites(): TestSuite[]
```
Returns all registered test suites.

```typescript
clearSuites(): void
```
Clears all registered test suites.

#### Test Runner

```typescript
class TestRunner {
  async runTest(suite: string, test: Test): Promise<TestResult>
  async runSuite(suite: TestSuite): Promise<TestResult[]>
  getResults(): TestResult[]
  printResults(): void
}
```

### @tspec/assert

#### Basic Assertions

```typescript
expect(actual).toBe(expected)              // Strict equality (===)
expect(actual).toEqual(expected)           // Deep equality
expect(actual).toBeNull()                  // Checks for null
expect(actual).toBeUndefined()             // Checks for undefined
expect(actual).toBeTruthy()                // Checks for truthy value
expect(actual).toBeFalsy()                 // Checks for falsy value
```

#### Enhanced Assertions

```typescript
expect(fn).toThrow()                       // Function throws any error
expect(fn).toThrow('message')              // Function throws specific message
expect(fn).toThrow(/pattern/)              // Function throws matching pattern
expect(array).toContain(item)              // Array contains item
expect(string).toContain(substring)        // String contains substring
expect(string).toMatch(/pattern/)          // String matches regex
expect(number).toBeCloseTo(expected, precision?) // Floating point comparison
```

#### Async Assertions

```typescript
// Promise resolves to expected value
await expect(promise).resolves.toBe(value)
await expect(promise).resolves.toEqual(object)
await expect(promise).resolves.toContain(item)

// Promise rejects with expected error
await expect(promise).rejects.toEqual(error)
await expect(promise).rejects.toThrow('message')
await expect(promise).rejects.toMatch(/pattern/)
```

### @tspec/mock

#### Mock Functions

```typescript
import { fn, mock } from '@tspec/mock';

const mockFn = fn()                        // Create basic mock
const mockFn = fn(implementation)          // Create mock with implementation
const mockFn = mock(implementation, options) // Create named mock
```

#### Mock Control

```typescript
mockFn.mockReturnValue(value)              // Set return value
mockFn.mockReturnValueOnce(value)          // Set one-time return value
mockFn.mockImplementation(fn)              // Set implementation
mockFn.mockImplementationOnce(fn)          // Set one-time implementation
mockFn.mockResolvedValue(value)            // Return resolved promise
mockFn.mockRejectedValue(error)            // Return rejected promise
mockFn.mockThrow(error)                    // Throw error
mockFn.mockThrowOnce(error)                // Throw error once
```

#### Mock Assertions

```typescript
mockFn.toHaveBeenCalled()                  // Was called at least once
mockFn.toHaveBeenCalledTimes(count)        // Called exact number of times
mockFn.toHaveBeenCalledWith(...args)       // Called with specific arguments
mockFn.toHaveBeenLastCalledWith(...args)   // Last call had specific arguments
mockFn.toHaveReturnedWith(value)           // Returned specific value
```

#### Mock Utilities

```typescript
mockFn.mockClear()                         // Clear call history
mockFn.mockReset()                         // Reset to initial state
mockFn.mockRestore()                       // Restore original function
```

#### Spying

```typescript
import { spyOn } from '@tspec/mock';

const spy = spyOn(object, 'methodName')    // Spy on method
spy.mockRestore()                          // Restore original method
```

## ⚙️ Configuration

### Configuration File

Create `tspec.config.ts` in your project root:

```typescript
import { TSpecConfig } from '@tspec/core';

const config: TSpecConfig = {
  // Test discovery
  testMatch: [
    '**/*.tspec.ts',
    '**/*.test.ts',
    '**/*.spec.ts'
  ],
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**'
  ],

  // Execution
  timeout: 10000,
  parallel: false,
  maxWorkers: 1,

  // Output
  verbose: false,
  silent: false,

  // Setup (future)
  setupFilesAfterEnv: [],
  globalSetup: undefined,
  globalTeardown: undefined,

  // Coverage (future)
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

  // TypeScript
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Environment
  testEnvironment: 'node',

  // Mocks
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true
};

export default config;
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `testMatch` | `string[]` | `['**/*.tspec.ts']` | Patterns for test files |
| `testIgnore` | `string[]` | `['**/node_modules/**', '**/dist/**']` | Patterns to ignore |
| `timeout` | `number` | `5000` | Default test timeout (ms) |
| `verbose` | `boolean` | `false` | Enable detailed output |
| `silent` | `boolean` | `false` | Suppress non-error output |
| `parallel` | `boolean` | `false` | Run tests in parallel |
| `maxWorkers` | `number` | `1` | Maximum worker processes |

## 🖥️ CLI Reference

### Basic Commands

```bash
# Run all tests
tspec

# Show help
tspec --help
tspec -h

# Show version
tspec --version
tspec -v
```

### Options

```bash
# Configuration
tspec --config custom.config.ts       # Use custom config file
tspec -c custom.config.ts

# Output control
tspec --verbose                        # Detailed output
tspec --silent                         # Errors only

# Test selection
tspec --testMatch "**/*.unit.ts"      # Custom test pattern
tspec --testMatch "src/**/*.test.ts"   # Multiple patterns
tspec "**/user*.tspec.ts"             # Positional patterns

# Execution
tspec --timeout 30000                  # Override timeout

# Future features
tspec --watch                          # Watch mode (planned)
```

### Examples

```bash
# Run tests with detailed output
tspec --verbose

# Run only unit tests
tspec --testMatch "**/*.unit.tspec.ts"

# Run tests silently (CI mode)
tspec --silent

# Use custom configuration
tspec --config test-config.ts

# Run specific test files
tspec "user.tspec.ts" "auth.tspec.ts"

# Override timeout for slow tests
tspec --timeout 60000
```

### Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed or error occurred

## 💡 Examples

### Testing a REST API

```typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';
import { fn } from '@tspec/mock';

interface User {
  id: string;
  name: string;
  email: string;
}

class ApiClient {
  constructor(private baseUrl: string) {}
  
  async getUser(id: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/${id}`);
    return response.json();
  }
}

describe('API Client', () => {
  test('fetches user successfully', async () => {
    const mockFetch = fn().mockResolvedValue({
      json: () => Promise.resolve({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      })
    });
    
    global.fetch = mockFetch;
    
    const client = new ApiClient('https://api.example.com');
    const user = await client.getUser('123');
    
    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users/123');
  });
});
```

### Testing Database Operations (Future)

```typescript
import { describe, test, beforeEach, afterEach } from '@tspec/core';
import { expect } from '@tspec/assert';
import { createTestDatabase } from '@tspec/database'; // Future package

describe('User Repository', () => {
  let db: TestDatabase;
  let userRepo: UserRepository;

  beforeEach(async () => {
    db = await createTestDatabase();
    userRepo = new UserRepository(db);
  });

  afterEach(async () => {
    await db.cleanup();
  });

  test('creates and retrieves user', async () => {
    const userData = { name: 'Bob', email: 'bob@example.com' };
    const user = await userRepo.create(userData);
    
    expect(user.id).toBeDefined();
    expect(user.name).toBe('Bob');
    
    const retrieved = await userRepo.findById(user.id);
    expect(retrieved).toEqual(user);
  });
});
```

## 🏗️ Architecture

### Package Structure

TSpec is built as a monorepo with focused packages:

```
tspec/
├── packages/
│   ├── core/          # Test runner and framework core
│   ├── assert/        # Assertion library
│   ├── mock/          # Mocking utilities  
│   ├── cli/           # Command-line interface
│   └── integrations/  # Future: Framework integrations
├── examples/          # Example test files
└── docs/             # Additional documentation
```

### Core Concepts

#### Test Discovery
- Uses glob patterns to find test files
- Supports multiple file extensions
- Configurable ignore patterns
- Automatic TypeScript compilation

#### Test Execution
- Sequential execution by default
- Parallel execution (planned)
- Isolated test environments
- Proper error handling and reporting

#### Type Safety
- Full TypeScript integration
- Type-safe assertions
- Generic mock functions
- IntelliSense support

### Design Principles

1. **TypeScript-First**: Built for TypeScript, works with JavaScript
2. **Zero Config**: Works out of the box, configurable when needed
3. **Developer Experience**: Clear APIs, helpful error messages
4. **Performance**: Fast execution, minimal overhead
5. **Extensibility**: Plugin system for future enhancements

## 🎯 Roadmap

### Phase 1: Core Framework ✅
- [x] Basic test runner
- [x] Assertion library  
- [x] Mocking system
- [x] Configuration system
- [x] CLI interface

### Phase 2: Enhanced Features (In Progress)
- [ ] Watch mode
- [ ] Parallel execution
- [ ] Coverage reporting
- [ ] Snapshot testing

### Phase 3: Integrations (Planned)
- [ ] React testing utilities
- [ ] Database testing helpers
- [ ] HTTP request mocking
- [ ] VS Code extension

### Phase 4: Enterprise Features (Future)
- [ ] Test reporting formats
- [ ] CI/CD integrations
- [ ] Performance testing
- [ ] Visual regression testing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup (Contributors Only)

If you want to contribute to TSpec development:

```bash
# Clone the repository
git clone https://github.com/your-org/tspec.git
cd tspec

# Install dependencies
npm install

# Build all packages
npm run build --workspaces

# Run tests
node packages/cli/dist/index.js

# Run tests with verbose output
node packages/cli/dist/index.js --verbose
```

### Package Development

```bash
# Build specific package
npm run build --workspace=packages/core

# Watch mode for development
npm run dev --workspace=packages/core
```

### Current Development Status

TSpec is currently in active development. To use it now:

1. Clone and build from source (instructions above)
2. The framework is fully functional with 47 passing tests
3. Ready for basic TypeScript testing and mocking
4. Package publication coming soon

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

TSpec is inspired by the best parts of Jest, Vitest, and other testing frameworks, while focusing specifically on TypeScript developer experience.

---

**TSpec** - Making TypeScript testing simple, powerful, and enjoyable.

For more information, visit our [documentation site](https://tspec.dev) or join our [Discord community](https://discord.gg/tspec).

## 📖 Documentation

- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Step-by-step introduction to TSpec
- **[API Reference](docs/API_REFERENCE.md)** - Complete API documentation for all packages
- **[Configuration Guide](docs/CONFIGURATION.md)** - Advanced configuration options
- **[Examples](examples/)** - Real-world testing examples and patterns
- **[Migration Guide](docs/MIGRATION.md)** - Migrating from other testing frameworks
- **[FAQ](docs/FAQ.md)** - Frequently asked questions and troubleshooting

## 🌟 Current Status

TSpec is currently in active development with the following implemented features:

### ✅ **Completed Features**

#### **Core Testing Framework**
- Test definition with `describe()`, `test()`, and `it()`
- TypeScript file discovery with `.tspec.ts` extension
- Automatic TypeScript compilation using tsx
- Test execution with proper error handling and timing
- Test result reporting with pass/fail counts

#### **Assertion Library (@tspec/assert)**
- **Basic Assertions**: `toBe()`, `toEqual()`, `toBeNull()`, `toBeUndefined()`, `toBeTruthy()`, `toBeFalsy()`
- **Enhanced Assertions**: `toThrow()`, `toContain()`, `toMatch()`, `toBeCloseTo()`
- **Async Assertions**: Full `resolves` and `rejects` support with all assertion methods
- **Type Safety**: Full TypeScript integration with proper generic typing

#### **Mocking System (@tspec/mock)**
- **Mock Functions**: Create mock functions with `fn()` and `mock()`
- **Call Tracking**: Track calls with arguments, return values, and timestamps
- **Return Control**: `mockReturnValue()`, `mockReturnValueOnce()`, `mockImplementation()`
- **Async Mocking**: `mockResolvedValue()`, `mockRejectedValue()`, `mockThrow()`
- **Spy Functions**: `spyOn()` for wrapping existing object methods
- **Mock Assertions**: `toHaveBeenCalled()`, `toHaveBeenCalledWith()`, etc.
- **Mock Management**: `mockClear()`, `mockReset()`, `mockRestore()`

#### **Configuration System**
- **TypeScript Config Files**: Support for `tspec.config.ts` with full typing
- **File Discovery**: Configurable test patterns with `testMatch` and `testIgnore`
- **CLI Integration**: Command-line options override config file settings
- **Error Handling**: Comprehensive config validation and error reporting

#### **CLI Interface (@tspec/cli)**
- **Basic Commands**: `--help`, `--version`, test execution
- **Configuration**: `--config` for custom config files
- **Output Control**: `--verbose` and `--silent` modes
- **Test Selection**: `--testMatch` for filtering test files
- **Execution Options**: `--timeout` for test timeout override
- **Exit Codes**: Proper exit codes for CI/CD integration

### 📊 **Test Coverage**

Current test suite includes **47 total tests** covering:
- **36 core framework tests** (basic functionality)
- **11 mocking examples** (comprehensive mocking scenarios)

All tests are passing and demonstrate:
- Basic math operations and string manipulation
- Object and array comparisons
- Error handling and async operations
- Mock function creation and call tracking
- Service mocking and dependency injection
- Spy functionality and method restoration

### 🔄 **Known Limitations**

- **Parallel Execution**: Currently sequential only (parallel planned)
- **Watch Mode**: Not yet implemented (coming soon)
- **Coverage Reporting**: Infrastructure in place, implementation pending
- **Setup/Teardown Hooks**: `beforeEach`, `afterEach` not yet implemented
- **Test Filtering**: Basic pattern matching only (advanced filtering planned)

### 🚀 **Next Steps**

The framework is ready for:
1. **Basic TypeScript testing** - Full feature set available
2. **Mocking complex dependencies** - Comprehensive mocking system
3. **CI/CD Integration** - Proper exit codes and error reporting
4. **Configuration customization** - Flexible config system

For production use, we recommend waiting for the completion of parallel execution and watch mode features, currently in development. 