#!/usr/bin/env node

import { findTestFiles, TestRunner, getSuites, clearSuites, loadConfig, validateConfig, TestResult, WatchManager, TSpecConfig } from '@tspec/core';
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
  console.log('🔍 TSpec Watch Mode Started');
  
  const watchManager = new WatchManager(config.watchDebounce);
  let isRunning = false;

  // Setup graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping watch mode...');
    watchManager.stopWatching();
    process.exit(0);
  });

  const runAllTests = async () => {
    if (isRunning) return;
    isRunning = true;

    try {
      console.clear();
      console.log('🔍 TSpec Watch Mode - Running tests...\n');

      // Find test files
      const testFiles = await findTestFiles(config);
      
      if (testFiles.length === 0) {
        console.log('No test files found matching the patterns:', config.testMatch);
        return;
      }

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
      
      if (!config.silent) {
        runner.printResults();
      }

      const results = runner.getResults();
      const failedCount = results.filter((r: TestResult) => r.status === 'failed').length;
      const passedCount = results.filter((r: TestResult) => r.status === 'passed').length;
      const totalCount = results.length;

      console.log(`\n📋 Watching ${testFiles.length} test files...`);
      console.log('📝 Press Ctrl+C to exit watch mode');
    } catch (error) {
      console.error('Error running tests:', error);
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
      console.log(`\n📁 File ${event}: ${filePath}`);
      runAllTests();
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