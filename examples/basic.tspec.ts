import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

describe('Basic Math Operations', () => {
  test('addition works correctly', () => {
    expect(2 + 2).toBe(4);
    expect(10 + 5).toBe(15);
    expect(-5 + 3).toBe(-2);
  });
  
  test('subtraction works correctly', () => {
    expect(5 - 3).toBe(2);
    expect(10 - 7).toBe(3);
    expect(0 - 5).toBe(-5);
  });

  test('multiplication works correctly', () => {
    expect(3 * 4).toBe(12);
    expect(7 * 0).toBe(0);
    expect(-2 * 5).toBe(-10);
  });

  test('division works correctly', () => {
    expect(12 / 3).toBe(4);
    expect(10 / 2).toBe(5);
    expect(1 / 4).toBe(0.25);
  });
});

describe('String Operations', () => {
  test('string concatenation works', () => {
    expect('hello' + ' world').toBe('hello world');
    expect('TSpec' + ' Framework').toBe('TSpec Framework');
  });

  test('string methods work correctly', () => {
    expect('HELLO'.toLowerCase()).toBe('hello');
    expect('world'.toUpperCase()).toBe('WORLD');
    expect('  trimmed  '.trim()).toBe('trimmed');
  });
});

describe('Array Operations', () => {
  test('array creation and access', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr.length).toBe(5);
    expect(arr[0]).toBe(1);
    expect(arr[4]).toBe(5);
  });

  test('array methods work correctly', () => {
    const numbers = [1, 2, 3];
    expect(numbers.concat([4, 5])).toEqual([1, 2, 3, 4, 5]);
    expect(numbers.join(', ')).toBe('1, 2, 3');
  });
});

describe('Object Operations', () => {
  test('object creation and property access', () => {
    const person = { name: 'Alice', age: 30 };
    expect(person.name).toBe('Alice');
    expect(person.age).toBe(30);
  });

  test('nested objects work correctly', () => {
    const nested = {
      user: { id: 1, profile: { email: 'test@example.com' } }
    };
    expect(nested.user.id).toBe(1);
    expect(nested.user.profile.email).toBe('test@example.com');
  });
}); 