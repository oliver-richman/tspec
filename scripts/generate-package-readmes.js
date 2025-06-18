#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Package configurations
const packages = {
  'core': {
    name: '@tspec/core',
    description: 'Core testing framework functionality for TSpec',
    shortDescription: 'Provides the foundational testing APIs including `describe()`, `test()`, and the test runner engine.',
    mainFeatures: [
      'Test organization with `describe()`, `test()`, `it()`',
      'Async testing support with promises and async/await',
      'Test file discovery and execution',
      'TypeScript-first design with full type safety'
    ],
    installCommand: 'npm install --save-dev @tspec/core @tspec/assert',
    usageNote: 'Typically used together with @tspec/assert for assertions.',
    exampleCode: `import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

describe('My Component', () => {
  test('should work correctly', () => {
    const result = myFunction();
    expect(result).toBe('expected');
  });
});`,
    relatedPackages: ['@tspec/assert', '@tspec/cli']
  },
  'assert': {
    name: '@tspec/assert',
    description: 'Assertion library for TSpec testing framework',
    shortDescription: 'Provides the `expect()` function and comprehensive assertion methods for testing.',
    mainFeatures: [
      '16+ assertion methods covering all common use cases',
      'Promise testing with `resolves` and `rejects`',
      'Type-safe assertions with full TypeScript support',
      'Clear, descriptive error messages'
    ],
    installCommand: 'npm install --save-dev @tspec/core @tspec/assert',
    usageNote: 'Must be used with @tspec/core for test organization.',
    exampleCode: `import { expect } from '@tspec/assert';

// Basic assertions
expect(2 + 2).toBe(4);
expect('hello world').toContain('world');
expect([1, 2, 3]).toHaveLength(3);

// Async assertions
await expect(fetchData()).resolves.toEqual({ data: 'value' });
await expect(failingFunction()).rejects.toThrow('Error message');`,
    relatedPackages: ['@tspec/core', '@tspec/mock']
  },
  'mock': {
    name: '@tspec/mock',
    description: 'Mocking and spying utilities for TSpec testing framework',
    shortDescription: 'Provides `fn()` and `spyOn()` for creating mocks and spies in your tests.',
    mainFeatures: [
      'Function mocks with `fn()` for creating test doubles',
      'Method spying with `spyOn()` for existing objects',
      'Mock implementations and return value control',
      'Call tracking and verification utilities'
    ],
    installCommand: 'npm install --save-dev @tspec/core @tspec/assert @tspec/mock',
    usageNote: 'Used alongside @tspec/core and @tspec/assert for complete testing.',
    exampleCode: `import { fn, spyOn } from '@tspec/mock';
import { expect } from '@tspec/assert';

// Create mock functions
const mockCallback = fn().mockReturnValue('mocked result');
expect(mockCallback()).toBe('mocked result');

// Spy on existing methods
const consoleSpy = spyOn(console, 'log');
console.log('test message');
expect(consoleSpy).toHaveBeenCalledWith('test message');
consoleSpy.mockRestore();`,
    relatedPackages: ['@tspec/core', '@tspec/assert']
  },
  'cli': {
    name: '@tspec/cli',
    description: 'Command-line interface for running TSpec tests',
    shortDescription: 'Provides the `tspec` command for discovering and running your test files.',
    mainFeatures: [
      'Zero-config test runner with intelligent defaults',
      'Automatic TypeScript compilation with tsx',
      'Flexible CLI options for different workflows',
      'CI/CD integration with proper exit codes'
    ],
    installCommand: 'npm install --save-dev @tspec/cli',
    usageNote: 'Automatically includes @tspec/core as a dependency.',
    exampleCode: `# Run all tests
npx tspec

# Run with verbose output
npx tspec --verbose

# Run specific test files
npx tspec tests/unit.tspec.ts

# Global installation
npm install -g @tspec/cli
tspec`,
    relatedPackages: ['@tspec/core', '@tspec/assert', '@tspec/mock']
  }
};

function createInfoBox(packageKey, config) {
  const isStandalone = packageKey === 'cli';
  
  return `> **ℹ️ Important Note**
> 
> ${config.shortDescription}
> 
> ${isStandalone 
    ? `The CLI automatically includes **@tspec/core** as a dependency. For full functionality, you'll also want **@tspec/assert** for assertions${packageKey !== 'cli' ? ' and **@tspec/mock** for mocking' : ''}.`
    : `This package is designed to work as part of the **TSpec ecosystem** and ${config.usageNote}`
  }
> 
> 📖 **[View complete documentation and examples →](https://github.com/oliver-richman/tspec#readme)**`;
}

function generatePackageReadme(packageKey, config) {
  const infoBox = createInfoBox(packageKey, config);
  const isCliPackage = packageKey === 'cli';
  
  return `# ${config.name}

${config.description}

${infoBox}

## Installation

\`\`\`bash
${config.installCommand}
\`\`\`

## Features

${config.mainFeatures.map(feature => `- ${feature}`).join('\n')}

## Usage

\`\`\`${isCliPackage ? 'bash' : 'typescript'}
${config.exampleCode}
\`\`\`

## Complete Testing Example

${isCliPackage ? `
First, create a test file \`example.tspec.ts\`:

\`\`\`typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

describe('Math Operations', () => {
  test('addition works correctly', () => {
    expect(2 + 2).toBe(4);
  });
});
\`\`\`

Then run with the CLI:

\`\`\`bash
npx tspec example.tspec.ts
\`\`\`
` : `
\`\`\`typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';
${packageKey === 'mock' ? `import { fn, spyOn } from '@tspec/mock';` : ''}

describe('${config.name.split('/')[1]} Example', () => {
  test('demonstrates ${packageKey} functionality', () => {
    ${packageKey === 'core' ? `// Test organization and structure
    const value = 'test';
    expect(value).toBe('test');` : ''}
    ${packageKey === 'assert' ? `// Comprehensive assertions
    expect(42).toBe(42);
    expect('hello').toContain('ell');
    expect([1, 2, 3]).toHaveLength(3);` : ''}
    ${packageKey === 'mock' ? `// Mocking and spying
    const mockFn = fn().mockReturnValue('mocked');
    expect(mockFn()).toBe('mocked');
    expect(mockFn).toHaveBeenCalled();` : ''}
  });
});
\`\`\`
`}

## Related Packages

TSpec is designed as a cohesive framework. Here are the related packages:

${config.relatedPackages.map(pkg => {
  const relatedConfig = Object.values(packages).find(p => p.name === pkg);
  return relatedConfig ? `- [**${pkg}**](https://npmjs.com/package/${pkg}) - ${relatedConfig.description}` : `- [**${pkg}**](https://npmjs.com/package/${pkg})`;
}).join('\n')}

## Documentation & Support

- 📖 **[Complete Documentation](https://github.com/oliver-richman/tspec#readme)** - Full usage guide and API reference
- 🚀 **[Getting Started Guide](https://github.com/oliver-richman/tspec/blob/main/docs/GETTING_STARTED.md)** - Step-by-step setup
- 💡 **[Examples](https://github.com/oliver-richman/tspec/tree/main/examples)** - Real-world usage examples
- 🐛 **[Issues](https://github.com/oliver-richman/tspec/issues)** - Report bugs or request features

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/oliver-richman/tspec/blob/main/CONTRIBUTING.md) for details on:

- Setting up the development environment
- Running tests and ensuring quality
- Submitting pull requests

## License

MIT License - see the [LICENSE](https://github.com/oliver-richman/tspec/blob/main/LICENSE) file for details.

---

<div align="center">

**[⭐ Star TSpec on GitHub](https://github.com/oliver-richman/tspec)** • **[📦 View on NPM](https://npmjs.com/package/${config.name})**

</div>
`;
}

// Generate README for each package
console.log('🚀 Generating clean, comprehensive package READMEs...\n');

Object.entries(packages).forEach(([packageKey, config]) => {
  const packageDir = path.join(rootDir, 'packages', packageKey);
  const readmePath = path.join(packageDir, 'README.md');
  
  if (!fs.existsSync(packageDir)) {
    console.warn(`⚠️  Package directory not found: ${packageDir}`);
    return;
  }
  
  const readmeContent = generatePackageReadme(packageKey, config);
  fs.writeFileSync(readmePath, readmeContent);
  
  console.log(`✅ Generated clean README for ${config.name}`);
});

console.log('\n🎉 All package READMEs generated successfully!');
console.log('\n📋 Each README now includes:');
console.log('   • Clear info box explaining package relationships');
console.log('   • Clean sections with no empty content');
console.log('   • Practical usage examples');
console.log('   • Links to complete documentation');
console.log('   • Professional NPM-optimized formatting'); 