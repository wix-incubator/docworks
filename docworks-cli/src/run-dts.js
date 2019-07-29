const dts = require('docworks-dts')
const fs = require('fs')
const {readFromDir} = require('docworks-repo')
const defaultLogger = require('./logger')
const {writeOutput} = require('./utils/fsUtil')
// const fsExtra = require('fs-extra')
// const Git = require('./git')
// const tmp = require('tmp-promise')

async function runDts(outputFileName, logger) {
  logger = logger || defaultLogger

  try {
    // let localServicesDir
    // if (remote) {
    //   logger.config(`remote repo url:   `, remote)
    //   let tmpDir = await tmp.dir()
    //
      const workingDir = '/Users/karinag/projects/wix-code-docs'
    //   await fsExtra.ensureDir(workingDir)
    //   logger.config(`working dir:       `, workingDir)
    //
    //   let baseGit = new Git()
    //   logger.command('git', `clone ${remote} ${workingDir}`)
    //   await baseGit.clone(remote, workingDir, ['--depth', 1])
    //
    //   localServicesDir = workingDir
    // }
    // else {
    //   logger.config(`local sources:     `, local)
    //   localServicesDir = local
    // }

    // logger.command('docworks', `readServices ${localServicesDir}`)
    const repo = await readFromDir(workingDir)
    // console.log(repo.services)
    //
    // logger.config(`plugins:           `, plugins.join(', '))
    // logger.newLine()
    //
    // let pluginModules = plugins.map(require)
    //
    logger.command('docworks dts', '')
    const dtsContent = dts(repo.services)
      return Promise.all(dtsContent.map(file => {
          const fileName = `${outputFileName}-${file.key}.d.ts`
          logger.command('dts save to file', fileName)
          return writeOutput(fileName, file.content)
      }))

  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack)
    throw error
  }
}

module.exports = runDts
