const dts = require('docworks-dts')
const logger = require('./logger')
const {writeOutput} = require('./utils/fsUtil')
const {readRepoFromRemoteOrLocal} = require('./utils/gitUtils')

const SERVICES_DTS_FILE_NAME = 'declarations.d.ts'
const DOLLAR_W_DTS_FILE_NAME = '$w.d.ts'

function saveDTSFile(fullFilePath, content) {
  logger.command('dts save to file', fullFilePath)
  writeOutput(fullFilePath, content)
}

async function runDts(outputDirectory, {remote, local}) {
  try {
    let repo = await readRepoFromRemoteOrLocal({remote, local})

    logger.command('docworks dts', '')
    const {servicesDTS, dollarWDTS} = dts(repo.services)

    const directoryPath = (outputDirectory + '/').replace('//', '/')

    saveDTSFile(directoryPath + SERVICES_DTS_FILE_NAME, servicesDTS)
    saveDTSFile(directoryPath + DOLLAR_W_DTS_FILE_NAME, dollarWDTS)
    return true
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack)
    throw error
  }
}

module.exports = runDts
