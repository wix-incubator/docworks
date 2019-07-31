import fs from 'fs-extra'
import {join} from 'path'
import {spawn} from 'child_process'
import runJsDoc from 'docworks-jsdoc2spec'
import {saveToDir} from 'docworks-repo'
import git from 'simple-git'
import asPromise from '../src/as-promise'
import * as logger from './test-logger'

async function createRemoteOnVer1(remote) {
    const ver1 = './test/ver1'
    const project1 = 'project1'
    const  baseGit = git()

    const remoteBuild = './tmp/remoteBuild'
    // setup
    logger.log('create remote repo')
    logger.log('------------------')
    logger.log('git init')
    fs.ensureDirSync(remoteBuild)
    let remoteBuildRepo = git(remoteBuild)
    await asPromise(remoteBuildRepo, remoteBuildRepo.init)()
    // run js doc
    logger.log(`jsdoc ${ver1}`)

    let v1 = runJsDoc({'include': ver1, 'includePattern': '.+\\.(js)?$',}).services
    let files = await saveToDir(join(remoteBuild, project1), v1)

    logger.log('git add files')
    // git add files
    await asPromise(remoteBuildRepo, remoteBuildRepo.add)(files.map(file => join(project1, file)))

    logger.log('git commit')
    // commit
    await asPromise(remoteBuildRepo, remoteBuildRepo.commit)('initial commit')

    logger.log(`git clone ${remoteBuild} ${remote} --bare`)
    await asPromise(baseGit, baseGit.clone)(remoteBuild, remote, ['--bare'])
}

async function runCommand(args) {
    let child = spawn('node', args)

    return new Promise((fulfill, reject) => {
        let stdout = ''
        let stderr = ''

        let stdoutLog = (data) => {
            const line = data.toString('utf8')
            stdout += line
            process.stdout.write(line)
        }
        let stderrLog = (data) => {
            const line = data.toString('utf8')
            stderr += line
            process.stderr.write(line)
        }

        child.on('exit', () => fulfill({stdout, stderr}))
        child.on('error', reject)
        child.stdout.on('data', stdoutLog)
        child.stderr.on('data', stderrLog)
    })
}

export {createRemoteOnVer1, runCommand}