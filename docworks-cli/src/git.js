import simpleGit from 'simple-git';
import asPromise from './as-promise';


export default class Git {
  constructor(workingDir) {
    this._git = workingDir?simpleGit(workingDir):simpleGit();
  }

  clone(remoteRepo, workingDir, branch) {
    return asPromise(this._git, this._git.clone)(remoteRepo, workingDir, branch?['-b', branch] :[]);
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
}