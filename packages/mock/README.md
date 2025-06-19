# @tspec/mock

Mocking and spying utilities for TSpec testing framework

> **ℹ️ Important Note**
> 
> Provides `fn()` and `spyOn()` for creating mocks and spies in your tests.
> 
> This package is designed to work as part of the **TSpec ecosystem** and Used alongside @tspec/core and @tspec/assert for complete testing.
> 
> 📖 **[View complete documentation and examples →](https://github.com/oliver-richman/tspec#readme)**

## Installation

```bash
npm install --save-dev @tspec/core @tspec/assert @tspec/mock
```

## Features

- Function mocks with `fn()` for creating test doubles
- Method spying with `spyOn()` for existing objects
- Mock implementations and return value control
- Call tracking and verification utilities

## Usage

```typescript
import { fn, spyOn } from '@tspec/mock';
import { expect } from '@tspec/assert';

// Create mock functions
const mockCallback = fn().mockReturnValue('mocked result');
expect(mockCallback()).toBe('mocked result');

// Spy on existing methods
const consoleSpy = spyOn(console, 'log');
console.log('test message');
expect(consoleSpy).toHaveBeenCalledWith('test message');
consoleSpy.mockRestore();
```

## Complete Testing Example


```typescript
import { describe, test } from '@tspec/core';
import { expect } from '@tspec/assert';
import { fn, spyOn } from '@tspec/mock';

describe('mock Example', () => {
  test('demonstrates mock functionality', () => {
    
    
    // Mocking and spying
    const mockFn = fn().mockReturnValue('mocked');
    expect(mockFn()).toBe('mocked');
    expect(mockFn).toHaveBeenCalled();
  });
});
```


## Related Packages

TSpec is designed as a cohesive framework. Here are the related packages:

- [**@tspec/core**](https://npmjs.com/package/@tspec/core) - Core testing framework functionality for TSpec
- [**@tspec/assert**](https://npmjs.com/package/@tspec/assert) - Assertion library for TSpec testing framework

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

**[⭐ Star TSpec on GitHub](https://github.com/oliver-richman/tspec)** • **[📦 View on NPM](https://npmjs.com/package/@tspec/mock)**

</div>
