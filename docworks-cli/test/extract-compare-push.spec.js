import chai from 'chai'
import chaiSubset from 'chai-subset'
import fs from 'fs-extra'
import {join} from 'path'

import runJsDoc from 'docworks-jsdoc2spec'
import {saveToDir, serviceFromJson} from 'docworks-repo'
import Git from '../src/git'
import * as logger from './test-logger'

import extractComparePush from '../src/extract-compare-push'

chai.use(chaiSubset)
const expect = chai.expect

const remote = './tmp/remote'
const ver1 = './test/ver1'
const ver2 = './test/ver2'
const ver3 = './test/ver3'
const ver4 = './test/ver4'
const project2_ver1 = './test/project2-ver1'
const project1 = 'project1'
const project2 = 'project2'
const largeFiles = './test/large-files'

let baseGit = new Git()

async function createRemoteOnVer1() {
  const remoteBuild = './tmp/remoteBuild'
  // setup
  logger.log('create remote repo')
  logger.log('------------------')
  logger.log('git init')
  await fs.ensureDir(remoteBuild)
  let remoteBuildRepo = new Git(remoteBuild)
  await remoteBuildRepo.init()
  // run js doc
  logger.log('jsdoc ./test/ver1')

  let v1 = runJsDoc({'include': ver1, 'includePattern': '.+\\.(js)?$',}).services
  let files = await saveToDir(join(remoteBuild, project1), v1)

  logger.log('git add files')
  // git add files
  await remoteBuildRepo.add(files.map(file => join(project1, file)))

  logger.log('git commit')
  // commit
  await remoteBuildRepo.commit('initial commit')

  logger.log(`git clone ${remoteBuild} ${remote} --bare`)
  await baseGit.clone(remoteBuild, remote, ['--bare'])
}

async function createBareRemote() {
  // setup
  logger.log('create bare remote')
  logger.log('------------------')
  logger.log('git init --bare')
  await fs.ensureDir(remote)
  let remoteRepo = new Git(remote)
  await remoteRepo.init(true)
}

describe('extract compare push workflow', function() {

  beforeEach(() => {
    logger.reset()
    return fs.remove('./tmp')
  })

  afterEach(function(){
    // console.log(this.currentTest)
    if (this.currentTest.err && this.currentTest.err.stack) {
      let stack = this.currentTest.err.stack
      let lines = stack.split('\n')
      lines.splice(1, 0, ...logger.get())
      this.currentTest.err.stack = lines.join('\n')
    }
  })

  it('should update remote with changes from v2 over v1', async function() {
    await createRemoteOnVer1()
    logger.log('run test')
    logger.log('--------')
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local', projectSubdir: project1,
        jsDocSources: {'include': ver2, 'includePattern': '.+\\.(js)?$'}, plugins: [], enrichmentDocsDir: false, dryrun: false}, logger)

    let remoteRepo = new Git(remote)
    let service = serviceFromJson(await remoteRepo.readFile(join(project1, 'Service.service.json')))
    let message = await remoteRepo.getCommitMessage()

    expect(message).to.equal('DocWorks for project1 - 1 change detected\nchanges:\nService Service operation operation has a new param param2\n')
    expect(service).to.containSubset({
      labels: ['changed']
    })
  })

  it('dryrun should not update remote with changes from v2 over v1, but should detect them', async function() {
    await createRemoteOnVer1()
    logger.log('run test')
    logger.log('--------')
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local', projectSubdir: project1,
      jsDocSources: {'include': ver2, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: true}, logger)

    let remoteRepo = new Git(remote)
    let service = serviceFromJson(await remoteRepo.readFile(join(project1, 'Service.service.json')))
    let message = await remoteRepo.getCommitMessage()

    expect(message).to.equal('initial commit\n')
    expect(service).to.not.containSubset({
      labels: ['changed']
    })
  })

  it('should push files to a bare remote', async function() {
    await createBareRemote()
    logger.log('run test')
    logger.log('--------')
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local', projectSubdir: project1,
      jsDocSources: {'include': ver2, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)

    let remoteRepo = new Git(remote)
    let service = serviceFromJson(await remoteRepo.readFile(join(project1, 'Service.service.json')))
    let message = await remoteRepo.getCommitMessage()

    expect(message).to.equal('DocWorks for project1 - 1 change detected\nchanges:\nService Service is new\n')
    expect(service).to.containSubset({
      labels: ['new']
    })
  })

  it('should update remote with changes from v2 and v3 over v1', async function() {
    await createRemoteOnVer1()
    logger.log('run test')
    logger.log('--------')
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local', projectSubdir: project1,
        jsDocSources: {'include': ver2, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local2', projectSubdir: project1,
        jsDocSources: {'include': ver3, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)

    let remoteRepo = new Git(remote)
    let service = serviceFromJson(await remoteRepo.readFile(join(project1, 'Service.service.json')))
    let message = await remoteRepo.getCommitMessage()

    expect(message).to.equal('DocWorks for project1 - 1 change detected\nchanges:\nService Service has a new operation newOperation\n')
    expect(service).to.containSubset({
      labels: ['changed']
    })
  })

  it('should update remote with changes from v2, v3 and v4 over v1', async function() {
    await createRemoteOnVer1()
    logger.log('run test')
    logger.log('--------')
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local', projectSubdir: project1,
        jsDocSources: {'include': ver2, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local2', projectSubdir: project1,
        jsDocSources: {'include': ver3, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local3', projectSubdir: project1,
        jsDocSources: {'include': ver4, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)

    let remoteRepo = new Git(remote)
    let service = serviceFromJson(await remoteRepo.readFile(join(project1, 'Service.service.json')))
    let message = await remoteRepo.getCommitMessage()

    expect(message).to.equal('DocWorks for project1 - no significant changes detected\n')
    expect(service).to.not.containSubset({
      labels: ['changed']
    })
  })

  it('not update remote if there are no changes', async function() {
    await createRemoteOnVer1()
    logger.log('run test')
    logger.log('--------')
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local', projectSubdir: project1,
        jsDocSources: {'include': ver1, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)

    let remoteRepo = new Git(remote)
    let service = serviceFromJson(await remoteRepo.readFile(join(project1, 'Service.service.json')))
    let message = await remoteRepo.getCommitMessage()

    expect(message).to.equal('initial commit\n')
    expect(service).to.not.containSubset({
      labels: ['changed']
    })
  })

  it('should support two projects working on the same repo', async function() {
    await createRemoteOnVer1()
    logger.log('run test')
    logger.log('--------')
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local', projectSubdir: project1,
        jsDocSources: {'include': ver2, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)
    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local2', projectSubdir: project2,
        jsDocSources: {'include': project2_ver1, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)

    let remoteRepo = new Git(remote)
    let service = serviceFromJson(await remoteRepo.readFile(join(project1, 'Service.service.json')))
    let anotherService = serviceFromJson(await remoteRepo.readFile(join(project2, 'AnotherService.service.json')))
    let message = await remoteRepo.getCommitMessage()

    expect(message).to.equal('DocWorks for project2 - 1 change detected\nchanges:\nService AnotherService is new\n')
    expect(service).to.containSubset({
      labels: ['changed']
    })
    expect(anotherService).to.containSubset({
      labels: ['new']
    })
  })

  it.only('should not fail on large change-sets', async function() {
    this.timeout(10000)

    await createRemoteOnVer1()
    logger.log('run test')
    logger.log('--------')

    await extractComparePush({remoteRepo: remote, remoteBranch: null, workingDir: './tmp/local2', projectSubdir: project2,
        jsDocSources: {'include': largeFiles, 'includePattern': '.+\\.(js)?$'}, plugins: [], dryrun: false}, logger)

    let remoteRepo = new Git(remote)
    let service = serviceFromJson(await remoteRepo.readFile(join(project1, 'Service.service.json')))
    let anotherService = serviceFromJson(await remoteRepo.readFile(join(project2, 'AnotherService.service.json')))
    let message = await remoteRepo.getCommitMessage()

    expect(message).to.equal('DocWorks for project2 - 1 change detected\nchanges:\nService AnotherService is new\n')
    expect(service).to.containSubset({
      labels: ['changed']
    })
    expect(anotherService).to.containSubset({
      labels: ['new']
    })
  })
})
