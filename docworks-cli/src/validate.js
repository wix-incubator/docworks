const runJsDoc = require('docworks-jsdoc2spec')
const defaultLogger = require('./logger')

function validate(jsDocSources, plugins, logger) {
  logger = logger || defaultLogger
  try {
    logger.log(`docworks extractDocs ${jsDocSources.include}/**/${jsDocSources.includePattern} --plug ${plugins}`)
    let serviceModel = runJsDoc(jsDocSources, plugins)
    let isOk = logger.jsDocErrors(serviceModel.errors)
    if (isOk) {
      logger.success('jsDoc ok')
    }
    return isOk
  }
  catch(error) {
    logger.error('failed to complete workflow\n' + error.stack)
    throw error
  }
}

module.exports = validate
