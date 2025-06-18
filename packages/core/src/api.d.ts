import { TestSuite } from './types.js';
export declare function describe(name: string, fn: () => void): void;
export declare function test(name: string, fn: () => void | Promise<void>): void;
export declare function test(name: string, fn: () => void | Promise<void>, timeout?: number): void;
export declare function it(name: string, fn: () => void | Promise<void>): void;
export declare function getSuites(): TestSuite[];
export declare function clearSuites(): void;
