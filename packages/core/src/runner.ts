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

  async runAffectedSuites(allSuites: TestSuite[], affectedTestFiles: string[]): Promise<TestResult[]> {
    const affectedResults: TestResult[] = [];
    
    // Filter suites to only run affected ones
    const affectedSuites = allSuites.filter(suite => {
      // Check if any of the affected test files match this suite
      // We'll use a simple approach of checking if the suite name or any property matches
      return affectedTestFiles.some(file => 
        file.includes(suite.name) || suite.name.includes(file)
      );
    });
    
    if (affectedSuites.length === 0) {
      // If no suites matched by name, fall back to running all suites
      // This can happen if the dependency tracking doesn't perfectly match suite names
      for (const suite of allSuites) {
        const results = await this.runSuite(suite);
        affectedResults.push(...results);
      }
    } else {
      for (const suite of affectedSuites) {
        const results = await this.runSuite(suite);
        affectedResults.push(...results);
      }
    }
    
    return affectedResults;
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