# TSpec API Reference

This document provides comprehensive API documentation for all TSpec packages.

## @tspec/core

### Test Definition Functions

#### `describe(name: string, fn: () => void): void`

Groups related tests together in a test suite.

**Parameters:**
- `name` - A descriptive name for the test suite
- `fn` - A function containing the test definitions

**Example:**
```typescript
describe('User Service', () => {
  test('should create user', () => {
    // test implementation
  });
});
```

#### `test(name: string, fn: () => void | Promise<void>, timeout?: number): void`

Defines an individual test case.

**Parameters:**
- `name` - A descriptive name for the test
- `fn` - The test function (can be async)
- `timeout` - Optional timeout in milliseconds

**Example:**
```typescript
test('should calculate sum correctly', () => {
  expect(add(2, 3)).toBe(5);
});

test('should handle async operations', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
}, 10000); // 10 second timeout
```

#### `it(name: string, fn: () => void | Promise<void>, timeout?: number): void`

Alias for `test()`. Provides alternative syntax for test definition.

### Test Management

#### `getSuites(): TestSuite[]`

Returns all currently registered test suites.

**Returns:** Array of `TestSuite` objects

#### `clearSuites(): void`

Clears all registered test suites. Useful for test isolation.

### TestRunner Class

#### `new TestRunner()`

Creates a new test runner instance.

#### `async runTest(suite: string, test: Test): Promise<TestResult>`

Executes a single test.

**Parameters:**
- `suite` - Name of the test suite
- `test` - Test object to execute

**Returns:** Promise resolving to `TestResult`

#### `async runSuite(suite: TestSuite): Promise<TestResult[]>`

Executes all tests in a suite.

**Parameters:**
- `suite` - TestSuite object to execute

**Returns:** Promise resolving to array of `TestResult`

#### `getResults(): TestResult[]`

Returns all test results from the current runner.

#### `printResults(): void`

Prints formatted test results to console.

### Configuration

#### `loadConfig(configPath?: string): Promise<TSpecConfig>`

Loads configuration from file or returns default config.

**Parameters:**
- `configPath` - Optional path to config file

**Returns:** Promise resolving to `TSpecConfig`

#### `validateConfig(config: TSpecConfig): { isValid: boolean; errors: string[] }`

Validates a configuration object.

**Parameters:**
- `config` - Configuration to validate

**Returns:** Validation result with errors if any

### File Discovery

#### `findTestFiles(config?: TSpecConfig): Promise<string[]>`

Discovers test files based on configuration patterns.

**Parameters:**
- `config` - Optional configuration object

**Returns:** Promise resolving to array of file paths

## @tspec/assert

### Basic Assertions

#### `expect(actual: T): Expectation<T>`

Creates an expectation object for the given value.

**Parameters:**
- `actual` - The value to test

**Returns:** `Expectation<T>` object with assertion methods

### Expectation Methods

#### `.toBe(expected: T): void`

Asserts strict equality using `===`.

```typescript
expect(5).toBe(5);
expect('hello').toBe('hello');
expect(obj).toBe(obj); // same reference
```

#### `.toEqual(expected: T): void`

Asserts deep equality for objects and arrays.

```typescript
expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
expect([1, 2, 3]).toEqual([1, 2, 3]);
```

#### `.toBeNull(): void`

Asserts that value is `null`.

```typescript
expect(null).toBeNull();
expect(undefined).not.toBeNull(); // would fail
```

#### `.toBeUndefined(): void`

Asserts that value is `undefined`.

```typescript
expect(undefined).toBeUndefined();
let x;
expect(x).toBeUndefined();
```

#### `.toBeTruthy(): void`

Asserts that value is truthy.

```typescript
expect(true).toBeTruthy();
expect(1).toBeTruthy();
expect('hello').toBeTruthy();
expect([]).toBeTruthy();
```

#### `.toBeFalsy(): void`

Asserts that value is falsy.

```typescript
expect(false).toBeFalsy();
expect(0).toBeFalsy();
expect('').toBeFalsy();
expect(null).toBeFalsy();
```

### Enhanced Assertions

#### `.toThrow(): void`
#### `.toThrow(expected: string | RegExp | Error): void`

Asserts that a function throws an error.

```typescript
expect(() => { throw new Error('test'); }).toThrow();
expect(() => { throw new Error('specific'); }).toThrow('specific');
expect(() => { throw new Error('pattern123'); }).toThrow(/pattern\d+/);
```

#### `.toContain(expected: any): void`

Asserts that an array contains an item or string contains substring.

```typescript
expect([1, 2, 3]).toContain(2);
expect('hello world').toContain('world');
```

#### `.toMatch(expected: RegExp): void`

Asserts that a string matches a regular expression.

```typescript
expect('hello123').toMatch(/hello\d+/);
expect('test@example.com').toMatch(/\w+@\w+\.\w+/);
```

#### `.toBeCloseTo(expected: number, precision?: number): void`

Asserts that numbers are close (useful for floating point).

**Parameters:**
- `expected` - Expected number
- `precision` - Number of decimal places (default: 2)

```typescript
expect(0.1 + 0.2).toBeCloseTo(0.3);
expect(Math.PI).toBeCloseTo(3.14, 2);
```

### Async Assertions

#### `.resolves: AsyncExpectation<T>`

For testing resolved promises.

```typescript
await expect(Promise.resolve('success')).resolves.toBe('success');
await expect(fetchUser('123')).resolves.toEqual({ id: '123', name: 'John' });
```

#### `.rejects: AsyncExpectation<T>`

For testing rejected promises.

```typescript
await expect(Promise.reject(new Error('failed'))).rejects.toThrow('failed');
await expect(invalidApiCall()).rejects.toMatch(/network error/);
```

## @tspec/mock

### Mock Creation

#### `fn<T extends (...args: any[]) => any>(implementation?: T): MockFunction<T>`

Creates a mock function.

**Parameters:**
- `implementation` - Optional default implementation

**Returns:** `MockFunction<T>`

```typescript
const mockFn = fn();
const mockWithImpl = fn((x: number) => x * 2);
```

#### `mock<T extends (...args: any[]) => any>(implementation?: T, options?: MockOptions): MockFunction<T>`

Creates a named mock function.

**Parameters:**
- `implementation` - Optional default implementation
- `options` - Mock options including name

```typescript
const mockFn = mock(undefined, { name: 'apiCall' });
```

### Mock Control Methods

#### `.mockReturnValue(value: ReturnType<T>): MockFunction<T>`

Sets the return value for all calls.

```typescript
const mockFn = fn().mockReturnValue('hello');
console.log(mockFn()); // 'hello'
```

#### `.mockReturnValueOnce(value: ReturnType<T>): MockFunction<T>`

Sets the return value for the next call only.

```typescript
const mockFn = fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

console.log(mockFn()); // 'first'
console.log(mockFn()); // 'second'  
console.log(mockFn()); // 'default'
```

#### `.mockImplementation(fn: T): MockFunction<T>`

Sets the implementation for all calls.

```typescript
const mockFn = fn().mockImplementation((x: number, y: number) => x + y);
console.log(mockFn(2, 3)); // 5
```

#### `.mockImplementationOnce(fn: T): MockFunction<T>`

Sets the implementation for the next call only.

```typescript
const mockFn = fn()
  .mockImplementationOnce((x: number) => x * 2)
  .mockImplementation((x: number) => x * 3);

console.log(mockFn(5)); // 10 (first call)
console.log(mockFn(5)); // 15 (subsequent calls)
```

#### `.mockResolvedValue(value: Awaited<ReturnType<T>>): MockFunction<T>`

Returns a resolved promise with the given value.

```typescript
const mockAsyncFn = fn().mockResolvedValue('success');
const result = await mockAsyncFn(); // 'success'
```

#### `.mockRejectedValue(error: any): MockFunction<T>`

Returns a rejected promise with the given error.

```typescript
const mockAsyncFn = fn().mockRejectedValue(new Error('failed'));
try {
  await mockAsyncFn();
} catch (e) {
  console.log(e.message); // 'failed'
}
```

#### `.mockThrow(error: Error): MockFunction<T>`

Makes the function throw an error on all calls.

```typescript
const mockFn = fn().mockThrow(new Error('always fails'));
expect(() => mockFn()).toThrow('always fails');
```

#### `.mockThrowOnce(error: Error): MockFunction<T>`

Makes the function throw an error on the next call only.

### Mock Assertion Methods

#### `.toHaveBeenCalled(): boolean`

Checks if the mock was called at least once.

```typescript
const mockFn = fn();
mockFn();
expect(mockFn.toHaveBeenCalled()).toBe(true);
```

#### `.toHaveBeenCalledTimes(times: number): boolean`

Checks if the mock was called exactly the specified number of times.

```typescript
const mockFn = fn();
mockFn();
mockFn();
expect(mockFn.toHaveBeenCalledTimes(2)).toBe(true);
```

#### `.toHaveBeenCalledWith(...args: Parameters<T>): boolean`

Checks if the mock was called with specific arguments.

```typescript
const mockFn = fn();
mockFn('hello', 123);
expect(mockFn.toHaveBeenCalledWith('hello', 123)).toBe(true);
```

#### `.toHaveBeenLastCalledWith(...args: Parameters<T>): boolean`

Checks if the last call was made with specific arguments.

```typescript
const mockFn = fn();
mockFn('first');
mockFn('last');
expect(mockFn.toHaveBeenLastCalledWith('last')).toBe(true);
```

#### `.toHaveReturnedWith(value: ReturnType<T>): boolean`

Checks if the mock returned a specific value.

```typescript
const mockFn = fn().mockReturnValue('hello');
mockFn();
expect(mockFn.toHaveReturnedWith('hello')).toBe(true);
```

### Mock Utility Methods

#### `.mockClear(): void`

Clears all call history but keeps the implementation.

```typescript
const mockFn = fn().mockReturnValue('test');
mockFn();
mockFn();
expect(mockFn.toHaveBeenCalledTimes(2)).toBe(true);

mockFn.mockClear();
expect(mockFn.toHaveBeenCalledTimes(0)).toBe(true);
console.log(mockFn()); // Still returns 'test'
```

#### `.mockReset(): void`

Clears call history and removes all implementations.

```typescript
const mockFn = fn().mockReturnValue('test');
mockFn();

mockFn.mockReset();
expect(mockFn.toHaveBeenCalledTimes(0)).toBe(true);
console.log(mockFn()); // undefined (no implementation)
```

#### `.mockRestore(): void`

For spies, restores the original function.

### Spying

#### `spyOn<T extends object, K extends keyof T>(object: T, methodName: K): SpyFunction<any>`

Creates a spy on an existing object method.

**Parameters:**
- `object` - The object to spy on
- `methodName` - The method name to spy on

**Returns:** `SpyFunction` that wraps the original method

```typescript
const user = {
  getName: () => 'John',
  setName: (name: string) => { this.name = name; }
};

const getSpy = spyOn(user, 'getName');
user.getName(); // Still works normally
expect(getSpy.toHaveBeenCalled()).toBe(true);

// Mock the implementation
getSpy.mockReturnValue('Jane');
console.log(user.getName()); // 'Jane'

// Restore original
getSpy.mockRestore();
console.log(user.getName()); // 'John'
```

### Mock Properties

#### `.mock: { calls: CallInfo[]; results: any[]; instances: any[]; lastCall?: any[] }`

Provides access to call information:

- `calls` - Array of all calls with arguments and metadata
- `results` - Array of return values and thrown errors
- `instances` - Array of `this` contexts for each call
- `lastCall` - Arguments of the most recent call

```typescript
const mockFn = fn();
mockFn('arg1', 'arg2');
mockFn('arg3');

console.log(mockFn.mock.calls); 
// [
//   { args: ['arg1', 'arg2'], timestamp: 1234567890 },
//   { args: ['arg3'], timestamp: 1234567891 }
// ]

console.log(mockFn.mock.lastCall); // ['arg3']
```

## Type Definitions

### Core Types

```typescript
interface Test {
  name: string;
  fn: () => void | Promise<void>;
  timeout?: number;
}

interface TestSuite {
  name: string;
  tests: Test[];
}

interface TestResult {
  suite: string;
  test: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: Error;
}

interface TSpecConfig {
  testMatch?: string[];
  testIgnore?: string[];
  timeout?: number;
  parallel?: boolean;
  maxWorkers?: number;
  verbose?: boolean;
  silent?: boolean;
  // ... other config options
}
```

### Mock Types

```typescript
interface CallInfo {
  args: any[];
  returnValue?: any;
  thrownError?: Error;
  timestamp: number;
}

interface MockFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  
  // Control methods
  mockReturnValue(value: ReturnType<T>): MockFunction<T>;
  mockImplementation(fn: T): MockFunction<T>;
  // ... other control methods
  
  // Assertion methods
  toHaveBeenCalled(): boolean;
  toHaveBeenCalledWith(...args: Parameters<T>): boolean;
  // ... other assertion methods
  
  // Properties
  mock: {
    calls: CallInfo[];
    results: { type: 'return' | 'throw'; value: any }[];
    instances: any[];
    lastCall?: any[];
  };
}
```

This comprehensive API reference covers all public methods and properties available in TSpec packages. For examples and usage patterns, see the main README.md and examples directory. 