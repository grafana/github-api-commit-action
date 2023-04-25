import * as core from '@actions/core'
import type {ExecOptions} from '@actions/exec'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import fs from 'fs'
import path from 'path'
import {Tree} from './types'

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

async function run(): Promise<void> {
  try {
    const stageAllFiles = core.getInput('stage-all-files')
    const token = core.getInput('token')
    const octokit = github.getOctokit(token)
    const context = github.context

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
      ['diff', '--staged', '--name-only', 'HEAD'],
      {cwd: rootDir}
    )

    // Generate the tree
    const tree: Tree = await Promise.all(
      diff.map(async _file => {
        // Get the current file mode to preserve it
        const fileMode = await getTrimmedOutput('stat', [
          '--format',
          '"%a"',
          path.resolve(rootDir, _file)
        ])

        // We only fetched files with our diff so we can safely assume one of the blob types
        const mode = Number(fileMode) > 700 ? '100755' : '100644'

        return {
          path: _file,
          mode,
          type: 'blob',
          content: fs.readFileSync(path.resolve(rootDir, _file), {
            encoding: 'utf-8'
          })
        }
      })
    )

    const createTreePayload = {
      ...context.repo,
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
      ...context.repo,
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
      ...context.repo,
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
        {'commit-sha': createdCommitSha, 'committed-files': diff},
        null,
        2
      )
    )

    core.setOutput('commit-sha', createdCommitSha)
    core.setOutput('committed-files', JSON.stringify(diff))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
