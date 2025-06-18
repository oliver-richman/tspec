import { MockFunction, CallInfo, MockOptions } from './types.js';

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

export function createMockFunction<T extends (...args: any[]) => any>(
  name?: string,
  implementation?: T
): MockFunction<T> {
  const calls: CallInfo[] = [];
  const results: { type: 'return' | 'throw'; value: any }[] = [];
  const instances: any[] = [];
  
  let defaultReturnValue: any = undefined;
  let returnValues: any[] = [];
  let implementations: T[] = [];
  let throwErrors: Error[] = [];
  let currentImplementation: T | undefined = implementation;
  let resolvedValue: any = undefined;
  let rejectedError: any = undefined;
  
  const mockFn = function (this: any, ...args: any[]): any {
    const callInfo: CallInfo = {
      args: [...args],
      timestamp: Date.now()
    };
    
    instances.push(this);
    
    try {
      let result: any;
      
      // Handle one-time throw errors
      if (throwErrors.length > 0) {
        const error = throwErrors.shift();
        callInfo.thrownError = error;
        calls.push(callInfo);
        results.push({ type: 'throw', value: error });
        throw error;
      }
      
      // Handle one-time return values
      if (returnValues.length > 0) {
        result = returnValues.shift();
      }
      // Handle one-time implementations
      else if (implementations.length > 0) {
        const impl = implementations.shift();
        result = impl!.apply(this, args);
      }
      // Handle resolved/rejected promises
      else if (rejectedError !== undefined) {
        result = Promise.reject(rejectedError);
      }
      else if (resolvedValue !== undefined) {
        result = Promise.resolve(resolvedValue);
      }
      // Handle current implementation
      else if (currentImplementation) {
        result = currentImplementation.apply(this, args);
      }
      // Handle default return value
      else {
        result = defaultReturnValue;
      }
      
      callInfo.returnValue = result;
      calls.push(callInfo);
      results.push({ type: 'return', value: result });
      
      return result;
    } catch (error) {
      callInfo.thrownError = error as Error;
      calls.push(callInfo);
      results.push({ type: 'throw', value: error });
      throw error;
    }
  } as MockFunction<T>;
  
  // Mock control methods
  mockFn.mockReturnValue = (value: any): MockFunction<T> => {
    defaultReturnValue = value;
    resolvedValue = undefined;
    rejectedError = undefined;
    return mockFn;
  };
  
  mockFn.mockReturnValueOnce = (value: any): MockFunction<T> => {
    returnValues.push(value);
    return mockFn;
  };
  
  mockFn.mockResolvedValue = (value: any): MockFunction<T> => {
    resolvedValue = value;
    rejectedError = undefined;
    defaultReturnValue = undefined;
    return mockFn;
  };
  
  mockFn.mockRejectedValue = (error: any): MockFunction<T> => {
    rejectedError = error;
    resolvedValue = undefined;
    defaultReturnValue = undefined;
    return mockFn;
  };
  
  mockFn.mockImplementation = (fn: T): MockFunction<T> => {
    currentImplementation = fn;
    defaultReturnValue = undefined;
    resolvedValue = undefined;
    rejectedError = undefined;
    return mockFn;
  };
  
  mockFn.mockImplementationOnce = (fn: T): MockFunction<T> => {
    implementations.push(fn);
    return mockFn;
  };
  
  mockFn.mockThrow = (error: Error): MockFunction<T> => {
    currentImplementation = ((...args: any[]) => { throw error; }) as unknown as T;
    return mockFn;
  };
  
  mockFn.mockThrowOnce = (error: Error): MockFunction<T> => {
    throwErrors.push(error);
    return mockFn;
  };
  
  // Call tracking
  mockFn.mock = {
    calls,
    results,
    instances,
    get lastCall() {
      return calls.length > 0 ? calls[calls.length - 1].args : undefined;
    }
  };
  
  // Assertion helpers
  mockFn.toHaveBeenCalled = (): boolean => {
    return calls.length > 0;
  };
  
  mockFn.toHaveBeenCalledTimes = (times: number): boolean => {
    return calls.length === times;
  };
  
  mockFn.toHaveBeenCalledWith = (...args: any[]): boolean => {
    return calls.some(call => deepEqual(call.args, args));
  };
  
  mockFn.toHaveBeenLastCalledWith = (...args: any[]): boolean => {
    if (calls.length === 0) return false;
    const lastCall = calls[calls.length - 1];
    return deepEqual(lastCall.args, args);
  };
  
  mockFn.toHaveReturnedWith = (value: any): boolean => {
    return results.some(result => 
      result.type === 'return' && deepEqual(result.value, value)
    );
  };
  
  // Reset methods
  mockFn.mockClear = (): void => {
    calls.length = 0;
    results.length = 0;
    instances.length = 0;
  };
  
  mockFn.mockReset = (): void => {
    mockFn.mockClear();
    defaultReturnValue = undefined;
    returnValues.length = 0;
    implementations.length = 0;
    throwErrors.length = 0;
    currentImplementation = undefined;
    resolvedValue = undefined;
    rejectedError = undefined;
  };
  
  mockFn.mockRestore = (): void => {
    mockFn.mockReset();
  };
  
  return mockFn;
}

export function mock<T extends (...args: any[]) => any>(
  implementation?: T,
  options?: MockOptions
): MockFunction<T> {
  return createMockFunction(options?.name, implementation);
}

export function fn<T extends (...args: any[]) => any>(
  implementation?: T
): MockFunction<T> {
  return createMockFunction(undefined, implementation);
} 