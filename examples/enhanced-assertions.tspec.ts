import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

describe('Basic Assertions', () => {
  test('toBe() works with primitive equality', () => {
    expect(2 + 2).toBe(4);
    expect('hello').toBe('hello');
    expect(true).toBe(true);
    expect(null).toBe(null);
  });

  test('toEqual() works with deep equality', () => {
    expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
    expect([1, 2, 3]).toEqual([1, 2, 3]);
    expect('hello').toEqual('hello');
  });

  test('toBeNull() works with null values', () => {
    expect(null).toBeNull();
  });

  test('toBeUndefined() works with undefined values', () => {
    expect(undefined).toBeUndefined();
    let uninitialized;
    expect(uninitialized).toBeUndefined();
  });

  test('toBeTruthy() works with truthy values', () => {
    expect(true).toBeTruthy();
    expect(1).toBeTruthy();
    expect('hello').toBeTruthy();
    expect([]).toBeTruthy();
    expect({}).toBeTruthy();
  });

  test('toBeFalsy() works with falsy values', () => {
    expect(false).toBeFalsy();
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
  });
});

describe('Enhanced Assertions', () => {
  test('toThrow() works with functions that throw', () => {
    expect(() => {
      throw new Error('Test error');
    }).toThrow();
  });

  test('toThrow() works with specific error messages', () => {
    expect(() => {
      throw new Error('Specific error message');
    }).toThrow('Specific error');
  });

  test('toThrow() works with regex patterns', () => {
    expect(() => {
      throw new Error('Error: Invalid input');
    }).toThrow(/Invalid input/);
  });

  test('toContain() works with arrays', () => {
    expect([1, 2, 3, 4]).toContain(3);
    expect(['apple', 'banana', 'cherry']).toContain('banana');
  });

  test('toContain() works with strings', () => {
    expect('hello world').toContain('world');
    expect('TypeScript is awesome').toContain('Script');
  });

  test('toMatch() works with regex patterns', () => {
    expect('hello123').toMatch(/hello\d+/);
    expect('test@example.com').toMatch(/\w+@\w+\.\w+/);
    expect('TSpec Framework').toMatch(/^TSpec/);
  });

  test('toBeCloseTo() works with floating point numbers', () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3);
    expect(Math.PI).toBeCloseTo(3.14, 2);
    expect(1 / 3).toBeCloseTo(0.333, 3);
  });
});

describe('Async Assertions - Resolves', () => {
  test('resolves.toBe() works with resolved promises', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBe('success');
  });

  test('resolves.toEqual() works with complex objects', async () => {
    const promise = Promise.resolve({ status: 'ok', data: [1, 2, 3] });
    await expect(promise).resolves.toEqual({ status: 'ok', data: [1, 2, 3] });
  });

  test('resolves.toBeNull() works with null resolution', async () => {
    const promise = Promise.resolve(null);
    await expect(promise).resolves.toBeNull();
  });

  test('resolves.toBeUndefined() works with undefined resolution', async () => {
    const promise = Promise.resolve(undefined);
    await expect(promise).resolves.toBeUndefined();
  });

  test('resolves.toBeTruthy() works with truthy resolutions', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBeTruthy();
  });

  test('resolves.toBeFalsy() works with falsy resolutions', async () => {
    const promise = Promise.resolve(0);
    await expect(promise).resolves.toBeFalsy();
  });

  test('resolves.toContain() works with arrays and strings', async () => {
    const arrayPromise = Promise.resolve([1, 2, 3, 4]);
    await expect(arrayPromise).resolves.toContain(3);
    
    const stringPromise = Promise.resolve('async hello world');
    await expect(stringPromise).resolves.toContain('hello');
  });

  test('resolves.toMatch() works with regex patterns', async () => {
    const promise = Promise.resolve('async-test-123');
    await expect(promise).resolves.toMatch(/async-test-\d+/);
  });

  test('resolves.toBeCloseTo() works with numbers', async () => {
    const promise = Promise.resolve(0.1 + 0.2);
    await expect(promise).resolves.toBeCloseTo(0.3);
  });
});

describe('Async Assertions - Rejects', () => {
  test('rejects.toEqual() works with rejected promises', async () => {
    const promise = Promise.reject(new Error('Async error'));
    await expect(promise).rejects.toEqual(new Error('Async error'));
  });

  test('rejects.toBeTruthy() works with truthy rejection values', async () => {
    const promise = Promise.reject('error message');
    await expect(promise).rejects.toBeTruthy();
  });

  test('rejects.toContain() works with rejection strings', async () => {
    const promise = Promise.reject('Network connection failed');
    await expect(promise).rejects.toContain('connection');
  });

  test('rejects.toMatch() works with rejection patterns', async () => {
    const promise = Promise.reject('Error: NETWORK_TIMEOUT');
    await expect(promise).rejects.toMatch(/NETWORK_\w+/);
  });
}); 