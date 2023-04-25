<p align="center">
  <a href="https://github.com/grafana/github-api-commit-action/actions"><img alt="typescript-action status" src="https://github.com/grafana/github-api-commit-action/workflows/build-test/badge.svg"></a>
</p>

# GitHub Api Commit

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

## Usage:

```yaml
  - name: Commit changes
    uses: grafana/github-api-commit-action@v1
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
    uses: grafana/github-api-commit-action@v1
    with:
      token: ${{ steps.get_installation_token.outputs.token }} # Token you want to authenticate with
      commit-message: "<commit-message>" # Commit message defaults to "Commit performed by grafana/github-api-commit-action"
      stage-all-files: true | false # Whether to additionally stage any changed files in the checkout. Defaults to false
```

## Limitations

- The branch that is checked out needs to be in an attached state. Meaning that you can commit and push to it
- Currently, the action only supports adding and updating file contents. It doesn't reconstruct the entire tree for
  commit. Moving files would succeed, but the old file will still remain in its location.
