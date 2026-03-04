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

### 1. Git Workflow

**Branch Strategy:**

- `dev` - Development branch (default)
- `release/vX.Y.Z` - Release branches for QA testing
- `main` - Production branch
- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring

**Release Process:**

```bash
# 1. Create release branch from dev
git checkout dev
git pull
git checkout -b release/v1.2.0
git push origin release/v1.2.0
# → Auto build & deploy to QA

# 2. Tester tests on QA environment

# 3. Fix bugs on release branch
git commit -am "fix: bug description"
git push
# → Auto redeploy to QA

# 4. After QA approval, merge to main
git checkout main
git pull
git merge release/v1.2.0
git push
# → Auto deploy to Production

# 5. Sync back to dev
git checkout dev
git merge main
git push
```

### 2. Branch Naming

### 3. Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) with required scope:

## Commit Message Format

```
<type>(<scope>): <description>
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

## Examples

```
feat(auth): add user authentication
fix(login): resolve validation issue
docs(api): update endpoint documentation
style(core): format code with prettier
refactor(database): optimize queries
test(auth): add unit tests for service
chore(deps): update dependencies
```

### 4. Code Standards

- **ESLint**: Code will be automatically linted before commit
- **Prettier**: Code formatting is enforced
- **TypeScript**: Strict typing required

### 5. Testing

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
