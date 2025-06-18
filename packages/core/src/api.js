let currentSuite = null;
const allSuites = [];
export function describe(name, fn) {
    const suite = {
        name,
        tests: []
    };
    const previousSuite = currentSuite;
    currentSuite = suite;
    try {
        fn();
    }
    finally {
        currentSuite = previousSuite;
    }
    allSuites.push(suite);
}
export function test(name, fn, timeout) {
    if (!currentSuite) {
        throw new Error('test() must be called within a describe() block');
    }
    const testCase = {
        name,
        fn,
        timeout
    };
    currentSuite.tests.push(testCase);
}
export function it(name, fn) {
    test(name, fn);
}
export function getSuites() {
    return [...allSuites];
}
export function clearSuites() {
    allSuites.length = 0;
    currentSuite = null;
}
