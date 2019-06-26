import dts from 'docworks-dts';
import fs from 'fs';
// import fsExtra from 'fs-extra';
import {readFromDir} from 'docworks-repo';
import * as defaultLogger from './logger';
// import Git from './git';
// import tmp from 'tmp-promise';

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

export default async function runDts(outputFileName, logger) {
  logger = logger || defaultLogger;

  try {
    // let localServicesDir;
    // if (remote) {
    //   logger.config(`remote repo url:   `, remote);
    //   let tmpDir = await tmp.dir();
    //
      let workingDir = '/Users/karinag/projects/wix-code-docs';
    //   await fsExtra.ensureDir(workingDir);
    //   logger.config(`working dir:       `, workingDir);
    //
    //   let baseGit = new Git();
    //   logger.command('git', `clone ${remote} ${workingDir}`);
    //   await baseGit.clone(remote, workingDir, ['--depth', 1]);
    //
    //   localServicesDir = workingDir;
    // }
    // else {
    //   logger.config(`local sources:     `, local);
    //   localServicesDir = local;
    // }

    // logger.command('docworks', `readServices ${localServicesDir}`);
    let repo = await readFromDir(workingDir);
    // console.log(repo.services)
    //
    // logger.config(`plugins:           `, plugins.join(', '));
    // logger.newLine();
    //
    // let pluginModules = plugins.map(require);
    //
    // logger.command('docworks tern', '');
    let dtsContent = dts(repo.services);
    //
    logger.command('dts save to file', outputFileName);
    return writeOutput(outputFileName, dtsContent);
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack);
    throw error;
  }
}
