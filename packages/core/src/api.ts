import { Test, TestSuite } from './types.js';

let currentSuite: TestSuite | null = null;
const allSuites: TestSuite[] = [];

export function describe(name: string, fn: () => void): void {
  const suite: TestSuite = {
    name,
    tests: []
  };
  
  const previousSuite = currentSuite;
  currentSuite = suite;
  
  try {
    fn();
  } finally {
    currentSuite = previousSuite;
  }
  
  allSuites.push(suite);
}

export function test(name: string, fn: () => void | Promise<void>): void;
export function test(name: string, fn: () => void | Promise<void>, timeout?: number): void;
export function test(name: string, fn: () => void | Promise<void>, timeout?: number): void {
  if (!currentSuite) {
    throw new Error('test() must be called within a describe() block');
  }
  
  const testCase: Test = {
    name,
    fn,
    timeout
  };
  
  currentSuite.tests.push(testCase);
}

export function it(name: string, fn: () => void | Promise<void>): void {
  test(name, fn);
}

export function getSuites(): TestSuite[] {
  return [...allSuites];
}

export function clearSuites(): void {
  allSuites.length = 0;
  currentSuite = null;
} 