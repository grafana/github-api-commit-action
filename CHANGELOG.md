# Changelog

## [0.3.1] - 2025-02-13

### 🐛 Bug Fixes

- Validate tokenized urls (#59)
- Pr create steps (#61)

### ⚙️ Miscellaneous Tasks

- Update commit hash in readme; add test for delete (#58)
- Add auto update and merge workflows (#60)
- Update changelog [bot] (#62)

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
