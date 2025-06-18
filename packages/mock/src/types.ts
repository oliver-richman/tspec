// Core mock types and interfaces

export interface CallInfo {
  args: any[];
  returnValue?: any;
  thrownError?: Error;
  timestamp: number;
}

export interface MockFunction<T extends (...args: any[]) => any = (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  
  // Mock control methods
  mockReturnValue(value: ReturnType<T>): MockFunction<T>;
  mockReturnValueOnce(value: ReturnType<T>): MockFunction<T>;
  mockResolvedValue(value: Awaited<ReturnType<T>>): MockFunction<T>;
  mockRejectedValue(error: any): MockFunction<T>;
  mockImplementation(fn: T): MockFunction<T>;
  mockImplementationOnce(fn: T): MockFunction<T>;
  mockThrow(error: Error): MockFunction<T>;
  mockThrowOnce(error: Error): MockFunction<T>;
  
  // Call tracking
  mock: {
    calls: CallInfo[];
    results: { type: 'return' | 'throw'; value: any }[];
    instances: any[];
    lastCall?: any[];
  };
  
  // Assertion helpers
  toHaveBeenCalled(): boolean;
  toHaveBeenCalledTimes(times: number): boolean;
  toHaveBeenCalledWith(...args: Parameters<T>): boolean;
  toHaveBeenLastCalledWith(...args: Parameters<T>): boolean;
  toHaveReturnedWith(value: ReturnType<T>): boolean;
  
  // Reset methods
  mockClear(): void;
  mockReset(): void;
  mockRestore(): void;
}

export interface SpyFunction<T extends (...args: any[]) => any = (...args: any[]) => any> extends MockFunction<T> {
  original: T;
}

export interface MockOptions {
  name?: string;
} 