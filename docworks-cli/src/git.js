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

  async getCommitMessage() {
    let listLogSummary = await asPromise(this._git, this._git.log)(['-1', '--pretty=format:%H;%ai;%B;%aN;%ae']);
    return listLogSummary.latest.message;
  }

  async fileExists(fileName) {
    try {
      await asPromise(this._git, this._git.catFile)(['-p', `HEAD:${fileName}`]);
      return true;
    }
    catch (e) {
      return false;
    }
  }


}