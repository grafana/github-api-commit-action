[![Test](https://github.com/grafana/github-api-commit-action/actions/workflows/test.yml/badge.svg)](https://github.com/grafana/github-api-commit-action/actions/workflows/test.yml)

[//]: # (THIS README FILE IS GENERATED FROM docs/README.tmpl any updates should be done there)

# GitHub Api Commit

This action commits to the checked out repo via the graphql mutation `createCommitOnBranch`. This mutation supports
signing commits automatically for the user. This is useful when using a GitHub App to do committing for bot-related
commits and the repo requires signed commits.

It will build a list of file additions and deletions to commit, and just prior to committing will fetch the latest
commit OID from the remote repo. It will commit to whatever branch is currently checked out in the workflow. For
instance, if you create a branch via `git checkout -b my-test-branch` in one of your steps, it will commit to 
`my-test-branch`.

## Usage:

```yaml
  - name: Commit changes
    uses: grafana/github-api-commit-action@217dd3b6fd87795791baec73516d331c3839bc42 # v0.4.1
    with:
      commit-message: "<commit-message>" # Commit message defaults to "Commit performed by grafana/github-api-commit-action"
      create-branch-on-remote: true | false # Whether to create the branch on the remote if it doesn't exist: Defaults to false
      stage-all-files: true | false # Whether to additionally stage any changed files in the checkout. Defaults to false
      token: ${{ github.token }} # Token you want to authenticate with
```

### Example: Using a GitHub App Installation Token

```yaml
  - uses: tibdex/github-app-token@v1
    id: get_installation_token
    with:
      app_id: ${{ secrets.GITHUB_APP_ID }}
      installation_id: ${{ secrets.GITHUB_APP_INSTALLATION_ID }}
      private_key: ${{ secrets.GITHUB_APP_PRIVATE_KEY }}

  - name: Commit changes
    uses: grafana/github-api-commit-action@217dd3b6fd87795791baec73516d331c3839bc42 # v0.4.1
    with:
      commit-message: "<commit-message>" # Commit message defaults to "Commit performed by grafana/github-api-commit-action"
      create-branch-on-remote: true | false # Whether to create the branch on the remote if it doesn't exist already: Defaults to false
      stage-all-files: true | false # Whether to additionally stage any changed files in the checkout. Defaults to false
      token: ${{ steps.get_installation_token.outputs.token }} # Token you want to authenticate with
```

## Releases

This repository uses [release-please](https://github.com/googleapis/release-please) to automate version management and
package releasing. Release-please automatically:

- Creates and maintains a release PR
- Updates the version in package files based on [Conventional Commits](https://www.conventionalcommits.org/)
- Maintains the CHANGELOG.md file
- Creates GitHub releases when the release PR is merged

The release process is completely automated - when commits are pushed to the main branch, release-please will:
1. Analyze the commits since the last release
2. Update the version number according to semantic versioning rules
3. Update the CHANGELOG.md with the commit details
4. Create or update a release PR
5. When the release PR is merged, create a new GitHub release with appropriate tags

### Commit Convention

To ensure proper versioning and changelog generation, commits should follow the Conventional Commits specification:

- `feat:` for new features (minor version bump)
- `fix:` for bug fixes (patch version bump)
- `feat!:` or `fix!:` for breaking changes (major version bump)
- `chore:`, `docs:`, `test:`, etc. for other types of changes

Example: `feat: add new commit signing feature`

Since we use the `squash-merge` strategy, PR titles are required to be in Conventional Commits format to ensure that the
merge commit message is defaulted correctly.

# (Legacy) GitHub Api Commit

> [!NOTE]
> This section is preserved for historical context. Note that the action now uses the method of committing via
> `gh api graphql`.

Committing in your workflow can normally be done using git commands or other actions that perform commits for you.
However, if you are using a GitHub App installation token and your repository requires commit signing, there is no way
to attach a signing key to your commit, and it must be done through the GitHub API.

The general steps are:

1. [Create a tree](https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#create-a-tree)
2. [Create a commit](https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit)
3. [Update the head reference](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#update-a-reference)

An example can be found [here](https://github.com/orgs/community/discussions/50055).

When committing through the GitHub API using a GitHub App installation token, GitHub will recognize the app and add
commit signing for you.