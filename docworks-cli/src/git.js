import simpleGit from 'simple-git';
import asPromise from './as-promise';


export default class Git {
  constructor(workingDir) {
    this._git = workingDir?simpleGit(workingDir):simpleGit();
  }

  init(bare) {
    return asPromise(this._git, this._git.init)(bare);
  }

  clone(remoteRepo, workingDir, options) {
    return asPromise(this._git, this._git.clone)(remoteRepo, workingDir, options || []);
  }

  checkout(branchName) {
    return asPromise(this._git, this._git.checkout)(branchName);
  }

  status() {
    return asPromise(this._git, this._git.status)()
  }

  add(files) {
    return asPromise(this._git, this._git.add)(files);
  }

  commit(message) {
    return asPromise(this._git, this._git.commit)(message);
  }

  push(remote, branch) {
    return asPromise(this._git, this._git.push)(remote, branch, [])
  }

  async readFile(fileName, branch) {
    return await asPromise(this._git, this._git.catFile)(['-p', `${branch?branch:'HEAD'}:${fileName}`]);
  }

  async getCommitMessage(branch) {
    let options = [];
    if (branch)
      options.push(branch);
    options = options.concat(['-1', '--pretty=format:%H;%ai;%B;%aN;%ae']);
    let listLogSummary = await asPromise(this._git, this._git.log)(options);
    return listLogSummary.latest.message;
  }

  async fileExists(fileName, branch) {
    try {
      await this.readFile(fileName, branch);
      return true;
    }
    catch (e) {
      return false;
    }
  }


}