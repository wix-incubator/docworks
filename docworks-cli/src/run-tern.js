const tern = require('docworks-tern')
const fs = require('fs')
const fsExtra = require('fs-extra')
const {readFromDir} = require('docworks-repo')
const defaultLogger = require('./logger')
const Git = require('./git')
const tmp = require('tmp-promise')

function writeOutput(outputFileName, ternFileContent) {
  return new Promise((fulfill, reject) => {
    fs.writeFile(outputFileName, ternFileContent, {}, (err) => {
      if (err)
        reject(err)
      else
        fulfill()
    })
  })
}

async function runTern(remote, local, baseUrl, apiName, outputFileName, plugins, logger) {
  logger = logger || defaultLogger

  try {
    let localServicesDir
    if (remote) {
      logger.config('remote repo url:   ', remote)
      let tmpDir = await tmp.dir()

      let workingDir = tmpDir.path
      await fsExtra.ensureDir(workingDir)
      logger.config('working dir:       ', workingDir)

      let baseGit = new Git()
      logger.command('git', `clone ${remote} ${workingDir}`)
      await baseGit.clone(remote, workingDir, ['--depth', 1])

      localServicesDir = workingDir
    }
    else {
      logger.config('local sources:     ', local)
      localServicesDir = local
    }

    logger.command('docworks', `readServices ${localServicesDir}`)
    let repo = await readFromDir(localServicesDir)

    logger.config('plugins:           ', plugins.join(', '))
    logger.newLine()

    const pluginModules = plugins.map(require)

    logger.command('docworks tern', '')
    let ternContent = tern(repo.services, baseUrl, apiName, pluginModules)

    logger.command('tern save to file', outputFileName)
    return writeOutput(outputFileName, ternContent)
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack)
    throw error
  }
}

module.exports = runTern
