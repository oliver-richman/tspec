# TSpec Examples

This directory contains comprehensive examples demonstrating all TSpec assertions and features.

## Test Files

### `basic.tspec.ts`
Demonstrates basic TypeScript operations with fundamental assertions:
- Math operations (addition, subtraction, multiplication, division)
- String operations (concatenation, methods)
- Array operations (creation, access, methods)
- Object operations (creation, property access, nested objects)

### `enhanced-assertions.tspec.ts`
Comprehensive coverage of all TSpec assertion types:

### `mocking.tspec.ts`
Complete mocking examples demonstrating TSpec's native mocking capabilities:

### `watch-mode.tspec.ts`
Interactive example demonstrating TSpec's watch mode capabilities:
- Smart test selection based on file dependencies
- Interactive command examples (a, f, h, q, Enter)
- Dynamic tests that show instant feedback
- Tips for effective watch mode usage

## Supported Assertions

### Basic Assertions
- `toBe(expected)` - Strict equality comparison (===)
- `toEqual(expected)` - Deep equality comparison for objects/arrays
- `toBeNull()` - Checks if value is null
- `toBeUndefined()` - Checks if value is undefined
- `toBeTruthy()` - Checks if value is truthy
- `toBeFalsy()` - Checks if value is falsy

### Enhanced Assertions
- `toThrow()` - Checks if function throws an error
- `toThrow(message)` - Checks if function throws with specific message
- `toThrow(regex)` - Checks if function throws with message matching regex
- `toContain(item)` - Checks if array contains item or string contains substring
- `toMatch(regex)` - Checks if string matches regex pattern
- `toBeCloseTo(number, precision?)` - Checks floating point numbers with precision

### Async Assertions

#### Resolves (for successful promises)
- `resolves.toBe(expected)` - Promise resolves to expected value
- `resolves.toEqual(expected)` - Promise resolves to deep equal value
- `resolves.toBeNull()` - Promise resolves to null
- `resolves.toBeUndefined()` - Promise resolves to undefined
- `resolves.toBeTruthy()` - Promise resolves to truthy value
- `resolves.toBeFalsy()` - Promise resolves to falsy value
- `resolves.toContain(item)` - Promise resolves to value containing item
- `resolves.toMatch(regex)` - Promise resolves to string matching regex
- `resolves.toBeCloseTo(number)` - Promise resolves to close number

#### Rejects (for rejected promises)
- `rejects.toEqual(expected)` - Promise rejects with expected error
- `rejects.toBeTruthy()` - Promise rejects with truthy value
- `rejects.toBeFalsy()` - Promise rejects with falsy value
- `rejects.toContain(substring)` - Promise rejects with string containing substring
- `rejects.toMatch(regex)` - Promise rejects with string matching regex

## Usage Examples

```typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

describe('Example Tests', () => {
  test('basic assertion', () => {
    expect(2 + 2).toBe(4);
  });

  test('async assertion', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBe('success');
  });

  test('error handling', () => {
    expect(() => {
      throw new Error('Test error');
    }).toThrow('Test error');
  });
});
```

## Running Examples

```bash
# Run all examples
node packages/cli/dist/index.js

# Run specific example
node packages/cli/dist/index.js examples/basic.tspec.ts

# Try watch mode with interactive example
node packages/cli/dist/index.js --watch examples/watch-mode.tspec.ts
```

## Mocking Capabilities

### TSpec Native Mocking Features
- **Function Mocking**: Create mock functions with call tracking
- **Return Value Control**: Set static return values or dynamic implementations
- **Call Verification**: Track function calls, arguments, and return values
- **Error Simulation**: Test error scenarios with controlled exceptions
- **Async Mocking**: Mock Promise-based functions and async operations
- **Object Method Replacement**: Replace object methods with mock implementations
- **Partial Mocking**: Mock only specific methods while preserving others
- **Mock Reset/Restore**: Clean up mocks between tests

### Mocking Patterns Demonstrated
- Basic mock function creation and call tracking
- Mock functions with custom return values and implementations
- Service class dependency injection with mocked dependencies
- Object method mocking and restoration
- Error scenario testing with controlled exceptions
- Async function mocking without delays
- Partial object mocking (mock some methods, keep others)
- Conditional mock behavior based on input parameters
- Comprehensive call verification and history tracking

## Test Coverage

Current examples cover:
- **47 total tests** across all TSpec features
- **6 basic assertions** for fundamental type checking
- **7 enhanced assertions** for advanced comparisons
- **23 async assertions** for Promise-based testing
- **11 mocking examples** demonstrating comprehensive mocking patterns

This ensures comprehensive validation of all TSpec features and serves as living documentation for the framework's capabilities. 