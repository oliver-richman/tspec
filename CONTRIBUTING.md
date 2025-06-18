# Contributing to TSpec

Thank you for your interest in contributing to TSpec! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Git
- TypeScript knowledge

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/tspec.git
   cd tspec
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build All Packages**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   # Or with verbose output
   npm run test:verbose
   ```

## Development Workflow

### Project Structure

```
tspec/
├── packages/
│   ├── core/          # Test runner and framework core
│   ├── assert/        # Assertion library
│   ├── mock/          # Mocking utilities
│   └── cli/           # Command-line interface
├── examples/          # Example test files
├── docs/             # Documentation
└── README.md         # Main documentation
```

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow existing code style and patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Build and Test**
   ```bash
   npm run build
   npm test
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Available Scripts

```bash
# Build all packages
npm run build

# Build specific packages
npm run build:core
npm run build:assert
npm run build:mock
npm run build:cli

# Run tests
npm test                    # All tests
npm run test:verbose        # With detailed output
npm run test:basic          # Just basic examples
npm run test:mocking        # Just mocking examples
npm run test:assertions     # Just assertion examples

# Development
npm run dev                 # Watch mode for all packages

# Maintenance
npm run clean               # Clean all build outputs
npm run typecheck           # Type checking without emit
```

## Code Style

### TypeScript Guidelines

- Use strict TypeScript configuration
- Prefer explicit types over `any`
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Testing Guidelines

- Write tests for all new functionality
- Use descriptive test names
- Group related tests with `describe` blocks
- Test both happy path and error cases

### Example

```typescript
// Good: Descriptive names and proper typing
export function validateUserInput(input: string): ValidationResult {
  if (!input.trim()) {
    throw new Error('Input cannot be empty');
  }
  return { isValid: true, value: input.trim() };
}

// Test for the above function
describe('validateUserInput', () => {
  test('should return valid result for non-empty input', () => {
    const result = validateUserInput('  hello  ');
    expect(result).toEqual({ isValid: true, value: 'hello' });
  });

  test('should throw error for empty input', () => {
    expect(() => validateUserInput('   ')).toThrow('Input cannot be empty');
  });
});
```

## Submitting Changes

### Pull Request Process

1. **Push Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use the GitHub web interface
   - Provide clear title and description
   - Link any related issues

3. **PR Requirements**
   - All tests must pass
   - Code must build without errors
   - Documentation updated if needed
   - Follow the existing code style

### Commit Message Convention

Use conventional commit format:

```
type(scope): description

feat(core): add new test discovery feature
fix(assert): resolve floating point comparison issue
docs(readme): update installation instructions
test(mock): add tests for spy functionality
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- TSpec version
- Node.js version
- Operating system
- Minimal reproduction case
- Expected vs actual behavior
- Error messages or stack traces

### Feature Requests

For feature requests, please describe:

- The problem you're trying to solve
- Proposed solution
- Alternative solutions considered
- Examples of how it would be used

## Development Philosophy

### Core Principles

1. **TypeScript-First**: Everything should work seamlessly with TypeScript
2. **Developer Experience**: Clear APIs, helpful error messages
3. **Performance**: Fast test execution and minimal overhead
4. **Simplicity**: Easy to use with sensible defaults
5. **Compatibility**: Work well with existing TypeScript tooling

### Design Decisions

- **Zero Config**: Should work out of the box for basic use cases
- **Extensible**: Allow customization through configuration
- **Type Safe**: Leverage TypeScript's type system fully
- **Clear Errors**: Provide helpful, actionable error messages

## Getting Help

- **Documentation**: Check [docs/](docs/) directory
- **Examples**: Look at [examples/](examples/) directory
- **Issues**: Search existing [GitHub issues](https://github.com/oliver-richman/tspec/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/oliver-richman/tspec/discussions)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for contributing to TSpec! 🎉 