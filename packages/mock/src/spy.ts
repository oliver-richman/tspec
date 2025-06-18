import { SpyFunction } from './types.js';
import { createMockFunction } from './mock.js';

export function spyOn<T extends object, K extends keyof T>(
  object: T,
  methodName: K
): SpyFunction<any> {
  const originalMethod = object[methodName];
  
  if (typeof originalMethod !== 'function') {
    throw new Error(`Cannot spy on property ${String(methodName)} - it is not a function`);
  }
  
  const spy = createMockFunction(String(methodName), originalMethod as any) as SpyFunction<any>;
  spy.original = originalMethod as any;
  
  // Replace the original method with the spy
  (object as any)[methodName] = spy;
  
  // Add restore functionality specific to spies
  const originalRestore = spy.mockRestore;
  spy.mockRestore = (): void => {
    (object as any)[methodName] = originalMethod;
    originalRestore.call(spy);
  };
  
  return spy;
}

export function restoreAllSpies(): void {
  // In a real implementation, we'd track all spies globally
  // For now, this is a placeholder
  console.warn('restoreAllSpies() is not yet implemented');
} 