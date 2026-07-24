# Contributing Guidelines

Thank you for considering contributing to the Collaborative Task Management System!

## Code Style
- For Backend (Go): run `gofmt -w` and ensure linting passes.
- For Frontend (React/JS): use modular structures, camelCase for variables, and ensure all user-facing strings are sanitized.

## Branching Model
- Feature branches: `feature/name-of-feature`
- Bug fixes: `bugfix/issue-description`
- Open a Pull Request targeting the `main` branch.

## Secrets & Credentials Management
- **Never hardcode secrets**: Do not put passwords, tokens, or private keys directly in the codebase or in `docker-compose.yml`.
- **Environment variables**: Use `.env` files for local development. Copy the template from `.env.example`, fill in your secrets, and verify that the file remains ignored by git (tracked in `.gitignore`).
