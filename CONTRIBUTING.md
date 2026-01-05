# Contributing to GrowKids Backend

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup
```bash
git clone <repository-url>
cd growkids-be
npm install
```

## Development Workflow

### 1. Branch Naming
- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring

### 2. Commit Messages
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login validation issue
docs: update API documentation
style: format code with prettier
refactor: optimize database queries
test: add unit tests for auth service
chore: update dependencies
```

### 3. Code Standards
- **ESLint**: Code will be automatically linted before commit
- **Prettier**: Code formatting is enforced
- **TypeScript**: Strict typing required

### 4. Testing
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## Pull Request Process

1. Create feature branch from `dev`
2. Make your changes
3. Ensure all tests pass
4. Commit with conventional commit format
5. Push to your branch
6. Create Pull Request

### PR Requirements
- [ ] All tests passing
- [ ] Code follows style guidelines
- [ ] Commit messages follow conventional format
- [ ] Documentation updated if needed

## Project Structure

```
src/
├── common/          # Shared utilities, decorators, etc.
├── config/          # Configuration files
├── database/        # Database related files
├── modules/         # Feature modules
│   └── auth/        # Authentication module
├── app.module.ts    # Root module
└── main.ts          # Application entry point
```

## Module Structure
```
modules/feature-name/
├── dto/             # Data transfer objects
├── entities/        # Database entities
├── feature.controller.ts
├── feature.service.ts
├── feature.module.ts
└── tests/           # Module-specific tests
```

## Git Hooks
- **pre-commit**: Runs ESLint and Prettier
- **commit-msg**: Validates commit message format

## Questions?
Create an issue or contact the development team.