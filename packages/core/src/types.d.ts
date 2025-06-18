export interface Test {
    name: string;
    fn: () => void | Promise<void>;
    timeout?: number;
}
export interface TestSuite {
    name: string;
    tests: Test[];
}
export interface TestResult {
    suite: string;
    test: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: Error;
}
