import chai from 'chai';
import chaiSubset from 'chai-subset';
import fs from 'fs-extra';

import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, serviceFromJson} from 'docworks-repo';
import git from 'nodegit';

import extractDocs from '../src/extract-compare-push';

chai.use(chaiSubset);
const expect = chai.expect;

const remote = './tmp/remote';
const ver1 = './test/ver1';
const ver2 = './test/ver2';
const ver3 = './test/ver3';
const ver4 = './test/ver4';

let log = [];
const logger = {
  log: (_) => log.push(_),
  error: (_) => log.push(_),
  success: (_) => log.push(_)
};


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
  let files = await saveToDir(remoteBuild, v1);

  logger.log('git add files');
  // git add files
  let index = await remoteBuildRepo.refreshIndex();
  await Promise.all(files.map(file => index.addByPath(file)));
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

async function readServiceFromCommit(commit, fileName) {
  let file = await commit.getEntry(fileName);
  let content = await file.getBlob();
  let fileJson = content.content().toString();
  return serviceFromJson(fileJson);
}

describe('extract compare push workflow', function() {

  beforeEach(() => {
    log = [];
    return fs.remove('./tmp');
  });

  afterEach(function(){
    // console.log(this.currentTest)
    if (this.currentTest.err && this.currentTest.err.stack) {
      let stack = this.currentTest.err.stack;
      let lines = stack.split('\n');
      lines.splice(1, 0, ...log);
      this.currentTest.err.stack = lines.join('\n');
    }
  });


  it('should update remote with changes from v2 over v1', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractDocs(remote, './tmp/local', {"include": ver2, "includePattern": ".+\\.(js)?$"}, logger);

    let remoteRepo = await git.Repository.open(remote);
    let head = await git.Reference.nameToId(remoteRepo, "HEAD");
    let commit = await remoteRepo.getCommit(head);
    let service = await readServiceFromCommit(commit, "Service.service.json");

    expect(commit.message()).to.equal('Service Service operation operation has a new param param2');
    expect(service).to.containSubset({
      labels: ['changed']
    });
  });

  it('should update remote with changes from v2, v3 and v4 over v1', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractDocs(remote, './tmp/local', {"include": ver2, "includePattern": ".+\\.(js)?$"}, logger);
    await extractDocs(remote, './tmp/local2', {"include": ver3, "includePattern": ".+\\.(js)?$"}, logger);
    await extractDocs(remote, './tmp/local3', {"include": ver4, "includePattern": ".+\\.(js)?$"}, logger);

    let remoteRepo = await git.Repository.open(remote);
    let head = await git.Reference.nameToId(remoteRepo, "HEAD");
    let commit = await remoteRepo.getCommit(head);
    let service = await readServiceFromCommit(commit, "Service.service.json");

    expect(commit.message()).to.equal('Service Service has a new operation newOperation');
    expect(service).to.containSubset({
      labels: ['changed']
    });
  });

  it('not update remote if there are no changes', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await extractDocs(remote, './tmp/local', {"include": ver1, "includePattern": ".+\\.(js)?$"}, logger);

    let remoteRepo = await git.Repository.open(remote);
    let head = await git.Reference.nameToId(remoteRepo, "HEAD");
    let commit = await remoteRepo.getCommit(head);
    let service = await readServiceFromCommit(commit, "Service.service.json");

    expect(commit.message()).to.equal('initial commit');
    expect(service).to.not.containSubset({
      labels: ['changed']
    });
  });

});
