import { readFileSync } from 'fs';
import { resolve, dirname, extname, join } from 'path';
import { existsSync } from 'fs';

export interface DependencyMap {
  [testFile: string]: string[];  // test file -> array of source files it depends on
}

export class DependencyTracker {
  private dependencyMap: DependencyMap = {};
  private sourceToTestsMap: { [sourceFile: string]: string[] } = {};

  /**
   * Analyze test files to build dependency graph
   */
  async analyzeDependencies(testFiles: string[]): Promise<void> {
    this.dependencyMap = {};
    this.sourceToTestsMap = {};

    for (const testFile of testFiles) {
      const dependencies = await this.extractDependencies(testFile);
      this.dependencyMap[testFile] = dependencies;
      
      // Build reverse mapping
      for (const dep of dependencies) {
        if (!this.sourceToTestsMap[dep]) {
          this.sourceToTestsMap[dep] = [];
        }
        if (!this.sourceToTestsMap[dep].includes(testFile)) {
          this.sourceToTestsMap[dep].push(testFile);
        }
      }
    }
  }

  /**
   * Get test files affected by changes to the given source files
   */
  getAffectedTests(changedFiles: string[]): string[] {
    const affectedTests = new Set<string>();

    for (const changedFile of changedFiles) {
      const resolvedPath = resolve(changedFile);
      
      // If the changed file is itself a test file, include it
      if (this.dependencyMap[resolvedPath]) {
        affectedTests.add(resolvedPath);
      }
      
      // Find tests that depend on this source file
      const dependentTests = this.sourceToTestsMap[resolvedPath] || [];
      for (const testFile of dependentTests) {
        affectedTests.add(testFile);
      }
      
      // Also check for files that might match with different extensions
      const withoutExt = resolvedPath.replace(/\.[^/.]+$/, '');
      for (const sourceFile of Object.keys(this.sourceToTestsMap)) {
        if (sourceFile.replace(/\.[^/.]+$/, '') === withoutExt) {
          const dependentTests = this.sourceToTestsMap[sourceFile] || [];
          for (const testFile of dependentTests) {
            affectedTests.add(testFile);
          }
        }
      }
    }

    return Array.from(affectedTests);
  }

  /**
   * Get all dependencies for a test file
   */
  getDependencies(testFile: string): string[] {
    return this.dependencyMap[resolve(testFile)] || [];
  }

  /**
   * Get all test files that depend on a source file
   */
  getDependentTests(sourceFile: string): string[] {
    return this.sourceToTestsMap[resolve(sourceFile)] || [];
  }

  /**
   * Extract all dependencies from a TypeScript file
   */
  private async extractDependencies(filePath: string): Promise<string[]> {
    const dependencies = new Set<string>();
    const visited = new Set<string>();
    
    await this.extractDependenciesRecursive(filePath, dependencies, visited);
    
    return Array.from(dependencies);
  }

  /**
   * Recursively extract dependencies from a file
   */
  private async extractDependenciesRecursive(
    filePath: string, 
    dependencies: Set<string>, 
    visited: Set<string>
  ): Promise<void> {
    const resolvedPath = resolve(filePath);
    
    if (visited.has(resolvedPath) || !existsSync(resolvedPath)) {
      return;
    }
    
    visited.add(resolvedPath);
    dependencies.add(resolvedPath);

    try {
      const content = readFileSync(resolvedPath, 'utf8');
      const imports = this.parseImports(content);
      
      for (const importPath of imports) {
        const resolvedImport = this.resolveImport(importPath, dirname(resolvedPath));
        if (resolvedImport && !resolvedImport.includes('node_modules')) {
          await this.extractDependenciesRecursive(resolvedImport, dependencies, visited);
        }
      }
    } catch (error) {
      // Ignore errors reading files that might not exist or be accessible
      console.warn(`Warning: Could not read file ${resolvedPath}:`, error);
    }
  }

  /**
   * Parse import statements from TypeScript/JavaScript content
   */
  private parseImports(content: string): string[] {
    const imports: string[] = [];
    
    // Match various import patterns
    const patterns = [
      // import ... from 'module'
      /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*)?)+\s+from\s+['"`]([^'"`]+)['"`]/g,
      // import 'module'
      /import\s+['"`]([^'"`]+)['"`]/g,
      // require('module')
      /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // import() dynamic imports
      /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath && !importPath.startsWith('@types/') && this.isRelativeOrLocalImport(importPath)) {
          imports.push(importPath);
        }
      }
    }

    return imports;
  }

  /**
   * Check if an import path is relative or local (not from node_modules)
   */
  private isRelativeOrLocalImport(importPath: string): boolean {
    return importPath.startsWith('./') || 
           importPath.startsWith('../') || 
           (!importPath.startsWith('@') && !importPath.includes('/'));
  }

  /**
   * Resolve an import path relative to the current file directory
   */
  private resolveImport(importPath: string, fromDir: string): string | null {
    if (!this.isRelativeOrLocalImport(importPath)) {
      return null;
    }

    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
    
    // Handle relative imports
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      const basePath = resolve(fromDir, importPath);
      
      // Try with extensions
      for (const ext of extensions) {
        const withExt = basePath + ext;
        if (existsSync(withExt)) {
          return withExt;
        }
      }
      
      // Try as directory with index file
      for (const ext of extensions) {
        const indexFile = join(basePath, `index${ext}`);
        if (existsSync(indexFile)) {
          return indexFile;
        }
      }
      
      // If file already has extension and exists
      if (existsSync(basePath)) {
        return basePath;
      }
    }

    return null;
  }
} 