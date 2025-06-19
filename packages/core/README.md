# @tspec/core

Core testing framework functionality for TSpec

> **ℹ️ Important Note**
> 
> Provides the foundational testing APIs including `describe()`, `test()`, and the test runner engine.
> 
> This package is designed to work as part of the **TSpec ecosystem** and Typically used together with @tspec/assert for assertions.
> 
> 📖 **[View complete documentation and examples →](https://github.com/oliver-richman/tspec#readme)**

## Installation

```bash
npm install --save-dev @tspec/core @tspec/assert
```

## Features

- Test organization with `describe()`, `test()`, `it()`
- Async testing support with promises and async/await
- Test file discovery and execution
- TypeScript-first design with full type safety

## Usage

```typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';

describe('My Component', () => {
  test('should work correctly', () => {
    const result = myFunction();
    expect(result).toBe('expected');
  });
});
```

## Complete Testing Example


```typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';


describe('core Example', () => {
  test('demonstrates core functionality', () => {
    // Test organization and structure
    const value = 'test';
    expect(value).toBe('test');
    
    
  });
});
```


## Related Packages

TSpec is designed as a cohesive framework. Here are the related packages:

- [**@tspec/assert**](https://npmjs.com/package/@tspec/assert) - Assertion library for TSpec testing framework
- [**@tspec/cli**](https://npmjs.com/package/@tspec/cli) - Command-line interface for running TSpec tests

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

**[⭐ Star TSpec on GitHub](https://github.com/oliver-richman/tspec)** • **[📦 View on NPM](https://npmjs.com/package/@tspec/core)**

</div>
