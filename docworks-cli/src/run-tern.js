const tern = require('docworks-tern')
const {writeOutput} = require('./utils/fsUtil')
const logger = require('./logger')
const {readRepoFromRemoteOrLocal} = require('./utils/gitUtils')

async function runTern({remote, branch, local, baseUrl, apiName, outputFileName, plugins}) {

  try {
    let repo = await readRepoFromRemoteOrLocal({remote, branch, local})

    logger.config('plugins:           ', plugins.join(', '))
    logger.newLine()

    const pluginModules = plugins.map(require)

    logger.command('docworks tern', '')
    let ternContent = tern(repo.services, baseUrl, apiName, pluginModules)

    logger.command('tern saving to file...', outputFileName)
    return writeOutput(outputFileName, ternContent)
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack)
    throw error
  }
}

module.exports = runTern
