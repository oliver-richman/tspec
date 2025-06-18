export class TestRunner {
    constructor() {
        this.results = [];
    }
    async runTest(suite, test) {
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
        }
        catch (error) {
            const duration = Date.now() - startTime;
            return {
                suite,
                test: test.name,
                status: 'failed',
                duration,
                error: error
            };
        }
    }
    async runSuite(suite) {
        const results = [];
        for (const test of suite.tests) {
            const result = await this.runTest(suite.name, test);
            results.push(result);
            this.results.push(result);
        }
        return results;
    }
    getResults() {
        return this.results;
    }
    printResults() {
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
