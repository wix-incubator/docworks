import runJsDoc from 'docworks-jsdoc2spec';
import defaultLogger from './logger';

export default function validate(jsDocSources, logger) {
  logger = logger || defaultLogger;
  try {
    logger.log(`docworks extractDocs ${jsDocSources.include}/**/${jsDocSources.includePattern}`);
    let serviceModel = runJsDoc(jsDocSources);
    if (serviceModel.errors.length > 0) {
      serviceModel.errors.forEach(_ => logger.warn(`  ${_.message} (${_.location})`));
      logger.error(`jsDoc errors detected`);
      logger.error(`  ${serviceModel.errors.length} issues detected`);
      return false;
    }
    logger.success('jsDoc ok');
    return true;
  }
  catch(error) {
    logger.error('failed to complete workflow\n' + error.stack);
    throw error;
  }
}