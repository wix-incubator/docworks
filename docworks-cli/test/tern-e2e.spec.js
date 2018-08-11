import chai from 'chai';
import chaiSubset from 'chai-subset';
import fs from 'fs-extra';
import {join} from 'path';
import {spawn} from 'child_process';
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

async function runTern(args) {
  let child = spawn('node', args);

  return new Promise((fulfill, reject) => {
    let stdout = '';
    let stderr = '';

    let stdoutLog = (data) => {
      const line = data.toString('utf8');
      stdout += line;
      process.stdout.write(line);
    };
    let stderrLog = (data) => {
      const line = data.toString('utf8');
      stderr += line;
      process.stderr.write(line);
    };

    child.on('exit', () => fulfill({stdout, stderr}));
    child.on('error', reject);
    child.stdout.on('data', stdoutLog);
    child.stderr.on('data', stderrLog);
  })
}

describe('tern workflow e2e', function() {

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

  it('generate tern from a remote repo', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await runTern(`.bin/docworks tern -r ${remote} -u http://base-url.com -n apiname -o ./tmp/tern.js`.split(' '));

    let content = await fs.readFile('tmp/tern.js', 'utf-8');

    expect(content).to.equal(
      `define([], function() { return {
	"!define": {
		"Service": {
			"!doc": "this is a service",
			"!url": "http://base-url.com/Service.html",
			"prototype": {
				"operation": {
					"!type": "fn(param: string)",
					"!doc": "",
					"!url": "http://base-url.com/Service.html#operation"
				}
			}
		}
	},
	"!name": "apiname"
}; });`
    );
  });

});
