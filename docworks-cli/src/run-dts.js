const isArray_ = require('lodash/isArray')
const isEmpty_ = require('lodash/isEmpty')
const path = require('path')
const dts = require('docworks-dts')
const { dtsNew } = require('docworks-dts')
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

    const dtsContent = dts(repo.services, {run$wFixer, summaryTemplate, ignoredModules, ignoredNamespaces })
    const dtsNewContent = dtsNew(repo.services, { run$wFixer, summaryTemplate, ignoredModules, ignoredNamespaces })
    // const fileToWrite = ['wix-location', 'wix-window', 'wix-storage', 'wix-site-backend', 'wix-seo', 'wix-realtime', 'wix-paid-plans-backend', 'wix-forum-backend', 'wix-fetch', 'wix-chat-backend', 'wix-captcha-backend']
    dtsNewContent.forEach(file => {
      logger.command('writting file', file.name)
      // if (fileToWrite.some(f => f=== file.name))
        writeOutput(`${outputDirName}/${file.name}.d.ts`, file.content)
    })

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
