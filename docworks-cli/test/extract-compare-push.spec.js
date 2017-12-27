import chai from 'chai';
import chaiSubset from 'chai-subset';
import fs from 'fs-extra';
import {join} from 'path';

import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, serviceFromJson} from 'docworks-repo';
import git from 'nodegit';
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

async function createRemoteOnVer1() {
  const remoteBuild = './tmp/remoteBuild';
  // setup
  logger.log('create remote repo');
  logger.log('------------------');
  logger.log('git init');
  let remoteBuildRepo = await git.Repository.init(remoteBuild, 0);
  // run js doc
  logger.log('jsdoc ./test/ver1');

  let v1 = runJsDoc({"include": ver1, "includePattern": ".+\\.(js)?$",}).services;
  let files = await saveToDir(join(remoteBuild, project1), v1);

  logger.log('git add files');
  // git add files
  let index = await remoteBuildRepo.refreshIndex();
  await Promise.all(files.map(file => index.addByPath(join(project1, file))));
  await index.write();
  let oid = await index.writeTree();

  logger.log('git commit');
  // commit
  let author = git.Signature.default(remoteBuildRepo);
  let committer = git.Signature.default(remoteBuildRepo);
  await remoteBuildRepo.createCommit("HEAD", author, committer, "initial commit", oid, []);

  logger.log(`git clone ${remoteBuild} ${remote} --bare`);
  await git.Clone(remoteBuild, remote, {bare: 1});
}

async function createBareRemote() {
  // setup
  logger.log('create bare remote');
  logger.log('------------------');
  logger.log('git init --bare');
  await git.Repository.init(remote, 1);
}

async function readServiceFromCommit(commit, fileName) {
  let file = await commit.getEntry(fileName);
  let content = await file.getBlob();
  let fileJson = content.content().toString();
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
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], logger);

    let remoteRepo = await git.Repository.open(remote);
    let head = await git.Reference.nameToId(remoteRepo, "HEAD");
    let commit = await remoteRepo.getCommit(head);
    let service = await readServiceFromCommit(commit, join(project1, "Service.service.json"));

    expect(commit.message()).to.equal('Service Service operation operation has a new param param2');
    expect(service).to.containSubset({
      labels: ['changed']
    });
  });

  it('should push files to a bare remote', async function() {
    await createBareRemote();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], logger);

    let remoteRepo = await git.Repository.open(remote);
    let head = await git.Reference.nameToId(remoteRepo, "HEAD");
    let commit = await remoteRepo.getCommit(head);
    let service = await readServiceFromCommit(commit, join(project1, "Service.service.json"));

    expect(commit.message()).to.equal('Service Service is new');
    expect(service).to.containSubset({
      labels: ['new']
    });
  });

  it('should update remote with changes from v2, v3 and v4 over v1', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], logger);
    await extractComparePush(remote, './tmp/local2', project1, {"include": ver3, "includePattern": ".+\\.(js)?$"}, [], logger);
    await extractComparePush(remote, './tmp/local3', project1, {"include": ver4, "includePattern": ".+\\.(js)?$"}, [], logger);

    let remoteRepo = await git.Repository.open(remote);
    let head = await git.Reference.nameToId(remoteRepo, "HEAD");
    let commit = await remoteRepo.getCommit(head);
    let service = await readServiceFromCommit(commit, join(project1, "Service.service.json"));

    expect(commit.message()).to.equal('Service Service has a new operation newOperation');
    expect(service).to.containSubset({
      labels: ['changed']
    });
  });

  it('not update remote if there are no changes', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver1, "includePattern": ".+\\.(js)?$"}, [], logger);

    let remoteRepo = await git.Repository.open(remote);
    let head = await git.Reference.nameToId(remoteRepo, "HEAD");
    let commit = await remoteRepo.getCommit(head);
    let service = await readServiceFromCommit(commit, join(project1, "Service.service.json"));

    expect(commit.message()).to.equal('initial commit');
    expect(service).to.not.containSubset({
      labels: ['changed']
    });
  });

  it('should support two projects working on the same repo', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractComparePush(remote, './tmp/local', project1, {"include": ver2, "includePattern": ".+\\.(js)?$"}, [], logger);
    await extractComparePush(remote, './tmp/local2', project2, {"include": project2_ver1, "includePattern": ".+\\.(js)?$"}, [], logger);

    let remoteRepo = await git.Repository.open(remote);
    let head = await git.Reference.nameToId(remoteRepo, "HEAD");
    let commit = await remoteRepo.getCommit(head);
    let service = await readServiceFromCommit(commit, join(project1, "Service.service.json"));
    let anotherService = await readServiceFromCommit(commit, join(project2, "AnotherService.service.json"));

    expect(commit.message()).to.equal('Service AnotherService is new');
    expect(service).to.containSubset({
      labels: ['changed']
    });
    expect(anotherService).to.containSubset({
      labels: ['new']
    });
  });


});
