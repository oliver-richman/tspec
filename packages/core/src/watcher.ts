import chokidar, { FSWatcher } from 'chokidar';

export type FileChangeEvent = 'add' | 'change' | 'unlink';
export type FileChangeCallback = (filePath: string, event: FileChangeEvent) => void;

export class WatchManager {
  private watcher: FSWatcher | null = null;
  private callback: FileChangeCallback | null = null;
  private debounceTimer: NodeJS.Timeout | null = null;
  private debounceDelay: number = 300;

  constructor(debounceDelay?: number) {
    if (debounceDelay !== undefined) {
      this.debounceDelay = debounceDelay;
    }
    
    // Handle process termination gracefully
    process.on('SIGINT', this.stopWatching.bind(this));
    process.on('SIGTERM', this.stopWatching.bind(this));
  }

  /**
   * Start watching files matching the given patterns
   */
  startWatching(patterns: string[], ignored: string[] = []): void {
    if (this.watcher) {
      throw new Error('Watcher is already running. Call stopWatching() first.');
    }

    // Default ignored patterns for common development files
    const defaultIgnored = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
      '**/coverage/**',
      '**/.*',          // Hidden files
      '**/*.tmp',
      '**/*.temp',
      '**/*.swp',
      '**/*.swo',
      '**/*.log',
      '**/*.pid',
      '**/*.seed',
      '**/*.pid.lock',
      '**/.DS_Store',
      '**/Thumbs.db',
      '**/*.tsbuildinfo',
      '**/npm-debug.log*',
      '**/yarn-debug.log*',
      '**/yarn-error.log*'
    ];

    const allIgnored = [...defaultIgnored, ...ignored];

    this.watcher = chokidar.watch(patterns, {
      ignored: allIgnored,
      ignoreInitial: true,
      persistent: true,
      ignorePermissionErrors: true,
      followSymlinks: false,  // Don't follow symlinks to avoid circular dependencies
      atomic: true,          // Wait for write operations to complete
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100
      },
      // Enable polling on some systems for better reliability
      usePolling: process.env.TSPEC_WATCH_POLLING === 'true',
      interval: 100,
      binaryInterval: 300
    });

    this.watcher.on('add', (path) => this.handleFileChange(path, 'add'));
    this.watcher.on('change', (path) => this.handleFileChange(path, 'change'));
    this.watcher.on('unlink', (path) => this.handleFileChange(path, 'unlink'));
    
    this.watcher.on('error', (error) => {
      console.warn('File watcher error:', error);
      // Try to recover by restarting the watcher
      this.handleWatcherError(error);
    });
  }

  /**
   * Stop watching files and cleanup resources
   */
  stopWatching(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }

    this.callback = null;
  }

  /**
   * Set the callback to be called when files change
   */
  onFileChange(callback: FileChangeCallback): void {
    this.callback = callback;
  }

  /**
   * Check if the watcher is currently active
   */
  isWatching(): boolean {
    return this.watcher !== null;
  }

  /**
   * Get the current debounce delay
   */
  getDebounceDelay(): number {
    return this.debounceDelay;
  }

  /**
   * Set a new debounce delay
   */
  setDebounceDelay(delay: number): void {
    if (delay < 0) {
      throw new Error('Debounce delay must be non-negative');
    }
    this.debounceDelay = delay;
  }

  private handleFileChange(filePath: string, event: FileChangeEvent): void {
    if (!this.callback) {
      return;
    }

    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer for debounced callback
    this.debounceTimer = setTimeout(() => {
      if (this.callback) {
        try {
          this.callback(filePath, event);
        } catch (error) {
          console.error('Error in file change callback:', error);
        }
      }
      this.debounceTimer = null;
    }, this.debounceDelay);
  }

  /**
   * Handle watcher errors and attempt recovery
   */
  private handleWatcherError(error: Error): void {
    console.warn('Attempting to recover from watcher error...');
    
    // Don't attempt recovery too frequently
    setTimeout(() => {
      if (this.watcher) {
        try {
          // The watcher will be restarted by the consumer if needed
          console.warn('File watcher encountered an error and may need to be restarted.');
        } catch (recoveryError) {
          console.error('Failed to recover from watcher error:', recoveryError);
        }
      }
    }, 1000);
  }
} 