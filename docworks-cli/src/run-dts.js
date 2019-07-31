const dts = require('docworks-dts')
const logger = require('./logger')
const {writeOutput} = require('./utils/fsUtil')
const {readRepoFromRemoteOrLocal} = require('./utils/gitUtils')

async function runDts(outputFileName, {remote, local}) {

  try {
    let repo = await readRepoFromRemoteOrLocal({remote, local})

    logger.command('docworks dts', '')
    const dtsContent = dts(repo.services)

    const fileNameWithExtensions = `${outputFileName}.d.ts`
    logger.command('dts save to file', fileNameWithExtensions)
    return writeOutput(fileNameWithExtensions, dtsContent)
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack)
    throw error
  }
}

module.exports = runDts
