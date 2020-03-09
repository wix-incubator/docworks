const path = require('path')
const dts = require('docworks-dts')
const logger = require('./logger')
const {writeOutput} = require('./utils/fsUtil')
const {readRepoFromRemoteOrLocal} = require('./utils/gitUtils')

async function runDts(outputFileName, outputDirName, {remote, local, run$wFixer, summaryTemplate}) {

  try {
    let repo = await readRepoFromRemoteOrLocal({remote, local})

    if(run$wFixer){
      logger.command('running with $w fixer', '')
    }

    logger.command('docworks dts', '')

    const dtsContent = dts(repo.services, {run$wFixer, summaryTemplate})

    const fileNameWithExtensions = `${outputFileName}.d.ts`
    const fullPath = path.join(outputDirName, fileNameWithExtensions)

    logger.command('dts saving to file...', fullPath)

    return writeOutput(fullPath, dtsContent)
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack)
    throw error
  }
}

module.exports = runDts
