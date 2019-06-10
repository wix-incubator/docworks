import chai from 'chai';
import chaiSubset from 'chai-subset';
import fs from 'fs-extra';
import {join} from 'path';
import {spawn} from 'child_process';
import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, serviceFromJson} from 'docworks-repo';
import Git from '../src/git';
import * as logger from './test-logger';

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
let baseGit = new Git();

async function createRemoteOnVer1() {
  const remoteBuild = './tmp/remoteBuild';
  // setup
  logger.log('create remote repo');
  logger.log('------------------');
  logger.log('git init');
  await fs.ensureDir(remoteBuild);
  let remoteBuildRepo = new Git(remoteBuild);
  await remoteBuildRepo.init();
  // run js doc
  logger.log('jsdoc ./test/ver1');

  let v1 = runJsDoc({"include": ver1, "includePattern": ".+\\.(js)?$",}).services;
  let files = await saveToDir(join(remoteBuild, project1), v1);

  logger.log('git add files');
  // git add files
  await remoteBuildRepo.add(files.map(file => join(project1, file)));

  logger.log('git commit');
  // commit
  await remoteBuildRepo.commit("initial commit");

  logger.log(`git clone ${remoteBuild} ${remote} --bare`);
  await baseGit.clone(remoteBuild, remote, ['--bare']);
}

async function runDocWorks(args) {
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

describe('extract compare push workflow e2e', function() {

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

  it('including test/include/folder1, should include service 1 and 3', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await runDocWorks(`.bin/docworks ecp -r ${remote} --fs test/include/folder1 -p ${project2} --fp .+\\.js?$`.split(' '));

    let remoteRepo = new Git(remote);
    let service1 = await remoteRepo.fileExists(join(project2, "Service1.service.json"));
    let service2 = await remoteRepo.fileExists(join(project2, "Service2.service.json"));
    let service3 = await remoteRepo.fileExists(join(project2, "Service3.service.json"));
    let message = await remoteRepo.getCommitMessage();

    expect(message).to.include('Service Service1 is new');
    expect(message).to.not.include('Service Service2 is new');
    expect(message).to.include('Service Service3 is new');
    expect(service1).to.be.true;
    expect(service2).to.be.false;
    expect(service3).to.be.true;
  });

  it('dryrun including test/include/folder1, should include service 1 and 3', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    let output = await runDocWorks(`.bin/docworks ecp -r ${remote} --fs test/include/folder1 -p ${project2} --fp .+\\.js?$ --dryrun`.split(' '));

    let remoteRepo = new Git(remote);
    let service1 = await remoteRepo.fileExists(join(project2, "Service1.service.json"));
    let service2 = await remoteRepo.fileExists(join(project2, "Service2.service.json"));
    let service3 = await remoteRepo.fileExists(join(project2, "Service3.service.json"));
    let message = await remoteRepo.getCommitMessage();

    expect(output.stdout).to.include('Service Service1 is new');
    expect(output.stdout).to.not.include('Service Service2 is new');
    expect(output.stdout).to.include('Service Service3 is new');
    expect(message).to.include('initial commit');
    expect(service1).to.be.false;
    expect(service2).to.be.false;
    expect(service3).to.be.false;
  });

  it('including test/include/folder1 and folder2, should include service 1, 2, 3 and 4', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await runDocWorks(`.bin/docworks ecp -r ${remote} --fs test/include/folder1 --fs test/include/folder2 -p ${project2} --fp .+\\.js?$`.split(' '));

    let remoteRepo = new Git(remote);
    let service1 = await remoteRepo.fileExists(join(project2, "Service1.service.json"));
    let service2 = await remoteRepo.fileExists(join(project2, "Service2.service.json"));
    let service3 = await remoteRepo.fileExists(join(project2, "Service3.service.json"));
    let service4 = await remoteRepo.fileExists(join(project2, "Service4.service.json"));
    let message = await remoteRepo.getCommitMessage();

    expect(message).to.include('Service Service1 is new');
    expect(message).to.include('Service Service2 is new');
    expect(message).to.include('Service Service3 is new');
    expect(message).to.include('Service Service4 is new');
    expect(service1).to.be.true;
    expect(service2).to.be.true;
    expect(service3).to.be.true;
    expect(service4).to.be.true;
  });

  it('including test/include/folder1 and folder2, excluding folder 3, should include service 1, 2 and 4', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await runDocWorks(`.bin/docworks ecp -r ${remote} --fs test/include/folder1 --fs test/include/folder2 --fx test/include/folder1/folder3 -p ${project2} --fp .+\\.js?$`.split(' '));

    let remoteRepo = new Git(remote);
    let service1 = await remoteRepo.fileExists(join(project2, "Service1.service.json"));
    let service2 = await remoteRepo.fileExists(join(project2, "Service2.service.json"));
    let service3 = await remoteRepo.fileExists(join(project2, "Service3.service.json"));
    let service4 = await remoteRepo.fileExists(join(project2, "Service4.service.json"));
    let message = await remoteRepo.getCommitMessage();

    expect(message).to.include('Service Service1 is new');
    expect(message).to.include('Service Service2 is new');
    expect(message).to.not.include('Service Service3 is new');
    expect(message).to.include('Service Service4 is new');
    expect(service1).to.be.true;
    expect(service2).to.be.true;
    expect(service3).to.be.false;
    expect(service4).to.be.true;
  });

  it('including test/include/folder1 and folder2, excluding folder 3 and folder 4, should include service 1, 2', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await runDocWorks(`.bin/docworks ecp -r ${remote} --fs test/include/folder1 --fs test/include/folder2 --fx test/include/folder1/folder3 --fx test/include/folder2/folder4 -p ${project2} --fp .+\\.js?$`.split(' '));

    let remoteRepo = new Git(remote);
    let service1 = await remoteRepo.fileExists(join(project2, "Service1.service.json"));
    let service2 = await remoteRepo.fileExists(join(project2, "Service2.service.json"));
    let service3 = await remoteRepo.fileExists(join(project2, "Service3.service.json"));
    let service4 = await remoteRepo.fileExists(join(project2, "Service4.service.json"));
    let message = await remoteRepo.getCommitMessage();

    expect(message).to.include('Service Service1 is new');
    expect(message).to.include('Service Service2 is new');
    expect(message).to.not.include('Service Service3 is new');
    expect(message).to.not.include('Service Service4 is new');
    expect(service1).to.be.true;
    expect(service2).to.be.true;
    expect(service3).to.be.false;
    expect(service4).to.be.false;
  });

  it('should work on a branch', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await runDocWorks(`.bin/docworks ecp -r ${remote} -b branch --fs test/include/folder1 -p ${project2} --fp .+\\.js?$`.split(' '));

    let remoteRepo = new Git(remote);
    let service1 = await remoteRepo.fileExists(join(project2, "Service1.service.json"), 'branch');
    let service2 = await remoteRepo.fileExists(join(project2, "Service2.service.json"), 'branch');
    let service3 = await remoteRepo.fileExists(join(project2, "Service3.service.json"), 'branch');
    let message = await remoteRepo.getCommitMessage('branch');

    expect(message).to.include('Service Service1 is new');
    expect(message).to.not.include('Service Service2 is new');
    expect(message).to.include('Service Service3 is new');
    expect(service1).to.be.true;
    expect(service2).to.be.false;
    expect(service3).to.be.true;
  });

  it('run ecpAfterMerge plugin', async function() {
    await createRemoteOnVer1();
    logger.log('run test');
    logger.log('--------');
    await runDocWorks(`.bin/docworks ecp -r ${remote} --fs test/include/folder1 -p ${project2} --fp .+\\.js?$ --plug ./test/ecp-plugin`.split(' '));

    let remoteRepo = new Git(remote);
    let createdByPlugins = await remoteRepo.fileExists(join(project2, "created-by-plugin"));
    expect(createdByPlugins).to.be.true;
  });
});
