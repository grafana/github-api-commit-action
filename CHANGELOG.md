# Changelog

## [1.0.0](https://github.com/grafana/github-api-commit-action/compare/v0.4.3...v1.0.0) (2025-05-07)


### ⚠ BREAKING CHANGES

* add token to remote URL so remote operations have auth ([#111](https://github.com/grafana/github-api-commit-action/issues/111))

### 🚀 Features

* add token to remote URL so remote operations have auth ([#111](https://github.com/grafana/github-api-commit-action/issues/111)) ([219f96d](https://github.com/grafana/github-api-commit-action/commit/219f96df5c2c646d38463d3a0d18979616448b41))

## [0.4.3](https://github.com/grafana/github-api-commit-action/compare/v0.4.2...v0.4.3) (2025-05-06)


### 🧪 Testing

* improve test workflow to reduce boilerplate ([#104](https://github.com/grafana/github-api-commit-action/issues/104)) ([702c057](https://github.com/grafana/github-api-commit-action/commit/702c057668af23a7bbd990f46ee800b1603f41bd))


### 📦 Dependency Updates

* **deps:** bump grafana/github-api-commit-action from 0.4.0 to 0.4.2 ([#102](https://github.com/grafana/github-api-commit-action/issues/102)) ([f5788fb](https://github.com/grafana/github-api-commit-action/commit/f5788fbbe894fa820e1ee49d5e9d8e5149f72282))

## [0.4.2](https://github.com/grafana/github-api-commit-action/compare/v0.4.1...v0.4.2) (2025-04-22)


### 📚 Documentation

* **CONTRIBUTING:** add contribution guide ([#99](https://github.com/grafana/github-api-commit-action/issues/99)) ([6bdf8f1](https://github.com/grafana/github-api-commit-action/commit/6bdf8f1cb22d95f48887e9ea05a7010f8d2bbc25))

## [0.4.1](https://github.com/grafana/github-api-commit-action/compare/v0.4.0...v0.4.1) (2025-04-21)


### 📚 Documentation

* **README:** add releases section to README template ([#93](https://github.com/grafana/github-api-commit-action/issues/93)) ([80353e9](https://github.com/grafana/github-api-commit-action/commit/80353e98320a5165a7d134e55868d29c210bf87e))

## [0.4.0](https://github.com/grafana/github-api-commit-action/compare/v0.3.1...v0.4.0) (2025-04-21)


### 🚀 Features

* improve support for larger commits ([cae2afb](https://github.com/grafana/github-api-commit-action/commit/cae2afb911661e78ed33f4a07d17b6ad105b2ac4))


### 🐛 Bug Fixes

* support no changes ([#67](https://github.com/grafana/github-api-commit-action/issues/67)) ([665f5a0](https://github.com/grafana/github-api-commit-action/commit/665f5a07397c8574da8babb275bc27bf4fd542c0))
* test workflow use default checkout ref for pull request ([#68](https://github.com/grafana/github-api-commit-action/issues/68)) ([ee8e5db](https://github.com/grafana/github-api-commit-action/commit/ee8e5db2746fd53945d81daeee489265d6cdc238))


### 🧪 Testing

* fix conditionals for test cases ([#77](https://github.com/grafana/github-api-commit-action/issues/77)) ([a10f0e3](https://github.com/grafana/github-api-commit-action/commit/a10f0e3ecded6e63f5f0e208acae7496bc69e8c7))


### ⚙️ Miscellaneous Tasks

* add vault secrets to workflows; update test to pull_request_target ([#72](https://github.com/grafana/github-api-commit-action/issues/72)) ([e884679](https://github.com/grafana/github-api-commit-action/commit/e8846792fd30ed6023eb560f3d2654fecd9a4d0a))
* bootstrap release-please config ([#81](https://github.com/grafana/github-api-commit-action/issues/81)) ([a1de24a](https://github.com/grafana/github-api-commit-action/commit/a1de24a3244cc89866e77d2afdc1729dab9dd9bf))
* **changelog:** generate changelog and add sections to release-please config ([#86](https://github.com/grafana/github-api-commit-action/issues/86)) ([f76be42](https://github.com/grafana/github-api-commit-action/commit/f76be42c88502e9740b110813650a9dbe85207dd))
* **deps:** bump actions/create-github-app-token from 1 to 2 ([#79](https://github.com/grafana/github-api-commit-action/issues/79)) ([412b51b](https://github.com/grafana/github-api-commit-action/commit/412b51bdf2e89caaf37e5b53b8fbc8a4c1c1c412))
* **deps:** bump grafana/github-api-commit-action from 0.3.0 to 0.3.1 ([#65](https://github.com/grafana/github-api-commit-action/issues/65)) ([cdc46bd](https://github.com/grafana/github-api-commit-action/commit/cdc46bd6d01c95fecdf1cf2acb3106478518d17e))
* trigger tests via workflow call, dispatch or push to main ([#75](https://github.com/grafana/github-api-commit-action/issues/75)) ([f72ba3b](https://github.com/grafana/github-api-commit-action/commit/f72ba3ba7d3a7def86ad1d8b5e7706912494e4c1))

## [0.3.1] - 2025-02-13

### 🐛 Bug Fixes

- Validate tokenized urls (#59)
- Pr create steps (#61)

### ⚙️ Miscellaneous Tasks

- Update commit hash in readme; add test for delete (#58)
- Add auto update and merge workflows (#60)

## [0.3.0] - 2025-02-10

### 💼 Other

- [**breaking**] Convert action to use graphql mutation (#57)

## [0.2.0] - 2023-09-19

### 🚀 Features

- Add ability to commit to checked out repo instead of context repo

### ⚙️ Miscellaneous Tasks

- *(version)* Update version in readme and update changelog
- Update readme, changelog and commit message in update changelog
- Fix linting error and rebuild action

## [0.1.0] - 2023-04-25

### 🚀 Features

- *(wip)* Begin pulling in pieces of action
- *(commit-flow)* Add in remaining steps to commit files
- *(github)* Use * as github instead of default import
- *(exec)* Use * as exec instead of default export
- *(cwd)* Remove cwd option as it said it doesnt exist. Not sure if its considered relative or not
- *(cd)* Remove cd because it wasn't available
- *(action)* Add logging to action and improve workflow (#4)

### ⚙️ Miscellaneous Tasks

- *(build)* Disable codeql until repo is public, build action
- *(pwd)* Add pwd command to see what the directory structure looks like
- *(pwd)* Add realpath to see what the path of the files are
- *(path)* Print out realpath of file
- *(rootDir)* Remove reference to rootdir to see if action can see files
- *(debug)* Add debug logging
- *(trim)* Trim the output of any execs
- *(cleanup)* Readme updates, remove unused code (#6)
