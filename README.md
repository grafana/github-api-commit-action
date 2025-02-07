<p align="center">
  <a href="https://github.com/grafana/github-api-commit-action/actions"><img alt="typescript-action status" src="https://github.com/grafana/github-api-commit-action/workflows/build-test/badge.svg"></a>
</p>

# GitHub Api Commit

This action commits to the checked out repo via the graphql mutation `createCommitOnBranch`. This mutation supports
signing commits automatically for the user. This is useful when using a GitHub App to do committing for bot related
commits and the repo requires signed commits.

It will build a list of file additions and deletions to commit, and just prior to committing will fetch the latest
commit oid from the remote repo. It will commit to whatever branch is currently checked out in the workflow. For
instance, if you create a branch via `git checkout -b my-test-branch` in one of your steps it will commit to 
`my-test-branch`

## Usage:

```yaml
  - name: Commit changes
    uses: grafana/github-api-commit-action@ccf9b520c5698380ad3b9619c5add427369b7ef1 # v0.2.0
    with:
      token: ${{ github.token }} # Token you want to authenticate with
      commit-message: "<commit-message>" # Commit message defaults to "Commit performed by grafana/github-api-commit-action"
      stage-all-files: true | false # Whether to additionally stage any changed files in the checkout. Defaults to false
```

Example how to use GitHub app installation token

```yaml
  - uses: tibdex/github-app-token@v1
    id: get_installation_token
    with:
      app_id: ${{ secrets.GITHUB_APP_ID }}
      installation_id: ${{ secrets.GITHUB_APP_INSTALLATION_ID }}
      private_key: ${{ secrets.GITHUB_APP_PRIVATE_KEY }}

  - name: Commit changes
    uses: grafana/github-api-commit-action@ccf9b520c5698380ad3b9619c5add427369b7ef1 # v0.2.0
    with:
      token: ${{ steps.get_installation_token.outputs.token }} # Token you want to authenticate with
      commit-message: "<commit-message>" # Commit message defaults to "Commit performed by grafana/github-api-commit-action"
      stage-all-files: true | false # Whether to additionally stage any changed files in the checkout. Defaults to false
```

## Limitations

- The branch that is checked out needs to be in an attached state. Meaning that you can commit and push to it
- Currently, the action only supports adding, updating, and deleting files. It doesn't reconstruct the entire tree for
  commit. Moving files would succeed, but the old file will still remain in its location.

# (Legacy) GitHub Api Commit

> [!NOTE]
> This section is preserved for the sake of knowledge. Note that the action now uses the method of commiting via
> `gh api graphql`

Committing in your workflow can normally be done using git commands or other actions that perform commits for you.
However, if you are using a GitHub App installation token and your repository requires commit signing, there is no way
to attach a signing key to your commit and it must be done through the GitHub api.

The general steps of doing so are

1. [Create a tree](https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#create-a-tree)
2. [Create a commit](https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit)
3. [Update the head reference](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#update-a-reference)

An example can be found [here](https://github.com/orgs/community/discussions/50055)

When committing through the GitHub API using a GitHub App installation token, GitHub will recognize the app and add
commit signing for you.
