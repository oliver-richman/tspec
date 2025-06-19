# @tspec/assert

Assertion library for TSpec testing framework

> **ℹ️ Important Note**
> 
> Provides the `expect()` function and comprehensive assertion methods for testing.
> 
> This package is designed to work as part of the **TSpec ecosystem** and Must be used with @tspec/core for test organization.
> 
> 📖 **[View complete documentation and examples →](https://github.com/oliver-richman/tspec#readme)**

## Installation

```bash
npm install --save-dev @tspec/core @tspec/assert
```

## Features

- 16+ assertion methods covering all common use cases
- Promise testing with `resolves` and `rejects`
- Type-safe assertions with full TypeScript support
- Clear, descriptive error messages

## Usage

```typescript
import { expect } from '@tspec/assert';

// Basic assertions
expect(2 + 2).toBe(4);
expect('hello world').toContain('world');
expect([1, 2, 3]).toHaveLength(3);

// Async assertions
await expect(fetchData()).resolves.toEqual({ data: 'value' });
await expect(failingFunction()).rejects.toThrow('Error message');
```

## Complete Testing Example


```typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';


describe('assert Example', () => {
  test('demonstrates assert functionality', () => {
    
    // Comprehensive assertions
    expect(42).toBe(42);
    expect('hello').toContain('ell');
    expect([1, 2, 3]).toHaveLength(3);
    
  });
});
```


## Related Packages

TSpec is designed as a cohesive framework. Here are the related packages:

- [**@tspec/core**](https://npmjs.com/package/@tspec/core) - Core testing framework functionality for TSpec
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

**[⭐ Star TSpec on GitHub](https://github.com/oliver-richman/tspec)** • **[📦 View on NPM](https://npmjs.com/package/@tspec/assert)**

</div>
