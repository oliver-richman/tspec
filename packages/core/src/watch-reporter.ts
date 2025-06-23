import { TestResult } from './types.js';

export interface WatchReporterOptions {
  showTimestamp?: boolean;
  showOnlyFailures?: boolean;
  clearConsole?: boolean;
}

export class WatchReporter {
  private options: WatchReporterOptions;

  constructor(options: WatchReporterOptions = {}) {
    this.options = {
      showTimestamp: true,
      showOnlyFailures: false,
      clearConsole: true,
      ...options
    };
  }

  /**
   * Clear the console if enabled
   */
  clearConsole(): void {
    if (this.options.clearConsole) {
      console.clear();
    }
  }

  /**
   * Print watch mode header
   */
  printWatchHeader(watchingFiles: number): void {
    console.log('🔍 TSpec Watch Mode');
    if (this.options.showTimestamp) {
      console.log(`⏰ ${new Date().toLocaleTimeString()}`);
    }
    console.log(`📋 Watching ${watchingFiles} files\n`);
  }

  /**
   * Print file change notification
   */
  printFileChange(filePath: string, event: string): void {
    const timestamp = this.options.showTimestamp ? `[${new Date().toLocaleTimeString()}] ` : '';
    console.log(`\n${timestamp}📁 File ${event}: ${this.getRelativePath(filePath)}`);
  }

  /**
   * Print test results in watch mode format
   */
  printResults(results: TestResult[], affectedCount?: number): void {
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const total = results.length;

    // Summary line
    const statusEmoji = failed > 0 ? '❌' : '✅';
    console.log(`\n${statusEmoji} Tests: ${passed} passed, ${failed} failed, ${total} total`);
    
    if (affectedCount !== undefined && affectedCount < total) {
      console.log(`📊 Ran ${affectedCount} affected test files`);
    }

    // Show individual results
    if (this.options.showOnlyFailures) {
      // Only show failed tests
      const failedResults = results.filter(r => r.status === 'failed');
      if (failedResults.length > 0) {
        console.log('\n❌ Failed tests:');
        failedResults.forEach(result => {
          console.log(`  ✗ ${result.suite} > ${result.test} (${result.duration}ms)`);
          if (result.error) {
            console.log(`    ${result.error.message}`);
          }
        });
      }
    } else {
      // Show all results
      results.forEach(result => {
        const symbol = result.status === 'passed' ? '✓' : '✗';
        const color = result.status === 'passed' ? '' : '';
        console.log(`  ${symbol} ${result.suite} > ${result.test} (${result.duration}ms)`);
        
        if (result.error) {
          console.log(`    ${result.error.message}`);
        }
      });
    }
  }

  /**
   * Print watching status and available commands
   */
  printWatchingStatus(patterns: string[]): void {
    console.log('\n📋 Watching for changes...');
    console.log('🔍 Patterns:', patterns.join(', '));
    console.log('\n⌨️  Interactive Commands:');
    console.log('  • Press "a" to run all tests');
    console.log('  • Press "f" to run only failed tests');
    console.log('  • Press "h" or "?" for help');
    console.log('  • Press "q" to quit');
    console.log('  • Press Enter to re-run affected tests');
    console.log('  • Press Ctrl+C to exit');
  }

  /**
   * Print initial watch mode startup message
   */
  printStartupMessage(testFiles: string[], patterns: string[]): void {
    this.clearConsole();
    console.log('🚀 TSpec Watch Mode Started\n');
    console.log(`📁 Found ${testFiles.length} test files`);
    console.log('🔍 Patterns:', patterns.join(', '));
    console.log('');
  }

  /**
   * Print error message in watch mode format
   */
  printError(error: Error, context?: string): void {
    console.log('\n❌ Error' + (context ? ` in ${context}` : '') + ':');
    console.log(`   ${error.message}`);
    if (error.stack) {
      console.log('   Stack trace:');
      console.log(error.stack.split('\n').slice(1).map(line => `   ${line}`).join('\n'));
    }
  }

  /**
   * Print warning message
   */
  printWarning(message: string): void {
    console.log(`\n⚠️  ${message}`);
  }

  /**
   * Print info message
   */
  printInfo(message: string): void {
    console.log(`\nℹ️  ${message}`);
  }

  /**
   * Get relative path for display
   */
  private getRelativePath(filePath: string): string {
    const cwd = process.cwd();
    if (filePath.startsWith(cwd)) {
      return filePath.slice(cwd.length + 1);
    }
    return filePath;
  }
} 