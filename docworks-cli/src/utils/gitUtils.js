const Git = require('../git')
const logger = require('../logger')
const tmp = require('tmp-promise')
const fsExtra = require('fs-extra')
const {readFromDir} = require('docworks-repo')

async function cloneToDir(remote) {
    let tmpDir = await tmp.dir()

    let workingDir = tmpDir.path
    await fsExtra.ensureDir(workingDir)
    logger.config('working dir:       ', workingDir)

    let baseGit = new Git()
    logger.command('git', `clone ${remote} ${workingDir}`)
    await baseGit.clone(remote, workingDir, ['--depth', 1])

    return workingDir
}

async function readRepoFromRemoteOrLocal({remote, local}){
    let localServicesDir
    if (remote) {
        logger.config('remote repo url:   ', remote)
        localServicesDir = await cloneToDir(remote)
    } else if (local) {
        logger.config('local sources:     ', local)
        localServicesDir = local
    } else {
        throw new Error('Please provide local or remote path')
    }

    logger.command('docworks', `readServices ${localServicesDir}`)
    return await readFromDir(localServicesDir)
}


module.exports = {
    readRepoFromRemoteOrLocal
}