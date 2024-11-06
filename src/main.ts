import * as core from '@actions/core'
import type {ExecOptions} from '@actions/exec'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import fs from 'fs'
import path from 'path'
import {
  Mode,
  Tree,
  TreeEntry,
  TreeType,
  GitFileChangeType,
  GitFileChange
} from './types'
import {Context} from '@actions/github/lib/context'

async function getTrimmedOutput(
  command: string,
  args?: string[],
  options?: ExecOptions
): Promise<string> {
  const {stdout, stderr, exitCode} = await exec.getExecOutput(
    command,
    args,
    options
  )

  if (exitCode) {
    throw new Error(stderr)
  }

  return stdout.trim()
}

async function getTrimmedOutputArray(
  command: string,
  args?: string[],
  options?: ExecOptions
): Promise<string[]> {
  return (await getTrimmedOutput(command, args, options))
    .split('\n')
    .map(f => f.trim())
    .filter(f => f !== '')
}

async function getRepoFromCheckout(): Promise<Context['repo']> {
  const remoteOriginUrl = await getTrimmedOutput('git', [
    'remote',
    'get-url',
    'origin'
  ])

  core.debug(`remoteOriginUrl: ${remoteOriginUrl}`)

  const githubRepoRegex =
    /^(?:https:\/\/github\.com\/|git@github\.com:)([^/]+)\/([^/]+?)(?:\.git)?$/

  const match = remoteOriginUrl.match(githubRepoRegex)

  if (match) {
    const repo = {
      owner: match[1],
      repo: match[2]
    }
    core.debug(`repo:\n${JSON.stringify(repo, null, 2)}`)
    return repo
  }

  throw new Error('Failure to parse repo from origin URL')
}

function fileModeToMode(fileMode: string): Mode {
  return Number(fileMode) > 700 ? '100755' : '100644'
}

async function processModifiedFile(
  rootDir: string,
  _file: string
): Promise<TreeEntry> {
  // Get the current file mode to preserve it
  const fileMode = await getTrimmedOutput('stat', [
    '--format',
    '"%a"',
    path.resolve(rootDir, _file)
  ])

  // We only fetched files with our diff so we can safely assume one of the blob types
  const mode = fileModeToMode(fileMode)
  const type: TreeType = 'blob'

  const treeEntry = {
    path: _file,
    mode: mode,
    type: type,
    content: fs.readFileSync(path.resolve(rootDir, _file), {
      encoding: 'utf-8'
    })
  }

  return treeEntry
}

async function processDeletedFile(_file: string): Promise<TreeEntry> {
  const mode: Mode = '100644'
  const type: TreeType = 'blob'

  const treeEntry = {
    path: _file,
    mode: mode, // mode should not matter since this file is getting deleted
    type: type,
    sha: null
  }

  return treeEntry
}

async function processGitFileStatus(entry: string): Promise<GitFileChange> {
  var entryArr = entry.split(/(\s+)/).filter(e => e.trim().length > 0)

  var changeType = entryArr[0]

  switch (changeType[0]) {
    case 'M':
    case 'A':
      return {
        action: changeType[0] as GitFileChangeType,
        old_path: entryArr[1],
        new_path: entryArr[1]
      }
    case 'D':
      return {
        action: changeType[0] as GitFileChangeType,
        old_path: entryArr[1]
      }
    case 'R':
      return {
        action: changeType[0] as GitFileChangeType,
        old_path: entryArr[1],
        new_path: entryArr[2]
      }
    default:
      throw new Error('Failure to parse git diff')
  }
}

async function processFileEntry(
  rootDir: string,
  entry: GitFileChange
): Promise<Tree> {
  switch (entry.action) {
    case 'M':
    case 'A':
      return [await processModifiedFile(rootDir, entry.old_path)]
    case 'D':
      return [await processDeletedFile(entry.old_path)]
    case 'R':
      if (entry.new_path === undefined) {
        throw new Error('Invalid file rename entry')
      }
      return [
        await processDeletedFile(entry.old_path),
        await processModifiedFile(rootDir, entry.new_path)
      ]
    default:
      throw new Error('Failure to parse git diff')
  }
}

async function run(): Promise<void> {
  try {
    const stageAllFiles = core.getInput('stage-all-files')
    const token = core.getInput('token')
    const useCheckoutRepo = core.getInput('use-checkout-repo')

    const octokit = github.getOctokit(token)

    const repo =
      useCheckoutRepo === 'true'
        ? await getRepoFromCheckout()
        : github.context.repo

    // Get the root directory for the repository
    const rootDir = await getTrimmedOutput('git', [
      'rev-parse',
      '--show-toplevel'
    ])

    // Get the full ref for the branch we have checked out
    const ref = (
      await getTrimmedOutput('git', [
        'rev-parse',
        '--symbolic-full-name',
        'HEAD'
      ])
    ).replace(/^refs\//, '')

    core.info(`Committing to: ${ref}`)

    // We need the latest commit hash to use as our base tree
    const latestSha = await getTrimmedOutput('git', ['rev-parse', 'HEAD'])

    core.info(`Latest commit hash: ${latestSha}`)

    if (stageAllFiles === 'true') {
      const stageExitCode = await exec.exec('git', ['add', '.'], {cwd: rootDir})
      if (stageExitCode) {
        throw new Error('Failure to stage files using "git add ."')
      }
    }

    // Get only staged files
    const diff = await getTrimmedOutputArray(
      'git',
      ['diff', '--staged', '--name-status', 'HEAD'],
      {cwd: rootDir}
    )

    const gitFileChanges = await Promise.all(
      diff.map(async change => processGitFileStatus(change))
    )

    // Generate the tree
    const tree: Tree = (
      await Promise.all(
        gitFileChanges.map(async change => {
          return processFileEntry(rootDir, change)
        })
      )
    ).reduce((accumulator, value) => accumulator.concat(value), [])

    const createTreePayload = {
      ...repo,
      base_tree: latestSha,
      tree
    }

    core.debug(
      `Create tree payload:\n ${JSON.stringify(createTreePayload, null, 2)}`
    )

    // 1. Create the new tree
    const treeSha = (await octokit.rest.git.createTree(createTreePayload)).data
      .sha

    const createCommitPayload = {
      ...repo,
      message: core.getInput('commit-message'),
      parents: [latestSha],
      tree: treeSha
    }

    core.debug(
      `Create commit payload:\n ${JSON.stringify(createCommitPayload, null, 2)}`
    )

    // 2. Create the commit
    const createdCommitSha = (
      await octokit.rest.git.createCommit(createCommitPayload)
    ).data.sha

    // 3. Update the reference to the new sha
    const updateRefPayload = {
      ...repo,
      ref,
      sha: createdCommitSha
    }

    core.debug(
      `Update ref payload:\n ${JSON.stringify(updateRefPayload, null, 2)}`
    )

    await octokit.rest.git.updateRef(updateRefPayload)

    core.info('Resetting local file changes to pull new commit')
    await exec.exec('git', ['reset', '--hard', 'HEAD'])

    core.info('Pulling latest commit')
    await exec.exec('git', ['pull'])

    core.info(
      JSON.stringify(
        {'commit-sha': createdCommitSha, 'committed-files': gitFileChanges},
        null,
        2
      )
    )

    core.setOutput('commit-sha', createdCommitSha)
    core.setOutput('committed-files', JSON.stringify(gitFileChanges))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
