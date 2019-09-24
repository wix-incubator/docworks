const path = require('path')
const dts = require('docworks-dts')
const logger = require('./logger')
const {writeOutput} = require('./utils/fsUtil')
const {readRepoFromRemoteOrLocal} = require('./utils/gitUtils')

async function runDts(outputFileName, outputDirName, {remote, local, run$wFixer}) {

  try {
    let repo = await readRepoFromRemoteOrLocal({remote, local})

    if(run$wFixer){
      logger.command('running with $w fixer', '')
    }
    const dtsContent = dts(repo.services, {run$wFixer})
    const extractFixersEntries = declarations => Object.entries(declarations)
      .map(([fileName, fileContent]) => ({outputDirName, outputFileName: fileName, fileContent}))

    // Since we are short in times, the fixer does 2 things: fixing the main module, and generate $w.d.ts files
    // A better solution would be spilt this logic to two: a fixer and and a new module how would be in charge of the $w declaration, using docworks-dts converters
    // The fixer would disappear the moment we will fix the model
    const contentToWrite = [{outputFileName, outputDirName, fileContent: dtsContent.mainDeclaration}]
      .concat(extractFixersEntries(dtsContent.fixerDeclaration))

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
