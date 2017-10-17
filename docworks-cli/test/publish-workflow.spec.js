import chai from 'chai';
import chaiSubset from 'chai-subset';
import fs from 'fs-extra';

import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import git from 'nodegit';

import {extractDocs} from '../src/extract-compare-push';

chai.use(chaiSubset);
const expect = chai.expect;

describe('compare repo', function() {

  beforeEach(() => {
    return fs.remove('./tmp');
  });

  it('push updated services - from v1 to v2', async function() {
    // setup
    console.log('setup (remote)');
    console.log('-----');
    console.log('git init');
    let remoteRepo = await git.Repository.init('./tmp/remote', 0);
    // run js doc
    console.log('jsdoc ./test/ver1');
    let v1 = runJsDoc({"include": './test/ver1', "includePattern": ".+\\.(js)?$",}).services;
    let files = await saveToDir('./tmp/remote', v1);

    console.log('git add files');
    // git add files
    let index = await remoteRepo.refreshIndex();
    await Promise.all(files.map(file => index.addByPath(file)));
    await index.write();
    let oid = await index.writeTree();

    console.log('git commit');
    // commit
    var author = git.Signature.default(remoteRepo);
    var committer = git.Signature.default(remoteRepo);
    await remoteRepo.createCommit("HEAD", author, committer, "message", oid, []);


    console.log('');
    console.log('create bare remote (/bare)');
    console.log('------------------');
    console.log('git clone ./tmp/remote ./tmp/bare --bare');
    await git.Clone('./tmp/remote', './tmp/bare', {bare: 1});

    await extractDocs('./tmp/bare', './tmp/local', {"include": './test/ver2', "includePattern": ".+\\.(js)?$"});

  });

});
