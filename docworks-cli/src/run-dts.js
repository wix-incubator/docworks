const path = require('path')
const { dts2 } = require('docworks-dts')
const logger = require('./logger')
const {writeOutput} = require('./utils/fsUtil')
const {readRepoFromRemoteOrLocal} = require('./utils/gitUtils')
const isArray_ = require('lodash/isArray')

async function runDts(outputFileName, outputDirName,
  { remote, local, run$wFixer, summaryTemplate, ignoredModules, ignoredNamespaces }) {

  try {
    let repo = await readRepoFromRemoteOrLocal({remote, local})
    const toPick = ''
    const services = repo.services.filter(s => (s.name && s.name.endsWith(toPick)) || (s.memberOf && s.memberOf.includes(toPick)))

    if(run$wFixer){
      logger.command('running with $w fixer', '')
    }

    logger.command('docworks dts', '')
    debugger
    const dtsResult = dts2(services, {run$wFixer, summaryTemplate, ignoredModules, ignoredNamespaces })
    if (isArray_(dtsResult)) {
      return Promise.all(dtsResult.map(res => writeOutput(`${outputDirName}/${res.name}.d.ts`, res.content)))
    }
    else {
      const fileNameWithExtensions = `${outputFileName}.d.ts`
      const fullPath = path.join(outputDirName, fileNameWithExtensions)

      logger.command('dts saving to file...', fullPath)

      return writeOutput(fullPath, dtsContent)
    }
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack)
    throw error
  }
}

module.exports = runDts
