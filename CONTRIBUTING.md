# Contributing to Vito Frontend (Vue 3)

Thank you for your interest in contributing to the **Vito Frontend** project!

This app is built with **Vue 3**, **TypeScript**, and **Vite**. We welcome bug fixes, new features, UI improvements, or any other contributions you’d like to make.

## How to Contribute

### 1. Fork & Branch
- Fork this repository.
- Create a new branch from `main`, e.g. `feature/add-account-page`.

### 2. Set Up the Project

```bash
git clone https://github.com/YOUR_USERNAME/vito_frontend.git
cd vito_frontend
chmod +x ./generate_env.sh
./generate_env.sh
docker compose up -d
```

### 3. Code Standards
- We use ESLint and Prettier.

Before committing, please run:
```
npm run lint
npm run format
```

### 4. Testing

- Please write or update relevant tests when adding features or fixing bugs.
- Make sure all tests pass before opening a PR:

```
npm run test
```

### Pull Requests
- Use clear and descriptive commit messages.

- In your PR description, explain what was changed and why.

- Reference any related issues when applicable (e.g. Closes #12).

### Reporting Issues
If you encounter a bug or have a feature suggestion, feel free to open an issue.

Please include:

- Your OS/browser version.

- Steps to reproduce the issue.

- Screenshots or logs, if applicable.


