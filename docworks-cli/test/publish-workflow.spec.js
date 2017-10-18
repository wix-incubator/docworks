import chai from 'chai';
import chaiSubset from 'chai-subset';
import fs from 'fs-extra';
import chalk from 'chalk';

import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import git from 'nodegit';

import extractDocs from '../src/extract-compare-push';

chai.use(chaiSubset);

const expect = chai.expect;
const remote = './tmp/remote';
const comment = (_) => console.log(`    ${chalk.gray(_)}`);
let log = [];
const logger = (_) => log.push(_);


async function createRemoteOnVer1() {
  const remoteBuild = './tmp/remoteBuild';
  // setup
  logger('create remote repo');
  logger('------------------');
  logger('git init');
  let remoteRepo = await git.Repository.init(remoteBuild, 0);
  // run js doc
  logger('jsdoc ./test/ver1');
  let v1 = runJsDoc({"include": './test/ver1', "includePattern": ".+\\.(js)?$",}).services;
  let files = await saveToDir(remoteBuild, v1);

  logger('git add files');
  // git add files
  let index = await remoteRepo.refreshIndex();
  await Promise.all(files.map(file => index.addByPath(file)));
  await index.write();
  let oid = await index.writeTree();

  logger('git commit');
  // commit
  let author = git.Signature.default(remoteRepo);
  let committer = git.Signature.default(remoteRepo);
  await remoteRepo.createCommit("HEAD", author, committer, "message", oid, []);

  logger(`git clone ${remoteBuild} ${remote} --bare`);
  await git.Clone(remoteBuild, remote, {bare: 1});
}

describe('extract compare push workflow', function() {

  beforeEach(() => {
    log = [];
    return fs.remove('./tmp');
  });

  afterEach(function(){
    if (true /*this.currentTest.state == 'failed'*/) {
      log.forEach(comment);
    }
  });


  it('update remote with changes from v2 over v1', async function() {
    await createRemoteOnVer1();
    logger('run test');
    logger('--------');
    await extractDocs(remote, './tmp/local', {"include": './test/ver2', "includePattern": ".+\\.(js)?$"}, logger);

  });

});
