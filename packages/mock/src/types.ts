// Core mock types and interfaces

export interface CallInfo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  returnValue?: any;
  thrownError?: Error;
  timestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface MockFunction<T extends (...args: any[]) => any = (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  
  // Mock control methods
  mockReturnValue(value: ReturnType<T>): MockFunction<T>;
  mockReturnValueOnce(value: ReturnType<T>): MockFunction<T>;
  mockResolvedValue(value: Awaited<ReturnType<T>>): MockFunction<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockRejectedValue(error: any): MockFunction<T>;
  mockImplementation(fn: T): MockFunction<T>;
  mockImplementationOnce(fn: T): MockFunction<T>;
  mockThrow(error: Error): MockFunction<T>;
  mockThrowOnce(error: Error): MockFunction<T>;
  
  // Call tracking
  mock: {
    calls: CallInfo[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: { type: 'return' | 'throw'; value: any }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instances: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SpyFunction<T extends (...args: any[]) => any = (...args: any[]) => any> extends MockFunction<T> {
  original: T;
}

export interface MockOptions {
  name?: string;
} 