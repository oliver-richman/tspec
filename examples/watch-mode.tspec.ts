import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

/**
 * Watch Mode Example
 * 
 * This file demonstrates TSpec's watch mode capabilities.
 * 
 * To try watch mode:
 * 1. Run: tspec --watch examples/watch-mode.tspec.ts
 * 2. Make changes to this file or create utils.ts
 * 3. See tests automatically re-run
 * 4. Try interactive commands (a, f, h, q, Enter)
 */

// Simple utility functions for testing
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function formatName(first: string, last: string): string {
  return `${first} ${last}`;
}

describe('Watch Mode Demo', () => {
  describe('Math Operations', () => {
    test('addition works correctly', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(-1, 1)).toBe(0);
      expect(add(0, 5)).toBe(5);
    });

    test('multiplication works correctly', () => {
      expect(multiply(3, 4)).toBe(12);
      expect(multiply(-2, 3)).toBe(-6);
      expect(multiply(0, 100)).toBe(0);
    });

    test('handles edge cases', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
      expect(multiply(1.5, 2)).toBe(3);
    });
  });

  describe('String Operations', () => {
    test('formats names correctly', () => {
      expect(formatName('John', 'Doe')).toBe('John Doe');
      expect(formatName('Alice', 'Smith')).toBe('Alice Smith');
    });

    test('handles empty strings', () => {
      expect(formatName('', 'Doe')).toBe(' Doe');
      expect(formatName('John', '')).toBe('John ');
    });
  });

  describe('Array Operations', () => {
    test('array methods work correctly', () => {
      const numbers = [1, 2, 3, 4, 5];
      
      expect(numbers.length).toBe(5);
      expect(numbers.includes(3)).toBe(true);
      expect(numbers.includes(6)).toBe(false);
    });

    test('array transformations', () => {
      const numbers = [1, 2, 3];
      const doubled = numbers.map(n => n * 2);
      
      expect(doubled).toEqual([2, 4, 6]);
    });
  });
});

describe('Dynamic Test Example', () => {
  // This test can be modified to see watch mode in action
  test('current timestamp test', () => {
    const now = new Date();
    expect(now instanceof Date).toBe(true);
    
    // Try changing this value and saving to see watch mode detect the change
    const expectedHour = new Date().getHours();
    expect(now.getHours()).toBe(expectedHour);
  });

  test('random number test', () => {
    const random = Math.random();
    expect(random >= 0).toBe(true);
    expect(random < 1).toBe(true);
    
    // Try changing these bounds to see tests re-run
    expect(typeof random).toBe('number');
  });
});

/*
 * Watch Mode Tips:
 * 
 * 1. Make small changes to any test and save to see instant feedback
 * 2. Create a new file that imports functions from this file
 * 3. Watch mode will detect dependencies and run affected tests
 * 4. Use interactive commands for more control:
 *    - Press 'a' to run all tests
 *    - Press 'f' to run only failed tests
 *    - Press 'q' to quit
 * 
 * 5. Watch mode ignores:
 *    - node_modules/
 *    - dist/
 *    - .git/
 *    - Temporary files
 *    - Log files
 */ 