#!/usr/bin/env node

import { findTestFiles, TestRunner, getSuites, clearSuites, loadConfig, validateConfig, TestResult, WatchManager, TSpecConfig, DependencyTracker, WatchReporter } from '@tspec/core';
import { register } from 'tsx/esm/api';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'url';

interface CliOptions {
  help?: boolean;
  version?: boolean;
  config?: string;
  verbose?: boolean;
  silent?: boolean;
  timeout?: number;
  testMatch?: string[];
  watch?: boolean;
}

function showHelp() {
  console.log(`
TSpec - TypeScript Testing Framework

Usage: tspec [options] [testPattern...]

Options:
  -h, --help              Show this help message
  -v, --version           Show version number
  -c, --config <path>     Path to config file (default: tspec.config.ts)
  --verbose               Verbose output
  --silent                Silent output (errors only)
  --timeout <ms>          Test timeout in milliseconds
  --testMatch <pattern>   Test file patterns (can be used multiple times)
  -w, --watch             Watch files and re-run tests on changes

Examples:
  tspec                   Run all tests
  tspec --verbose         Run tests with verbose output
  tspec --config custom.config.ts  Use custom config file
  tspec --testMatch "**/*.test.ts"  Run only .test.ts files
  tspec --timeout 30000   Set 30 second timeout
`);
}

function showVersion() {
  // In a real implementation, this would read from package.json
  console.log('TSpec v0.1.0');
}

function parseCliArgs(): CliOptions {
  try {
    const { values, positionals } = parseArgs({
      args: process.argv.slice(2),
      options: {
        help: { type: 'boolean', short: 'h' },
        version: { type: 'boolean', short: 'v' },
        config: { type: 'string', short: 'c' },
        verbose: { type: 'boolean' },
        silent: { type: 'boolean' },
        timeout: { type: 'string' },
        testMatch: { type: 'string', multiple: true },
        watch: { type: 'boolean', short: 'w' }
      },
      allowPositionals: true
    });

    // Parse timeout as number
    const timeout = values.timeout ? parseInt(values.timeout, 10) : undefined;
    if (values.timeout && isNaN(timeout!)) {
      throw new Error('--timeout must be a valid number');
    }

    // Add positional arguments as test patterns
    const testMatch = values.testMatch || [];
    if (positionals.length > 0) {
      testMatch.push(...positionals);
    }

    return {
      help: values.help,
      version: values.version,
      config: values.config,
      verbose: values.verbose,
      silent: values.silent,
      timeout,
      testMatch: testMatch.length > 0 ? testMatch : undefined,
      watch: values.watch
    };
  } catch (error: unknown) {
    console.error('Error parsing arguments:', (error as Error).message);
    process.exit(1);
  }
}

async function runWatchMode(config: TSpecConfig) {
  const watchManager = new WatchManager(config.watchDebounce);
  const dependencyTracker = new DependencyTracker();
  const reporter = new WatchReporter({
    showOnlyFailures: false,
    showTimestamp: true,
    clearConsole: true
  });
  let isRunning = false;
  let testFiles: string[] = [];
  let lastResults: TestResult[] = [];
  let lastChangedFiles: string[] = [];

  // Setup graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping watch mode...');
    watchManager.stopWatching();
    process.exit(0);
  });

  // Setup stdin for interactive commands
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  
  const handleKeyPress = (key: string) => {
    if (isRunning) return; // Don't handle input while tests are running

    switch (key) {
      case 'a':
      case 'A':
        console.log('\n🔄 Running all tests...');
        runAllTests();
        break;
      
      case 'f':
      case 'F':
        console.log('\n🔄 Running failed tests...');
        runFailedTests();
        break;
      
      case 'q':
      case 'Q':
      case '\u0003': // Ctrl+C
        console.log('\n👋 Stopping watch mode...');
        watchManager.stopWatching();
        process.exit(0);
        break;
      
      case '\r': // Enter
      case '\n':
        if (lastChangedFiles.length > 0) {
          console.log('\n🔄 Re-running affected tests...');
          runAffectedTests(lastChangedFiles);
        } else {
          console.log('\n🔄 Running all tests...');
          runAllTests();
        }
        break;
      
      case 'h':
      case 'H':
      case '?':
        printInteractiveHelp();
        break;
    }
  };

  process.stdin.on('data', handleKeyPress);

  const runFailedTests = async () => {
    if (isRunning) return;
    isRunning = true;

    try {
      const failedResults = lastResults.filter(r => r.status === 'failed');
      
      if (failedResults.length === 0) {
        reporter.printInfo('No failed tests to re-run!');
        isRunning = false;
        return;
      }

      reporter.clearConsole();
      reporter.printWatchHeader(testFiles.length);
      console.log(`Re-running ${failedResults.length} failed tests...\n`);

      // Get unique test files from failed results
      const failedTestFiles = new Set<string>();
      for (const result of failedResults) {
        // Find the test file that contains this suite
        for (const testFile of testFiles) {
          if (testFile.includes(result.suite) || result.suite.includes(testFile)) {
            failedTestFiles.add(testFile);
          }
        }
      }

      if (failedTestFiles.size === 0) {
        // Fallback: run all tests if we can't map failed tests to files
        await runAllTests();
        return;
      }

      // Clear existing suites
      clearSuites();
      
      // Register tsx for TypeScript support
      const unregisterTsx = register();
      
      try {
        // Import only test files that had failures
        for (const file of failedTestFiles) {
          await import(pathToFileURL(file).href + '?t=' + Date.now());
        }
      } finally {
        unregisterTsx();
      }
      
      // Run tests
      const runner = new TestRunner();
      const suites = getSuites();
      
      for (const suite of suites) {
        await runner.runSuite(suite);
      }
      
      const results = runner.getResults();
      lastResults = results;
      
      if (!config.silent) {
        reporter.printResults(results);
      }

      reporter.printWatchingStatus(config.testMatch || ['**/*.tspec.ts', '**/*.test.ts', '**/*.spec.ts']);
    } catch (error) {
      reporter.printError(error as Error, 'running failed tests');
    } finally {
      isRunning = false;
    }
  };

  const printInteractiveHelp = () => {
    console.log('\n📝 Interactive Watch Mode Commands:');
    console.log('  • Press "a" to run all tests');
    console.log('  • Press "f" to run only failed tests');
    console.log('  • Press "h" or "?" to show this help');
    console.log('  • Press "q" to quit watch mode');
    console.log('  • Press Enter to re-run affected tests');
    console.log('  • Press Ctrl+C to exit');
    console.log('');
  };

  const runAllTests = async () => {
    if (isRunning) return;
    isRunning = true;

    try {
      reporter.clearConsole();
      reporter.printWatchHeader(testFiles.length || 0);
      console.log('Running all tests...\n');

      // Find test files
      testFiles = await findTestFiles(config);
      
      if (testFiles.length === 0) {
        reporter.printWarning('No test files found matching the patterns: ' + config.testMatch?.join(', '));
        return;
      }

      // Build dependency graph for smart test selection
      await dependencyTracker.analyzeDependencies(testFiles);

      // Clear existing suites
      clearSuites();
      
      // Register tsx for TypeScript support
      const unregisterTsx = register();
      
      try {
        // Import all test files
        for (const file of testFiles) {
          await import(pathToFileURL(file).href + '?t=' + Date.now());
        }
      } finally {
        unregisterTsx();
      }
      
      // Run tests
      const runner = new TestRunner();
      const suites = getSuites();
      
      for (const suite of suites) {
        await runner.runSuite(suite);
      }
      
      const results = runner.getResults();
      lastResults = results;
      
      if (!config.silent) {
        reporter.printResults(results);
      }

      reporter.printWatchingStatus(config.testMatch || ['**/*.tspec.ts', '**/*.test.ts', '**/*.spec.ts']);
    } catch (error) {
      reporter.printError(error as Error, 'running tests');
    } finally {
      isRunning = false;
    }
  };

  const runAffectedTests = async (changedFiles: string[]) => {
    if (isRunning) return;
    isRunning = true;

    try {
      reporter.clearConsole();
      reporter.printWatchHeader(testFiles.length);
      
      if (config.watchAll) {
        // Run all tests if watchAll is enabled
        console.log('Running all tests (watchAll enabled)...\n');
        await runAllTests();
        return;
      }

      const affectedTestFiles = dependencyTracker.getAffectedTests(changedFiles);
      
      if (affectedTestFiles.length === 0) {
        reporter.printInfo('No tests affected by changes to: ' + changedFiles.map(f => f.replace(process.cwd() + '/', '')).join(', '));
        reporter.printWatchingStatus(config.testMatch || ['**/*.tspec.ts', '**/*.test.ts', '**/*.spec.ts']);
        isRunning = false;
        return;
      }

      console.log(`Running ${affectedTestFiles.length} affected tests...\n`);

      // Clear existing suites
      clearSuites();
      
      // Register tsx for TypeScript support
      const unregisterTsx = register();
      
      try {
        // Import only affected test files  
        for (const file of affectedTestFiles) {
          await import(pathToFileURL(file).href + '?t=' + Date.now());
        }
      } finally {
        unregisterTsx();
      }
      
      // Run tests
      const runner = new TestRunner();
      const suites = getSuites();
      
      for (const suite of suites) {
        await runner.runSuite(suite);
      }
      
      const results = runner.getResults();
      lastResults = results;
      
      if (!config.silent) {
        reporter.printResults(results, affectedTestFiles.length);
      }

      reporter.printWatchingStatus(config.testMatch || ['**/*.tspec.ts', '**/*.test.ts', '**/*.spec.ts']);
    } catch (error) {
      reporter.printError(error as Error, 'running affected tests');
    } finally {
      isRunning = false;
    }
  };

  // Setup file watching
  const patterns = config.testMatch || ['**/*.tspec.ts', '**/*.test.ts', '**/*.spec.ts'];
  const watchIgnore = [...(config.testIgnore || []), ...(config.watchIgnore || [])];
  
  watchManager.startWatching(patterns, watchIgnore);
  watchManager.onFileChange((filePath, event) => {
    if (!isRunning) {
      lastChangedFiles = [filePath];
      reporter.printFileChange(filePath, event);
      runAffectedTests([filePath]);
    }
  });

  // Run initial test suite
  await runAllTests();
}

async function runTests() {
  try {
    const cliOptions = parseCliArgs();

    // Handle help and version
    if (cliOptions.help) {
      showHelp();
      return;
    }

    if (cliOptions.version) {
      showVersion();
      return;
    }

    // Load configuration
    const config = await loadConfig(cliOptions.config);
    
    // Override config with CLI options
    if (cliOptions.verbose !== undefined) config.verbose = cliOptions.verbose;
    if (cliOptions.silent !== undefined) config.silent = cliOptions.silent;
    if (cliOptions.timeout !== undefined) config.timeout = cliOptions.timeout;
    if (cliOptions.testMatch !== undefined) config.testMatch = cliOptions.testMatch;

    // Validate merged configuration
    const validation = validateConfig(config);
    if (!validation.isValid) {
      console.error('Configuration validation failed:');
      validation.errors.forEach((error: string) => console.error(`  - ${error}`));
      process.exit(1);
    }

    if (cliOptions.watch) {
      await runWatchMode(config);
      return;
    }

    // Find test files using configuration
    const testFiles = await findTestFiles(config);
    
    if (testFiles.length === 0) {
      if (!config.silent) {
        console.log('No test files found matching the patterns:', config.testMatch);
      }
      return;
    }

    if (config.verbose) {
      console.log(`Found ${testFiles.length} test file(s):`);
      testFiles.forEach((file: string) => console.log(`  - ${file}`));
    } else if (!config.silent) {
      console.log(`Found ${testFiles.length} test file(s)`);
    }
    
    // Clear any existing suites
    clearSuites();
    
    // Register tsx for TypeScript support
    const unregisterTsx = register();
    
    try {
      // Import all test files
      for (const file of testFiles) {
        await import(pathToFileURL(file).href);
      }
    } finally {
      // Always unregister tsx
      unregisterTsx();
    }
    
    // Run all tests
    const runner = new TestRunner();
    const suites = getSuites();
    
    for (const suite of suites) {
      await runner.runSuite(suite);
    }
    
    if (!config.silent) {
      runner.printResults();
    }
    
    // Exit with error code if tests failed
    const results = runner.getResults();
    const failedCount = results.filter((r: TestResult) => r.status === 'failed').length;
    if (failedCount > 0) {
      process.exit(1);
    }
    
  } catch (error: unknown) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

runTests(); 