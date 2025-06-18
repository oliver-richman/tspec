import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

// Sample classes and functions to demonstrate mocking
class UserService {
  constructor(private apiClient: ApiClient) {}
  
  async getUser(id: string): Promise<User> {
    return await this.apiClient.fetchUser(id);
  }
  
  calculateAge(birthYear: number): number {
    return new Date().getFullYear() - birthYear;
  }
}

class ApiClient {
  async fetchUser(id: string): Promise<User> {
    // Simulate API call
    throw new Error('Real API call - should be mocked!');
  }
  
  async saveUser(user: User): Promise<boolean> {
    // Simulate save operation
    return true;
  }
}

interface User {
  id: string;
  name: string;
  birthYear: number;
}

// Simple mock implementation for testing
function createSimpleMock<T extends (...args: any[]) => any>(): {
  fn: T;
  calls: any[][];
  returnValue?: any;
  implementation?: T;
  setReturnValue: (value: any) => void;
  setImplementation: (impl: T) => void;
  getCallCount: () => number;
  getLastCall: () => any[] | undefined;
  wasCalledWith: (...args: any[]) => boolean;
  reset: () => void;
} {
  const calls: any[][] = [];
  let returnValue: any = undefined;
  let implementation: T | undefined = undefined;
  
  const mockFn = function(this: any, ...args: any[]): any {
    calls.push([...args]);
    
    if (implementation) {
      return implementation.apply(this, args);
    }
    
    return returnValue;
  } as T;
  
  return {
    fn: mockFn,
    calls,
    get returnValue() { return returnValue; },
    get implementation() { return implementation; },
    setReturnValue: (value: any) => { returnValue = value; },
    setImplementation: (impl: T) => { implementation = impl; },
    getCallCount: () => calls.length,
    getLastCall: () => calls.length > 0 ? calls[calls.length - 1] : undefined,
    wasCalledWith: (...args: any[]) => calls.some(call => 
      call.length === args.length && call.every((arg, i) => arg === args[i])
    ),
    reset: () => {
      calls.length = 0;
      returnValue = undefined;
      implementation = undefined;
    }
  };
}

describe('TSpec Mocking Examples', () => {
  test('basic mock function creation and call tracking', () => {
    const mockFn = createSimpleMock<(x: number, y: string) => string>();
    
    expect(mockFn.getCallCount()).toBe(0);
    
    mockFn.fn(42, 'hello');
    mockFn.fn(99, 'world');
    
    expect(mockFn.getCallCount()).toBe(2);
    expect(mockFn.wasCalledWith(42, 'hello')).toBe(true);
    expect(mockFn.wasCalledWith(99, 'world')).toBe(true);
    expect(mockFn.getLastCall()).toEqual([99, 'world']);
  });

  test('mock function with return value', () => {
    const mockFn = createSimpleMock<(name: string) => string>();
    mockFn.setReturnValue('mocked result');
    
    const result = mockFn.fn('test');
    
    expect(result).toBe('mocked result');
    expect(mockFn.wasCalledWith('test')).toBe(true);
  });

  test('mock function with custom implementation', () => {
    const mockFn = createSimpleMock<(a: number, b: number) => number>();
    mockFn.setImplementation((a: number, b: number) => a * b + 10);
    
    const result = mockFn.fn(3, 4);
    
    expect(result).toBe(22); // 3 * 4 + 10
    expect(mockFn.wasCalledWith(3, 4)).toBe(true);
  });

  test('mocking object methods', async () => {
    const apiClient = new ApiClient();
    const originalFetch = apiClient.fetchUser;
    
    // Create mock for fetchUser method
    const mockFetch = createSimpleMock<typeof originalFetch>();
    mockFetch.setImplementation(async (id: string) => ({
      id,
      name: 'Mocked User',
      birthYear: 1990
    }));
    
    // Replace the method
    apiClient.fetchUser = mockFetch.fn;
    
    // Test the mocked behavior
    const user = await apiClient.fetchUser('123');
    expect(user.name).toBe('Mocked User');
    expect(user.id).toBe('123');
    expect(mockFetch.wasCalledWith('123')).toBe(true);
    
    // Restore original method
    apiClient.fetchUser = originalFetch;
  });

  test('mocking in service classes', async () => {
    // Create mock functions
    const mockFetchUser = createSimpleMock<(id: string) => Promise<User>>();
    const mockSaveUser = createSimpleMock<(user: User) => Promise<boolean>>();
    
    // Set up mock behavior
    mockFetchUser.setImplementation(async (id: string) => ({
      id,
      name: 'Test User',
      birthYear: 1985
    }));
    
    // Create mock API client object
    const mockApiClient = {
      fetchUser: mockFetchUser.fn,
      saveUser: mockSaveUser.fn
    } as ApiClient;
    
    // Create service with mocked dependencies
    const userService = new UserService(mockApiClient);
    
    // Test service method
    const user = await userService.getUser('user123');
    expect(user.name).toBe('Test User');
    expect(user.id).toBe('user123');
    expect(mockFetchUser.wasCalledWith('user123')).toBe(true);
  });

  test('testing error scenarios with mocks', () => {
    const mockFn = createSimpleMock<(input: string) => string>();
    mockFn.setImplementation((input: string) => {
      if (input === 'error') {
        throw new Error('Mocked error');
      }
      return 'success';
    });
    
    // Test success case
    expect(mockFn.fn('valid')).toBe('success');
    
    // Test error case
    expect(() => mockFn.fn('error')).toThrow('Mocked error');
    
    expect(mockFn.getCallCount()).toBe(2);
  });

  test('mock reset functionality', () => {
    const mockFn = createSimpleMock<(x: number) => number | undefined>();
    mockFn.setReturnValue(100);
    
    mockFn.fn(1);
    mockFn.fn(2);
    
    expect(mockFn.getCallCount()).toBe(2);
    
    mockFn.reset();
    
    expect(mockFn.getCallCount()).toBe(0);
    const result = mockFn.fn(3);
    expect(result).toBe(undefined); // No return value set
  });

  test('async function mocking', async () => {
    const mockAsyncFn = createSimpleMock<(delay: number) => Promise<string>>();
    mockAsyncFn.setImplementation(async (delay: number) => {
      // Mock implementation that doesn't actually delay
      return `completed after ${delay}ms`;
    });
    
    const result = await mockAsyncFn.fn(1000);
    
    expect(result).toBe('completed after 1000ms');
    expect(mockAsyncFn.wasCalledWith(1000)).toBe(true);
  });
});

describe('Advanced Mocking Patterns', () => {
  test('partial object mocking', () => {
    const originalService = {
      method1: (x: number) => x * 2,
      method2: (x: string) => x.toUpperCase(),
      method3: (x: boolean) => !x
    };
    
    // Mock only method2
    const mockMethod2 = createSimpleMock<typeof originalService.method2>();
    mockMethod2.setReturnValue('MOCKED');
    
    const partiallyMockedService = {
      ...originalService,
      method2: mockMethod2.fn
    };
    
    // Test original methods still work
    expect(partiallyMockedService.method1(5)).toBe(10);
    expect(partiallyMockedService.method3(true)).toBe(false);
    
    // Test mocked method
    expect(partiallyMockedService.method2('hello')).toBe('MOCKED');
    expect(mockMethod2.wasCalledWith('hello')).toBe(true);
  });

  test('conditional mock behavior', () => {
    const mockFn = createSimpleMock<(type: string, value: any) => any>();
    mockFn.setImplementation((type: string, value: any) => {
      switch (type) {
        case 'double':
          return value * 2;
        case 'uppercase':
          return value.toString().toUpperCase();
        case 'error':
          throw new Error(`Error for ${value}`);
        default:
          return value;
      }
    });
    
    expect(mockFn.fn('double', 5)).toBe(10);
    expect(mockFn.fn('uppercase', 'hello')).toBe('HELLO');
    expect(mockFn.fn('passthrough', 'test')).toBe('test');
    expect(() => mockFn.fn('error', 'bad')).toThrow('Error for bad');
    
    expect(mockFn.getCallCount()).toBe(4);
  });

  test('mock call verification patterns', () => {
    const mockLogger = createSimpleMock<(level: string, message: string) => void>();
    
    // Simulate some logging calls
    mockLogger.fn('info', 'Application started');
    mockLogger.fn('debug', 'Processing user data');
    mockLogger.fn('error', 'Database connection failed');
    mockLogger.fn('info', 'Request completed');
    
    // Verify specific calls were made
    expect(mockLogger.wasCalledWith('info', 'Application started')).toBe(true);
    expect(mockLogger.wasCalledWith('error', 'Database connection failed')).toBe(true);
    expect(mockLogger.wasCalledWith('warning', 'Some warning')).toBe(false);
    
    // Verify call count
    expect(mockLogger.getCallCount()).toBe(4);
    
    // Verify last call
    expect(mockLogger.getLastCall()).toEqual(['info', 'Request completed']);
  });
}); 