import runJsDoc from 'docworks-jsdoc2spec';
import {saveToDir, readFromDir, merge} from 'docworks-repo';
import {join} from 'path';
import git from 'nodegit';
import * as defaultLogger from './logger';
import chalk from 'chalk';

function commitMessage(messages, errors, indent) {
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

  let commitMessage = `DocWorks  - ${changesSummary}${errorsSummary}`;
  commitMessage += newLineIndent + 'changes:' + newLineIndent+ messages.join(newLineIndent);

  if (errors.length > 0) {
    let formattedErrors = errors.map(_ => {
      if (_.location)
        return `${_.message} (${_.location})`;
      else
        return `${_.message}`;
    });
    commitMessage += newLineIndent + newLineIndent + 'issues:' + newLineIndent + formattedErrors.join(newLineIndent);
  }
  return commitMessage;
}

export default async function extractComparePush(remoteRepo, workingDir, projectSubdir, jsDocSources, plugins, ghtoken, logger) {
  logger = logger || defaultLogger;
  logger.config(`remote repo url:   `, remoteRepo);
  logger.config(`working dir:       `, workingDir);
  logger.config(`project dir:       `, projectSubdir);
  logger.config(`jsdoc sources:     `, JSON.stringify(jsDocSources));
  logger.config(`plugins:           `, plugins.join(', '));
  logger.newLine();
  let workingSubdir = join(workingDir, projectSubdir);
  try {

    logger.command('git', `clone ${remoteRepo} ${workingDir}`);
    let gitAuthOptions = {};
    let tries = 10;
    if (ghtoken) {
      const remoteCallbacks = {
        certificateCheck: function () {
          return 1;
        },
        credentials: function () {
          if (tries-- === 0) {
            logger.error('Github authentication failed');
            process.exit(1);
          }

          return git.Cred.userpassPlaintextNew(ghtoken, "x-oauth-basic");
        }
      };
      gitAuthOptions = {
        callbacks: remoteCallbacks
      }
    }
    await git.Clone(remoteRepo, workingDir, {
      fetchOpts: gitAuthOptions
    });

    logger.command('docworks', `readServices ${workingSubdir}`);
    let repoContent = await readFromDir(workingSubdir);

    logger.command('docworks', `extractDocs ${jsDocSources.include}/**/${jsDocSources.includePattern}`);
    const {services, errors} = runJsDoc(jsDocSources, plugins);
    logger.jsDocErrors(errors);
    
    logger.command('docworks', `merge`);
    let merged = merge(services, repoContent.services);

    logger.command('docworks', `saveServices ${workingSubdir}`);
    await saveToDir(workingSubdir, merged.repo);

    let localRepo = await git.Repository.open(workingDir);

    logger.command('git status');
    let statuses = await localRepo.getStatus();
    let files = statuses.filter(_ => _.isNew() || _.isModified())
      .map(_ => {
        logger.details(`  ${_.isNew()?'New:     ':'Modified:'} ${_.path()}`);
        return _.path()
      });

    if (files.length > 0) {
      logger.command('git', `add ${files.join(' ')}`);
      let index = await localRepo.refreshIndex();
      await Promise.all(files.map(file => index.addByPath(file)));
      await index.write();
      let oid = await index.writeTree();

      logger.rawLog(`    ${chalk.white('git commit -m')} '${chalk.gray(commitMessage(merged.messages, errors, '      '))}'`);
      let parents = [];
      try {
        let head = await git.Reference.nameToId(localRepo, "HEAD");
        let parent = await localRepo.getCommit(head);
        parents = [parent];
      }
      catch (err) {

      }
      let author = git.Signature.default(localRepo);
      let committer = git.Signature.default(localRepo);
      await localRepo.createCommit("HEAD", author, committer, commitMessage(merged.messages, errors, ''), oid, parents);

      logger.command('git push', 'origin master', );
      let remote = await git.Remote.lookup(localRepo, 'origin');
      await remote.push(['refs/heads/master:refs/heads/master'], gitAuthOptions);
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