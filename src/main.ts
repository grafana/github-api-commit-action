import * as core from '@actions/core'
import exec from '@actions/exec'
import github from '@actions/github'
import {wait} from './wait'
import fs from 'fs'
import path from 'path'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    const stageAllFiles = core.getInput('stage-all-files')

    const context = github.context
    const octokit = github.getOctokit(token)

    // Get the root directory for the repository
    const {
      stdout: rootDir,
      stderr: rootDirErr,
      exitCode: rootDirExitCode
    } = await exec.getExecOutput('git', ['rev-parse', '--show-toplevel'])

    if (stageAllFiles === 'true') {
      await exec.exec('git', ['add', '.'], {cwd: rootDir})
    }

    // Get only staged files
    const {
      stdout: diffString,
      stderr: diffErr,
      exitCode: diffExitCode
    } = await exec.getExecOutput(
      'git',
      ['diff', '--staged', '--name-only', 'HEAD'],
      {cwd: rootDir}
    )

    // Split the output into an array of files
    const diff = diffString
      .split('\n')
      .map(f => f.trim())
      .filter(f => f !== '')

    // Generate the tree
    const tree = diff.map(_file => {
      return {
        path: _file,
        mode: '100644', // non-executable blob
        type: 'blob',
        content: fs.readFileSync(path.join(rootDir, _file), {
          encoding: 'utf-8'
        })
      }
    })

    const createTreePayload = {
      owner: 'grafana',
      repo: 'cloud-data-archiver-plugin',
      base_tree: `${process.env.LATEST_SHA}`,
      tree
    }

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
