export interface Expectation<T> {
  toBe(expected: T): void;
  toEqual(expected: T): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toThrow(expectedError?: string | RegExp | Error): void;
  toContain(expected: any): void;
  toMatch(expected: RegExp): void;
  toBeCloseTo(expected: number, precision?: number): void;
  resolves: AsyncExpectation<T>;
  rejects: AsyncExpectation<T>;
}

export interface AsyncExpectation<T> {
  toBe(expected: any): Promise<void>;
  toEqual(expected: any): Promise<void>;
  toBeNull(): Promise<void>;
  toBeUndefined(): Promise<void>;
  toBeTruthy(): Promise<void>;
  toBeFalsy(): Promise<void>;
  toThrow(expectedError?: string | RegExp | Error): Promise<void>;
  toContain(expected: any): Promise<void>;
  toMatch(expected: RegExp): Promise<void>;
  toBeCloseTo(expected: number, precision?: number): Promise<void>;
}

export function expect<T>(actual: T): Expectation<T> {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    toEqual(expected: T) {
      if (!deepEqual(actual, expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected ${actual} to be null`);
      }
    },
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(`Expected ${actual} to be undefined`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected ${actual} to be truthy`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected ${actual} to be falsy`);
      }
    },
    toThrow(expectedError?: string | RegExp | Error) {
      if (typeof actual !== 'function') {
        throw new Error(`Expected ${actual} to be a function`);
      }
      
      let error: Error | null = null;
      try {
        (actual as Function)();
      } catch (e) {
        error = e as Error;
      }
      
      if (!error) {
        throw new Error(`Expected function to throw an error`);
      }
      
      if (expectedError) {
        if (typeof expectedError === 'string') {
          if (!error.message.includes(expectedError)) {
            throw new Error(`Expected error message to contain "${expectedError}", but got "${error.message}"`);
          }
        } else if (expectedError instanceof RegExp) {
          if (!expectedError.test(error.message)) {
            throw new Error(`Expected error message to match ${expectedError}, but got "${error.message}"`);
          }
        } else if (expectedError instanceof Error) {
          if (error.constructor !== expectedError.constructor) {
            throw new Error(`Expected error to be instance of ${expectedError.constructor.name}, but got ${error.constructor.name}`);
          }
        }
      }
    },
    toContain(expected: any) {
      if (typeof actual === 'string') {
        if (!actual.includes(expected)) {
          throw new Error(`Expected "${actual}" to contain "${expected}"`);
        }
      } else if (Array.isArray(actual)) {
        if (!actual.includes(expected)) {
          throw new Error(`Expected array [${actual.join(', ')}] to contain ${expected}`);
        }
      } else {
        throw new Error(`Expected ${actual} to be a string or array`);
      }
    },
    toMatch(expected: RegExp) {
      if (typeof actual !== 'string') {
        throw new Error(`Expected ${actual} to be a string`);
      }
      
      if (!expected.test(actual)) {
        throw new Error(`Expected "${actual}" to match ${expected}`);
      }
    },
    toBeCloseTo(expected: number, precision: number = 2) {
      if (typeof actual !== 'number' || typeof expected !== 'number') {
        throw new Error(`Expected both values to be numbers`);
      }
      
      const pass = Math.abs(actual - expected) < Math.pow(10, -precision) / 2;
      if (!pass) {
        throw new Error(`Expected ${actual} to be close to ${expected} (precision: ${precision})`);
      }
    },
    resolves: createAsyncExpectation(actual, 'resolves'),
    rejects: createAsyncExpectation(actual, 'rejects')
  };
}

function createAsyncExpectation<T>(actual: T, mode: 'resolves' | 'rejects'): AsyncExpectation<T> {
  return {
    async toBe(expected: any): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (result !== expected) {
        throw new Error(`Expected ${result} to be ${expected}`);
      }
    },
    async toEqual(expected: any): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (!deepEqual(result, expected)) {
        throw new Error(`Expected ${JSON.stringify(result)} to equal ${JSON.stringify(expected)}`);
      }
    },
    async toBeNull(): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (result !== null) {
        throw new Error(`Expected ${result} to be null`);
      }
    },
    async toBeUndefined(): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (result !== undefined) {
        throw new Error(`Expected ${result} to be undefined`);
      }
    },
    async toBeTruthy(): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (!result) {
        throw new Error(`Expected ${result} to be truthy`);
      }
    },
    async toBeFalsy(): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (result) {
        throw new Error(`Expected ${result} to be falsy`);
      }
    },
    async toThrow(expectedError?: string | RegExp | Error): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (typeof result !== 'function') {
        throw new Error(`Expected ${result} to be a function`);
      }
      
      let error: Error | null = null;
      try {
        await (result as Function)();
      } catch (e) {
        error = e as Error;
      }
      
      if (!error) {
        throw new Error(`Expected function to throw an error`);
      }
      
      if (expectedError) {
        if (typeof expectedError === 'string') {
          if (!error.message.includes(expectedError)) {
            throw new Error(`Expected error message to contain "${expectedError}", but got "${error.message}"`);
          }
        } else if (expectedError instanceof RegExp) {
          if (!expectedError.test(error.message)) {
            throw new Error(`Expected error message to match ${expectedError}, but got "${error.message}"`);
          }
        } else if (expectedError instanceof Error) {
          if (error.constructor !== expectedError.constructor) {
            throw new Error(`Expected error to be instance of ${expectedError.constructor.name}, but got ${error.constructor.name}`);
          }
        }
      }
    },
    async toContain(expected: any): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (typeof result === 'string') {
        if (!result.includes(expected)) {
          throw new Error(`Expected "${result}" to contain "${expected}"`);
        }
      } else if (Array.isArray(result)) {
        if (!result.includes(expected)) {
          throw new Error(`Expected array [${result.join(', ')}] to contain ${expected}`);
        }
      } else {
        throw new Error(`Expected ${result} to be a string or array`);
      }
    },
    async toMatch(expected: RegExp): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (typeof result !== 'string') {
        throw new Error(`Expected ${result} to be a string`);
      }
      
      if (!expected.test(result)) {
        throw new Error(`Expected "${result}" to match ${expected}`);
      }
    },
    async toBeCloseTo(expected: number, precision: number = 2): Promise<void> {
      const result = await handlePromise(actual, mode);
      if (typeof result !== 'number' || typeof expected !== 'number') {
        throw new Error(`Expected both values to be numbers`);
      }
      
      const pass = Math.abs(result - expected) < Math.pow(10, -precision) / 2;
      if (!pass) {
        throw new Error(`Expected ${result} to be close to ${expected} (precision: ${precision})`);
      }
    }
  };
}

async function handlePromise<T>(actual: T, mode: 'resolves' | 'rejects'): Promise<any> {
  if (!(actual instanceof Promise)) {
    throw new Error(`Expected ${actual} to be a Promise`);
  }
  
  try {
    const result = await actual;
    if (mode === 'rejects') {
      throw new Error(`Expected promise to reject, but it resolved with ${result}`);
    }
    return result;
  } catch (error) {
    if (mode === 'resolves') {
      throw new Error(`Expected promise to resolve, but it rejected with ${error}`);
    }
    return error;
  }
}

function deepEqual(a: any, b: any): boolean {
  // Simple deep equality - enhance later
  return JSON.stringify(a) === JSON.stringify(b);
} 