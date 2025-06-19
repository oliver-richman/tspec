# @tspec/cli

Command-line interface for running TSpec tests

> **ℹ️ Important Note**
> 
> Provides the `tspec` command for discovering and running your test files.
> 
> The CLI automatically includes **@tspec/core** as a dependency. For full functionality, you'll also want **@tspec/assert** for assertions.
> 
> 📖 **[View complete documentation and examples →](https://github.com/oliver-richman/tspec#readme)**

## Installation

```bash
npm install --save-dev @tspec/cli
```

## Features

- Zero-config test runner with intelligent defaults
- Automatic TypeScript compilation with tsx
- Flexible CLI options for different workflows
- CI/CD integration with proper exit codes

## Usage

```bash
# Run all tests
npx tspec

# Run with verbose output
npx tspec --verbose

# Run specific test files
npx tspec tests/unit.tspec.ts

# Global installation
npm install -g @tspec/cli
tspec
```

## Complete Testing Example


First, create a test file `example.tspec.ts`:

```typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

describe('Math Operations', () => {
  test('addition works correctly', () => {
    expect(2 + 2).toBe(4);
  });
});
```

Then run with the CLI:

```bash
npx tspec example.tspec.ts
```


## Related Packages

TSpec is designed as a cohesive framework. Here are the related packages:

- [**@tspec/core**](https://npmjs.com/package/@tspec/core) - Core testing framework functionality for TSpec
- [**@tspec/assert**](https://npmjs.com/package/@tspec/assert) - Assertion library for TSpec testing framework
- [**@tspec/mock**](https://npmjs.com/package/@tspec/mock) - Mocking and spying utilities for TSpec testing framework

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

**[⭐ Star TSpec on GitHub](https://github.com/oliver-richman/tspec)** • **[📦 View on NPM](https://npmjs.com/package/@tspec/cli)**

</div>
