import { TestSuite, TestResult, Test } from './types.js';
export declare class TestRunner {
    private results;
    runTest(suite: string, test: Test): Promise<TestResult>;
    runSuite(suite: TestSuite): Promise<TestResult[]>;
    getResults(): TestResult[];
    printResults(): void;
}
