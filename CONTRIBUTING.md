# Contributing to GitHub API Commit Action

Thank you for your interest in contributing to the GitHub API Commit Action! This document provides guidelines and
instructions for contributing to this project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request, please create an issue on the GitHub repository. When reporting issues,
please include:

- A clear and descriptive title
- A detailed description of the issue or feature request
- Steps to reproduce the issue (if applicable)
- Any relevant logs or error messages

### Pull Requests

We welcome pull requests! Here's how to contribute code:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Submit a pull request

#### Important: Opening PRs from Forks

When opening a pull request from a fork, you need to take an additional step to ensure tests run properly:

1. After creating your fork and making changes in a branch, **open a PR to your fork's main branch first**
2. Once that PR is created and the tests pass, open a PR from your fork to the original repository

This step is necessary because the CI workflow is configured to only run tests on PRs from branches in the same
repository. By opening a PR to your fork's main branch, you ensure that the tests will run on your changes. This is
needed because the tests will commit to the repository. When a PR is opened from a fork, GitHub prevents the generated
token from having write permissions.

## Commit Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.
This helps with automated versioning and changelog generation.

Commit messages should be structured as follows:

```
<type>(optional scope): <description>

[optional body]

[optional footer(s)]
```

Types include:

- `feat:` for new features (minor version bump)
- `fix:` for bug fixes (patch version bump)
- `feat!:` or `fix!:` for breaking changes (major version bump)
- `chore:`, `docs:`, `test:`, etc. for other types of changes

Example: `feat: add new commit signing feature`

Since we use the `squash-merge` strategy, PR titles are required to be in Conventional Commits format to ensure that the
merge commit message is defaulted correctly.

## Development Setup

To set up the project for local development:

1. Clone the repository
2. Make your changes
3. Test your changes using the provided test workflows

## Testing

Before submitting a PR, please ensure that all tests pass. You can run tests locally by following the testing
instructions in the README.

## Release Process

This repository uses [release-please](https://github.com/googleapis/release-please) to automate version management and
package releasing. When commits are pushed to the main branch, release-please will:

1. Analyze the commits since the last release
2. Update the version number according to semantic versioning rules
3. Update the CHANGELOG.md with the commit details
4. Create or update a release PR
5. When the release PR is merged, create a new GitHub release with appropriate tags

## Questions?

If you have any questions about contributing, please open an issue and we'll be happy to help!