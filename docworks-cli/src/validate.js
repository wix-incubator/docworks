import runJsDoc from 'docworks-jsdoc2spec';
import defaultLogger from './logger';

export default function validate(jsDocSources, plugins, logger) {
  logger = logger || defaultLogger;
  try {
    logger.log(`docworks extractDocs ${jsDocSources.include}/**/${jsDocSources.includePattern} --plug ${plugins}`);
    let serviceModel = runJsDoc(jsDocSources, plugins);
    if (serviceModel.errors.length > 0) {
      serviceModel.errors.forEach(_ => {
        if (_.location)
          logger.warn(`  ${_.message} (${_.location})`);
        else
          logger.warn(`  ${_.message}`);
      });
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