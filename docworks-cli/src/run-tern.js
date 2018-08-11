import tern from 'docworks-tern';
import fs from 'fs';
import fsExtra from 'fs-extra';
import {readFromDir} from 'docworks-repo';
import * as defaultLogger from './logger';
import git from 'simple-git';
import tmp from 'tmp-promise';
import asPromise from './as-promise';

function writeOutput(outputFileName, ternFileContent) {
  return new Promise((fulfill, reject) => {
    fs.writeFile(outputFileName, ternFileContent, {}, (err) => {
      if (err)
        reject(err);
      else
        fulfill();
    })
  })
}

export default async function runTern(remote, local, baseUrl, apiName, outputFileName, plugins, logger) {
  logger = logger || defaultLogger;

  try {
    let localServicesDir;
    if (remote) {
      logger.config(`remote repo url:   `, remote);
      let tmpDir = await tmp.dir();

      let workingDir = tmpDir.path;
      await fsExtra.ensureDir(workingDir);
      logger.config(`working dir:       `, workingDir);

      let baseGit = git();
      logger.command('git', `clone ${remote} ${workingDir}`);
      await asPromise(baseGit, baseGit.clone)(remote, workingDir, []);

      localServicesDir = workingDir;
    }
    else {
      logger.config(`local sources:     `, local);
      localServicesDir = local;
    }

    logger.command('docworks', `readServices ${localServicesDir}`);
    let repo = await readFromDir(localServicesDir);

    logger.config(`plugins:           `, plugins.join(', '));
    logger.newLine();

    logger.command('docworks tern', '');
    let ternContent = tern(repo.services, baseUrl, apiName, plugins);

    logger.command('tern save to file', outputFileName);
    return writeOutput(outputFileName, ternContent);
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack);
    throw error;
  }
}
