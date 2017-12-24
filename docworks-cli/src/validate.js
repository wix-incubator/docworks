import runJsDoc from 'docworks-jsdoc2spec';
import * as defaultLogger from './logger';

export default function validate(jsDocSources, plugins, logger) {
  logger = logger || defaultLogger;
  try {
    logger.log(`docworks extractDocs ${jsDocSources.include}/**/${jsDocSources.includePattern} --plug ${plugins}`);
    let serviceModel = runJsDoc(jsDocSources, plugins);
    let isOk = logger.jsDocErrors(serviceModel.errors);
    if (isOk) {
      logger.success('jsDoc ok');
    }
    return isOk;
  }
  catch(error) {
    logger.error('failed to complete workflow\n' + error.stack);
    throw error;
  }
}