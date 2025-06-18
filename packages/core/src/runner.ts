import { TestSuite, TestResult, Test } from './types.js';

export class TestRunner {
  private results: TestResult[] = [];

  async runTest(suite: string, test: Test): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      await test.fn();
      const duration = Date.now() - startTime;
      
      return {
        suite,
        test: test.name,
        status: 'passed',
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        suite,
        test: test.name,
        status: 'failed',
        duration,
        error: error as Error
      };
    }
  }

  async runSuite(suite: TestSuite): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    for (const test of suite.tests) {
      const result = await this.runTest(suite.name, test);
      results.push(result);
      this.results.push(result);
    }
    
    return results;
  }

  getResults(): TestResult[] {
    return this.results;
  }

  printResults(): void {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    
    console.log(`\nTests: ${passed} passed, ${failed} failed, ${this.results.length} total`);
    
    this.results.forEach(result => {
      const symbol = result.status === 'passed' ? '✓' : '✗';
      console.log(`  ${symbol} ${result.suite} > ${result.test} (${result.duration}ms)`);
      
      if (result.error) {
        console.log(`    ${result.error.message}`);
      }
    });
  }
} 