import chai from 'chai';
import chaiSubset from 'chai-subset';
import fs from 'fs-extra';
import {join} from 'path';

import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, serviceFromJson} from 'docworks-repo';
import git from 'simple-git';
import asPromise from '../src/as-promise';
import * as logger from './test-logger';

import extractComparePush from '../src/extract-compare-push';

chai.use(chaiSubset);
const expect = chai.expect;

const remote = './tmp/remote';
const ver1 = './test/ver1';
const ver2 = './test/ver2';
const ver3 = './test/ver3';
const ver4 = './test/ver4';
const project2_ver1 = './test/project2-ver1';
const project1 = 'project1';
const project2 = 'project2';
let baseGit = git();

async function createRemoteOnVer1() {
  const remoteBuild = './tmp/remoteBuild';
  // setup
  logger.log('create remote repo');
  logger.log('------------------');
  logger.log('git init');
  await fs.ensureDir(remoteBuild);
  let remoteBuildRepo = git(remoteBuild);
  await asPromise(remoteBuildRepo, remoteBuildRepo.init)();
  // run js doc
  logger.log('jsdoc ./test/ver1');

  let v1 = runJsDoc({"include": ver1, "includePattern": ".+\\.(js)?$",}).services;
  let files = await saveToDir(join(remoteBuild, project1), v1);

  logger.log('git add files');
  // git add files
  await asPromise(remoteBuildRepo, remoteBuildRepo.add)(files.map(file => join(project1, file)));

  logger.log('git commit');
  // commit
  await asPromise(remoteBuildRepo, remoteBuildRepo.commit)("initial commit");

  logger.log(`git clone ${remoteBuild} ${remote} --bare`);
  await asPromise(baseGit, baseGit.clone)(remoteBuild, remote, ['--bare']);
}

async function createBareRemote() {
  // setup
  logger.log('create bare remote');
  logger.log('------------------');
  logger.log('git init --bare');
  await fs.ensureDir(remote);
  let remoteRepo = git(remote);
  await asPromise(remoteRepo, remoteRepo.init)(true);
}

async function getCommitMessage(remoteRepo) {
  let listLogSummary = await asPromise(remoteRepo, remoteRepo.log)(['-1', '--pretty=format:%H;%ai;%B;%aN;%ae']);
  return listLogSummary.latest.message;
}

async function readServiceFromCommit(remoteRepo, fileName) {
  let fileJson = await asPromise(remoteRepo, remoteRepo.catFile)(['-p', `HEAD:${fileName}`]);
  return serviceFromJson(fileJson);
}

describe('extract compare push workflow', function() {

  beforeEach(() => {
    logger.reset();
    return fs.remove('./tmp');
  });

  afterEach(function(){
    // console.log(this.currentTest)
    if (this.currentTest.err && this.currentTest.err.stack) {
      let stack = this.currentTest.err.stack;
      let lines = stack.split('\n');
      lines.splice(1, 0, ...logger.get());
      this.currentTest.err.stack = lines.join('\n');
    }
  });

  it('should update remote with changes from v2 over v1', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], false, logger);

    let remoteRepo = git(remote);
    let service = await readServiceFromCommit(remoteRepo, join(project1, "Service.service.json"));
    let message = await getCommitMessage(remoteRepo);

    expect(message).to.equal('DocWorks for project1 - 1 change detected\nchanges:\nService Service operation operation has a new param param2\n');
    expect(service).to.containSubset({
      labels: ['changed']
    });
  });

  it('dryrun should not update remote with changes from v2 over v1, but should detect them', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], true, logger);

    let remoteRepo = git(remote);
    let service = await readServiceFromCommit(remoteRepo, join(project1, "Service.service.json"));
    let message = await getCommitMessage(remoteRepo);

    expect(message).to.equal('initial commit\n');
    expect(service).to.not.containSubset({
      labels: ['changed']
    });
  });

  it('should push files to a bare remote', async function() {
    await createBareRemote();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], false, logger);

    let remoteRepo = git(remote);
    let service = await readServiceFromCommit(remoteRepo, join(project1, "Service.service.json"));
    let message = await getCommitMessage(remoteRepo);

    expect(message).to.equal('DocWorks for project1 - 1 change detected\nchanges:\nService Service is new\n');
    expect(service).to.containSubset({
      labels: ['new']
    });
  });

  it('should update remote with changes from v2 and v3 over v1', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], false, logger);
    await extractComparePush(remote, './tmp/local2', project1, {"include": ver3, "includePattern": ".+\\.(js)?$"}, [], false, logger);

    let remoteRepo = git(remote);
    let service = await readServiceFromCommit(remoteRepo, join(project1, "Service.service.json"));
    let message = await getCommitMessage(remoteRepo);

    expect(message).to.equal('DocWorks for project1 - 1 change detected\nchanges:\nService Service has a new operation newOperation\n');
    expect(service).to.containSubset({
      labels: ['changed']
    });
  });

  it.only('should update remote with changes from v2, v3 and v4 over v1', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], false, logger);
    await extractComparePush(remote, './tmp/local2', project1, {"include": ver3, "includePattern": ".+\\.(js)?$"}, [], false, logger);
    await extractComparePush(remote, './tmp/local3', project1, {"include": ver4, "includePattern": ".+\\.(js)?$"}, [], false, logger);

    let remoteRepo = git(remote);
    let service = await readServiceFromCommit(remoteRepo, join(project1, "Service.service.json"));
    let message = await getCommitMessage(remoteRepo);

    expect(message).to.equal('DocWorks for project1 - no significant changes detected\n');
    expect(service).to.not.containSubset({
      labels: ['changed']
    });
  });

  it('not update remote if there are no changes', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver1, "includePattern": ".+\\.(js)?$"}, [], false, logger);

    let remoteRepo = git(remote);
    let service = await readServiceFromCommit(remoteRepo, join(project1, "Service.service.json"));
    let message = await getCommitMessage(remoteRepo);

    expect(message).to.equal('initial commit\n');
    expect(service).to.not.containSubset({
      labels: ['changed']
    });
  });

  it('should support two projects working on the same repo', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], false, logger);
    await extractComparePush(remote, './tmp/local2', project2, {"include": project2_ver1, "includePattern": ".+\\.(js)?$"}, [], false, logger);

    let remoteRepo = git(remote);
    let service = await readServiceFromCommit(remoteRepo, join(project1, "Service.service.json"));
    let anotherService = await readServiceFromCommit(remoteRepo, join(project2, "AnotherService.service.json"));
    let message = await getCommitMessage(remoteRepo);

    expect(message).to.equal('DocWorks for project2 - 1 change detected\nchanges:\nService AnotherService is new\n');
    expect(service).to.containSubset({
      labels: ['changed']
    });
    expect(anotherService).to.containSubset({
      labels: ['new']
    });
  });


});
