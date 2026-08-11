# Contributing to Executive CV Profiler & Web Intelligence

Thank you for your interest in contributing to Executive CV Profiler! We welcome contributions from the community.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 How to Contribute

### Reporting Bugs
1. Search existing issues to ensure the bug hasn't already been reported.
2. Open a new issue describing:
   - Expected behavior versus actual behavior
   - Steps to reproduce the issue
   - Relevant screenshots or console error logs
   - System environment (Node version, OS, Browser)

### Suggesting Enhancements
1. Open a feature request issue explaining the motivation and proposed solution.
2. Discuss the design and implementation approach with maintainers before opening a pull request.

### Pull Request Workflow
1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your code modifications.
3. Ensure type safety and linting pass:
   ```bash
   npm run lint
   ```
4. Verify application build:
   ```bash
   npm run build
   ```
5. Commit your changes with clear messages following standard guidelines:
   ```bash
   git commit -m "feat: add support for custom persona export formats"
   ```
6. Push to your fork and submit a Pull Request targeting the `main` branch.

## 🛠️ Code Conventions

- **Language**: TypeScript throughout frontend and backend.
- **Styling**: Tailwind CSS utility classes.
- **Components**: Functional React components with hooks.
- **Icons**: Always import from `lucide-react`.
- **API Keys**: Never commit API keys or secrets. Use `.env.example` to document new environment variables.

Thank you for helping improve Executive CV Profiler!
