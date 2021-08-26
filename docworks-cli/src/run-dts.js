const path = require('path')
const dts = require('docworks-dts')
const logger = require('./logger')
const {writeOutput} = require('./utils/fsUtil')
const {readRepoFromRemoteOrLocal} = require('./utils/gitUtils')

async function runDts(outputFileName, outputDirName,
  { remote, local, run$wFixer, summaryTemplate, ignoredModules, ignoredNamespaces }) {

  try {
    let repo = await readRepoFromRemoteOrLocal({remote, local})

    if(run$wFixer){
      logger.command('running with $w fixer', '')
    }

    logger.command('docworks dts', '')

    // To support Service object Type property definition 
    // creating a messages types map from the service path according to {edm-name}.{service-name}.{message-name}
    global.customComplexTypesMap = repo.services.reduce((acc, curr) => {
      curr.messages.forEach(message => {
        acc[
          `${curr.memberOf ? `${curr.memberOf}.` : ""}${curr.name}.${
            message.name
          }`
        ] = {
          nativeType: message.name,
          typeParams: message.members.map(member => member.type)
        };
      });
      return acc;
    }, {});

    const dtsContent = dts(repo.services, {run$wFixer, summaryTemplate, ignoredModules, ignoredNamespaces })

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
