const path = require('path')
const dts = require('docworks-dts')
const logger = require('./logger')
const {writeOutput} = require('./utils/fsUtil')
const {readRepoFromRemoteOrLocal} = require('./utils/gitUtils')

async function runDts(outputFileName, outputDirName, {remote, local, run$wPlugin}) {

  try {
    let repo = await readRepoFromRemoteOrLocal({remote, local})

    if(run$wPlugin){
      logger.command('running with $wPlugin', '')
    }
    const dtsContent = dts(repo.services, {run$wPlugin})
    const extractPluginsEntries = declarations => Object.entries(declarations)
      .map(([fileName, fileContent]) => ({outputDirName, outputFileName: fileName, fileContent}))

    const contentToWrite = [{outputFileName, outputDirName, fileContent: dtsContent.mainDeclaration}]
      .concat(extractPluginsEntries(dtsContent.pluginDeclaration))

    return Promise.all(contentToWrite.map(writeDeclaration))
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack)
    throw error
  }
}

function writeDeclaration({outputFileName, outputDirName, fileContent}){
  const fileNameWithExtensions = `${outputFileName}.d.ts`
  const fullPath = path.join(outputDirName, fileNameWithExtensions)
  logger.command('dts save to file', fullPath)
  return writeOutput(fullPath, fileContent)
}

module.exports = runDts
