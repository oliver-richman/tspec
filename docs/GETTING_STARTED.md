# Getting Started with TSpec

Welcome to TSpec! This guide will walk you through setting up and using TSpec for testing your TypeScript applications.

> **🚧 Development Status:** TSpec is currently in active development. The packages are not yet published to npm. This guide shows both the future end-user experience and the current development setup.

## What is TSpec?

TSpec is a modern, TypeScript-first testing framework that provides:

- **Zero-config setup** - Works out of the box with TypeScript
- **Type-safe assertions** - Full TypeScript IntelliSense support
- **Comprehensive mocking** - Function mocks, spies, and object method replacement
- **Async testing** - Native Promise and async/await support
- **Flexible configuration** - Customize behavior when needed

## Installation

### Prerequisites

- Node.js 20 or higher
- Basic TypeScript knowledge
- A TypeScript project

### For End Users (Recommended)

```bash
# Install TSpec packages in your project
npm install --save-dev @tspec/core @tspec/assert @tspec/mock @tspec/cli

# Or install globally
npm install -g @tspec/cli
```

> **Note:** TSpec packages are not yet published to npm. For now, use the development setup below.

### For Development/Testing TSpec (Current)

```bash
# Clone the TSpec repository
git clone https://github.com/your-org/tspec.git
cd tspec

# Install dependencies
npm install

# Build all packages
npm run build --workspaces
```

### Project Integration

To use TSpec in your existing TypeScript project:

1. **If packages are published:** Install via npm (see above)
2. **If building from source:** Copy the built packages to your project or use npm link
3. Set up your test files with `.tspec.ts` extension

## Your First Test

Let's create a simple test to get familiar with TSpec's syntax.

### 1. Create a Test File

Create `calculator.tspec.ts`:

```typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

// Simple calculator function to test
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

describe('Calculator', () => {
  test('should add two numbers correctly', () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  test('should multiply two numbers correctly', () => {
    const result = multiply(4, 5);
    expect(result).toBe(20);
  });

  test('should handle zero values', () => {
    expect(add(0, 5)).toBe(5);
    expect(multiply(0, 10)).toBe(0);
  });
});
```

### 2. Run Your Tests

**If using published packages (future):**
```bash
# Using locally installed CLI
npx tspec

# Using globally installed CLI
tspec

# With verbose output
tspec --verbose
```

**If building from source (current):**
```bash
# From the TSpec root directory
node packages/cli/dist/index.js

# Or with verbose output
node packages/cli/dist/index.js --verbose
```

You should see output like:
```
Found 1 test file(s)

Tests: 3 passed, 0 failed, 3 total
  ✓ Calculator > should add two numbers correctly (1ms)
  ✓ Calculator > should multiply two numbers correctly (0ms)
  ✓ Calculator > should handle zero values (1ms)
```

## Test Structure

### Organizing Tests with `describe`

Use `describe` to group related tests:

```typescript
describe('User Authentication', () => {
  describe('Login', () => {
    test('should accept valid credentials', () => {
      // test implementation
    });

    test('should reject invalid credentials', () => {
      // test implementation
    });
  });

  describe('Registration', () => {
    test('should create new user account', () => {
      // test implementation
    });
  });
});
```

### Test Functions: `test` vs `it`

Both `test` and `it` define individual test cases. Use whichever reads better:

```typescript
// Using 'test'
test('should validate email format', () => {
  expect(isValidEmail('user@example.com')).toBe(true);
});

// Using 'it' (alias for 'test')
it('should validate email format', () => {
  expect(isValidEmail('user@example.com')).toBe(true);
});
```

## Working with Assertions

### Basic Assertions

```typescript
import { expect } from '@tspec/assert';

test('basic assertions', () => {
  // Equality
  expect(42).toBe(42);                    // Strict equality
  expect({ a: 1 }).toEqual({ a: 1 });    // Deep equality

  // Truthiness
  expect(true).toBeTruthy();
  expect(false).toBeFalsy();
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();
});
```

### Working with Arrays and Strings

```typescript
test('collections and strings', () => {
  // Arrays
  expect([1, 2, 3]).toContain(2);
  expect(['apple', 'banana']).toEqual(['apple', 'banana']);

  // Strings
  expect('hello world').toContain('world');
  expect('user@example.com').toMatch(/\w+@\w+\.\w+/);
});
```

### Number Comparisons

```typescript
test('number comparisons', () => {
  // Exact equality
  expect(100).toBe(100);

  // Floating point comparison
  expect(0.1 + 0.2).toBeCloseTo(0.3);
  expect(Math.PI).toBeCloseTo(3.14, 2); // 2 decimal places
});
```

### Error Testing

```typescript
function divideByZero() {
  throw new Error('Division by zero');
}

test('error handling', () => {
  // Test that function throws
  expect(() => divideByZero()).toThrow();
  
  // Test specific error message
  expect(() => divideByZero()).toThrow('Division by zero');
  
  // Test error pattern
  expect(() => divideByZero()).toThrow(/division/i);
});
```

## Async Testing

### Testing Promises

```typescript
async function fetchUserData(id: string): Promise<{ id: string; name: string }> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'John Doe' });
    }, 100);
  });
}

describe('Async Operations', () => {
  test('should fetch user data', async () => {
    const user = await fetchUserData('123');
    expect(user).toEqual({ id: '123', name: 'John Doe' });
  });

  test('should handle promise resolution', async () => {
    const promise = fetchUserData('456');
    await expect(promise).resolves.toEqual({ id: '456', name: 'John Doe' });
  });
});
```

### Testing Promise Rejections

```typescript
async function failingApiCall(): Promise<string> {
  throw new Error('Network error');
}

test('should handle promise rejection', async () => {
  const promise = failingApiCall();
  await expect(promise).rejects.toThrow('Network error');
});
```

## Mocking and Spying

### Creating Mock Functions

```typescript
import { fn } from '@tspec/mock';

test('mock function basics', () => {
  const mockFn = fn();
  
  // Use the mock
  mockFn('hello', 123);
  mockFn('world');
  
  // Verify calls
  expect(mockFn.toHaveBeenCalled()).toBe(true);
  expect(mockFn.toHaveBeenCalledTimes(2)).toBe(true);
  expect(mockFn.toHaveBeenCalledWith('hello', 123)).toBe(true);
});
```

### Mock Return Values

```typescript
test('mock return values', () => {
  const mockFn = fn()
    .mockReturnValueOnce('first')
    .mockReturnValueOnce('second')
    .mockReturnValue('default');

  expect(mockFn()).toBe('first');
  expect(mockFn()).toBe('second');
  expect(mockFn()).toBe('default');
  expect(mockFn()).toBe('default'); // continues returning default
});
```

### Mock Implementations

```typescript
test('mock implementations', () => {
  const mockFn = fn().mockImplementation((x: number, y: number) => x + y);
  
  expect(mockFn(2, 3)).toBe(5);
  expect(mockFn(10, 20)).toBe(30);
});
```

### Async Mocks

```typescript
test('async mocks', async () => {
  const mockAsyncFn = fn()
    .mockResolvedValueOnce('success')
    .mockRejectedValue(new Error('failed'));

  // First call succeeds
  expect(await mockAsyncFn()).toBe('success');
  
  // Subsequent calls fail
  await expect(mockAsyncFn()).rejects.toThrow('failed');
});
```

### Spying on Objects

```typescript
import { spyOn } from '@tspec/mock';

const userService = {
  getUser: (id: string) => ({ id, name: 'John' }),
  logAccess: (userId: string) => console.log(`User ${userId} accessed`)
};

test('spying on object methods', () => {
  const getUserSpy = spyOn(userService, 'getUser');
  const logSpy = spyOn(userService, 'logAccess');

  // Use the service normally
  const user = userService.getUser('123');
  userService.logAccess('123');

  // Verify spy calls
  expect(getUserSpy.toHaveBeenCalledWith('123')).toBe(true);
  expect(logSpy.toHaveBeenCalledWith('123')).toBe(true);

  // Original functionality still works
  expect(user).toEqual({ id: '123', name: 'John' });

  // Restore original methods
  getUserSpy.mockRestore();
  logSpy.mockRestore();
});
```

## Configuration

### Basic Configuration

Create `tspec.config.ts` in your project root:

```typescript
import { TSpecConfig } from '@tspec/core';

const config: TSpecConfig = {
  // Test file patterns
  testMatch: [
    '**/*.tspec.ts',
    '**/*.test.ts'
  ],
  
  // Files to ignore
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**'
  ],
  
  // Test timeout (5 seconds)
  timeout: 5000,
  
  // Output verbosity
  verbose: false
};

export default config;
```

### CLI Options

Override configuration via command line:

**If using published packages (future):**
```bash
# Use custom config file
tspec --config my-config.ts

# Run with verbose output
tspec --verbose

# Run specific test patterns
tspec --testMatch "**/*.unit.tspec.ts"

# Override timeout
tspec --timeout 10000
```

**If building from source (current):**
```bash
# Use custom config file
node packages/cli/dist/index.js --config my-config.ts

# Run with verbose output
node packages/cli/dist/index.js --verbose

# Run specific test patterns
node packages/cli/dist/index.js --testMatch "**/*.unit.tspec.ts"

# Override timeout
node packages/cli/dist/index.js --timeout 10000
```

## Best Practices

### 1. Descriptive Test Names

```typescript
// ❌ Poor test names
test('test 1', () => { /* ... */ });
test('user test', () => { /* ... */ });

// ✅ Good test names  
test('should return user profile when valid ID is provided', () => { /* ... */ });
test('should throw error when user ID is empty string', () => { /* ... */ });
```

### 2. Test Organization

```typescript
// ✅ Well-organized tests
describe('UserService', () => {
  describe('getUserById', () => {
    test('should return user when ID exists', () => { /* ... */ });
    test('should throw error when ID does not exist', () => { /* ... */ });
    test('should handle invalid ID format', () => { /* ... */ });
  });

  describe('createUser', () => {
    test('should create user with valid data', () => { /* ... */ });
    test('should validate required fields', () => { /* ... */ });
  });
});
```

### 3. Mock Management

```typescript
import { fn } from '@tspec/mock';

describe('Service with Dependencies', () => {
  let mockRepository: any;
  let mockLogger: any;
  let service: UserService;

  // Set up fresh mocks for each test
  beforeEach(() => {
    mockRepository = {
      findById: fn(),
      save: fn()
    };
    mockLogger = {
      info: fn(),
      error: fn()
    };
    service = new UserService(mockRepository, mockLogger);
  });

  test('should log user access', () => {
    mockRepository.findById.mockReturnValue({ id: '123', name: 'John' });
    
    service.getUser('123');
    
    expect(mockLogger.info.toHaveBeenCalledWith('User 123 accessed'));
  });
});
```

### 4. Async Test Patterns

```typescript
// ✅ Proper async testing
test('should handle async operations', async () => {
  const result = await someAsyncFunction();
  expect(result).toBeDefined();
});

// ✅ Promise assertion
test('should resolve with expected value', async () => {
  await expect(someAsyncFunction()).resolves.toBe('expected');
});

// ❌ Avoid: Forgetting await
test('should handle async operations', () => {
  const result = someAsyncFunction(); // Returns Promise, not resolved value
  expect(result).toBe('expected'); // Will fail
});
```

## Common Patterns

### Testing Classes

```typescript
class Calculator {
  private history: number[] = [];

  add(a: number, b: number): number {
    const result = a + b;
    this.history.push(result);
    return result;
  }

  getHistory(): number[] {
    return [...this.history];
  }
}

describe('Calculator Class', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test('should add numbers and track history', () => {
    const result = calculator.add(2, 3);
    
    expect(result).toBe(5);
    expect(calculator.getHistory()).toEqual([5]);
  });
});
```

### Testing with External Dependencies

```typescript
// Mock external module
const mockAxios = {
  get: fn().mockResolvedValue({ data: { id: '123', name: 'John' } })
};

class ApiClient {
  constructor(private http: any) {}
  
  async getUser(id: string) {
    const response = await this.http.get(`/users/${id}`);
    return response.data;
  }
}

test('should fetch user from API', async () => {
  const client = new ApiClient(mockAxios);
  
  const user = await client.getUser('123');
  
  expect(user).toEqual({ id: '123', name: 'John' });
  expect(mockAxios.get.toHaveBeenCalledWith('/users/123'));
});
```

## Next Steps

Now that you have the basics, explore these advanced topics:

1. **[API Reference](API_REFERENCE.md)** - Complete API documentation
2. **[Configuration Guide](CONFIGURATION.md)** - Advanced configuration options
3. **[Examples](../examples/)** - Real-world testing examples
4. **[Best Practices](BEST_PRACTICES.md)** - Advanced testing patterns

## Troubleshooting

### Common Issues

**Tests not found**
- Ensure files end with `.tspec.ts`
- Check `testMatch` patterns in configuration
- Verify files are not in ignored directories

**TypeScript compilation errors**
- Ensure TypeScript is properly configured
- Check import paths are correct
- Verify all packages are built

**Mock not working as expected**
- Check if mock is being called correctly
- Verify mock setup order (setup before use)
- Use `.mockClear()` or `.mockReset()` between tests

**Async tests timing out**
- Add `await` before async function calls
- Increase timeout in test or configuration
- Check for unhandled promise rejections

Need help? Check our [FAQ](FAQ.md) or open an issue on GitHub! 