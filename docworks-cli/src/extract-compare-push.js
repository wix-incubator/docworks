import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import {join} from 'path';
import Git from './git';
import fs from 'fs-extra';
import * as defaultLogger from './logger';
import chalk from 'chalk';

function commitMessage(projectSubdir, messages, errors, indent) {
  let newLineIndent = `\n${indent}`;
  let changesSummary;
  if (messages.length === 0)
    changesSummary = `no significant changes detected`;
  else if (messages.length === 1)
    changesSummary = `1 change detected`;
  else
    changesSummary = `${messages.length} changes detected`;

  let errorsSummary = '';
  if (errors.length === 1)
    errorsSummary = ', but 1 issue detected';
  else if (errors.length > 1)
    errorsSummary = `, but ${errors.length} issue detected`;

  let formattedMessage = `DocWorks for ${projectSubdir} - ${changesSummary}${errorsSummary}`;
  if (messages.length > 0) {
    formattedMessage += newLineIndent + 'changes:' + newLineIndent+ messages.join(newLineIndent);
  }

  if (errors.length > 0) {
    let formattedErrors = errors.map(_ => {
      if (_.location)
        return `${_.message} (${_.location})`;
      else
        return `${_.message}`;
    });
    formattedMessage += newLineIndent + newLineIndent + 'issues:' + newLineIndent + formattedErrors.join(newLineIndent);
  }
  return formattedMessage;
}

function logStatus(statuses, logger) {
  statuses.created.forEach(file => logger.details(`  New:      ${file}`));
  statuses.not_added.forEach(file => logger.details(`  New:      ${file}`));
  statuses.modified.forEach(file => logger.details(`  Modified:      ${file}`));
}

export default async function extractComparePush(remoteRepo, workingDir, projectSubdir, jsDocSources, plugins, dryrun, logger) {
  logger = logger || defaultLogger;
  logger.config(`remote repo url:   `, remoteRepo);
  logger.config(`working dir:       `, workingDir);
  logger.config(`project dir:       `, projectSubdir);
  logger.config(`jsdoc sources:     `, JSON.stringify(jsDocSources));
  logger.config(`plugins:           `, plugins.join(', '));
  logger.newLine();
  let workingSubdir = join(workingDir, projectSubdir);
  try {

    await fs.ensureDir(workingDir);
    let baseGit = new Git();
    logger.command('git', `clone ${remoteRepo} ${workingDir}`);
    await baseGit.clone(remoteRepo, workingDir);

    let localGit = new Git(workingDir);

    logger.command('docworks', `readServices ${workingSubdir}`);
    let repoContent = await readFromDir(workingSubdir);

    logger.command('docworks', `extractDocs ${jsDocSources.include}/**/${jsDocSources.includePattern}`);
    const {services, errors} = runJsDoc(jsDocSources, plugins);
    logger.jsDocErrors(errors);
    
    logger.command('docworks', `merge`);
    let merged = merge(services, repoContent.services, plugins);

    logger.command('docworks', `saveServices ${workingSubdir}`);
    await saveToDir(workingSubdir, merged.repo);

    logger.command('git status', '');
    let statuses = await localGit.status();
    let files = [];
    files.push(...statuses.created, ...statuses.not_added, ...statuses.modified);

    logStatus(statuses, logger);

    if (dryrun) {
      logger.command('# git', `add ${files.join(' ')}`);
      logger.rawLog(`    ${chalk.white('# git commit -m')} '${chalk.gray(commitMessage(projectSubdir, merged.messages, errors, '      '))}'`);
      logger.command('# git push', 'origin master', );
    }
    else if (files.length > 0) {
      logger.command('git', `add ${files.join(' ')}`);
      await localGit.add(files);

      logger.rawLog(`    ${chalk.white('git commit -m')} '${chalk.gray(commitMessage(projectSubdir, merged.messages, errors, '      '))}'`);
      await localGit.commit(commitMessage(projectSubdir, merged.messages, errors, ''));

      logger.command('git push', 'origin master', );
      await localGit.push('origin', 'master');
    }
    else {
      logger.log('no changes detected');
    }
    logger.success('completed workflow');
  }
  catch (error) {
    logger.error('failed to complete workflow\n' + error.stack);
    throw error;
  }
}